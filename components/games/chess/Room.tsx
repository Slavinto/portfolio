import { GameRow } from "@/types/games/chess";
import React from "react";
import ChatPanel from "./chat/ChatPanel";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";

const Room = ({ game }: { game: GameRow }) => {
    const { state } = useChessGamePageContext();
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
            <div className='relative flex mt-4 text-sm font-light rounded-md border border-border min-h-96 w-full'>
                {state.playerId && <ChatPanel />}
            </div>
        </div>
    );
};

export default Room;
