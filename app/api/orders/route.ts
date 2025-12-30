import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { amount_usd } = body;

    if (!amount_usd || amount_usd <= 0) {
        return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({ userid: user.id, amount_usd, currency: "usd" })
        .select()
        .single();

    if (orderError) {
        return NextResponse.json(
            { error: orderError.message },
            { status: 500 }
        );
    }

    return NextResponse.json({ order }, { status: 201 });
}
