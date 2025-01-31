"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function AnimatedCard({
    icon,
    imagePath,
    headerText,
    descriptionText,
    routerPath,
    classNames,
}: {
    icon?: ReactNode;
    imagePath?: string;
    headerText: string;
    descriptionText: string;
    routerPath?: string;
    classNames?: string;
}) {
    const router = useRouter();
    const handleClickCard = () => routerPath && router.push(routerPath);
    return (
        <div
            onClick={handleClickCard}
            className='max-w-xs w-full group/card shadow-xl rounded-3xl'
        >
            <div
                className={cn(
                    ` cursor-pointer overflow-hidden relative card w-96 h-56 rounded-3xl shadow-xl max-w-lg mx-auto flex flex-col justify-center p-8 items-center",
                    "dark:bg-card-1 bg-card-2 bg-cover ${classNames}`
                )}
            >
                <div className='absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60 backdrop-blur-md' />
                <div className='absolute w-full h-full top-0 left-0 transition duration-300 bg-black opacity-20 dark:opacity-50' />
                <div className='flex flex-row items-center space-x-4 z-10'>
                    {imagePath ? (
                        <Image
                            height='100'
                            width='100'
                            alt='Avatar'
                            src={imagePath || ""}
                            className='h-10 w-10 rounded-full border-2 object-cover'
                        />
                    ) : icon ? (
                        <div className='w-10 h-10'>{icon}</div>
                    ) : (
                        ""
                    )}
                    <div className='flex flex-col'>
                        <h1 className='font-bold text-xl md:text-2xl text-gray-50 relative z-10 dark:shadow-none text-shadow-lg'>
                            {headerText}
                        </h1>
                        <p className='font-normal text-sm text-gray-50 relative z-10 my-4 dark:shadow-none text-shadow-lg'>
                            {descriptionText}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
