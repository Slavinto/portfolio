import { useUser } from "@/hooks/auth/useUser";
import { createClient } from "@/lib/supabase/client";
import { GameRow, SupabaseMove } from "@/types/games/chess";
import { useEffect, useRef } from "react";
import { useGame } from "./useGame";
import { GameTableData } from "@/types/supabase/database.types";
import { usePresenceStore } from "@/data/games/chess/store/presence";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";

export function useGameChannel(
    gameId: string,
    onGameUpdate: (row: any) => void,
    onMove?: (row: any) => void,
    initialRow?: GameRow
) {
    const hydratedRef = useRef(false);
    const channelRef = useRef<ReturnType<
        ReturnType<typeof createClient>["channel"]
    > | null>(null);
    const opponentOnlineRef = useRef<boolean>(false);
    const supabase = createClient();
    const { data: user } = useUser();
    const gameRow = useGame(gameId) as { data: GameTableData };
    const { state: localState, dispatch } = useChessGamePageContext();

    const setOnline = usePresenceStore((s) => s.setOnline);
    const setOffline = usePresenceStore((s) => s.setOffline);
    const reset = usePresenceStore((s) => s.reset);
    const { data: game } = gameRow;
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
        channelRef.current = channel;
        console.log("Subscribing to channel:", `game-${gameId}`);

        channel
            .on("presence", { event: "sync" }, () => {
                const state = channel.presenceState();

                const playersOnline = Object.keys(state); // array of user ids
                playersOnline.forEach((id) => setOnline(id));

                console.info("Players currently online:", playersOnline);

                if (!game?.player_white || !game?.player_black) {
                    console.info(
                        "Game not fully loaded yet, skipping presence check."
                    );
                    return;
                }

                user.id && playersOnline.includes(user.id)
                    ? setOnline(user.id)
                    : setOffline(user.id);

                const opponentId =
                    user.id === game.player_white
                        ? game.player_black
                        : game.player_white;

                if (
                    playersOnline.includes(opponentId) &&
                    !opponentOnlineRef.current
                ) {
                    opponentOnlineRef.current = true;
                    // toast.info("Opponent has joined the game");
                }
                if (
                    !playersOnline.includes(opponentId) &&
                    opponentOnlineRef.current
                ) {
                    opponentOnlineRef.current = false;
                    // toast.info("Opponent has left the game");
                }

                if (!localState.opponentId || !localState.playerId) {
                    dispatch({
                        type: "SET_PLAYER_IDS",
                        payload: {
                            playerId: user.id ?? null,
                            opponentId: opponentId ?? null,
                        },
                    });
                }

                if (game?.player_white) {
                    if (!playersOnline.includes(game.player_white))
                        setOffline(game.player_white);
                }
                if (game?.player_black) {
                    if (!playersOnline.includes(game.player_black))
                        setOffline(game.player_black);
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
            channelRef.current?.unsubscribe();
            reset();
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
        dispatch,
        game,
        localState,
        setOnline,
        setOffline,
        reset,
    ]);
}
