import React from "react";
import PieceMove from "./Move";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";

const Moves = () => {
    const {
        state: {
            board: { moveHistoryList },
        },
    } = useChessGamePageContext();
    return (
        <div className=' w-full rounded-xl p-4 border border-border bg-card'>
            <div className='md:col-span-2 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-purple [&::-webkit-scrollbar-thumb]:icon-bg-dark max-h-64'>
                <h2 className='font-semibold mb-3'>Moves</h2>
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
