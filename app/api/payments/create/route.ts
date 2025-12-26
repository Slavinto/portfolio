import { nowpaymentsRequest } from "@/lib/nowpayments/nowpayments";
import {
    NowPaymentsPayment,
    NowPaymentsPaymentSchema,
} from "@/lib/nowpayments/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { amount } = body;
    const payment = await nowpaymentsRequest<NowPaymentsPayment>(
        "/v1/payment",
        NowPaymentsPaymentSchema,
        {
            method: "POST",
            body: JSON.stringify({
                price_amount: amount,
                price_currency: "usd",
                pay_currency: "usdttrc20",
                order_id: `test_${Date.now()}`,
                order_description: "Learning NOWPayments",
            }),
        }
    );

    return NextResponse.json(payment);
}
