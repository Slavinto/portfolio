import { useAnimate } from "framer-motion";
import { useEffect } from "react";

export const useSafeAnimate = () => {
    const [scope, animate] = useAnimate();

    const safeAnimate = (...args: Parameters<typeof animate>) => {
        return scope.current ? animate(...args) : undefined;
    };

    return [scope, safeAnimate] as [typeof scope, typeof animate];
};

// a hook to detect a click outside of a modal window
export const useOutsideClick = (
    ref: React.RefObject<HTMLDivElement>,
    callback: Function
) => {
    useEffect(() => {
        const listener = (event: any) => {
            // DO NOTHING if the element being clicked is the target element or their children
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            callback(event);
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, callback]);
};
