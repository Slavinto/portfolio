import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { ButtonsCard } from "@/components/ui";
import CustomInput from "@/components/ui/CustomInput";
import { sendMessage } from "@/lib/services/chess-chat";
import { useState } from "react";

const ChatInput = () => {
    const [text, setText] = useState("");
    const {
        state: { player, gameRow },
    } = useChessGamePageContext();

    if (!gameRow || !player || !player.playerId) {
        return null;
    }

    const { id: gameId } = gameRow;
    const { playerId } = player;
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
                value={text}
                handler={(e) => {
                    if (e.target instanceof HTMLInputElement) {
                        setText(e.target.value);
                    }
                }}
            />
            <ButtonsCard className='px-4 py-1 rounded-lg bg-primary text-primary-foreground'>
                Send
            </ButtonsCard>
        </form>
    );
};
export default ChatInput;
