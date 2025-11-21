import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { joinGame } from "@/lib/services/chess-db";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";

export function useJoinedGame(gameId: string) {
    const supabase = createClient();
    const { dispatch } = useChessGamePageContext();
    return useQuery({
        queryKey: ["game", gameId],
        queryFn: async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) throw new Error("Not signed in");

            // try to fetch
            const { data: existingGame, error } = await supabase
                .from("games")
                .select("*")
                .eq("id", gameId)
                .single();

            if (error || !existingGame)
                throw error ?? new Error("Game not found");
            dispatch({
                type: "SET_GAME_ID",
                payload: { gameId: existingGame.id },
            });
            // join game if needed
            const joined = await joinGame(gameId);
            return joined;
        },
    });
}
