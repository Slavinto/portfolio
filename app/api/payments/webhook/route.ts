import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { allowedTransitions } from "@/types/nowpayments/types";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
    try {
        const supabase = supabaseAdmin;
        const rawBody = await req.text();
        const signature = req.headers.get("x-nowpayments-sig");

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

        if (expectedSignature !== signature) {
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 401 }
            );
        }

        const payload = JSON.parse(rawBody);
        const { payment_id, payment_status } = payload;

        const { data: payment } = await supabase
            .from("payments")
            .select("status")
            .eq("payment_id", payment_id)
            .single();

        if (!payment) {
            return NextResponse.json(
                { error: "Payment not found" },
                { status: 404 }
            );
        }

        const currentPaymentStatus = payment.status;

        // checking status
        if (
            !allowedTransitions[currentPaymentStatus].includes(payment_status)
        ) {
            return NextResponse.json({ ok: true });
        }

        // building idempotency key
        const eventHash = crypto
            .createHash("sha256")
            .update(`${payment_id}:${payment_status}`)
            .digest("hex");

        // checking if the event already processed
        const { data: existingEvent } = await supabase
            .from("payment_events")
            .select("id")
            .eq("event_hash", eventHash)
            .single();

        if (existingEvent) {
            // idempotency exit
            return NextResponse.json({ ok: true });
        }

        // store event
        await supabase.from("payment_events").insert({
            payment_id,
            status: payment_status,
            event_hash: eventHash,
        });

        //update payment state
        await supabase
            .from("payments")
            .update({
                status: payment_status,
                updated_at: new Date().toISOString(),
            })
            .eq("payment_id", payment_id);
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
