import { useUser } from "@/hooks/auth/useUser";
import { createClient } from "@/lib/supabase/client";
import { GameRow, SupabaseMove } from "@/types/games/chess";
import { useEffect, useRef } from "react";
import { useGame } from "./useGame";
import { GameTableData } from "@/types/supabase/database.types";
import { toast } from "react-toastify";
import { usePresenceStore } from "@/data/games/chess/store/presence";

export function useGameChannel(
    gameId: string,
    onGameUpdate: (row: any) => void,
    onMove?: (row: any) => void,
    initialRow?: GameRow
) {
    const hydratedRef = useRef(false);
    const channelRef = useRef<ReturnType<
        ReturnType<typeof createClient>["channel"]
    > | null>();
    const supabase = createClient();
    const { data: user } = useUser();
    const game = useGame(gameId) as unknown as GameTableData;

    const setOnline = usePresenceStore((s) => s.setOnline);
    const setOffline = usePresenceStore((s) => s.setOffline);
    const reset = usePresenceStore((s) => s.reset);

    useEffect(() => {
        if (!gameId || !user?.id) return;

        // Hydrate initial game state only once
        if (initialRow && !hydratedRef.current) {
            onGameUpdate(initialRow);
            hydratedRef.current = true;
        }

        const channel = supabase.channel(`game-${gameId}`, {
            config: {
                presence: {
                    key: user.id,
                },
            },
        });

        console.log("Subscribing to channel:", `game-${gameId}`);

        channel
            .on("presence", { event: "sync" }, () => {
                const state = channel.presenceState();

                const playersOnline = Object.keys(state); // array of user ids

                console.info("Players currently online:", playersOnline);

                if (!game?.player_white || !game?.player_black) {
                    toast.info(
                        "Game not fully loaded yet, skipping presence check."
                    );
                    return;
                }
                const opponentId =
                    user.id === game.player_white
                        ? game.player_black
                        : game.player_white;

                const opponentOnline = playersOnline.includes(opponentId ?? "");

                if (opponentOnline) {
                    // opposite player is in the game right now
                    toast.info("Opponent has joined the game");
                }
            })
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "games",
                    filter: `id=eq.${gameId}`,
                },
                (payload) => {
                    console.log("Game updated:", payload.new);
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
                    console.log("New move:", payload.new);
                    const newMove = payload.new as SupabaseMove;
                    // Don’t re-hydrate board here — pass the move up
                    onMove?.(newMove.move_json);
                }
            )
            .subscribe((status) => {
                if (status === "SUBSCRIBED") {
                    channel.track({ online_at: Date.now() });
                    console.log("Realtime channel status:", status);
                }
            });

        // ✅ Clean up on unmount or game change
        return () => {
            console.log("Unsubscribing from channel", `game-${gameId}`);
            channel.unsubscribe();
        };
    }, [
        gameId,
        onGameUpdate,
        onMove,
        initialRow,
        game?.player_black,
        game?.player_white,
        supabase,
        user?.id,
    ]);
}
