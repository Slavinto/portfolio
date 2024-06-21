"use client";
import React from "react";
import {
    heroMainHeading,
    heroSubheading,
    heroIntroductionText,
    heroCTAButtonText,
} from "@/data";
import { TextGenerateEffect } from "./ui/text-generate-effect";

const Hero = () => {
    const words = "Bringing you fast and reliable solutions for the web";
    return (
        <section className='bg-background w-full h-32 flex flex-col border border-red-500'>
            <h3 className='uppercase font-normal'></h3>
            <h1 className='text-white text-center font-bold text-6xl '>
                <TextGenerateEffect
                    words={heroMainHeading}
                    className='!text-white-100 font-bold text-5xl'
                />
            </h1>
        </section>
    );
};

export default Hero;
