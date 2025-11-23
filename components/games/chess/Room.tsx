import { GameRow } from "@/types/games/chess";
import React from "react";
import ChatPanel from "./chat/ChatPanel";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";

const Room = () => {
    const { state } = useChessGamePageContext();
    if (!state.player || !state.gameRow) {
        return null;
    }
    const { playerId } = state.player;
    const { player_white, player_black } = state.gameRow;
    return (
        <div className='rounded-xl p-4 border border-border bg-card w-full'>
            <h2 className='font-semibold mb-3'>Room</h2>
            <p className='text-sm'>
                White:{" "}
                <span className='font-medium'>{player_white ?? "—"}</span>
                <br />
                Black:{" "}
                <span className='font-medium'>{player_black ?? "—"}</span>
            </p>
            <div className='relative flex mt-4 text-sm font-light rounded-md border border-border min-h-96 w-full'>
                {playerId && <ChatPanel />}
            </div>
        </div>
    );
};

export default Room;
