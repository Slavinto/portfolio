import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import React, { useEffect, useState } from "react";

const PlayerColor = () => {
    const [showDivider, setShowDivider] = useState<boolean>(true);
    const [curDate, setCurDate] = useState(new Date());
    const {
        state: {
            playerColor: color,
            board: { currentTurn: turn },
        },
    } = useChessGamePageContext();
    const hours = curDate.getHours();
    const minutes = curDate.getMinutes();

    useEffect(() => {
        const id = setInterval(() => {
            setCurDate(new Date());
            setShowDivider((prev) => !prev);
        }, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div
            className={`lg:-top-36 mt-4 max-w-sm flex flex-col self-center items-center px-12 py-4 rounded-full bg-secondary text-secondary-foreground text-xl mb-6${
                turn === color ? " text-shadow-lg shadow-white-300" : ""
            }`}
        >
            <p className='text-3xl flex gap-1 items-center'>
                <span className='mt-1'>{hours < 10 ? `0${hours}` : hours}</span>
                <span className='w-2'>{showDivider ? ":" : " "}</span>
                <span className='mt-1'>
                    {minutes < 10 ? `0${minutes}` : minutes}
                </span>
            </p>
            <hr className='w-full' />
            <p>{turn === color ? "Your turn" : "Opponent's turn"}</p>
        </div>
    );
};

export default PlayerColor;
