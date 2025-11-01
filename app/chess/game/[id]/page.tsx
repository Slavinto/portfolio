"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { pushMove } from "@/lib/services/chess-db";
import ChessBoard from "@/components/games/chess/ChessBoard";
import { boardReducer } from "@/hooks/games/chess/board/boardReducer";
import { initialBoardState } from "@/data/games/chess/constants/initialBoardState";
import { useReducer } from "react";
import { useGameChannel } from "@/hooks/games/chess/useGameChannel";
import { toPersistedMove, toPersistedState } from "@/utils/games/chess/helpers";
import { Board } from "@/lib/games/chess/game-logic/main/board/board";
import { Color, Move, SupabaseMove } from "@/types/games/chess";
import ChessHeader from "@/components/games/chess/ChessHeader";
import PlayerColor from "@/components/games/chess/PlayerColor";
import Room from "@/components/games/chess/Room";
import Moves from "@/components/games/chess/Moves";
import { useJoinedGame } from "@/hooks/games/chess/useJoinedGame";
import ChessGameSkeleton from "@/components/ui/patterns/ChessGameSkeleton";
import { ButtonsCard } from "@/components/ui";
import { useUser } from "@/hooks/auth/useUser";
import { useYourColor } from "@/hooks/games/chess/useYourColor";

export default function GamePage() {
    const {
        data: user,
        error: userError,
        isLoading: isLoadingUser,
    } = useUser();
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const [moves, setMoves] = useState<SupabaseMove[]>([]);
    const { data: game, isPending: isLoadingGame, error } = useJoinedGame(id);
    const [state, dispatch] = useReducer(boardReducer, initialBoardState);
    const { yourColor, isLoading: isLoadingColor } = useYourColor();

    const isBusy = isLoadingGame || isLoadingUser || isLoadingColor;
    // Realtime subscriptions
    useGameChannel(
        id,
        (row) => {
            if (row?.state_json) {
                dispatch({
                    type: "HYDRATE_FROM_SERVER",
                    payload: row.state_json,
                });
            }
        },
        (newMove) => {
            console.log("SETTING MOVES");
            console.log({ newMove });
            setMoves((prev) => {
                if (prev.some((m) => m.id === newMove.id)) {
                    return prev;
                }
                return [...prev, newMove];
            });
        },
        game
    );

    // Handler that your ChessBoard can call when a local legal move occurs
    async function onCommittedMove(move: Move, board: Board) {
        const { from, to, moveNumber } = move;

        console.log({ board });
        // Convert to persistable state
        const nextState = toPersistedState({
            board,
            selected: from,
            playerColor: board.currentTurn,
        });
        const persistedMove = toPersistedMove(move);
        console.log({ persistedMove });

        await pushMove(id, nextState, persistedMove);
    }

    // determine if game is ready
    if (isBusy) return <ChessGameSkeleton repeatPattern={3} />;
    if (!user && !isBusy) {
        router.push("/app/auth/login");
    }

    if (!game && !isBusy) return <p>Game not found</p>;
    const waitingForOpponent =
        (game && !game?.player_white) || !game?.player_black;

    if (error) return <p>Error loading game: {error.message}</p>;
    console.log({ gameFromGamePage: game });
    console.log({ stateFromGamePage: state });
    return (
        game && (
            <section className='content-container mx-auto py-16'>
                <div className='mx-auto max-w-5xl rounded-2xl shadow-lg p-6 header-gradient-light dark:header-gradient-dark'>
                    <div className='flex w-full justify-center gap-16'>
                        <div className='flex flex-col max-w-sm gap-4 items-center'>
                            <PlayerColor
                                color={yourColor as Color}
                                turn={game?.turn}
                            />
                            <ChessHeader
                                id={id}
                                gameStatus={game?.status}
                                gameTurn={game?.turn}
                            />
                            <Room game={game} />
                            <Moves board={state.board} />
                        </div>
                        <div
                            className={
                                waitingForOpponent
                                    ? "relative opacity-50 pointer-events-none"
                                    : ""
                            }
                        >
                            <ChessBoard
                                gameId={id}
                                state={state}
                                dispatch={dispatch}
                                onCommittedMove={onCommittedMove}
                            />
                            {waitingForOpponent && (
                                <ButtonsCard className='absolute w-[20rem] h-16 top-1/2 left-1/2 !-translate-x-1/2 !-translate-y-1/2'>
                                    <p className='text-center px-4 py-2'>
                                        Waiting for opponent to join…
                                    </p>
                                </ButtonsCard>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        )
    );
}
