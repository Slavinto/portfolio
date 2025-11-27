import { useUser } from "@/hooks/auth/useUser";
import { GameStatus } from "@/types/games/chess";
import { GameTableData } from "@/types/supabase/database.types";
import { getStatusColor } from "@/utils/games/chess/helpers";
import React from "react";

const GameCard = ({ game }: { game: GameTableData }) => {
    const { data: user } = useUser();

    if (!user) {
        return null;
    }
    const moves = game.state_json?.board?.moveHistoryList;

    const youWin = user.id === game.winner;

    return (
        <li className='w-full p-4 rounded-lg bg-card hover:shadow-md transition-shadow'>
            <div className='flex justify-between items-center'>
                <div>
                    <p className='font-medium text-lg'>Game #{game.id}</p>
                    <p className='text-sm text-muted-foreground'>
                        Created: {new Date(game.created_at).toLocaleString()}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                        Moves: {moves?.length ?? 0}
                    </p>
                </div>
                <div className='text-right'>
                    <p
                        className={`font-semibold px-4 py-1 rounded-xl ${getStatusColor(
                            game.status as GameStatus
                        )}`}
                    >
                        {!!game.winner ? (
                            `Winner: ${youWin ? "Loss" : "Win"}`
                        ) : game.status === "stalemate" ? (
                            "Stalemate"
                        ) : game.status === "draw" ? (
                            "Draw"
                        ) : game.status === "layed-off" ? (
                            <span className='text-skeleton'>
                                Layed&nbsp;off
                            </span>
                        ) : (
                            <span className='text-skeleton'>Ongoing</span>
                        )}
                    </p>
                </div>
            </div>
        </li>
    );
};

export default GameCard;
