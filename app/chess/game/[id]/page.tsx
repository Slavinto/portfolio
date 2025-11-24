"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGameChannel } from "@/hooks/games/chess/useGameChannel";
import { useJoinedGame } from "@/hooks/games/chess/useJoinedGame";
import ChessBoard from "@/components/games/chess/ChessBoard";
import ChessHeader from "@/components/games/chess/ChessHeader";
import PlayerColor from "@/components/games/chess/PlayerColor";
import Room from "@/components/games/chess/Room";
import Moves from "@/components/games/chess/Moves";
import ChessGameSkeleton from "@/components/ui/patterns/ChessGameSkeleton";
import { ButtonsCard, Heading } from "@/components/ui";
import { isGameStatus, onCommittedMove } from "@/utils/games/chess/helpers";
import { Color, GameRow, Move, OfferRow } from "@/types/games/chess";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast } from "react-toastify";
import CustomToastContainer from "@/components/ui/CustomToastContainer";
import { useUser } from "@/hooks/auth/useUser";
import { useOffersChannel } from "@/hooks/games/chess/useOffersChannel";
import ResignButton from "@/components/games/chess/action-buttons/ResignButton";
import OfferButton from "@/components/games/chess/action-buttons/OfferButton";
import { ToastModal } from "@/components/games/toast/ToastModal";
import { acceptOffer, declineOffer } from "@/lib/services/chess-offers";
import { useChessMessages } from "@/hooks/useChessMessages";
import { useChatChannel } from "@/hooks/games/chess/useChatChannel";
import { Headings } from "@/types/enums";
import { Board } from "@/lib/games/chess/game-logic/main/board/board";
import { finishGame } from "@/lib/services/chess-db";
import { InvitePlayersCard } from "@/components/ui/cards/InvitePlayersCard";

export default function GamePage() {
    const { id: gameId } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: user } = useUser();
    console.log({ userId: user?.id });
    console.log({ gameId });

    useEffect(() => {
        dispatch({ type: "RESET_GAME_STATE" });
    }, [gameId]);

    const {
        data: game,
        isPending: isLoadingGame,
        error,
    } = useJoinedGame(gameId);
    const { chessMessages, isLoadingMessages } = useChessMessages();
    const { state, dispatch } = useChessGamePageContext();

    const initializedRef = useRef<boolean>(false);
    const prevOfferRef = useRef<OfferRow | null>(null);
    const [asideOpen, setAsideOpen] = useState(true);

    const isBusy = isLoadingGame || isLoadingMessages;
    console.log({ isBusy });

    // Realtime chat
    useChatChannel();

    // Realtime game offers
    useOffersChannel(gameId, (offerRow: OfferRow) => {
        if (prevOfferRef.current?.id === offerRow.id) {
            return;
        }
        prevOfferRef.current = offerRow;
        if (offerRow.from_player !== state.player?.playerId) {
            ToastModal(() => acceptOffer(offerRow.id), {
                message: `Opponent offers a ${offerRow.type}`,
                onDecline: () => declineOffer(offerRow.id),
            });
        }
    });

    // Realtime sync
    useGameChannel(
        gameId,
        (row: GameRow) => {
            const { status, player_black, player_white } = row;
            const boardStatus = Board.fromPersistedState(
                row.state_json
            ).getBoardStatus();

            if (status === "resigned") {
                toast.info("Game over. Your opponent resigned");
                router.push("/chess");
            }
            if (status === "layed-off") {
                if (prevOfferRef.current?.type === "layoff") {
                    toast.info("The game was layed off");
                    router.push("/chess");
                }
            }
            if (
                status === "ongoing" &&
                prevOfferRef.current?.type === "resume"
            ) {
                toast.info("The game is resumed");
            }
            if (boardStatus === "checkmate") {
                const winner =
                    state.board.getLastMove()?.playerColor === "Black"
                        ? player_black
                        : player_white;
                finishGame(gameId, "finished", winner);
            }
            if (boardStatus === "stalemate") {
                finishGame(gameId, "finished", null);
            }

            dispatch({
                type: "HYDRATE_FROM_SERVER",
                payload: { gameRow: row },
            });
        },
        (newMove: Move) => {
            const { from, to } = newMove;
            if (from && to) {
                dispatch({ type: "MOVE_PIECE", payload: { from, to } });
            }
        }
    );
    console.log({ state });

    // syncing isLoading
    useEffect(() => {
        if (isBusy !== state.isLoading) {
            dispatch({
                type: "SET_IS_LOADING",
                payload: { isLoading: isBusy },
            });
        }
    }, [isBusy, state.isLoading, dispatch]);

    // initialyzing game
    useEffect(() => {
        if (!gameId || initializedRef.current) {
            return;
        }
        if (!state.gameRow && game) {
            dispatch({ type: "INIT_GAME", payload: { gameRow: game } });
            initializedRef.current = true;
        }
    }, [gameId, state, game, dispatch]);

    // initialyzing player
    useEffect(() => {
        if (!user || !state.gameRow) return;

        const playerId = user.id;
        let opponentId: string | null = null;
        let playerColor: Color;

        if (state.gameRow.player_white === playerId) {
            opponentId = state.gameRow.player_black;
            playerColor = "White";
        } else if (state.gameRow.player_black === playerId) {
            opponentId = state.gameRow.player_white;
            playerColor = "Black";
        } else {
            return; // user not part of this game
        }

        // If state.player doesn't exist, or opponentId has changed
        if (
            !state.player ||
            state.player.opponentId !== opponentId ||
            state.player.playerColor !== playerColor
        ) {
            dispatch({
                type: "INIT_PLAYER",
                payload: { player: { playerId, opponentId, playerColor } },
            });
        }
    }, [
        user?.id,
        state.gameRow?.player_white,
        state.gameRow?.player_black,
        state.player,
        dispatch,
    ]);

    useEffect(() => {
        if (!isLoadingMessages && state.chatMessages.length === 0) {
            dispatch({
                type: "INIT_CHAT_MESSAGES",
                payload: { chatMessages: chessMessages },
            });
        }
    }, [chessMessages, dispatch, isLoadingMessages, state.chatMessages]);

    const { gameRow } = state;

    if (isBusy) return <ChessGameSkeleton repeatPattern={3} />;
    if (!game || !gameRow)
        return <Heading as={Headings.H3}>Game not found</Heading>;
    if (!state.player)
        return <Heading as={Headings.H3}>Player not found</Heading>;
    if (error)
        return (
            <Heading as={Headings.H3}>
                Error loading game: {error.message}
            </Heading>
        );

    // game status handling
    // we basically derive gamestatus from boardstatus
    // but player actions can override this

    const boardStatus = Board.fromPersistedState(
        gameRow.state_json
    ).getBoardStatus();
    let { status: gameStatus } = gameRow;
    const canPlay =
        (boardStatus === "check" || boardStatus === "in-progress") &&
        gameStatus === "ongoing";
    console.log({ gameStatus, boardStatus });
    const playerAbsent = !gameRow.player_white || !gameRow.player_black;
    const waitingForOpponent = playerAbsent && gameRow.status === "waiting";
    // const !canPlay = gameStatus !== "ongoing" && gameStatus !== "waiting";
    // game status handling

    return (
        <section className='flex lg:mt-8 lg:flex-row items-center justify-around flex-col w-full'>
            <CustomToastContainer />

            {/* Board */}
            <div
                className={`lg:self-start flex-col items-center relative lg:ml-auto transition-opacity duration-300 flex ${
                    waitingForOpponent ? "opacity-50 pointer-events-none" : ""
                }`}
            >
                <PlayerColor />
                <ChessBoard gameId={gameId} onCommittedMove={onCommittedMove}>
                    {(waitingForOpponent || !canPlay) && (
                        <ButtonsCard className='absolute z-10 w-[20rem] h-16 top-1/2 left-1/2 !-translate-x-1/2 !-translate-y-1/2'>
                            <p className='text-center px-4 py-2'>
                                {waitingForOpponent
                                    ? "Waiting for opponent to join…"
                                    : gameStatus === "layed-off"
                                    ? "Game was layed off. Please send the resume offer"
                                    : !canPlay
                                    ? `Game over. ${""}`
                                    : "Waiting..."}
                            </p>
                        </ButtonsCard>
                    )}
                </ChessBoard>
            </div>
            <div className='mx-auto max-w-6xl rounded-2xl shadow-lg p-6 header-gradient-light dark:header-gradient-dark'>
                {/* Collapsible sidebar */}
                <ChessHeader id={gameId}>
                    <div className='mt-4 flex gap-2 justify-evenly'>
                        {waitingForOpponent ? (
                            <InvitePlayersCard
                                inviteUrl={`${process.env.NEXT_PUBLIC_APP_URL}/chess/game/${gameId}`}
                            />
                        ) : (
                            <>
                                <OfferButton type={"draw"} />
                                <OfferButton
                                    type={
                                        gameStatus === "layed-off"
                                            ? "resume"
                                            : "layoff"
                                    }
                                />
                                <ResignButton />
                            </>
                        )}
                    </div>
                    {/* Toggle Button */}
                    <ButtonsCard
                        onClick={() => setAsideOpen((prev) => !prev)}
                        className='mt-4 w-full h-12 flex items-center justify-start cursor-pointer p-2 rounded-lg bg-card transition'
                        contentClassNames='mx-auto'
                    >
                        {asideOpen ? (
                            <FaChevronUp className='w-full h-5' />
                        ) : (
                            <FaChevronDown className='w-5 h-5' />
                        )}
                    </ButtonsCard>
                </ChessHeader>
                <aside
                    className={`mt-2 flex flex-col w-full gap-2 items-center transition-all duration-400 overflow-hidden ${
                        asideOpen ? "h-full opacity-100" : "h-0 opacity-0"
                    }`}
                >
                    {asideOpen && (
                        <>
                            {game ? <Room /> : null}
                            <Moves />
                        </>
                    )}
                </aside>
            </div>
        </section>
    );
}
