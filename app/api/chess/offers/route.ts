import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST /api/chess/offers
export async function POST(req: NextRequest) {
    const supabase = await createSupabaseServerClient();

    // get logged-in user from the cookie-based session
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    const { gameId, fromPlayer, toPlayer, type } = await req.json();

    if (!user || userError) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Optional: enforce cooldown or max pending offers per game
    const { data: existing, error: offersSelectError } = await supabase
        .from("offers")
        .select("*")
        .eq("game_id", gameId)
        .eq("from_player", fromPlayer)
        .eq("type", type)
        .eq("status", "pending")
        .maybeSingle();

    if (offersSelectError) {
        console.log({ errorMessage: offersSelectError?.message });
        return NextResponse.json(
            { error: offersSelectError?.message },
            { status: 400 }
        );
    }

    if (existing) {
        return NextResponse.json(
            { error: "Offer already pending" },
            { status: 400 }
        );
    }

    const expiresAt = new Date(Date.now() + 60 * 1000); // 1 minute
    const { data, error } = await supabase
        .from("offers")
        .insert([
            {
                game_id: gameId,
                from_player: fromPlayer,
                to_player: toPlayer,
                type,
                expires_at: expiresAt,
            },
        ])
        .select()
        .single();

    return NextResponse.json({ data, error });
}
