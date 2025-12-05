// components/ui/TruncatedText.tsx
"use client";

import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export default function TruncatedText({
    children,
    className = "",
    ...rest
}: Props) {
    return (
        <div
            className={`min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap ${className}`}
            {...rest}
        >
            {children}
        </div>
    );
}
