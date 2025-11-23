import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const ChatMessages = () => {
    const {
        state: { player, chatMessages },
    } = useChessGamePageContext();

    const chatLoadedRef = useRef<boolean>(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const [showScrollButton, setShowScrollButton] = useState(false);

    // Auto-scroll when messages change IF user is near the bottom
    useEffect(() => {
        // const el = scrollRef.current;
        // if (!el) return;

        // const distanceFromBottom =
        //     el.scrollHeight - el.scrollTop - el.clientHeight;

        // const isNearBottom = distanceFromBottom < 120;

        // if (isNearBottom) {
        //     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        // }
        requestAnimationFrame(() => {
            bottomRef.current?.scrollIntoView({ behavior: "auto" });
        });
    }, [chatMessages]);

    // useLayoutEffect(() => {
    //     // scrolling to last message on first component load
    //     if (!chatLoadedRef.current) {
    //         chatLoadedRef.current = true;
    //         bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    //     }
    // });

    // Show / hide scroll-down button
    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;

        const distanceFromBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight;

        setShowScrollButton(distanceFromBottom > 150);
    };

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    if (!player) return null;
    const { playerId } = player;

    return (
        <div className='relative'>
            {/* Scrollable area */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className='flex flex-col gap-1 p-1 overflow-y-auto flex-shrink-0 bg-muted/100 rounded-lg max-h-96 pb-12'
            >
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

                {/* Scroll target */}
                <div ref={bottomRef} />
            </div>

            {/* Scroll down button */}
            {showScrollButton && (
                <button
                    onClick={scrollToBottom}
                    className='absolute bottom-12 right-6 p-4 rounded-full shadow-lg bg-primary opacity-80 text-primary-foreground'
                >
                    <FaChevronDown className='w-4 h-4' />
                </button>
            )}
        </div>
    );
};

export default ChatMessages;
