import { createSupabaseServerClient } from "@/lib/supabase/server";

// PATCH /api/offers/:id
export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createSupabaseServerClient();
    const offerId = params.id;
    if (!offerId) {
        return Response.json({
            data: null,
            error: new Error("Failed to update offer. Invalid id"),
        });
    }
    const { gameId, fromPlayer, toPlayer, type } = await req.json();

    // Optional: enforce cooldown or max pending offers per game
    const { data: existing } = await supabase
        .from("offers")
        .select("*")
        .eq("game_id", gameId)
        .eq("from_player", fromPlayer)
        .eq("type", type)
        .eq("status", "pending")
        .maybeSingle();

    if (!existing) {
        return Response.json(
            { error: "Failed to update offer ", offerId },
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

    return Response.json({ data, error });
}
