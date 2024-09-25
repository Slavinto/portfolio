"use client";
import { Scroller } from "@/components/ui";
import React from "react";

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Scroller />
            {children}
        </>
    );
};

export default BlogLayout;
