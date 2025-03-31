import { AppTheme } from "@/types/enums";
import { useTheme } from "next-themes";

export const useAppTheme = () => {
    const { theme, resolvedTheme, setTheme } = useTheme();

    return {
        theme:
            theme === AppTheme.Dark
                ? AppTheme.Dark
                : theme === undefined
                ? undefined
                : AppTheme.Light,
        resolvedTheme: (resolvedTheme as AppTheme) || undefined,
        setTheme,
    };
};
