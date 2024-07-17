"use client";
import { cn } from "@/utils/cn";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui";
import { gridItems } from "@/data";

export function Grid() {
    return (
        <BentoGrid className='max-w-4xl mx-auto md:auto-rows-[20rem] pt-16'>
            {gridItems.map((item, i) => (
                <BentoGridItem
                    key={i}
                    title={item.title}
                    description={item.description}
                    header={item.header}
                    className={cn("[&>p:text-lg]", item.className)}
                    icon={item.icon}
                />
            ))}
        </BentoGrid>
    );
}
