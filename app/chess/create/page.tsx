"use client";

import { useRouter } from "next/navigation";
import { createGame } from "@/lib/services/chess-db";
import { BoardInstance } from "@/lib/games/chess/game-logic/main/board/board";
import { toPersistedState } from "@/utils/games/chess/helpers";
import { ButtonsCard } from "@/components/ui";

export default function CreateGamePage() {
    const router = useRouter();

    async function handleCreate() {
        // build a fresh board (or from initialBoardState)
        const board = BoardInstance.clone(); // or new Board()
        board.reset();
        const state = toPersistedState({
            board,
            playerColor: "White",
            selected: null,
        });
        const game = await createGame(state);
        router.push(`/chess/game/${game.id}`);
    }

    return (
        <section className='content-container mx-auto py-24'>
            <div className='mx-auto max-w-xl rounded-2xl shadow-lg p-8 header-gradient-light dark:header-gradient-dark'>
                <h1 className='text-3xl font-bold mb-4 text-center'>
                    Start a Chess Match
                </h1>
                <p className='text-center text-neutral-500 dark:text-neutral-300 mb-8'>
                    Create a room and share the link with your opponent.
                </p>
                <div className='flex justify-center gap-4'>
                    <ButtonsCard
                        onClick={handleCreate}
                        className='cursor-pointer dark:btn-gradient btn-gradient-light px-10 py-6 gap-1'
                    >
                        Create Game
                    </ButtonsCard>
                </div>
            </div>
        </section>
    );
}
