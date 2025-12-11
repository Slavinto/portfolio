import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { ButtonsCard } from "@/components/ui";
import CustomInput from "@/components/ui/CustomInput";
import { sendMessage } from "@/lib/services/chess-chat";
import { useState } from "react";

const ChatInput = () => {
    const [text, setText] = useState("");
    const {
        state: { player, opponent, gameRow },
    } = useChessGamePageContext();

    if (!gameRow || !player || !player?.id || !opponent || !opponent?.id) {
        return null;
    }

    const { id: gameId } = gameRow;
    const { id: playerId } = player;
    // const { id: opponentId } = opponent;
    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                if (text.trim().length === 0) return;
                await sendMessage(gameId, playerId, text);
                setText("");
            }}
            className='absolute bottom-0 w-[96%] self-center flex gap-2 mt-2 p-1'
        >
            <CustomInput
                classNames='text-middle'
                value={text}
                handler={(e) => {
                    if (e.target instanceof HTMLInputElement) {
                        setText(e.target.value);
                    }
                }}
            />
            <ButtonsCard className='text-middle p-1 2xs:px-2 2xs:py-1 sm:px-4 sm:py-1'>
                Send
            </ButtonsCard>
        </form>
    );
};
export default ChatInput;
