import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { usePresenceStore } from "@/data/games/chess/store/presence";
import { useEffect, useState } from "react";

export function usePlayersOnline() {
    const {
        state: { player },
    } = useChessGamePageContext();
    const onlinePlayers = usePresenceStore((s) => s.onlinePlayers);

    const [playerOnline, setPlayerOnline] = useState(false);
    const [opponentOnline, setOpponentOnline] = useState(false);

    useEffect(() => {
        if (!player) {
            return;
        }
        const { playerId, opponentId } = player;
        setPlayerOnline(!!playerId && onlinePlayers[playerId] === true);
        setOpponentOnline(!!opponentId && onlinePlayers[opponentId] === true);
    }, [onlinePlayers, player]);

    return { playerOnline, opponentOnline };
}
