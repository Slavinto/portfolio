import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { usePlayersOnline } from "@/hooks/usePlayersOnline";
import React from "react";

const ChessGameStatus = () => {
    const {
        state: { gameRow, isLoading },
    } = useChessGamePageContext();
    const { playerOnline, opponentOnline } = usePlayersOnline();
    if (isLoading) {
        return "Loading...";
    }
    if (!gameRow) {
        console.info("Failed to load game state data");
        return null;
    }
    const { turn, status } = gameRow;

    return (
        <div className='flex flex-col gap-2'>
            <p className='text-sm text-neutral-500 dark:text-neutral-300'>
                Game status:&nbsp;
                <span className='font-bold'>{status ?? "…"}</span> · Turn:&nbsp;
                <span className='font-bold'>{turn ?? "…"}</span>
            </p>
            <div className='flex flex-col text-sm'>
                <p className='text-neutral-500 dark:text-neutral-300'>
                    Player online: <span>{playerOnline ? "🟢" : "🔴"}</span>
                </p>
                <p className='text-neutral-500 dark:text-neutral-300'>
                    Opponent online: <span>{opponentOnline ? "🟢" : "🔴"}</span>
                </p>
            </div>
        </div>
    );
};

export default ChessGameStatus;
