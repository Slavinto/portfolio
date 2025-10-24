import { Color } from "@/types/games/chess";
import React from "react";

const PlayerColor = ({
    color,
    turn,
}: {
    color: Color | null;
    turn: Color | null;
}) => {
    return (
        <div
            className={`flex flex-col items-center px-12 py-4 rounded-full bg-secondary text-secondary-foreground text-xl mb-6${
                turn === color ? " text-shadow-lg shadow-white-300" : ""
            }`}
        >
            <p>{color ? `You: ${color}` : "Spectating"}</p>
            <hr className='w-full' />
            <p>{turn === color ? "Your turn" : "Opponent's turn"}</p>
        </div>
    );
};

export default PlayerColor;
