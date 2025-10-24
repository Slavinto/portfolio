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
        <div className={`bg-purple w-full h-18 rounded-md p-4 flex`}>
            {capturedPieces
                .filter(
                    (piece) =>
                        piece.color !== (isPlayerWhite ? "White" : "Black")
                )
                .map((wp) => (
                    <div
                        key={wp.id}
                        className={`font-bold ${
                            isPlayerWhite ? "text-black" : "text-white"
                        } text-4xl flex`}
                    >
                        {wp.getUnicodeSymbol()}
                    </div>
                ))}
        </div>
    );
};

export default CapturedPieces;
