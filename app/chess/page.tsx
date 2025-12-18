"use client";

import { FaRegChessKnight } from "react-icons/fa6";
import { ButtonsCard, Heading } from "@/components/ui";
import { Headings } from "@/types/enums";
import { useUser } from "@/hooks/auth/useUser";
import { useUserGames } from "@/hooks/games/chess/useUserGames";
import GameCard from "@/components/games/chess/GameCard";
import CustomToastContainer from "@/components/ui/CustomToastContainer";
import { useRouter } from "next/navigation";
import ChessGameSkeleton from "@/components/ui/patterns/ChessGameSkeleton";
import { toast } from "react-toastify";
import JoinGameCard from "@/components/ui/cards/JoinGameCard";
import { useEffect, useRef } from "react";

export default function ChessHomePage() {
    const {
        data: user,
        error: userError,
        isLoading: isLoadingUser,
    } = useUser();

    const {
        data: games,
        error: gamesError,
        isLoading: isLoadingUserGames,
    } = useUserGames();

    const router = useRouter();

    const isBusy = isLoadingUser || isLoadingUserGames;
    const isError = userError || gamesError;

    const toastShownRef = useRef(false);

    /* ---------- EFFECTS ---------- */

    useEffect(() => {
        if (isError && !toastShownRef.current) {
            toast.error(
                `Application encountered an error: ${
                    userError?.message ?? gamesError?.message
                }`
            );
            toastShownRef.current = true;
        }
    }, [isError, userError, gamesError]);

    useEffect(() => {
        if (isBusy && !toastShownRef.current) {
            console.log("Showing toast");
            toast.info(
                isLoadingUser ? "Loading user details" : "Loading user games"
            );
            toastShownRef.current = true;
        }
    }, [isBusy, isLoadingUser]);

    /* ---------- RENDER ---------- */

    if (isError || isBusy) {
        return <ChessGameSkeleton repeatPattern={3} />;
    }

    return (
        <section className='flex flex-col gap-6 py-16 px-4 w-full max-w-3xl mx-auto'>
            <CustomToastContainer />

            <header className='flex flex-col gap-8 sm:flex-row sm:justify-between items-center border-b border-border pb-4'>
                <ButtonsCard
                    className='cursor-pointer dark:btn-gradient btn-gradient-light py-2 px-4 md:px-10 md:py-6 gap-1'
                    icon={<FaRegChessKnight className='text-xl' />}
                    iconPosition='left'
                    onClick={() => router.push("/chess/create")}
                >
                    Start&nbsp;new&nbsp;Game
                </ButtonsCard>

                <div className='h-32 border border-common hidden sm:flex'></div>

                <JoinGameCard />
            </header>

            <Heading as={Headings.H4}>Your Games</Heading>

            <ul className='flex flex-col gap-3'>
                {!games || games.length === 0 ? (
                    <div className='text-muted-foreground text-center mt-12'>
                        <p>
                            No games found yet. Start a new match to begin
                            playing!
                        </p>
                    </div>
                ) : (
                    games.map((game) => (
                        <ButtonsCard
                            key={game.id}
                            className='!w-full !justify-between cursor-pointer'
                            contentClassNames='w-full'
                            onClick={() =>
                                router.push(`/chess/game/${game.id}`)
                            }
                        >
                            <GameCard game={game} />
                        </ButtonsCard>
                    ))
                )}
            </ul>
        </section>
    );
}
