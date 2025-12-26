import { nowpaymentsRequest } from "@/lib/nowpayments/nowpayments";
import {
    NowPaymentsMinAmount,
    NowPaymentsMinAmountSchema,
} from "@/lib/nowpayments/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const currencyFrom = searchParams.get("currency_from")?.toLowerCase();
    const currencyTo = searchParams.get("currency_to");
    console.log("**********************************************");
    console.log({ currencyFrom });
    console.log({ currencyTo });
    console.log("**********************************************");

    const res = await nowpaymentsRequest(
        `/v1/min-amount?currency_from=${currencyFrom}&currency_to=${currencyTo}&fiat_equivalent=usd&is_fee_paid_by_user=False`,
        NowPaymentsMinAmountSchema
    );
    console.log({ res });
    return NextResponse.json(res);
}
