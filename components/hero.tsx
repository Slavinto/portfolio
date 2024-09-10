"use client";

import React from "react";
import {
    heroMainHeading,
    heroSubheading,
    heroIntroductionText,
    heroCTAButtonText,
} from "@/data";
import { ButtonsCard, DotBackground, TextGenerateEffect } from "./ui";
import { BsArrow90DegLeft } from "react-icons/bs";

const Hero = () => {
    const handleClickCta = () => {};

    return (
        <section className='w-full pt-[12.5rem] h-fit'>
            <DotBackground className={"w-full"}>
                <div className='flex flex-col items-center text-center gap-3'>
                    <h3 className='uppercase font-normal text-base md:text-lg lg:text-xl xl:text-3xl'>
                        {heroSubheading}
                    </h3>
                    <TextGenerateEffect
                        words={heroMainHeading}
                        className='relative z-10 w-full md:max-w-[60rem] lg:max-w-[75rem] xl:max-w-[90rem] lg:py-6 md:py-4 xl:py-8'
                        textClassNames='font-black !text-white-100 text-6xl md:text-7xl lg:text-8xl xl:text-9xl'
                    />
                    <p className='font-normal text-base md:text-lg lg:text-xl xl:text-3xl'>
                        {heroIntroductionText}
                    </p>
                    <ButtonsCard
                        className='dark:btn-gradient btn-gradient-light xl:w-[35rem] xl:h-40 lg:w-[25rem] lg:h-[8rem] md:w-[20rem] md:h-[6rem] h-[4rem] w-[15rem] gap-1 mt-[2rem] md:mt-[4rem]'
                        icon={<BsArrow90DegLeft className='rotate-90' />}
                        onClick={handleClickCta}
                    >
                        <p className='font-normal text-base md:text-xl lg:text-2xl xl:text-3xl'>
                            {heroCTAButtonText}
                        </p>
                    </ButtonsCard>
                </div>
            </DotBackground>
        </section>
    );
};

export default Hero;
