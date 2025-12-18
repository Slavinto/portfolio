import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { joinGame } from "@/lib/games/chess/actions/joinGame";
import { useUser } from "@/hooks/auth/useUser";
import { toast } from "react-toastify";

export function useJoinedGame(gameId: string) {
    const { data: user, isLoading: isLoadingUser } = useUser();
    const supabase = createClient();
    const queryClient = useQueryClient();
    const attemptedJoinRef = useRef(false);

    /* ---------------- Fetch game (READ ONLY) ---------------- */

    const {
        data: game,
        isLoading: isLoadingGame,
        error: gameError,
    } = useQuery({
        queryKey: ["game", gameId],
        enabled: !!gameId && !isLoadingUser,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("games")
                .select("*")
                .eq("id", gameId)
                .single();

            if (error || !data) {
                throw error ?? new Error("Game not found");
            }

            return data;
        },
    });

    /* ---------------- Join mutation ---------------- */

    const joinMutation = useMutation({
        mutationFn: () => joinGame(gameId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["game", gameId] });
        },
        onError: (err: any) => {
            toast.error(err?.message ?? "Failed to join game");
        },
    });

    /* ---------------- Auto-join logic ---------------- */

    useEffect(() => {
        console.log({ userInUseJoinedGame: user, gameInUseJoinedGame: game });
        if (!user || !game || attemptedJoinRef.current) return;

        const alreadyJoined =
            user.id === game.player_white || user.id === game.player_black;

        const canJoin =
            game.status === "waiting" &&
            (!game.player_white || !game.player_black);

        if (!alreadyJoined && canJoin) {
            attemptedJoinRef.current = true;
            joinMutation.mutate();
        }
    }, [user?.id, game?.id]);

    return {
        game,
        isLoadingGame: isLoadingGame || joinMutation.isPending,
        gameError,
    };
}
