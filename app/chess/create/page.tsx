"use client";

import { useRouter } from "next/navigation";
import { createGame } from "@/lib/services/chess-db";
import { toPersistedState } from "@/utils/games/chess/helpers";
import { ButtonsCard, Heading } from "@/components/ui";
import {
    Board,
    BoardInstance,
} from "@/lib/games/chess/game-logic/main/board/board";
import { FaChessKing } from "react-icons/fa6";
import { Headings } from "@/types/enums";
import { Color } from "@/types/games/chess";

export default function CreateGamePage() {
    const router = useRouter();

    async function handleCreate(playAs: Color) {
        // build a fresh board (or from initialBoardState)
        const board = BoardInstance.clone(); // or new Board()
        board.reset();
        const state = toPersistedState(board);
        const game = await createGame(state, playAs);
        router.push(`/chess/game/${game.id}`);
    }

    return (
        <section className='content-container mx-auto py-24'>
            <div className='mx-auto max-w-xl rounded-2xl shadow-lg p-8 header-gradient-light flex flex-col dark:header-gradient-dark'>
                <h1 className='text-3xl font-bold mb-4 text-center'>
                    Start a Chess Match
                </h1>
                <p className='text-center text-neutral-500 dark:text-neutral-300 mb-8'>
                    Create a room and share the link with your opponent.
                </p>
                <Heading as={Headings.H3} classNames='self-center'>
                    Choose your color
                </Heading>
                <div className='flex justify-center gap-4 mt-4'>
                    <ButtonsCard
                        onClick={() => handleCreate("White")}
                        className='cursor-pointer btn-gradient-light px-10 py-6 gap-1'
                    >
                        <FaChessKing fill='white' className='text-5xl' />
                    </ButtonsCard>
                    <ButtonsCard
                        onClick={() => handleCreate("Black")}
                        className='cursor-pointer btn-gradient-light px-10 py-6 gap-1'
                    >
                        <FaChessKing
                            fill='#000'
                            className='text-5xl text-shadow-xl'
                        />
                    </ButtonsCard>
                </div>
            </div>
        </section>
    );
}
