import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { ButtonsCard } from "@/components/ui";
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
                console.log({ gameId, playerId, text });
                await sendMessage(gameId, playerId, text);
                setText("");
            }}
            className='absolute bottom-0 w-[96%] self-center flex gap-2 mt-2 p-1'
        >
            <input
                className='flex-1 px-2 py-1 rounded-lg border border-neutral-100 dark:bg-black dark:border-white/[0.2] hover:border-neutral-200 dark:hover:border-neutral-500 ring-0 outline-none'
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder='Type a message…'
            />
            <ButtonsCard className='px-4 py-1 rounded-lg bg-primary text-primary-foreground'>
                Send
            </ButtonsCard>
        </form>
    );
};
export default ChatInput;
