"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGameChannel } from "@/hooks/games/chess/useGameChannel";
import { useJoinedGame } from "@/hooks/games/chess/useJoinedGame";
import { useYourColor } from "@/hooks/games/chess/useYourColor";
import ChessBoard from "@/components/games/chess/ChessBoard";
import ChessHeader from "@/components/games/chess/ChessHeader";
import PlayerColor from "@/components/games/chess/PlayerColor";
import Room from "@/components/games/chess/Room";
import Moves from "@/components/games/chess/Moves";
import ChessGameSkeleton from "@/components/ui/patterns/ChessGameSkeleton";
import { ButtonsCard, Heading } from "@/components/ui";
import { onCommittedMove } from "@/utils/games/chess/helpers";
import {
    ChessMessage,
    Color,
    GameRow,
    GameStatus,
    Move,
    OfferRow,
} from "@/types/games/chess";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast } from "react-toastify";
import CustomToastContainer from "@/components/ui/CustomToastContainer";
import { GameTableData } from "@/types/supabase/database.types";
import { useUser } from "@/hooks/auth/useUser";
import { useOffersChannel } from "@/hooks/games/chess/useOffersChannel";
import ResignButton from "@/components/games/chess/action-buttons/ResignButton";
import OfferButton from "@/components/games/chess/action-buttons/OfferButton";
import { ToastModal } from "@/components/games/toast/ToastModal";
import { acceptOffer, declineOffer } from "@/lib/services/chess-offers";
import { useChessMessages } from "@/hooks/useChessMessages";
import { useChatChannel } from "@/hooks/games/chess/useChatChannel";
import { Headings } from "@/types/enums";

export default function GamePage() {
    const { id: gameId } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: user } = useUser();
    const {
        data: game,
        isPending: isLoadingGame,
        error,
    } = useJoinedGame(gameId);
    const { state, dispatch } = useChessGamePageContext();

    const prevOfferRef = useRef<OfferRow | null>(null);
    const { chessMessages, isLoadingMessages } = useChessMessages();
    // const { gameStatus } = state;
    const [asideOpen, setAsideOpen] = useState(true);

    const isBusy = isLoadingGame;

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
            if (row?.status === "resigned") {
                toast.info("Game over. Your opponent resigned");
                router.push("/chess");
            }
            if (row?.status === "layed-off") {
                if (prevOfferRef.current?.type === "layoff") {
                    toast.info("The game was layed off");
                    router.push("/chess");
                }
            }
            if (
                row?.status === "ongoing" &&
                prevOfferRef.current?.type === "resume"
            ) {
                toast.info("The game is resumed");
            }

            if (row?.state_json) {
                dispatch({
                    type: "HYDRATE_FROM_SERVER",
                    payload: { gameRow: row },
                });
            }
        },
        (newMove: Move) => {
            const { from, to } = newMove;
            if (from && to) {
                dispatch({ type: "MOVE_PIECE", payload: { from, to } });
            }
        },
        game
    );
    console.log({ chessMessages });

    // initialyzing game
    useEffect(() => {
        if (!gameId) {
            return;
        }
        if (!state.gameRow && game) {
            dispatch({ type: "INIT_GAME", payload: { gameRow: game } });
        }
    }, [gameId, state, game, dispatch]);

    // initialyzing player
    useEffect(() => {
        if (!user || !state.gameRow || state.player) {
            return;
        }
        const playerId = user.id;
        let opponentId;
        let playerColor;
        if (state.gameRow.player_white === playerId) {
            opponentId = state.gameRow.player_black;
            playerColor = "Black" as Color;
        } else {
            opponentId = state.gameRow.player_white;
            playerColor = "White" as Color;
        }
        dispatch({
            type: "INIT_PLAYER",
            payload: { player: { playerId, opponentId, playerColor } },
        });
    }, [user, state, dispatch]);

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
    const { status: gameStatus } = gameRow;
    const playerAbsent =
        gameRow && (!gameRow.player_white || !gameRow.player_black);
    const waitingForOpponent = playerAbsent || gameRow.status === "waiting";
    const gameOver =
        gameRow &&
        gameStatus !== "ongoing" &&
        gameStatus !== "check" &&
        gameStatus !== "waiting";
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
                    {(waitingForOpponent || gameOver) && (
                        <ButtonsCard className='absolute z-10 w-[20rem] h-16 top-1/2 left-1/2 !-translate-x-1/2 !-translate-y-1/2'>
                            <p className='text-center px-4 py-2'>
                                {waitingForOpponent
                                    ? "Waiting for opponent to join…"
                                    : gameStatus === "layed-off"
                                    ? "Game was layed off. Please send the resume offer"
                                    : gameOver
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
                        {gameRow.player_black && gameRow.player_white && (
                            <>
                                <OfferButton type={"draw"} />
                                <OfferButton
                                    type={
                                        gameStatus === "layed-off"
                                            ? "resume"
                                            : "layoff"
                                    }
                                />
                            </>
                        )}
                        <ResignButton />
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
                            {game ? <Room game={game} /> : null}
                            <Moves />
                        </>
                    )}
                </aside>
            </div>
        </section>
    );
}
