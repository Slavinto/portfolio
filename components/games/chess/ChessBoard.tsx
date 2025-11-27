"use client";

import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { Board } from "@/lib/games/chess/game-logic/main/board/board";
import { Position } from "@/lib/games/chess/game-logic/main/position";
import { GameStatus, Move } from "@/types/games/chess";
import {
    getPositionForCell,
    isLegalToMoveToPosition,
} from "@/utils/games/chess/helpers";
import { ReactNode } from "react";

interface ChessBoardProps {
    gameId: string;
    onCommittedMove: (
        id: string,
        gameStatus: GameStatus,
        move: Move,
        board: Board
    ) => void;
    children: ReactNode;
}

export default function ChessBoard({
    gameId,
    onCommittedMove,
    children,
}: ChessBoardProps) {
    const { state, dispatch } = useChessGamePageContext();
    const { board, gameRow: game, player, isLoading } = state;
    const { selectedPiecePosition: selected } = board;

    if (isLoading || !game || !board || !player) {
        return null;
    }

    const waitingForOpponent = !game.player_white || !game.player_black;
    const { playerColor } = player;

    // Sync from server if provided

    function handleSquareClick(position: Position) {
        if (!game || game.status !== "ongoing") {
            return;
        }
        const piece = board.getPieceAtPosition(position);
        if (piece && !selected && piece.color !== player?.playerColor) {
            console.info("Can not select opponent's piece");
            return;
        }

        // selecting a piece that is already selected -> deselecting
        if (
            selected &&
            piece?.position.equals(selected) &&
            piece.color === playerColor
        ) {
            dispatch({ type: "UNSELECT_PIECE" });
        }
        // selecting own piece while another piece is selected -> select current target piece
        if (
            selected &&
            piece?.color === playerColor &&
            !piece.position.equals(selected)
        ) {
            dispatch({
                type: "SELECT_PIECE",
                payload: { position: piece.position },
            });
        }

        if (selected) {
            const selectedPiece = board.getPieceAtPosition(selected);
            if (!selectedPiece) return;

            console.log({ selectedPiece });

            if (isLegalToMoveToPosition(board, selectedPiece, position)) {
                // Reset local selection
                dispatch({ type: "UNSELECT_PIECE" });
                const move = board.movePiece(selected, position);
                if (!move) {
                    throw new Error("Failed to make a move.");
                }
                // Tell parent -> push to Supabase
                onCommittedMove(gameId, game.status, move, board);
            }
        } else if (piece && piece.color === board.currentTurn) {
            dispatch({ type: "SELECT_PIECE", payload: { position } });
        }
    }

    return (
        <div className='relative grid grid-cols-8 w-[32rem] h-[32rem] rounded-xl overflow-hidden border-2 border-white-300 cursor-pointer'>
            {children}
            {Array.from({ length: 8 }).map((_, row) =>
                Array.from({ length: 8 }).map((_, col) => {
                    const pos: Position = getPositionForCell(
                        row,
                        col,
                        playerColor
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
