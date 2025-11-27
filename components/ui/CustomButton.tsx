import { cn } from "@/utils/cn";
import React, { ReactNode } from "react";
export type CustomButtonType = "button" | "submit";

type CustomButtonProps = {
    children: ReactNode;
    classNames?: string;
    disabled?: boolean;
    type?: CustomButtonType;
    handler?: () => void;
};
const CustomButton = ({
    children,
    classNames,
    disabled = false,
    type = "button",
    handler,
}: CustomButtonProps) => {
    return (
        <button
            disabled={disabled}
            type={type}
            onClick={handler}
            className={cn(
                "px-4 py-2 cursor-pointer bg-white rounded-xl border border-neutral-100 dark:bg-black dark:border-white/[0.2] hover:border-neutral-200 dark:hover:border-neutral-500 group/btn overflow-hidden relative flex items-center justify-center",
                classNames
            )}
        >
            {children}
        </button>
    );
};

export default CustomButton;
