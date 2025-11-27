import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { joinGame } from "@/lib/services/chess-db";
import { Color } from "@/types/games/chess";
import { useUser } from "@/hooks/auth/useUser";

export function useJoinedGame(gameId: string) {
    const { data: user } = useUser();

    const supabase = createClient();
    const {
        data: game,
        isLoading: isLoadingGame,
        error: gameError,
    } = useQuery({
        queryKey: ["game", gameId],
        enabled: !!user && !!gameId,
        queryFn: async () => {
            if (!user) {
                throw new Error("Invalid user");
            }
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

    return { game, isLoadingGame, gameError };
}
