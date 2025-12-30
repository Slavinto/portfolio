import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
    paymentAllowedTransitions,
    NowPaymentsStatus,
    PAYMENT_TERMINAL_STATES,
    ORDER_TERMINAL_STATES,
} from "@/types/nowpayments/types";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Payment } from "@/types/supabase/database.types";
import {
    NowPaymentsPayment,
    NowPaymentsStatusSchema,
    OrderStatus,
} from "@/lib/nowpayments/schemas";

export async function POST(req: NextRequest) {
    try {
        const supabase = supabaseAdmin;
        const rawBody = await req.text();
        const signature = req.headers.get("x-nowpayments-sig");

        async function updateOrder(order_id: string, status: OrderStatus) {
            await supabase
                .from("orders")
                .update({
                    status,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", order_id);
        }

        if (!signature) {
            return NextResponse.json(
                { error: "Missing signature" },
                { status: 400 }
            );
        }

        // handling nowpayments request
        const expectedSignature = crypto
            .createHmac("sha512", process.env.NOWPAYMENTS_IPN_SECRET!)
            .update(rawBody)
            .digest("hex");

        // verify signature
        if (expectedSignature !== signature) {
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 401 }
            );
        }

        // parse payload
        const payload = JSON.parse(rawBody) as NowPaymentsPayment;
        const parsedStatus = NowPaymentsStatusSchema.safeParse(
            payload.payment_status
        );

        if (!parsedStatus.success) {
            return NextResponse.json(
                { error: "Unknown payment status" },
                { status: 400 }
            );
        }

        const payment_status = parsedStatus.data;
        const { payment_id } = payload;

        // fetch payment row
        const { data: payment } = (await supabase
            .from("payments")
            .select("status, order_id")
            .eq("payment_id", payment_id)
            .single()) as unknown as { data: Payment };

        // check payment existence
        if (!payment) {
            return NextResponse.json(
                { error: "Payment not found" },
                { status: 404 }
            );
        }

        const { order_id } = payment;
        const currentPaymentStatus = payment.status;

        // checking whether payment is terminal state or whether state transition is not allowed
        if (PAYMENT_TERMINAL_STATES.has(currentPaymentStatus)) {
            // validate payment terminal state
            return NextResponse.json({ ok: true });
        }
        if (
            !paymentAllowedTransitions[currentPaymentStatus].includes(
                payment_status
            )
        ) {
            // validate payment state transition
            return NextResponse.json({ ok: true });
        }

        // compute event hash
        const eventHash = crypto
            .createHash("sha256")
            .update(`${payment_id}:${payment_status}`)
            .digest("hex");

        // store event
        const { error } = await supabase.from("payment_events").insert({
            payment_id,
            status: payment_status,
            event_hash: eventHash,
        });

        if (error) {
            if (error.code === "23505") {
                // duplicate event
                return NextResponse.json({ ok: true });
            }
            // otherwise
            throw error;
        }

        // update payment state
        await supabase
            .from("payments")
            .update({
                status: payment_status,
                updated_at: new Date().toISOString(),
            })
            .eq("payment_id", payment_id);

        // fetch corresponding order status
        const { data: orderStatus, error: orderStatusError } = await supabase
            .from("orders")
            .select("status")
            .eq("id", order_id)
            .single();

        if (!orderStatus || orderStatusError) {
            NextResponse.json(
                { error: "Invalid order status" },
                { status: 500 }
            );
        }

        const order_status = orderStatus as unknown as OrderStatus;

        // check whether order is not in terminal state
        if (!ORDER_TERMINAL_STATES.has(order_status)) {
            // map order status
            switch (payment_status) {
                case "expired":
                    await updateOrder(order_id, "expired");
                    break;
                case "failed":
                    await updateOrder(order_id, "cancelled");
                    break;
                case "finished":
                    await updateOrder(order_id, "paid");
                    break;
                case "refunded":
                    await updateOrder(order_id, "refunded");
                    break;
            }
        }

        if (payment_status === "finished") {
            // update order logic here
        }
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
