import React from "react";
import ChatPanel from "./chat/ChatPanel";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { FaChessKing } from "react-icons/fa";
import PlayerCard from "@/components/ui/cards/PlayerCard";
import { Headings } from "@/types/enums";
import { Heading } from "@/components/ui";

const Room = () => {
    const { state } = useChessGamePageContext();
    if (!state.player || !state.gameRow || !state.opponent) {
        return null;
    }
    const { id: playerId } = state.player;
    const { player_white } = state.gameRow;
    const isPlayerWhite = playerId === player_white;
    const playerColor = isPlayerWhite ? "#999" : "#444";
    const opponentColor = isPlayerWhite ? "#444" : "#999";

    return (
        <div className='flex flex-col rounded-xl p-4 border border-border bg-card w-full'>
            <Heading as={Headings.H4} classNames='font-semibold mb-3'>
                Room
            </Heading>
            <div className='flex flex-col gap-8 w-full justify-center'>
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
