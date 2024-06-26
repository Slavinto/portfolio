"use client";

import { LuSunMedium } from "react-icons/lu";
import { LuMoon } from "react-icons/lu";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ButtonsCard } from "./ui";

const ThemeToggleButton = () => {
    const [domLoaded, setDomLoaded] = useState(false);
    useEffect(() => {
        setDomLoaded(true);
    }, []);

    const { theme, setTheme } = useTheme();

    return (
        <ButtonsCard
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className='fixed z-10 top-4 right-4 border-2 rounded-xl w-12 h-12 flex items-center justify-center dark:btn-gradient btn-gradient-light'
            icon={
                theme === "dark"
                    ? domLoaded && <LuSunMedium size={24} />
                    : domLoaded && <LuMoon size={24} />
            }
        />
    );
};
export default ThemeToggleButton;
