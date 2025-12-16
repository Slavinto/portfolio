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
            className='absolute bottom-0 w-[99%] self-center flex mt-2 p-1 overflow-hidden'
        >
            <div className='relative flex w-full'>
                <CustomInput
                    name={`player_${playerId}_chat_input`}
                    classNames='text-middle max-w-full'
                    value={text}
                    handler={(e) => {
                        if (e.target instanceof HTMLInputElement) {
                            setText(e.target.value);
                        }
                    }}
                />
                <ButtonsCard className='absolute top-0 bottom-0 right-0 p-1 2xs:px-2 2xs:py-1 sm:px-4 sm:py-1'>
                    Send
                </ButtonsCard>
            </div>
        </form>
    );
};
export default ChatInput;
