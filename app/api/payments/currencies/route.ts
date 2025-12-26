import { nowpaymentsRequest } from "@/lib/nowpayments/nowpayments";
import { NextResponse } from "next/server";

export async function GET() {
    const currencies = await nowpaymentsRequest("/v1/currencies");
    return NextResponse.json(currencies);
}
