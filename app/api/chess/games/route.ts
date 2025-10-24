import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
        .from("games")
        .insert({ creator_id: user.id })
        .select()
        .single();

    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json(data);
}
