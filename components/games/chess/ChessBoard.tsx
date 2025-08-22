"use client";

import { files, initialBoardState, ranks } from "@/data/games/chess";
import { boardReducer } from "@/hooks/games/chess/board/boardReducer";
import { File, Rank } from "@/types/games/chess";
import { isLegalToMoveToPosition } from "@/utils/games/chess/helpers";
import { useReducer, useState } from "react";
import Square from "./Square";
import CapturedPieces from "./CapturedPieces";
import { Position } from "@/lib/games/chess/game-logic/main/position";

const ChessBoard = () => {
    const [_, forceRender] = useState(0);
    const [state, dispatch] = useReducer(boardReducer, initialBoardState);

    const { board, playerColor, selected } = state;

    console.log({ state });
    function handleSquareClick(position: Position) {
        // a piece at the position of current click
        const piece = board.getPieceAtPosition(position);
        // console.log({ position, piece });

        if (selected) {
            // if we have a selected piece
            const selectedPiece = board.getPieceAtPosition(selected);
            if (!selectedPiece) {
                console.info("Failed to move piece. No piece selected");
                return null;
            }
            if (piece) {
                // if we have a piece at the position of current click
                if (piece.position.equals(selected)) {
                    // clicked same piece as selected -> deselecting..
                    dispatch({ type: "UNSELECT_PIECE" });
                    return null;
                }
                if (piece.color === board.currentTurn) {
                    console.log({ curSelectedPiece: selected });

                    // if clicked a piece of current player's color -> selecting that piece
                    dispatch({ type: "SELECT_PIECE", payload: { position } });
                } else {
                    // if clicked an opponent's piece
                    if (
                        isLegalToMoveToPosition(board, selectedPiece, position)
                    ) {
                        console.log({ curPiece: piece });
                        // if clicked opponent's piece and it's legal -> capture
                        dispatch({
                            type: "MOVE_PIECE",
                            payload: { from: selected, to: position },
                        });
                        dispatch({ type: "UNSELECT_PIECE" });
                    } else {
                        // clicked opponent's piece and it's illegal -> do nothing
                        return null;
                    }
                }
            } else {
                // no piece at current clicked position
                if (!isLegalToMoveToPosition(board, selectedPiece, position)) {
                    // if performing not a legal move -> do nothing
                    console.info("Not a legal move");
                    return null;
                } else {
                    // moving a piece
                    dispatch({
                        type: "MOVE_PIECE",
                        payload: { from: selected, to: position },
                    });
                }
            }
        } else {
            // if no piece selected
            if (piece) {
                // if a piece clicked
                if (piece.color === board.currentTurn) {
                    // if current player's piece clicked
                    dispatch({ type: "SELECT_PIECE", payload: { position } });
                    return null;
                } else {
                    // if clicked opponent's piece with no piece selected -> do nothing
                    return null;
                }
            }
        }
    }

    function renderSquare(file: File, rank: Rank) {
        const position = new Position(file, rank);
        const piece = board.getPieceAtPosition(position);
        const isSelected = !!(selected && selected.equals(position));

        return (
            <Square
                key={`${file}${rank}`}
                piece={piece ?? null}
                position={position}
                isSelected={isSelected}
                onClick={() => handleSquareClick(position)}
            />
        );
    }

    const boardRanks = playerColor === "White" ? [...ranks].reverse() : ranks;
    const boardFiles = playerColor === "White" ? files : [...files].reverse();
    const isPlayerWhite = playerColor === "White";

    return (
        <section className='w-full flex flex-col items-center min-h-screen bg-gray-50 p-4 m-[2rem] gap-16'>
            {/* Game Status Bar */}
            <div
                className={`w-full max-w-xl mb-6 px-4 py-3 rounded-lg shadow-md flex justify-center items-center
      ${
          state.board.getGameStatus() === "checkmate"
              ? "bg-red-100 text-red-800"
              : state.board.getGameStatus() === "check"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
      }
    `}
            >
                <h1 className='font-bold text-lg tracking-wide'>
                    {state.board.getGameStatus() === "ongoing"
                        ? `${state.board.currentTurn} turn`.toUpperCase()
                        : state.board.getGameStatus().toUpperCase()}
                </h1>
            </div>
            <div className='flex flex-col items-center gap-12'>
                {/* Chessboard */}
                <CapturedPieces
                    capturedPieces={state.board.capturedPieces}
                    isPlayerWhite={!isPlayerWhite}
                />
                <div
                    className={`flex flex-col
        ${
            state.board.currentTurn === playerColor
                ? "shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
                : "shadow-[0_-4px_8px_rgba(0,0,0,0.15)]"
        }
      `}
                >
                    {boardRanks.map((rank) => (
                        <div key={rank} className='flex'>
                            {boardFiles.map((file) => renderSquare(file, rank))}
                        </div>
                    ))}
                </div>
                <CapturedPieces
                    capturedPieces={state.board.capturedPieces}
                    isPlayerWhite={isPlayerWhite}
                />
                {/* Controls */}
                <div className='flex gap-4'>
                    <button
                        className='px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 font-medium transition'
                        onClick={() => {
                            // board.reset();
                            dispatch({ type: "START_NEW_GAME" });
                            forceRender((prev) => prev + 1);
                        }}
                    >
                        Reset
                    </button>
                    <button
                        className='px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 font-medium transition'
                        onClick={() => {
                            board.undoLastMove();
                            forceRender((prev) => prev + 1);
                        }}
                    >
                        Move Back
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ChessBoard;
