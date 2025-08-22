"use client";

import { Piece } from "@/lib/games/chess/game-logic/main/piece";
import { Position } from "@/lib/games/chess/game-logic/main/position";

const Square = ({
    piece,
    position,
    isSelected,
    onClick,
}: {
    piece: Piece | null;
    position: Position;
    isSelected: boolean;
    onClick: () => void;
}) => {
    const isLight = (position.rank + position.file.charCodeAt(0)) % 2 === 0;
    // console.log({ isSelected });
    return (
        <div
            style={{
                boxShadow: isSelected
                    ? isLight
                        ? "inset 0 0 10px 4px rgba(1, 35, 91, 0.5)"
                        : "inset 0 0 10px 4px rgba(255, 255, 255, 0.5)"
                    : undefined,
            }}
            className={`relative w-16 h-16 flex items-center justify-center text-2xl cursor-pointer ${
                isLight ? "bg-amber-700" : "bg-emerald-800"
            } ${isSelected ? "shadow-inner ring-4 ring-slate-100" : ""}`}
            onClick={onClick}
        >
            <span
                className={`text-4xl ${
                    piece?.color === "White" ? "text-zinc-200" : "text-zinc-900"
                }`}
            >
                {piece ? piece.getUnicodeSymbol() : ""}
            </span>
            <span
                className={`text-2xl font-bold  absolute -bottom-8 text-black z-50${
                    position.rank !== 1 ? " hidden" : ""
                }`}
            >{`${position.file}`}</span>
            <span
                className={`text-2xl font-bold absolute -left-8 text-black${
                    position.file !== "A" ? " hidden" : ""
                }`}
            >{`${position.rank}`}</span>
        </div>
    );
};

export default Square;
