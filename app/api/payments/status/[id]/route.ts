import { nowpaymentsRequest } from "@/lib/nowpayments/nowpayments";
import { NextResponse } from "next/server";

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const status = await nowpaymentsRequest(`/v1/payment/${params.id}`);
    return NextResponse.json(status);
}
