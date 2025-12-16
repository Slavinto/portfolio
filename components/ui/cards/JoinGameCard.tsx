"use client";

import { extractGameIdFromText } from "@/lib/helpers";
import { Headings } from "@/types/enums";
import { useState } from "react";
import Heading from "../text/Heading";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import { joinGame } from "@/lib/games/chess/actions/joinGame";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import { getGameById } from "@/lib/services/chess-db";
import { useUser } from "@/hooks/auth/useUser";
import { useRouter } from "next/navigation";

const JoinGameCard = () => {
    const [input, setInput] = useState("");
    const gameId = extractGameIdFromText(input);
    const { data: user } = useUser();
    const router = useRouter();

    function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
        const text = e.clipboardData.getData("text").trim();
        const id = extractGameIdFromText(text);

        if (!id) {
            toast.info("That doesn't look like a valid game link");
        }
    }

    async function handleJoin() {
        if (!gameId) return;
        try {
            const game = await getGameById(gameId);
            if (!game) {
                toast.error("Game not found");
                return;
            }
            if (
                game.player_white === user?.id ||
                game.player_black === user?.id
            ) {
                toast.info("Game already joined. Redirecting to game page");
                router.push(`/chess/game/${gameId}`);
                return;
            }
            await joinGame(gameId);
        } catch (error) {
            toast.error(`Failed to join game. ${error}`);
        }
    }

    return (
        <div className='w-full p-4 rounded-xl border border-border bg-card space-y-3'>
            <Heading as={Headings.H4}>Join a Game</Heading>

            <CustomInput
                value={input}
                handler={(e) => setInput(e.target.value.trim())}
                onPaste={handlePaste}
                placeholder='Paste game link here'
                classNames={cn("w-full", input && !gameId && "border-red-500")}
            />

            <CustomButton
                disabled={!gameId}
                handler={handleJoin}
                classNames='btn-primary w-full disabled:opacity-50'
            >
                Join Game
            </CustomButton>

            <CustomButton
                classNames='btn-secondary w-full'
                // TODO: implement qr join support
                // onClick={() => setShowQR(true)}
            >
                Join via QR
            </CustomButton>
        </div>
    );
};

export default JoinGameCard;
