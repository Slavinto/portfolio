"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { GameStatus } from "@/types/games/chess";

export async function finishGame(
    gameId: string,
    status: GameStatus,
    winnerId: string | null
) {
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Not authenticated");
    }

    const { data: originalGame, error } = await supabase
        .from("games")
        .select("status")
        .eq("id", gameId)
        .single();

    if (error) throw error;
    if (originalGame.status !== "ongoing") return;

    await supabase
        .from("games")
        .update({
            status,
            winner: winnerId,
            updated_at: new Date().toISOString(),
        })
        .eq("id", gameId);

    if (winnerId === user.id) {
        await supabase.rpc("increment_player_stats", {
            p_player_id: user.id,
            p_result: "win",
        });
    } else if (winnerId !== null) {
        await supabase.rpc("increment_player_stats", {
            p_player_id: user.id,
            p_result: "loss",
        });
    } else {
        await supabase.rpc("increment_player_stats", {
            p_player_id: user.id,
            p_result: "draw",
        });
    }
}
