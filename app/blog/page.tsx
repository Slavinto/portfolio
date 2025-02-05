"use client";
import { AnimatedCard } from "@/components/ui";
import { useRouter } from "next/navigation";
import React from "react";

const BlogPage = () => {
    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <AnimatedCard
                imagePath='/icons/android-chrome-192x192.png'
                headerText='This feature is being implemented'
                descriptionText='Please come back later'
                classNames='rounded-3xl w-full'
                routerPath={"/"}
            />
        </div>
    );
};

export default BlogPage;
