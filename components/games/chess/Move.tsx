import { Board } from "@/lib/games/chess/game-logic/main/board/board";
import { Piece } from "@/lib/games/chess/game-logic/main/piece";
import { pieceClasses } from "@/lib/games/chess/game-logic/pieces";
import { SupabaseMove } from "@/types/games/chess";
import React from "react";

const Move = ({ move }: { move: SupabaseMove }) => {
    const {
        id,
        move_number,
        move_json: { piece, from, to },
    } = move;
    return (
        <div className=''>
            <li
                key={id}
                className='flex justify-between py-1 border-b border-border/50 max-w-32'
            >
                №{move_number}{" "}
                <span
                    className={
                        piece.color === "White"
                            ? "text-gray-300"
                            : "text-gray-600"
                    }
                >
                    {Piece.fromPersisted(
                        piece,
                        new Board(),
                        pieceClasses
                    ).getUnicodeSymbol()}
                </span>
                <span>&#8212;</span>
                {from?.file}
                {from?.rank}
                <span>&#8594;</span>
                {to?.file}
                {to?.rank}
            </li>
        </div>
    );
};

export default Move;
