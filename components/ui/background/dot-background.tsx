import React from "react";

const DotBackground = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className: string;
}) => {
    return (
        <div
            className={`w-full dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex flex-col items-center ${className}`}
        >
            <div className='absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] z-1' />
            {children}
        </div>
    );
};

export default DotBackground;
