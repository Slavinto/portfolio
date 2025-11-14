import { GameRow } from "@/types/games/chess";
import React from "react";

const Room = ({ game }: { game: GameRow }) => {
    return (
        <div className='rounded-xl p-4 border border-border bg-card w-full'>
            <h2 className='font-semibold mb-3'>Room</h2>
            <p className='text-sm'>
                White:{" "}
                <span className='font-medium'>{game?.player_white ?? "—"}</span>
                <br />
                Black:{" "}
                <span className='font-medium'>{game?.player_black ?? "—"}</span>
            </p>
            <div className='mt-4 text-sm font-light rounded-md border border-border h-64 w-full px-4 py-2'>
                Chat messages go here...
            </div>
        </div>
    );
};

export default Room;
