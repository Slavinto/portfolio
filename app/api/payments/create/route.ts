import { nowpaymentsRequest } from "@/lib/nowpayments/nowpayments";
import {
    NowPaymentsPayment,
    NowPaymentsPaymentSchema,
} from "@/lib/nowpayments/schemas";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Order } from "@/types/supabase/database.types";

export async function POST(req: NextRequest) {
    const { order_id } = await req.json();

    if (!order_id) {
        return NextResponse.json(
            { error: "Missing order id" },
            { status: 400 }
        );
    }

    const order = (await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("id", order_id)
        .single()) as unknown as Order | null;

    if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const payment = await nowpaymentsRequest<NowPaymentsPayment>(
        "/v1/payment",
        NowPaymentsPaymentSchema,
        {
            method: "POST",
            body: JSON.stringify({
                price_amount: order.amount_usd,
                price_currency: "usd",
                pay_currency: "usdttrc20",
                order_id: order.id,
                order_description: `Order ${order.id}`,
            }),
        }
    );

    await supabaseAdmin.from("payments").insert({
        payment_id: payment.payment_id,
        order_id: order.id,
        provider: "NowPayments",
        price_amount: payment.price_amount,
        price_currency: payment.price_currency,
        pay_amount: payment.pay_amount,
        pay_currency: payment.pay_currency,
        status: payment.payment_status,
        created_at: payment.created_at,
        updated_at: payment.created_at,
    });

    return NextResponse.json(payment);
}
