import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
        .from("games")
        .update({ opponent_id: user.id, status: "in_progress" })
        .eq("id", params.id)
        .is("opponent_id", null) // only join if slot is empty
        .select()
        .single();

    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json(data);
}
