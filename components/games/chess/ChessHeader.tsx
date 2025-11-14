import { Heading } from "@/components/ui";
import { Headings } from "@/types/enums";
import React, { ReactNode } from "react";
import { FaChessKing } from "react-icons/fa";
import ChessGameStatus from "./ChessGameStatus";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";

const ChessHeader = ({ id, children }: { id: string; children: ReactNode }) => {
    const { state } = useChessGamePageContext();
    const gameStatus = state.board.getGameStatus();
    return (
        <div className='rounded-xl p-4 border border-border bg-card w-full text-xl'>
            <Heading as={Headings.H4} classNames='text-2xl font-bold'>
                <span className='block max-w-xs overflow-hidden text-ellipsis whitespace-nowrap'>
                    <FaChessKing className='inline -rotate-12 mr-1 mb-1' />
                    Game-{id}
                </span>
            </Heading>

            <ChessGameStatus />

            {(gameStatus === "check" || gameStatus === "ongoing") && children}
        </div>
    );
};

export default ChessHeader;
