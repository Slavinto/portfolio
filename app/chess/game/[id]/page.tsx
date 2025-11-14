"use client";

import { useRef, useState } from "react";
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
import { ButtonsCard } from "@/components/ui";
import { onCommittedMove } from "@/utils/games/chess/helpers";
import { Color, Move, OfferRow } from "@/types/games/chess";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast } from "react-toastify";
import CustomToastContainer from "@/components/ui/CustomToastContainer";
import { GameTableData } from "@/types/supabase/database.types";
import { useUser } from "@/hooks/auth/useUser";
import { useOffersChannel } from "@/hooks/games/chess/useOffersChannel";
import ResignButton from "@/components/games/chess/action-buttons/ResignButton";
import OfferButton from "@/components/games/chess/action-buttons/OfferButton";

export default function GamePage() {
    const { id: gameId } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: user } = useUser();
    const {
        data: game,
        isPending: isLoadingGame,
        error,
    } = useJoinedGame(gameId);
    const { yourColor, isLoading: isLoadingColor } = useYourColor();
    const prevOfferRef = useRef<string | null>(null);
    const { state, dispatch } = useChessGamePageContext();

    // const [moves, setMoves] = useState<SupabaseMove[]>([]);
    const [asideOpen, setAsideOpen] = useState(true);

    const isBusy = isLoadingGame || isLoadingColor;

    // async function handleAcceptDraw(gameId: string) {
    //     await acceptDraw(gameId);
    //     router.push("/games");
    // }

    // async function handleDeclineDraw(gameId: string) {
    //     await declineDraw(gameId);
    //     toast.info("You declined the draw offer.");
    // }

    // Realtime game offers
    useOffersChannel(gameId, (offerRow: OfferRow) => {});

    // Realtime sync
    useGameChannel(
        gameId,
        (row: GameTableData) => {
            if (row?.status === "resigned") {
                toast.info("Game over. Your opponent resigned");
                router.push("/chess");
            }
            if (row?.state_json) {
                dispatch({
                    type: "HYDRATE_FROM_SERVER",
                    payload: row.state_json,
                });
            }

            // if (!row.draw_offered_by && prevOfferRef.current === user?.id) {
            //     // Draw offered by you - opponent declined
            //     if (state.board.getGameStatus() !== "draw") {
            //         toast.info("Your opponent declined your draw offer");
            //     } else {
            //         toast.info("Game over. Draw offer accepted");
            //         router.push("/games");
            //     }
            // }
            // if (row.draw_offered_by && row.draw_offered_by !== user?.id) {
            //     // Draw offered by your opponent
            //     ToastModal(() => handleAcceptDraw(row.id), {
            //         message: "Your opponent offered a draw. Do you accept?",
            //         onDecline: () => handleDeclineDraw(row.id),
            //     });
            // }
            // // Updating Draw offer ref
            // prevOfferRef.current = row.draw_offered_by;
        },
        (newMove: Move) => {
            const { from, to } = newMove;
            if (from && to) {
                dispatch({ type: "MOVE_PIECE", payload: { from, to } });
            }
        },
        game
    );

    if (isBusy) return <ChessGameSkeleton repeatPattern={3} />;
    if (!game && !isBusy) return <p>Game not found</p>;
    if (error) return <p>Error loading game: {error.message}</p>;

    // game status handling
    const playerAbsent = game && (!game?.player_white || !game?.player_black);
    const waitingForOpponent = playerAbsent || game?.status === "waiting";
    const gameOver =
        game &&
        game.status !== "ongoing" &&
        game.status !== "check" &&
        game.status !== "waiting";
    // game status handling

    return (
        <section className='flex lg:mt-24 lg:flex-row items-center justify-around flex-col w-full'>
            <CustomToastContainer />
            <PlayerColor color={yourColor as Color} turn={game?.turn} />

            {/* Board */}
            <div
                className={`xl:ml-auto transition-opacity duration-300 flex ${
                    waitingForOpponent ? "opacity-50 pointer-events-none" : ""
                }`}
            >
                <ChessBoard gameId={gameId} onCommittedMove={onCommittedMove}>
                    {(waitingForOpponent || gameOver) && (
                        <ButtonsCard className='absolute z-10 w-[20rem] h-16 top-1/2 left-1/2 !-translate-x-1/2 !-translate-y-1/2'>
                            <p className='text-center px-4 py-2'>
                                {waitingForOpponent
                                    ? "Waiting for opponent to join…"
                                    : gameOver
                                    ? `Game over. ${game.status}`
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
                        {game?.player_black && game?.player_white && (
                            <>
                                <OfferButton
                                    type={"draw"}
                                    toPlayer={
                                        yourColor === "Black"
                                            ? game?.player_white
                                            : game?.player_black
                                    }
                                />
                                <OfferButton
                                    type={"layoff"}
                                    toPlayer={
                                        yourColor === "Black"
                                            ? game?.player_white
                                            : game?.player_black
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
