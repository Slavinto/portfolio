import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST /api/chess/offers
export async function POST(req: NextRequest) {
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    const { gameId, fromPlayer, toPlayer, type } = await req.json();

    if (!user || userError) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ----------------------------
    // 1. Enforce hard cap: max 3 offers per type per game
    // ----------------------------
    const { data: allOffers, error: countError } = await supabase
        .from("offers")
        .select("id")
        .eq("game_id", gameId)
        .eq("from_player", fromPlayer)
        .eq("type", type);

    console.log({ allOffers });

    if (countError) {
        return NextResponse.json(
            { error: countError.message },
            { status: 400 }
        );
    }

    if (allOffers.length >= 3) {
        return NextResponse.json(
            {
                error: `Maximum number of ${type} offers reached for this game.`,
            },
            { status: 400 }
        );
    }

    // ----------------------------
    // 2. Check if there is a pending offer from this player
    // ----------------------------
    const { data: existing, error: selectError } = await supabase
        .from("offers")
        .select("*")
        .eq("game_id", gameId)
        .eq("from_player", fromPlayer)
        .eq("type", type)
        .eq("status", "pending")
        .maybeSingle();

    if (selectError) {
        return NextResponse.json(
            { error: selectError.message },
            { status: 400 }
        );
    }

    const expiresAt = new Date(Date.now() + 60 * 1000);

    // ----------------------------
    // 3. Pending exists → check expiration
    // ----------------------------
    if (existing && existing.expires_at) {
        const expired = Date.now() > new Date(existing.expires_at).getTime();

        if (!expired) {
            // still alive → block user
            return NextResponse.json(
                { error: "Offer already pending" },
                { status: 400 }
            );
        }

        // ----------------------------
        // 4. Mark expired + create a new one
        // ----------------------------
        const { error: expireError } = await supabase
            .from("offers")
            .update({ status: "expired" })
            .eq("id", existing.id);

        if (expireError) {
            return NextResponse.json(
                { error: expireError.message },
                { status: 400 }
            );
        }

        // (We do NOT return here; continue to insert the new offer)
    }

    // ----------------------------
    // 5. Insert NEW offer
    // ----------------------------
    const newItem = {
        game_id: gameId,
        from_player: fromPlayer,
        to_player: toPlayer,
        type,
        status: "pending",
        expires_at: expiresAt,
    };
    console.log({ newItem });
    const { data: newOffer, error: insertError } = await supabase
        .from("offers")
        .insert([newItem])
        .select()
        .single();

    if (insertError) {
        return NextResponse.json(
            { error: insertError.message },
            { status: 400 }
        );
    }

    return NextResponse.json({ data: newOffer });
}
