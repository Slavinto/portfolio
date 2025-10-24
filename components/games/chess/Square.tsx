"use client";

import { Piece } from "@/lib/games/chess/game-logic/main/piece";
import { Position } from "@/lib/games/chess/game-logic/main/position";

interface SquareProps {
    piece: Piece | null;
    position: Position;
    isSelected: boolean;
    onClick: () => void;
}

const Square = ({ piece, position, isSelected, onClick }: SquareProps) => {
    const isDark = (position.rank + position.file.charCodeAt(0)) % 2 === 0;

    const squareColor = isDark ? "bg-indigo-800" : "bg-violet-500";
    const pieceColor =
        piece?.color === "White" ? "text-zinc-200" : "text-zinc-900";

    const borderHighlight = isSelected
        ? "shadow-inner ring-4 ring-slate-100"
        : "";

    const boxShadow = isSelected
        ? isDark
            ? "inset 0 0 10px 4px rgba(255, 255, 255, 0.5)"
            : "inset 0 0 10px 4px rgba(1, 35, 91, 0.5)"
        : undefined;

    return (
        <div
            onClick={onClick}
            style={{ boxShadow }}
            className={`relative w-16 h-16 flex items-center justify-center text-2xl cursor-pointer ${squareColor} ${borderHighlight}`}
        >
            {/* Chess piece */}
            {piece && (
                <span className={`text-4xl ${pieceColor}`}>
                    {piece.getUnicodeSymbol()}
                </span>
            )}

            {/* File label (A–H) */}
            {position.rank === 1 && (
                <span className='absolute -bottom-8 text-2xl font-bold text-black z-50'>
                    {position.file}
                </span>
            )}

            {/* Rank label (1–8) */}
            {position.file === "A" && (
                <span className='absolute -left-8 text-2xl font-bold text-black'>
                    {position.rank}
                </span>
            )}
        </div>
    );
};

export default Square;
