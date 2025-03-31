import { useEffect, useState } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AppTheme } from "@/types/enums";

export const useTabsTheme = () => {
    const { theme, resolvedTheme } = useAppTheme();
    const [tabsTheme, setTabsTheme] = useState<AppTheme | undefined>();
    const isThemeDark = theme === AppTheme.Dark;

    useEffect(() => {
        setTabsTheme(theme || resolvedTheme || AppTheme.Light);
    }, [theme, isThemeDark, resolvedTheme]);

    return { tabsTheme, isThemeDark };
};
