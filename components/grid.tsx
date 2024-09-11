"use client";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { BentoGrid, BentoGridItem } from "@/components/ui";
import { gridItems } from "@/data";

export function Grid() {
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
}
