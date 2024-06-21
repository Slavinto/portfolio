"use client";

import React from "react";
import {
    heroMainHeading,
    heroSubheading,
    heroIntroductionText,
    heroCTAButtonText,
} from "@/data";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { useTheme } from "next-themes";

const Hero = () => {
    const { theme, setTheme } = useTheme();
    const words = "Bringing you fast and reliable solutions for the web";
    return (
        <section className='bg-red-500 rounded-2xl border-2 w-full h-32 flex flex-col items-center'>
            <h3 className='uppercase font-normal'></h3>
            <h1 className='text-white text-center font-bold text-6xl '>
                <TextGenerateEffect
                    words={heroMainHeading}
                    className='!text-white-100 font-bold text-5xl'
                />
            </h1>
            <button
                className='border-2 rounded-xl p-2 w-32'
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
                Toggle Theme
            </button>
        </section>
    );
};

export default Hero;
