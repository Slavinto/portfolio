import { Color } from "@/types/games/chess";
import React from "react";

const PlayerColor = ({ color, turn }: { color?: Color; turn?: Color }) => {
    return (
        <div
            className={`lg:-top-36 mt-4 max-w-sm flex flex-col self-center items-center px-12 py-4 rounded-full bg-secondary text-secondary-foreground text-xl mb-6${
                turn === color ? " text-shadow-lg shadow-white-300" : ""
            }`}
        >
            <p className='text-3xl'>08:30</p>
            <hr className='w-full' />
            <p>{turn === color ? "Your turn" : "Opponent's turn"}</p>
        </div>
    );
};

export default PlayerColor;
