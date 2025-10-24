"use client";

import { Board } from "@/lib/games/chess/game-logic/main/board/board";
import { Position } from "@/lib/games/chess/game-logic/main/position";
import { BoardAction, BoardState, File, Move, Rank } from "@/types/games/chess";
import { isLegalToMoveToPosition } from "@/utils/games/chess/helpers";

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

    console.log({ state });
    // Sync from server if provided

    function handleSquareClick(position: Position) {
        const piece = board.getPieceAtPosition(position);
        console.log({ piece });
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
                    const pos: Position = new Position(
                        String.fromCharCode(97 + col).toUpperCase() as File,
                        (8 - row) as Rank
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
                            onClick={() => handleSquareClick(pos)}
                        >
                            {piece ? (
                                <span
                                    className={`text-5xl${
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
