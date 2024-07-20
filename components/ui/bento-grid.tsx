import { cn } from "@/utils/cn";
import { BackgroundGradientAnimation } from "./background-gradient-animation";
import Image from "next/image";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    id,
    className,
    title,
    description,
    header,
    icon,
}: {
    id: number;
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
}) => {
    return (
        <div
            className={`${
                id === 1
                    ? "md:col-start-1 md:col-end-1 md:row-start-1 md:row-end-2"
                    : id === 2
                    ? "md:col-start-1 md:col-end-1 md:row-start-2 md:row-end-3"
                    : id === 3
                    ? "md:col-start-2 md:col-end-4 md:row-start-1 "
                    : "col-start-auto col-end-auto relative"
            } rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black-100 dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col ${className}`}
        >
            {header}
            <div className='group-hover/bento:translate-x-2 transition duration-200'>
                {icon}
                <div className='font-sans font-bold themed-text-icons mb-2 mt-2'>
                    {title}
                </div>
                <div className='font-sans font-normal text-xs themed-text-icons'>
                    {description}
                </div>
            </div>
            <div className='absolute left-0 top-0 w-full h-full -z-10'>
                {id === 4 ? (
                    <BackgroundGradientAnimation containerClassName='-z-10 w-full h-full rounded-xl' />
                ) : (
                    <div
                        className={`-z-10 w-full h-full rounded-xl ${
                            id === 1 || id === 2 || id === 3 ? "opacity-80" : ""
                        } header-gradient-light dark:header-gradient-dark`}
                    ></div>
                )}
                {id === 1 ? (
                    <Image
                        className='rounded-xl -z-20'
                        src='/images/grid-bg-1.jpg'
                        alt='texture image'
                        fill
                    />
                ) : id === 2 ? (
                    <Image
                        className='rounded-xl -z-20'
                        src='/images/grid-bg-3.jpg'
                        alt='texture image'
                        fill
                    />
                ) : id === 3 ? (
                    <Image
                        className='rounded-xl -z-20'
                        src='/images/grid-bg-2.jpg'
                        alt='texture image'
                        fill
                    />
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};
