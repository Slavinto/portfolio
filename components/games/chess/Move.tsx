import { Board } from "@/lib/games/chess/game-logic/main/board/board";
import { Piece } from "@/lib/games/chess/game-logic/main/piece";
import { pieceClasses } from "@/lib/games/chess/game-logic/pieces";
import { Move } from "@/types/games/chess";
import React from "react";

const PieceMove = ({ move }: { move: Move }) => {
    const { moveNumber, piece, from, to } = move;
    return (
        <div className=''>
            <li
                key={moveNumber}
                className='flex justify-between py-1 border-b border-border/50 max-w-32'
            >
                <span className='text-middle'>№{moveNumber} </span>
                <span
                    className={
                        piece.color === "White"
                            ? "!text-gray-300 text-middle"
                            : "!text-gray-800 text-middle"
                    }
                >
                    {Piece.fromPersisted(
                        piece,
                        new Board(),
                        pieceClasses
                    ).getUnicodeSymbol()}
                </span>
                <span className='text-middle'>&#8212;</span>
                <span className='text-middle'>
                    {from?.file}
                    {from?.rank}
                </span>
                <span className='text-middle'>&#8594;</span>
                <span className='text-middle'>
                    {to?.file}
                    {to?.rank}
                </span>
            </li>
        </div>
    );
};

export default PieceMove;
