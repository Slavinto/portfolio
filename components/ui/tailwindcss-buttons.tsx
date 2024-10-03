"use client";
import React from "react";
import { IconClipboard } from "@tabler/icons-react";

import { motion, useAnimate } from "framer-motion";
import { cn } from "@/utils/cn";

const Icon = ({ icon }: { icon?: string | React.ReactNode }) => {
    return (
        <>
            {icon ? (
                icon
            ) : (
                <IconClipboard className='absolute top-2 right-2 text-neutral-300 group-hover/btn:block hidden h-4 w-4 transition duration-200' />
            )}
        </>
    );
};

export const ButtonsCard = ({
    children,
    className,
    onClick,
    icon,
    iconPosition = "right",
}: {
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
    icon?: string | React.ReactNode;
    iconPosition?: "left" | "right";
}) => {
    const [scope, animate] = useAnimate();

    const handleButtonClick = () => {
        onClick && onClick();
    };

    const buttonVariants = {
        pressed: {
            y: "-0.2rem",
            scale: "0.96",
            transition: {
                ease: "inOut",
                duration: "0.3",
                type: "spring",
                delayChildren: 0.5,
            },
        },
    };

    return (
        <motion.div
            ref={scope}
            variants={buttonVariants}
            onClick={handleButtonClick}
            whileTap={"pressed"}
            style={{ scale: 1 }}
            className={cn(
                "bg-white rounded-xl border border-neutral-100 dark:bg-black dark:border-white/[0.2] hover:border-neutral-200 dark:hover:border-neutral-500 group/btn overflow-hidden relative flex items-center justify-center",
                className
            )}
        >
            {icon && iconPosition === "left" && <Icon icon={icon} />}
            <div className='relative z-40'>{children}</div>
            {icon && iconPosition === "right" && <Icon icon={icon} />}
        </motion.div>
    );
};
