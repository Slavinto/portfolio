import { cn } from "@/utils/cn";
import { BackgroundGradientAnimation } from "./background-gradient-animation";

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
                    ? "md:col-start-2 md:col-end-4 md:row-start-1"
                    : "col-start-auto col-end-auto"
            } rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black-100 dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col ${className}`}
        >
            {header}
            <div className='group-hover/bento:translate-x-2 transition duration-200'>
                {icon}
                <div className='font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2'>
                    {title}
                </div>
                <div className='font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300'>
                    {description}
                </div>
            </div>
            {id === 4 ? (
                <BackgroundGradientAnimation containerClassName='absolute -z-10 w-full h-full rounded-xl' />
            ) : (
                <div className='absolute left-0 top-0 -z-10 w-full h-full rounded-xl dark:header-gradient-dark header-gradient-light' />
            )}
        </div>
    );
};
