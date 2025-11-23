import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { joinGame } from "@/lib/services/chess-db";
import { Color } from "@/types/games/chess";

export function useJoinedGame(gameId: string) {
    const supabase = createClient();
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

            const gameFull =
                existingGame.player_white && existingGame.player_black;
            const alreadyJoinedGame =
                user.id === existingGame.player_white ||
                user.id === existingGame.player_black;

            if (gameFull || alreadyJoinedGame) {
                return existingGame;
            }

            const playerId = user.id;
            const playerColor = existingGame.player_white
                ? ("Black" as Color)
                : ("White" as Color);
            const joinAs = { playerColor, playerId };
            const opponentId =
                playerColor === "Black"
                    ? existingGame.player_white
                    : existingGame.player_black;

            // join game if needed
            const joined = await joinGame(gameId, joinAs);
            return joined;
        },
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always",
    });
}
