import { finishGame } from "@/lib/services/chess-db";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, ctx: any) {
    const supabase = await createSupabaseServerClient();
    const { id: offerId } = ctx.params;

    // 1. Get the offer
    const { data: offer, error: errOffer } = await supabase
        .from("offers")
        .select("*")
        .eq("id", offerId)
        .single();

    if (errOffer || !offer) {
        return new NextResponse(JSON.stringify({ error: "Offer not found" }), {
            status: 400,
        });
    }

    const { type } = offer;

    // 2. Mark offer as accepted
    const { error: errUpdateOffer } = await supabase
        .from("offers")
        .update({ status: "accepted" })
        .eq("id", offerId);

    if (errUpdateOffer) {
        return new NextResponse(
            JSON.stringify({ error: "Failed to update offer" }),
            { status: 500 }
        );
    }

    const status =
        type === "draw"
            ? "draw"
            : type === "layoff"
            ? "layed-off"
            : type === "resume"
            ? "ongoing"
            : "waiting";

    if (status === "draw") {
        finishGame(offer.game_id, status, null);
        return new NextResponse(JSON.stringify({ success: true }), {
            status: 200,
        });
    }
    // 3. Update game status
    const { error: errGame } = await supabase
        .from("games")
        .update({
            status,
        })
        .eq("id", offer.game_id);

    if (errGame) {
        return new NextResponse(
            JSON.stringify({ error: "Failed to update game" }),
            { status: 500 }
        );
    }

    return new NextResponse(JSON.stringify({ success: true }));
}
