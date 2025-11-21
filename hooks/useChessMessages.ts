import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { createClient } from "@/lib/supabase/client";
import { ChessMessage } from "@/types/games/chess";
import { useQuery } from "@tanstack/react-query";

export function useChessMessages() {
    const { state } = useChessGamePageContext();

    const {
        isPending,
        error,
        data: messages,
    } = useQuery({
        queryKey: ["chess-messages", state.gameId], // 👈 include gameId
        queryFn: async () => {
            const supabase = createClient();

            const { data, error } = await supabase
                .from("chess_messages")
                .select("*")
                .eq("game_id", state.gameId)
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Failed to fetch messages:", error);
                throw error; // 👈 let React Query handle errors
            }

            return (data ?? []) as ChessMessage[]; // 👈 always return array
        },
        enabled: !!state.gameId, // 👈 wait until gameId is defined
    });

    return {
        chessMessages: messages || [],
        isLoadingMessages: isPending,
        messagesError: error,
    };
}
