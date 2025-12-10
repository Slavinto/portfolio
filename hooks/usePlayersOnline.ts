import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { usePresenceStore } from "@/data/games/chess/store/presence";
import { useEffect, useState } from "react";

export function usePlayersOnline() {
    const {
        state: { player, opponent },
    } = useChessGamePageContext();
    const onlinePlayers = usePresenceStore((s) => s.onlinePlayers);
    const [playerOnline, setPlayerOnline] = useState(false);
    const [opponentOnline, setOpponentOnline] = useState(false);

    useEffect(() => {
        if (!player || !opponent) {
            return;
        }
        const { id: playerId } = player;
        const { id: opponentId } = opponent;
        setPlayerOnline(!!playerId && onlinePlayers[playerId] === true);
        setOpponentOnline(!!opponentId && onlinePlayers[opponentId] === true);
    }, [onlinePlayers, player, opponent]);

    return { playerOnline, opponentOnline };
}
