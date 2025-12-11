import React from "react";
import PieceMove from "./Move";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { Heading } from "@/components/ui";
import { Headings } from "@/types/enums";

const Moves = () => {
    const {
        state: {
            board: { moveHistoryList },
        },
    } = useChessGamePageContext();
    return (
        <div className=' w-full rounded-xl p-4 border border-border bg-card'>
            <div className='md:col-span-2 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-purple [&::-webkit-scrollbar-thumb]:icon-bg-dark max-h-64'>
                <Heading as={Headings.H4} classNames='font-semibold mb-3'>
                    Moves
                </Heading>
                <ol className='text-sm grid grid-cols-2 gap-x-8'>
                    {moveHistoryList.map((m) => (
                        <PieceMove key={m.moveNumber} move={m} />
                    ))}
                </ol>
            </div>
        </div>
    );
};

export default Moves;
