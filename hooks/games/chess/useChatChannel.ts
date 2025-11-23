"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ChessMessage } from "@/types/games/chess";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";

export function useChatChannel() {
    const {
        state: { gameRow },
        dispatch,
    } = useChessGamePageContext();

    useEffect(() => {
        if (!gameRow) {
            return;
        }

        const { id: gameId } = gameRow;
        const supabase = createClient();
        const channel = supabase.channel(`chat:${gameId}`);

        channel
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chess_messages",
                    filter: `game_id=eq.${gameId}`,
                },
                (payload) => {
                    dispatch({
                        type: "ADD_CHAT_MESSAGE",
                        payload: { chatMessage: payload.new as ChessMessage },
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [gameRow, dispatch]);
}
