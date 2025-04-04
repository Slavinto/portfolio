import { DEFAULT_CIPHERS } from "tls";
import { gridItems } from "./data";

const {
    default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
const svgToDataUri = require("mini-svg-data-uri");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./data/**/*.{js,ts,jsx,tsx,mdx}",
        "./features/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",

        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    safelist: ["header-gradient-dark", "header-gradient-light"],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                poppins: ["var(--font-poppins)", "sans-serif"],
            },
            textShadow: {
                sm: "1px 1px 2px rgba(0, 0, 0, 0.5)", // Small shadow
                DEFAULT: "2px 2px 4px rgba(0, 0, 0, 0.7)", // Default shadow
                lg: "3px 3px 6px rgba(0, 0, 0, 0.8)", // Large shadow
            },
            animation: {
                move: "move 5s linear infinite",
                first: "moveVertical 30s ease infinite",
                second: "moveInCircle 20s reverse infinite",
                third: "moveInCircle 40s linear infinite",
                fourth: "moveHorizontal 40s ease infinite",
                fifth: "moveInCircle 20s ease infinite",
            },
            keyframes: {
                move: {
                    "0%": { transform: "translateX(-200px)" },
                    "100%": { transform: "translateX(200px)" },
                },
                moveHorizontal: {
                    "0%": {
                        transform: "translateX(-50%) translateY(-10%)",
                    },
                    "50%": {
                        transform: "translateX(50%) translateY(10%)",
                    },
                    "100%": {
                        transform: "translateX(-50%) translateY(-10%)",
                    },
                },
                moveInCircle: {
                    "0%": {
                        transform: "rotate(0deg)",
                    },
                    "50%": {
                        transform: "rotate(180deg)",
                    },
                    "100%": {
                        transform: "rotate(360deg)",
                    },
                },
                moveVertical: {
                    "0%": {
                        transform: "translateY(-50%)",
                    },
                    "50%": {
                        transform: "translateY(50%)",
                    },
                    "100%": {
                        transform: "translateY(-50%)",
                    },
                },
            },
            colors: {
                black: {
                    DEFAULT: "#000",
                    100: "#000319",
                    200: "rgba(17, 25, 40, 0.85)",
                    300: "rgba(255, 255, 255, 0.125)",
                    400: "rgba(17, 25, 40, 0.75)",
                },
                white: {
                    DEFAULT: "#FFF",
                    100: "#BEC1DD",
                    200: "#C1C2D3",
                    300: "rgba(250, 250, 250, 1)",
                    400: "#b8b8c2",
                },
                blue: {
                    "100": "#E4ECFF",
                },
                purple: "#CBACF9",
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                skeleton: "var(--skeleton)",
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "var(--secondary-foreground)",
                },
                destructive: {
                    DEFAULT: "var(--destructive)",
                    foreground: "var(--destructive-foreground)",
                },
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)",
                },
                popover: {
                    DEFAULT: "var(--popover)",
                    foreground: "var(--popover-foreground)",
                },
                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)",
                },
            },
            background: {
                btn: "linear-gradient(90deg, rgba(22,26,49,1) 0%, rgba(6,9,31,1) 100%)",
            },
            backgroundImage: {
                btn: "linear-gradient(90deg, rgba(22,26,49,1) 0%, rgba(6,9,31,1) 100%)",
                "card-1": "url(/images/card-bg-1.jpg)",
                "card-2": "url(/images/grid-bg-5.jpg)",
                "card-3": "url(/images/computer-screen.jpg)",
            },
        },
    },
    plugins: [
        function ({ addUtilities }: { addUtilities: any }) {
            addUtilities({
                ".line-clamp-2": {
                    display: "-webkit-box",
                    "-webkit-line-clamp": "2", // Change this number for more or fewer lines
                    "-webkit-box-orient": "vertical",
                    overflow: "hidden",
                },
            });
        },
        function ({ addUtilities }: { addUtilities: any }) {
            addUtilities({
                ".text-shadow-sm": {
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                },
                ".text-shadow": {
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
                },
                ".text-shadow-lg": {
                    textShadow: "3px 3px 6px rgba(0, 0, 0, 0.8)",
                },
            });
        },
        addVariablesForColors,
        function ({ matchUtilities, theme }: any) {
            matchUtilities(
                {
                    "bg-grid": (value: any) => ({
                        backgroundImage: `url("${svgToDataUri(
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
                        )}")`,
                    }),
                    "bg-grid-small": (value: any) => ({
                        backgroundImage: `url("${svgToDataUri(
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
                        )}")`,
                    }),
                    "bg-dot": (value: any) => ({
                        backgroundImage: `url("${svgToDataUri(
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
                        )}")`,
                    }),
                },
                {
                    values: flattenColorPalette(theme("backgroundColor")),
                    type: "color",
                }
            );
        },
    ],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
    let allColors = flattenColorPalette(theme("colors"));
    let newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
    );

    addBase({
        ":root": newVars,
    });
}
