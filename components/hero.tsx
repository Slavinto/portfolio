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
    const handleClickCta = () => {
        document.getElementById("my-projects")?.scrollIntoView();
    };

    return (
        <section id='hero' className='w-full pt-[9.5rem] h-fit'>
            <DotBackground className={"w-full"}>
                <div className='flex flex-col items-center text-center gap-3'>
                    <Scroller />
                    <h3 className='uppercase font-normal text-base md:text-lg lg:text-xl xl:text-3xl'>
                        {heroSubheading}
                    </h3>
                    <TextGenerateEffect
                        words={heroMainHeading}
                        className='relative z-10 w-full md:max-w-[45rem] lg:max-w-[65rem] xl:max-w-[75rem] lg:py-6 md:py-4 xl:py-8'
                        textClassNames='font-black !text-white-100 text-6xl md:text-7xl lg:text-8xl xl:text-9xl lg:!leading-[7rem] xl:!leading-[9rem]'
                    />
                    <p className='font-normal text-base md:text-lg lg:text-xl xl:text-3xl'>
                        {heroIntroductionText}
                    </p>
                    <ButtonsCard
                        className='cursor-pointer dark:btn-gradient btn-gradient-light lg:w-[25rem] lg:h-[8rem] md:w-[20rem] md:h-[6rem] h-[4rem] w-[15rem] gap-1 mt-[2rem] md:mt-[4rem]'
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

export const HeroSkeleton = () => {
    return (
        <section
            id='hero'
            className='sm:px-12 pt-[9.5rem] content-container mx-auto'
        >
            <div className='flex flex-col gap-6 md:gap-10 lg:gap-12 skeleton-container-light dark:skeleton-container-dark items-center justify-center text-center bg-skeleton rounded-3xl w-full h-fit p-4 md:p-8 lg:p-12 xl:p-24'>
                <div className='rounded-3xl w-full h-[5rem] md:h-[10rem] dark:bg-white-200/10 bg-white/20'></div>
                <div className='rounded-3xl w-full h-[5rem] md:h-[10rem] dark:bg-white-200/10 bg-white/20'></div>
                <div className='rounded-3xl w-full h-[5rem] md:h-[10rem] dark:bg-white-200/10 bg-white/20'></div>
            </div>
        </section>
    );
};
