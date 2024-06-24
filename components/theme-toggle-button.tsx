import { LuSunMedium } from "react-icons/lu";
import { LuMoon } from "react-icons/lu";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggleButton = () => {
    const { theme, setTheme } = useTheme();
    const [domLoaded, setDomLoaded] = useState(false);

    useEffect(() => {
        setDomLoaded(true);
    }, []);

    return (
        <button
            className='fixed top-4 right-4 border-2 rounded-xl w-12 h-12 flex items-center justify-center'
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            {theme === "dark"
                ? domLoaded && <LuSunMedium size={24} />
                : domLoaded && <LuMoon size={24} />}
        </button>
    );
};
export default ThemeToggleButton;
