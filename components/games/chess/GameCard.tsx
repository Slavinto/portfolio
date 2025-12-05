import TruncatedText from "@/components/ui/text/TruncatedText";
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
            <div className='flex sm:flex-row flex-col justify-between items-center min-w-0'>
                <div className='max-w-lg min-w-0'>
                    <div className='line-clamp-1'>
                        <p className='text-sm text-muted-foreground'>
                            Game #{game.id}
                        </p>
                    </div>
                    <div className='line-clamp-1'>
                        <p className='text-sm text-muted-foreground'>
                            Created:{" "}
                            {new Date(game.created_at).toLocaleString()}
                        </p>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                        Moves: {moves?.length ?? 0}
                    </p>
                </div>
                <div className='text-right'>
                    <p
                        className={`font-semibold px-4 py-1 rounded-xl ${
                            youWin
                                ? "bg-green-100 text-green-800"
                                : !!game.winner && !youWin
                                ? "bg-red-100 text-red-800"
                                : getStatusColor(game.status as GameStatus)
                        }`}
                    >
                        {!!game.winner ? (
                            youWin ? (
                                "Win"
                            ) : (
                                "Loss"
                            )
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
