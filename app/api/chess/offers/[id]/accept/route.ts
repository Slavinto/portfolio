import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(_: Request, { params }: { params: { id: string } }) {
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
        .from("offers")
        .update({ status: "accepted" })
        .eq("id", params.id)
        .select()
        .single();

    if (error)
        return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ data });
}
