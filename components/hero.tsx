"use client";

import React from "react";
import {
    heroMainHeading,
    heroSubheading,
    heroIntroductionText,
    heroCTAButtonText,
} from "@/data";
import { ButtonsCard, DotBackground, Scroller, TextGenerateEffect } from "./ui";
import { BsArrow90DegLeft } from "react-icons/bs";

const Hero = () => {
    const handleClickCta = () => {};

    return (
        <section id='hero' className='w-full pt-[200px] h-fit'>
            <DotBackground className={"w-full"}>
                <div className='flex flex-col items-center text-center gap-3'>
                    <Scroller />
                    <h3 className='uppercase font-normal text-xs md:text-base'>
                        {heroSubheading}
                    </h3>
                    <TextGenerateEffect
                        words={heroMainHeading}
                        className='relative z-10 max-w-[400px] md:max-w-[670px] xl:max-w-[760px]'
                        textClassNames='font-bold !text-white-100 text-3xl md:text-5xl lg:text-6xl'
                    />
                    <p className=''>{heroIntroductionText}</p>
                    <ButtonsCard
                        className='dark:btn-gradient btn-gradient-light w-full md:w-[200px] lg:w-[220px] h-[66px] gap-1'
                        icon={<BsArrow90DegLeft className='rotate-90' />}
                        onClick={handleClickCta}
                    >
                        {heroCTAButtonText}
                    </ButtonsCard>
                </div>
            </DotBackground>
        </section>
    );
};

export default Hero;
