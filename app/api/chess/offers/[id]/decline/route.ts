import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, ctx: any) {
    const supabase = await createSupabaseServerClient();
    const { id } = ctx.params;
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
        .from("offers")
        .update({ status: "declined" })
        .eq("id", id)
        .select("*");

    if (error)
        return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ data });
}
