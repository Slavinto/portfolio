"use client";

import { FaRegChessKnight } from "react-icons/fa6";
import AuthForm from "@/components/ui/AuthForm";
import { ButtonsCard, Heading } from "@/components/ui";
import { Headings } from "@/types/enums";
import { useUser } from "@/hooks/auth/useUser";
import { useUserGames } from "@/hooks/games/chess/useUserGames";
import GameCard from "@/components/games/chess/GameCard";
import CustomToastContainer from "@/components/ui/CustomToastContainer";
import { useRouter } from "next/navigation";
import ChessGameSkeleton from "@/components/ui/patterns/ChessGameSkeleton";

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

    const router = useRouter();

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
        <section className='flex flex-col gap-6 py-16 px-4 w-full max-w-5xl mx-auto'>
            <CustomToastContainer />
            <header className='flex justify-between items-center border-b border-border pb-4'>
                <Heading as={Headings.H3}>Your Games</Heading>
                <ButtonsCard
                    className='cursor-pointer dark:btn-gradient btn-gradient-light px-10 py-6 gap-1 mt-[2rem] md:mt-[4rem]'
                    icon={<FaRegChessKnight className='text-xl' />}
                    iconPosition='left'
                    onClick={() => router.push("/chess/create")}
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
                        className='!w-full !justify-between cursor-pointer'
                        contentClassNames='w-full'
                        onClick={() => router.push(`/chess/game/${game.id}`)}
                    >
                        <GameCard game={game} userId={user?.id} />
                    </ButtonsCard>
                ))}
            </ul>
        </section>
    );
}
