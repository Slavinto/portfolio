"use client";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { BentoGrid, BentoGridItem } from "@/components/ui";
import { gridItems } from "@/data";

export function Grid() {
    return (
        <motion.div initial='hidden' whileInView='visible'>
            <BentoGrid className='max-w-4xl mx-auto auto-rows-[14rem] md:auto-rows-[10rem] pt-[10rem]'>
                {gridItems.map(
                    ({ id, title, description, header, className, icon }) => (
                        <BentoGridItem
                            key={id}
                            id={id}
                            title={title}
                            description={description}
                            header={header}
                            className={cn("relative [&>p:text-lg]", className)}
                            icon={icon}
                        />
                    )
                )}
            </BentoGrid>
        </motion.div>
    );
}
