import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const ChatPanel = () => {
    return (
        <div className='w-full max-h-96 overflow-y-auto overflow-x-hidden flex flex-col justify-between'>
            <ChatMessages />
            <ChatInput />
        </div>
    );
};

export default ChatPanel;
