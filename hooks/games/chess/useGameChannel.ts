import { createClient } from "@/lib/supabase/client";
import { SupabaseMove } from "@/types/games/chess";
import { useEffect, useRef } from "react";
import { usePresenceStore } from "@/data/games/chess/store/presence";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";

export function useGameChannel(
    id: string,
    onGameUpdate: (row: any) => void,
    onMove?: (row: any) => void
) {
    const channelRef = useRef<ReturnType<
        ReturnType<typeof createClient>["channel"]
    > | null>(null);
    const opponentOnlineRef = useRef<boolean>(false);
    const supabase = createClient();
    const {
        state: { player, gameRow },
    } = useChessGamePageContext();

    const setOnline = usePresenceStore((s) => s.setOnline);
    const setOffline = usePresenceStore((s) => s.setOffline);
    const reset = usePresenceStore((s) => s.reset);

    useEffect(() => {
        // require only id and player identity to subscribe
        if (!id || !player || !player.playerId) return;

        const playerId = player.playerId;
        const opponentId = player.opponentId; // may be undefined initially

        const channel = supabase.channel(`game-${id}`, {
            config: {
                presence: { key: playerId },
            },
        });
        channelRef.current = channel;

        channel
            .on("presence", { event: "sync" }, () => {
                const presenceState = channel.presenceState();
                const playersOnline = Object.keys(presenceState); // array of user ids

                // update presence store
                playersOnline.forEach((id) => setOnline(id));

                // if opponentId not yet known, skip per-player offline checks
                if (!opponentId) {
                    // still update creator/owner online state
                    if (!playersOnline.includes(playerId)) setOffline(playerId);
                    return;
                }

                // detect opponent online/offline toggles (optional ref-based)
                if (
                    playersOnline.includes(opponentId) &&
                    !opponentOnlineRef.current
                ) {
                    opponentOnlineRef.current = true;
                }
                if (
                    !playersOnline.includes(opponentId) &&
                    opponentOnlineRef.current
                ) {
                    opponentOnlineRef.current = false;
                }

                // ensure each known player is set offline if missing
                if (
                    gameRow?.player_white &&
                    !playersOnline.includes(gameRow.player_white)
                ) {
                    setOffline(gameRow.player_white);
                }
                if (
                    gameRow?.player_black &&
                    !playersOnline.includes(gameRow.player_black)
                ) {
                    setOffline(gameRow.player_black);
                }
            })
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "games",
                    filter: `id=eq.${id}`,
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
                    filter: `game_id=eq.${id}`,
                },
                (payload) => {
                    const newMove = payload.new as SupabaseMove;
                    onMove?.(newMove.move_json);
                }
            )
            .subscribe((status) => {
                if (status === "SUBSCRIBED") {
                    // track presence for this client
                    channel.track({ online_at: Date.now() }).catch((e) => {
                        console.warn("Presence track failed:", e);
                    });
                }
            });

        return () => {
            try {
                channelRef.current?.unsubscribe();
            } catch (e) {
                console.warn("Error unsubscribing channel:", e);
            }
            reset();
        };
    }, [
        id,
        player?.playerId,
        player?.opponentId,
        setOnline,
        setOffline,
        reset,
        supabase,
        gameRow?.player_white,
        gameRow?.player_black,
    ]);
}
