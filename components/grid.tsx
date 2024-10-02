"use client";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { BentoGrid, BentoGridItem } from "@/components/ui";
import { gridItems } from "@/data";

const Grid = () => {
    return (
        <section className='content-container mx-auto'>
            <motion.div id='about' initial='hidden' whileInView='visible'>
                <BentoGrid className='auto-cols-auto auto-rows-[9rem] md:auto-rows-[11rem] lg:auto-rows-[12rem] xl:auto-rows-[15rem] sm:px-12 pt-[12.5rem]'>
                    {gridItems.map(
                        ({
                            id,
                            title,
                            description,
                            header,
                            className,
                            icon,
                        }) => (
                            <BentoGridItem
                                key={id}
                                id={id}
                                title={title}
                                description={description}
                                header={header}
                                className={cn(
                                    "relative [&>p:text-lg]",
                                    className
                                )}
                                icon={icon}
                            />
                        )
                    )}
                </BentoGrid>
            </motion.div>
        </section>
    );
};

export default Grid;

export const GridSkeleton = () => {
    return (
        <section className='content-container mx-auto'>
            <div id='about'>
                <div className='sm:px-12 pt-[12.5rem]'>
                    <div className='skeleton-container-light dark:skeleton-container-dark grid gap-3 md:gap-5 lg:gap-7 auto-cols-auto md:grid-cols-4 lg:grid-cols-3 auto-rows-[9rem] md:auto-rows-[11rem] lg:auto-rows-[12rem] xl:auto-rows-[15rem] items-stretch justify-items-stretch rounded-3xl'>
                        <div className='rounded-3xl w-full h-full md:col-start-1 md:col-span-2 lg:col-start-1 lg:col-span-1 dark:bg-white-200/10 bg-white/20' />
                        <div className='rounded-3xl w-full h-full md:col-start-3 md:col-span-2 lg:col-start-1 lg:col-span-1 dark:bg-white-200/10 bg-white/20' />
                        <div className='rounded-3xl w-full h-full md:col-start-1 md:col-span-4 lg:row-start-1 lg:row-span-2 lg:col-start-2 lg:col-span-2 dark:bg-white-200/10 bg-white/20' />
                        <div className='rounded-3xl w-full h-full md:col-start-1 md:col-span-4 lg:col-span-3 lg:row-start-3 lg:row-span-2 dark:bg-white-200/10 bg-white/20' />
                    </div>
                </div>
            </div>
        </section>
    );
};
