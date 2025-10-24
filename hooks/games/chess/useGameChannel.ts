import { supabase } from "@/lib/supabase/client";
import { SupabaseMove } from "@/types/games/chess";
import { useEffect } from "react";

export function useGameChannel(
    gameId: string,
    onGameUpdate: (row: any) => void,
    onMove?: (row: any) => void
) {
    useEffect(() => {
        if (!gameId) return;
        const channel = supabase
            .channel(`games:${gameId}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "games",
                    filter: `id=eq.${gameId}`,
                },
                (payload) => {
                    onGameUpdate(payload.new);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "moves",
                    filter: `game_id=eq.${gameId}`,
                },
                (payload) => {
                    const newMove = payload.new as SupabaseMove;
                    const parsedMove = {
                        ...newMove,
                        move_json:
                            typeof newMove.move_json === "string"
                                ? JSON.parse(newMove.move_json)
                                : newMove.move_json,
                    };

                    onMove?.(parsedMove);
                }
            )
            .subscribe((status) => console.log({ channelStatus: status }));
    }, [gameId, onGameUpdate, onMove]);
}
