"use client";
import React from "react";
import { TextGenerateEffect } from "./ui/text-generate-effect";

const Hero = () => {
    const words = "Bringing you fast and reliable solutions for the web";
    return (
        <section className='flex w-full h-32'>
            <h1 className='text-white text-center font-bold text-6xl'>
                <TextGenerateEffect
                    words={words}
                    className='text-white text-5xl'
                />
            </h1>
        </section>
    );
};

export default Hero;
