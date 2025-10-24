"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { joinGame, pushMove } from "@/lib/services/chess-db";
import ChessBoard from "@/components/games/chess/ChessBoard";
import { boardReducer } from "@/hooks/games/chess/board/boardReducer";
import { initialBoardState } from "@/data/games/chess/constants/initialBoardState";
import { useReducer } from "react";
import { supabase } from "@/lib/supabase/client";
import { useGameChannel } from "@/hooks/games/chess/useGameChannel";
import { toPersistedMove, toPersistedState } from "@/utils/games/chess/helpers";
import { useGameSubscription } from "@/hooks/games/chess/useGameSubscription";
import { useGame } from "@/hooks/games/chess/useGame";
import { Board } from "@/lib/games/chess/game-logic/main/board/board";
import { GameRow, Move, SupabaseMove } from "@/types/games/chess";
import ChessHeader from "@/components/games/chess/ChessHeader";
import PlayerColor from "@/components/games/chess/PlayerColor";
import Room from "@/components/games/chess/Room";
import Moves from "@/components/games/chess/Moves";

export default function GamePage() {
    const { id } = useParams<{ id: string }>();
    const { data: dbGame, isPending: isLoadingGame } = useGame(id);
    useGameSubscription(id);
    const router = useRouter();
    const [game, setGame] = useState<GameRow>(dbGame);
    const [moves, setMoves] = useState<SupabaseMove[]>([]);
    const [state, dispatch] = useReducer(boardReducer, initialBoardState);
    // console.log({ serverState: state });
    // console.log({ serverMoves: moves });
    // console.log({ dbGame });

    console.log({ gameFromGamePage: game });
    // Load game + join as needed
    useEffect(() => {
        if (!id) return;
        (async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                // Redirect to sign-in or implement your own quick auth flow
                router.push("/auth/login");
                return;
            }

            const { data: g } = await supabase
                .from("games")
                .select("*")
                .eq("id", id)
                .single();
            if (!g) return;

            // Join if possible
            const joined = await joinGame(id);
            setGame(joined);

            // Prime local board from DB state
            if (joined?.state_json) {
                // If you keep your ChessBoard driven by reducer, you may want a custom action to hydrate from server:
                dispatch({
                    type: "HYDRATE_FROM_SERVER",
                    payload: joined.state_json,
                });
            }

            const { data: mv } = await supabase
                .from("moves")
                .select("*")
                .eq("game_id", id)
                .order("move_number", { ascending: true });
            setMoves(mv ?? []);
        })();
    }, [id, router]);

    // Realtime subscriptions
    useGameChannel(
        id,
        (row) => {
            setGame(row);
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
        }
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

    const youAre =
        game?.player_white === game?.creator_id ? "creator" : "guest";

    const yourColor = useMemo(() => {
        const uid = game?.creator_id; // will re-check with auth below
        return game?.player_white === uid
            ? "White"
            : game?.player_black === uid
            ? "Black"
            : null;
    }, [game]);

    if (isLoadingGame) return <p>Loading…</p>;
    if (!game) return <p>Game not found</p>;

    return (
        <section className='content-container mx-auto py-16'>
            <div className='mx-auto max-w-5xl rounded-2xl shadow-lg p-6 header-gradient-light dark:header-gradient-dark'>
                <div className='flex w-full justify-center gap-16'>
                    <div className='flex flex-col max-w-sm gap-4 items-center'>
                        <PlayerColor color={yourColor} turn={game?.turn} />
                        <ChessHeader
                            id={id}
                            gameStatus={game?.status}
                            gameTurn={game?.turn}
                        />
                        <Room game={game} />
                        <Moves moves={moves} />
                    </div>
                    <ChessBoard
                        gameId={id}
                        state={
                            state ?? Board.fromPersistedState(dbGame.state_json)
                        }
                        dispatch={dispatch}
                        onCommittedMove={onCommittedMove}
                    />
                </div>
            </div>
        </section>
    );
}
