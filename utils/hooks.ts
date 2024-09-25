import { useAnimate } from "framer-motion";

export const useSafeAnimate = () => {
    const [scope, animate] = useAnimate();

    const safeAnimate = (...args: Parameters<typeof animate>) => {
        return scope.current ? animate(...args) : undefined;
    };

    return [scope, safeAnimate] as [typeof scope, typeof animate];
};
