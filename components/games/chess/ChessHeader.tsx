import { Color, GameStatus } from "@/types/games/chess";
import React from "react";

type ChessHeaderProps = {
    id: string;
    gameStatus?: GameStatus;
    gameTurn?: Color;
};

const ChessHeader = ({ id, gameStatus, gameTurn }: ChessHeaderProps) => {
    return (
        <div className='rounded-xl p-4 border border-border bg-card w-full text-xl'>
            <h1 className='text-2xl font-bold'>
                Chess — Game
                <br />
                <span className='block max-w-xs overflow-hidden text-ellipsis whitespace-nowrap'>
                    {id}
                </span>
            </h1>

            <p className='text-neutral-500 dark:text-neutral-300'>
                Status: <span className='font-medium'>{gameStatus ?? "…"}</span>{" "}
                · Turn: <span className='font-medium'>{gameTurn ?? "…"}</span>
            </p>
        </div>
    );
};

export default ChessHeader;
