import { SupabaseMove } from "@/types/games/chess";
import React from "react";
import Move from "./Move";

const Moves = ({ moves }: { moves: SupabaseMove[] }) => {
    return (
        <div className=' w-full rounded-xl p-4 border border-border bg-card'>
            <div className='md:col-span-2 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-purple [&::-webkit-scrollbar-thumb]:icon-bg-dark max-h-64'>
                <h2 className='font-semibold mb-3'>Moves</h2>
                <ol className='text-sm grid grid-cols-2 gap-x-8'>
                    {moves.map((m) => (
                        <Move key={m.id} move={m} />
                    ))}
                </ol>
            </div>
        </div>
    );
};

export default Moves;
