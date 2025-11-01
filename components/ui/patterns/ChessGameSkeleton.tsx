import React, { Fragment } from "react";
import { createArrayOf } from "@/lib/helpers";

const ChessGameSkeleton = ({ repeatPattern }: { repeatPattern: number }) => {
    const arr = createArrayOf(
        <div className='rounded-3xl w-full h-[5rem] md:h-[10rem] dark:bg-white-200/10 bg-white/20' />,
        repeatPattern
    );
    return (
        <section
            id='hero'
            className='sm:px-12 pt-[9.5rem] content-container mx-auto'
        >
            <div className='flex flex-col gap-6 md:gap-10 lg:gap-12 skeleton-container-light dark:skeleton-container-dark items-center justify-center text-center bg-skeleton rounded-3xl w-full h-fit p-4 md:p-8 lg:p-12 xl:p-24'>
                {arr.map((pat, idx) => (
                    <Fragment key={idx}>{pat}</Fragment>
                ))}
            </div>
        </section>
    );
};

export default ChessGameSkeleton;
