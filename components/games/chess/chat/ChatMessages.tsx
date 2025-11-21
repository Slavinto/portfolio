import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import ChessGameSkeleton from "@/components/ui/patterns/ChessGameSkeleton";

const ChatMessages = () => {
    const {
        state: { playerId, chatMessages },
    } = useChessGamePageContext();

    if (!playerId) {
        return <ChessGameSkeleton repeatPattern={3} />;
    }

    return (
        <div className='flex flex-col gap-1 p-1 overflow-y-auto flex-shrink-0 bg-muted/100 rounded-lg'>
            {chatMessages.length > 0 ? (
                chatMessages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-2 p-2 rounded-lg max-w-[80%] opacity-90 items-center justify-between ${
                            msg.sender === playerId
                                ? "ml-auto dark:bg-skeleton !text-white"
                                : "mr-auto bg-secondary"
                        }`}
                    >
                        <p className='text-sm'>{msg.message}</p>
                        <span className='text-[10px] opacity-50 block text-right mt-1'>
                            {new Date(msg.created_at).toLocaleTimeString()}
                        </span>
                    </div>
                ))
            ) : (
                <span className='text-sm text-background/90'>
                    Nothing here yet
                </span>
            )}
            <div className='h-8 w-full'></div>
        </div>
    );
};

export default ChatMessages;
