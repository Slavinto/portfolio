"use client";

import { FaRegChessBishop } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import AuthForm from "@/components/ui/AuthForm";
import { ButtonsCard, Heading } from "@/components/ui";
import { Headings } from "@/types/enums";
import { useUser } from "@/hooks/auth/useUser";
import { useUserGames } from "@/hooks/games/chess/useUserGames";
import { createArrayOf } from "@/lib/helpers";
import { Fragment } from "react";
import GameCard from "@/components/games/chess/GameCard";
import { contextClass } from "@/types/constants";

function ChessErrorMsg(error: string) {
    return <span>{error}</span>;
}

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

    const isBusy = isLoadingUser || isLoadingUserGames;
    const isError = userError || gamesError;

    console.log({ user, games });

    if (isBusy) {
        return <ChessGameSkeleton repeatPattern={3} />;
    }

    if (!user) {
        return (
            <section className='flex flex-col items-center justify-center min-h-[80vh]'>
                <Heading
                    as={Headings.H3}
                    classNames='text-2xl md:text-3xl font-semibold mb-6'
                >
                    Sign in to view your games
                </Heading>
                <AuthForm />
            </section>
        );
    }

    if (!games || games.length === 0) {
        return (
            <div className='text-muted-foreground text-center mt-12'>
                <p>No games found yet. Start a new match to begin playing!</p>
            </div>
        );
    }

    return (
        <section className='flex flex-col gap-6 py-10 px-4 w-full max-w-5xl mx-auto'>
            <ToastContainer
                position='bottom-right'
                autoClose={false}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick={false}
                toastClassName={(context) =>
                    contextClass[context?.type || "default"] +
                    " py-4 px-16 bg-white rounded-xl border border-neutral-100 dark:bg-black dark:border-white/[0.2] hover:border-neutral-200 dark:hover:border-neutral-500 group/btn overflow-hidden relative flex items-center justify-center"
                }
            />
            <header className='flex justify-between items-center border-b border-border pb-4'>
                <h1 className='text-3xl font-semibold'>Your Games</h1>
                <ButtonsCard
                    className='cursor-pointer dark:btn-gradient btn-gradient-light px-10 py-6 gap-1 mt-[2rem] md:mt-[4rem]'
                    icon={<FaRegChessBishop className='text-xl' />}
                    iconPosition='left'
                    onClick={() =>
                        toast(ChessErrorMsg("Failed to load new game."))
                    }
                >
                    <p className='font-normal text-base md:text-md lg:text-lg xl:text-xl'>
                        Start new Game
                    </p>
                </ButtonsCard>
            </header>

            <ul className='flex flex-col gap-3'>
                {games?.map((game) => (
                    <ButtonsCard
                        key={game.id}
                        className='!w-full !justify-between'
                        contentClassNames='w-full'
                    >
                        <GameCard game={game} userId={user?.id} />
                    </ButtonsCard>
                ))}
            </ul>
        </section>
    );
}

export const ChessGameSkeleton = ({
    repeatPattern,
}: {
    repeatPattern: number;
}) => {
    const arr = createArrayOf(
        <div className='rounded-3xl w-full h-[5rem] md:h-[10rem] dark:bg-white-200/10 bg-white/20' />,
        repeatPattern
    );
    return (
        <section
            id='hero'
            className='sm:px-12 pt-[9.5rem] content-container mx-auto'
        >
            <div className='flex flex-col gap-6 md:gap-10 lg:gap-12 skeleton-container-light dark:skeleton-container-dark items-center justify-center text-center bg-skeleton rounded-3xl w-full h-fit p-4 md:p-8 lg:p-12 xl:p-24'>
                {arr.map((pat, idx) => (
                    <Fragment key={idx}>{pat}</Fragment>
                ))}
            </div>
        </section>
    );
};
