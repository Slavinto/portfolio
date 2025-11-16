import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { usePresenceStore } from "@/data/games/chess/store/presence";
import React from "react";

const ChessGameStatus = () => {
    const { state } = useChessGamePageContext();
    console.log({ state });
    const opponentIsOnline = usePresenceStore(
        (s) => s.onlinePlayers[state.opponentId!] === true
    )
        ? "🟢"
        : "🔴";
    const playerIsOnline = usePresenceStore(
        (s) => s.onlinePlayers[state.playerId!] === true
    )
        ? "🟢"
        : "🔴";
    return (
        <div className='flex flex-col'>
            <p className='text-neutral-500 dark:text-neutral-300'>
                Game status:&nbsp;
                <span className='font-medium'>
                    {state.board.getGameStatus() ?? "…"}
                </span>{" "}
                · Turn:&nbsp;
                <span className='font-medium'>
                    {state.board.currentTurn ?? "…"}
                </span>
            </p>
            <div className='flex gap-2 '>
                <p className='text-neutral-500 dark:text-neutral-300'>
                    Player online: <span>{playerIsOnline} |</span>
                </p>
                <p className='text-neutral-500 dark:text-neutral-300'>
                    Opponent online: <span>{opponentIsOnline}</span>
                </p>
            </div>
        </div>
    );
};

export default ChessGameStatus;
