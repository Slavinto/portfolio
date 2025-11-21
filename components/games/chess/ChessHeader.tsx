import { ButtonsCard, Heading } from "@/components/ui";
import { Headings } from "@/types/enums";
import React, { ReactNode } from "react";
import { FaChessKing } from "react-icons/fa";
import ChessGameStatus from "./ChessGameStatus";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { useRouter } from "next/navigation";
import { HiArrowTurnLeftUp } from "react-icons/hi2";

const ChessHeader = ({ id, children }: { id: string; children: ReactNode }) => {
    const router = useRouter();
    const { state } = useChessGamePageContext();
    const { gameStatus } = state;
    return (
        <div className='rounded-xl p-4 border border-border bg-card w-full text-xl'>
            <Heading as={Headings.H4} classNames='text-2xl font-bold'>
                <span className='block max-w-xs overflow-hidden text-ellipsis whitespace-nowrap'>
                    <FaChessKing className='inline -rotate-12 mr-1 mb-1' />
                    Game-{id}
                </span>
            </Heading>

            <ChessGameStatus gameStatus={gameStatus} />

            <ButtonsCard
                icon={<HiArrowTurnLeftUp className='mb-2' />}
                iconPosition='left'
                className='rounded-xl p-2 cursor-pointer gap-1 mt-2'
                onClick={() => router.push("/chess")}
            >
                Browse my games
            </ButtonsCard>

            {(gameStatus === "check" ||
                gameStatus === "ongoing" ||
                gameStatus === "waiting" ||
                gameStatus === "layed-off") &&
                children}
        </div>
    );
};

export default ChessHeader;
