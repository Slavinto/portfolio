import React from "react";

const DotBackground = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='h-full w-full background dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex flex-col items-center justify-center'>
            {/* Radial gradient for the container to give a faded look */}
            <div className='absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]' />
            {children}
        </div>
    );
};

export default DotBackground;
