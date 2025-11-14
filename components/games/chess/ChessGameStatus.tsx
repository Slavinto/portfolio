import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import React from "react";

const ChessGameStatus = () => {
    const { state } = useChessGamePageContext();

    return (
        <p className='text-neutral-500 dark:text-neutral-300'>
            Status:{" "}
            <span className='font-medium'>
                {state.board.getGameStatus() ?? "…"}
            </span>{" "}
            · Turn:{" "}
            <span className='font-medium'>
                {state.board.currentTurn ?? "…"}
            </span>
        </p>
    );
};

export default ChessGameStatus;
