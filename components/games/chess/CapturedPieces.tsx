"use client";

import { Piece } from "@/lib/games/chess/game-logic/main/piece";

const CapturedPieces = ({
    capturedPieces,
    isPlayerWhite,
}: {
    capturedPieces: Piece[];
    isPlayerWhite: boolean;
}) => {
    return (
        <div
            className={`${
                isPlayerWhite ? "bg-gray-400/20" : "bg-gray-800/20"
            } w-full h-18 rounded-md p-4 flex`}
        >
            {capturedPieces
                .filter(
                    (piece) =>
                        piece.color !== (isPlayerWhite ? "White" : "Black")
                )
                .map((wp) => (
                    <div
                        key={wp.id}
                        className='font-bold text-black text-4xl flex'
                    >
                        {wp.getUnicodeSymbol()}
                    </div>
                ))}
        </div>
    );
};

export default CapturedPieces;
