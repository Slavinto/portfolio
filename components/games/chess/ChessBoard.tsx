"use client";

import ChessGameSkeleton from "@/components/ui/patterns/ChessGameSkeleton";
import { useJoinedGame } from "@/hooks/games/chess/useJoinedGame";
import { useYourColor } from "@/hooks/games/chess/useYourColor";
import { Board } from "@/lib/games/chess/game-logic/main/board/board";
import { Position } from "@/lib/games/chess/game-logic/main/position";
import {
    BoardAction,
    BoardState,
    Color,
    File,
    Move,
    Rank,
} from "@/types/games/chess";
import {
    getPositionForCell,
    isLegalToMoveToPosition,
} from "@/utils/games/chess/helpers";

interface ChessBoardProps {
    gameId: string;
    state: BoardState;
    dispatch: React.Dispatch<BoardAction>;
    onCommittedMove: (move: Move, board: Board) => void;
}

export default function ChessBoard({
    gameId,
    state,
    dispatch,
    onCommittedMove,
}: ChessBoardProps) {
    const { board, selected } = state;
    const {
        data: game,
        isPending: isLoadingGame,
        error,
    } = useJoinedGame(gameId);
    const { yourColor, isLoading: isLoadingColor } = useYourColor();

    const waitingForOpponent =
        (game && !game?.player_white) || !game?.player_black;

    const isBusy = isLoadingGame || isLoadingColor;

    if (isBusy) return <ChessGameSkeleton repeatPattern={1} />;

    console.log({ state });

    // Sync from server if provided

    function handleSquareClick(position: Position) {
        const piece = board.getPieceAtPosition(position);
        console.log({ piece });
        if (piece && piece.color !== yourColor) {
            console.info("Can not select opponent's piece");
            return;
        }
        if (selected) {
            const selectedPiece = board.getPieceAtPosition(selected);
            if (!selectedPiece) return;

            if (isLegalToMoveToPosition(board, selectedPiece, position)) {
                // Reset local selection
                dispatch({ type: "UNSELECT_PIECE" });
                const move = board.movePiece(selected, position);
                if (!move) {
                    throw new Error("Failed to make a move.");
                }
                // Tell parent -> push to Supabase
                onCommittedMove(move, board);
            }
        } else if (piece && piece.color === board.currentTurn) {
            dispatch({ type: "SELECT_PIECE", payload: { position } });
        }
    }

    return (
        <div className='grid grid-cols-8 w-[32rem] h-[32rem] rounded-xl overflow-hidden border-2 border-white-300 cursor-pointer'>
            {Array.from({ length: 8 }).map((_, row) =>
                Array.from({ length: 8 }).map((_, col) => {
                    const pos: Position = getPositionForCell(
                        row,
                        col,
                        yourColor
                    );
                    const piece = board.getPieceAtPosition(pos);
                    const isSelected =
                        selected?.file === pos.file &&
                        selected?.rank === pos.rank;

                    return (
                        <div
                            key={`${pos.file}${pos.rank}`}
                            className={`flex items-center justify-center border w-16 h-16 ${
                                (row + col) % 2 === 0
                                    ? "bg-purple"
                                    : "icon-bg-dark"
                            } ${isSelected ? "!shadow-inset-md" : ""}`}
                            onClick={
                                waitingForOpponent
                                    ? () => {
                                          console.info(
                                              "Waiting for opponent. Failed to make a move."
                                          );
                                      }
                                    : () => handleSquareClick(pos)
                            }
                        >
                            {piece ? (
                                <span
                                    className={`relative text-5xl${
                                        piece.color === "White"
                                            ? " text-white"
                                            : " text-black"
                                    }`}
                                >
                                    {piece.getUnicodeSymbol()}
                                </span>
                            ) : (
                                ""
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}
