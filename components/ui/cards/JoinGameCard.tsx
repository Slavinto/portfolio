import { useState } from "react";
import { extractGameIdFromText } from "@/lib/helpers";
import { Headings } from "@/types/enums";
import Heading from "../text/Heading";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import { useRouter } from "next/navigation";

const JoinGameCard = () => {
    const [input, setInput] = useState("");
    const [showQR, setShowQR] = useState(false);
    const router = useRouter();

    const gameId = extractGameIdFromText(input);

    const handleJoin = () => {
        if (!gameId) return;
        router.push(`/chess/game/${gameId}`);
    };

    return (
        <div className='w-full p-4 rounded-xl border border-border bg-card space-y-3'>
            <Heading as={Headings.H4}>Join a Game</Heading>

            <CustomInput
                value={input}
                handler={(e) => setInput(e.target.value)}
                placeholder='Paste game link here'
                classNames='w-full'
            />

            <CustomButton
                disabled={!gameId}
                handler={handleJoin}
                classNames='btn-primary w-full disabled:opacity-50'
            >
                Join Game
            </CustomButton>

            <CustomButton
                handler={() => setShowQR(true)}
                classNames='btn-secondary w-full'
            >
                Join via QR
            </CustomButton>
        </div>
    );
};

export default JoinGameCard;
