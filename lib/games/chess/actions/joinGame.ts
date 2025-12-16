"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function joinGame(gameId: string) {
    if (!gameId) return;
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data: game } = await supabase
        .from("games")
        .select("id, player_white, player_black, status")
        .eq("id", gameId)
        .single();

    if (!game) throw new Error("Game not found");
    if (game.status !== "waiting") throw new Error("Game not joinable");

    if (game.player_white && game.player_black) {
        throw new Error("Game already full");
    }

    const side = game.player_white ? "player_black" : "player_white";

    await supabase
        .from("games")
        .update({
            [side]: user.id,
            status: "ongoing",
            updated_at: new Date().toISOString(),
        })
        .eq("id", gameId);

    return { gameId };
}
