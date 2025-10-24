import { Board } from "@/lib/games/chess/game-logic/main/board/board";
import { GameStatus, PersistedState } from "@/types/games/chess";
import { GameTableData } from "@/types/supabase/database.types";
import { getStatusColor, parseState } from "@/utils/games/chess/helpers";
import React from "react";

const GameCard = ({
    game,
    userId,
}: {
    game: GameTableData;
    userId: string;
}) => {
    const gameBoard = Board.fromPersistedState(
        parseState<PersistedState>(game?.state_json)
    );
    const moves = gameBoard.moveHistoryList;
    const lastMove = gameBoard.getLastMove();
    const gameStatus = gameBoard.getGameStatus();
    const winner =
        gameStatus !== "checkmate"
            ? "Unknown"
            : lastMove?.piece.color === "White"
            ? "White"
            : "Black";
    const yourColor = game.player_white === userId ? "White" : "Black";
    const youWin = winner === yourColor;

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
                        {game.status === "checkmate" && winner !== "Unknown"
                            ? `Winner: ${youWin ? "You" : "Your opponent"}`
                            : game.status === "stalemate"
                            ? "Stalemate"
                            : game.status === "draw"
                            ? "Draw"
                            : "In progress"}
                    </p>
                </div>
            </div>
        </li>
    );
};

export default GameCard;
