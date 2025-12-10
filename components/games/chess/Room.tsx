import React, { useEffect, useState } from "react";
import ChatPanel from "./chat/ChatPanel";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { FaChessKing, FaRegUserCircle } from "react-icons/fa";
import UserAvatar from "@/app/profile/UserAvatar";
import { getAvatarUrl } from "@/app/profile/getAvatarUrl";
import PlayerCard from "@/components/ui/cards/PlayerCard";

const Room = () => {
    const { state } = useChessGamePageContext();
    if (!state.player || !state.gameRow || !state.opponent) {
        return null;
    }
    const { id: playerId } = state.player;
    const { player_white } = state.gameRow;
    const isPlayerWhite = playerId === player_white;
    const playerColor = isPlayerWhite ? "#fff" : "#444";
    const opponentColor = isPlayerWhite ? "#444" : "#fff";

    return (
        <div className='flex flex-col rounded-xl p-4 border border-border bg-card w-full'>
            <h2 className='font-semibold mb-3'>Room</h2>
            <div className='flex gap-8 w-full justify-center'>
                <PlayerCard
                    icon={<FaChessKing fill={playerColor} />}
                    playerId={playerId}
                />
                <PlayerCard
                    icon={<FaChessKing fill={opponentColor} />}
                    playerId={state.opponent.id}
                />
            </div>
            <div className='relative flex mt-4 text-sm font-light rounded-md border border-border min-h-96 w-full'>
                {playerId && <ChatPanel />}
            </div>
        </div>
    );
};

export default Room;
