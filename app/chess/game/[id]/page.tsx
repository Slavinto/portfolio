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
import { onCommittedMove } from "@/utils/games/chess/helpers";
import { Color, GameRow, Move, OfferRow, Player } from "@/types/games/chess";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast } from "react-toastify";
import CustomToastContainer from "@/components/ui/CustomToastContainer";
import { useUser } from "@/hooks/auth/useUser";
import { useOffersChannel } from "@/hooks/games/chess/useOffersChannel";
import ResignButton from "@/components/games/chess/action-buttons/ResignButton";
import OfferButton from "@/components/games/chess/action-buttons/OfferButton";
import { ToastModal } from "@/components/ui/toast/ToastModal";
import { acceptOffer, declineOffer } from "@/lib/services/chess-offers";
import { useChessMessages } from "@/hooks/useChessMessages";
import { useChatChannel } from "@/hooks/games/chess/useChatChannel";
import { Headings } from "@/types/enums";
import { Board } from "@/lib/games/chess/game-logic/main/board/board";
import { InvitePlayersCard } from "@/components/ui/cards/InvitePlayersCard";
import { usePlayers } from "@/hooks/games/usePlayers";
import { useEnsurePlayer } from "@/hooks/auth/useEnsurePlayer";
import { finishGame } from "@/lib/games/chess/actions/finishGame";

export default function GamePage() {
    const { id: gameId } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: user } = useUser();

    const { game, isLoadingGame, gameError } = useJoinedGame(gameId);

    const opponentId =
        game && user?.id
            ? user.id === game.player_white
                ? game.player_black
                : game.player_white
            : null;

    const playersEnabled = Boolean(user?.id && opponentId);

    const {
        data: players,
        isLoading: isLoadingPlayers,
        error: playersError,
    } = usePlayers(user?.id ?? null, opponentId, { playersEnabled });

    console.log({ players });
    const { chessMessages, isLoadingMessages } = useChessMessages();
    const { state, dispatch } = useChessGamePageContext();

    const resetRef = useRef<boolean>(false);
    const initializedRef = useRef<boolean>(false);
    const prevOfferRef = useRef<OfferRow | null>(null);
    const [asideOpen, setAsideOpen] = useState(true);

    const isBusy = isLoadingGame || isLoadingPlayers;

    const isError = gameError || playersError;

    const isGameLoaded = resetRef.current && initializedRef.current;
    console.log({ isLoadingGame, isLoadingPlayers, isLoadingMessages });
    console.log({ isBusy, isGameLoaded });

    useEffect(() => {
        resetRef.current = false;
        initializedRef.current = false;
    }, [gameId]);

    useEffect(() => {
        if (!resetRef.current) {
            console.log("Resetting game");
            dispatch({ type: "RESET_GAME_STATE" });
            resetRef.current = true;
        }
    }, [gameId]);

    // Realtime chat
    useChatChannel();

    // Realtime game offers
    useOffersChannel(gameId, (offerRow: OfferRow) => {
        if (prevOfferRef.current?.id === offerRow.id) {
            return;
        }
        prevOfferRef.current = offerRow;
        console.log({ offerRow });
        if (offerRow.from_player !== state.player?.id) {
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
            console.log({ GameRow: row });
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
        if (!gameId || initializedRef.current || !resetRef.current || !game) {
            return;
        }

        dispatch({ type: "INIT_GAME", payload: { gameRow: game } });
        initializedRef.current = true;
    }, [gameId, game]);

    // initialyzing player
    useEffect(() => {
        if (!players || !players.player) return;
        if (!user || !game) return;

        const { player: p1 } = players;
        const p2 = players?.opponent ?? null;

        const color: Color = p1.id === game.player_white ? "White" : "Black";

        const player: Player = {
            id: p1.id,
            color,
            avatar: p1.avatar_url,
            username: p1.username,
            bio: p1.bio,
        };

        const opponent: Player = {
            id: p2?.id ?? null,
            color: color === "White" ? "Black" : "White",
            avatar: p2?.avatar_url ?? null,
            username: p2?.username ?? null,
            bio: p2?.bio ?? null,
        };

        // Run only if something truly changed
        const mustInit =
            !state.player ||
            state.player.id !== player.id ||
            state.opponent?.id !== opponent.id ||
            state.player.color !== player.color;

        if (mustInit) {
            console.log("Initializing players");
            dispatch({
                type: "INIT_PLAYERS",
                payload: { player, opponent },
            });
        }
    }, [
        players, // only re-run when players change
        user?.id,
        game?.id,
        opponentId,
    ]);

    useEffect(() => {
        if (
            !isLoadingMessages &&
            state.chatMessages.length === 0 &&
            chessMessages.length > 0
        ) {
            dispatch({
                type: "INIT_CHAT_MESSAGES",
                payload: { chatMessages: chessMessages },
            });
        }
    }, [chessMessages, dispatch, isLoadingMessages, state.chatMessages]);

    const { gameRow } = state;
    console.log({ BoardState: state });

    const isGameReady = !!gameRow && !!state?.player && isGameLoaded;

    if (isBusy || !isGameReady) return <ChessGameSkeleton repeatPattern={3} />;
    if (!game || !gameRow)
        return <Heading as={Headings.H3}>Game not found</Heading>;
    if (!state.player)
        return <Heading as={Headings.H3}>Player not found</Heading>;
    if (isError)
        return (
            <Heading as={Headings.H3}>
                Error loading game:{" "}
                {gameError?.message ?? playersError?.message}
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
    const playerAbsent = !gameRow.player_white || !gameRow.player_black;
    const waitingForOpponent = playerAbsent && gameRow.status === "waiting";
    // game status handling
    return (
        <section
            className='w-full max-w-screen-xl mx-auto px-2 sm:px-4 py-4 
        grid grid-cols-1 lg:flex lg:flex-1 gap-4 lg:gap-6
        '
        >
            <CustomToastContainer />

            {/* BOARD COLUMN */}
            <div
                className={`relative w-full min-w-0 flex flex-col items-center transition-opacity duration-300 ${
                    waitingForOpponent ? "opacity-50 pointer-events-none" : ""
                }`}
            >
                <PlayerColor />

                <div className='w-full flex justify-center min-w-0 px-1'>
                    <ChessBoard
                        gameId={gameId}
                        onCommittedMove={onCommittedMove}
                    >
                        {(waitingForOpponent || !canPlay) && (
                            <ButtonsCard className='!center-absolute z-10 w-64 h-16'>
                                <p className='text-center text-middle px-4'>
                                    {waitingForOpponent
                                        ? "Waiting for opponent..."
                                        : gameStatus === "layed-off"
                                        ? "Game was layed off"
                                        : !canPlay
                                        ? "Game over"
                                        : "Waiting..."}
                                </p>
                            </ButtonsCard>
                        )}
                    </ChessBoard>
                </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className='flex gap-2 md:gap-4 flex-col w-full min-w-0 items-center rounded-2xl shadow-lg header-gradient-light max-w-md mx-auto  dark:header-gradient-dark 2xs:py-2 xs:p-4 lg:p-6'>
                {/* Header */}
                <ChessHeader id={gameId}>
                    <div className='mt-4 flex w-full gap-2 justify-evenly'>
                        {waitingForOpponent ? (
                            <InvitePlayersCard
                                inviteUrl={`${process.env.NEXT_PUBLIC_APP_URL}/chess/game/${gameId}`}
                            />
                        ) : (
                            <>
                                <OfferButton type='draw' />
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

                    {/* Toggle aside */}
                    <ButtonsCard
                        onClick={() => setAsideOpen((prev) => !prev)}
                        className='mt-4 w-full h-12 flex items-center justify-center cursor-pointer bg-card'
                    >
                        {asideOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </ButtonsCard>
                </ChessHeader>

                {/* ASIDE */}
                <aside
                    className={`flex flex-col gap-2 md:gap-4 transition-all duration-300 overflow-hidden w-full
                ${
                    asideOpen
                        ? "max-h-[900px] opacity-100"
                        : "max-h-0 opacity-0"
                }`}
                >
                    {asideOpen && game && (
                        <>
                            <Room />
                            <Moves />
                        </>
                    )}
                </aside>
            </div>
        </section>
    );
}
