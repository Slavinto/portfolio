import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const ChatPanel = () => {
    return (
        <div className='w-full max-h-96 flex flex-col'>
            <div className='flex-1 overflow-y-auto overflow-x-hidden'>
                <ChatMessages />
            </div>
            <ChatInput />
        </div>
    );
};

export default ChatPanel;
