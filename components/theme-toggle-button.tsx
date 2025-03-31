"use client";

import { useEffect, useState } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";

import { LuSunMedium, LuMoon } from "react-icons/lu";
import { FaRegQuestionCircle } from "react-icons/fa";

import { ButtonsCard } from "./ui";
import { AppTheme } from "@/types/enums";

const ThemeToggleButton = () => {
    const [domLoaded, setDomLoaded] = useState(false);
    useEffect(() => {
        setDomLoaded(true);
    }, []);

    const { theme, setTheme } = useAppTheme();
    const isThemeDark = theme === AppTheme.Dark;

    return (
        <ButtonsCard
            onClick={() => setTheme(isThemeDark ? "light" : "dark")}
            className='cursor-pointer fixed z-50 top-4 right-4 border-2 rounded-xl w-12 h-12 flex items-center justify-center dark:btn-gradient btn-gradient-light'
            icon={
                !domLoaded ? (
                    <FaRegQuestionCircle size={24} />
                ) : isThemeDark ? (
                    <LuSunMedium
                        color={isThemeDark ? "white-300" : "black-200"}
                        size={24}
                    />
                ) : (
                    <LuMoon size={24} />
                )
            }
        />
    );
};
export default ThemeToggleButton;
