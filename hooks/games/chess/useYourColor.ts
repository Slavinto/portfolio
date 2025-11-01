import { useUser } from "@/hooks/auth/useUser";
import { useJoinedGame } from "./useJoinedGame";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { Color } from "@/types/games/chess";

export function useYourColor() {
    const {
        data: user,
        error: userError,
        isLoading: isLoadingUser,
    } = useUser();
    const { id } = useParams<{ id: string }>();
    const {
        data: game,
        isPending: isLoadingGame,
        error: gameError,
    } = useJoinedGame(id);

    const isBusy = isLoadingGame || isLoadingUser;
    const error = userError || gameError || null;

    const yourColor = useMemo(() => {
        return user?.id === game?.player_black ? "Black" : "White";
    }, [game, user]) as Color;

    return { yourColor, isLoading: isBusy, error };
}
