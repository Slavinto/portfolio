"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Tab = {
    title: string;
    value: string;
    content?: string | React.ReactNode | any;
};

export const Tabs = ({
    tabs: propTabs,
    containerClassName,
    activeTabClassName,
    tabClassName,
    contentClassName,
}: {
    tabs: Tab[];
    containerClassName?: string;
    activeTabClassName?: string;
    tabClassName?: string;
    contentClassName?: string;
}) => {
    const [active, setActive] = useState<Tab>(propTabs[0]);
    const [tabs, setTabs] = useState<Tab[]>(propTabs);

    const moveSelectedTabToTop = (idx: number) => {
        const newTabs = [...propTabs];
        const selectedTab = newTabs.splice(idx, 1);
        newTabs.unshift(selectedTab[0]);
        setTabs(newTabs);
        setActive(newTabs[0]);
    };

    const [hovering, setHovering] = useState(false);

    return (
        <>
            <div
                className={cn(
                    "flex flex-col flex-shrink-0 gap-2 lg:flex-row items-center justify-start [perspective:1000px] relative overflow-visible no-visible-scrollbar max-w-full w-full",
                    containerClassName
                )}
            >
                {propTabs.map((tab, idx) => (
                    <button
                        key={tab.title}
                        onClick={() => {
                            moveSelectedTabToTop(idx);
                        }}
                        onMouseEnter={() => setHovering(true)}
                        onMouseLeave={() => setHovering(false)}
                        className={cn(
                            "relative px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-xl w-full border-common",
                            tabClassName
                        )}
                        style={{
                            transformStyle: "preserve-3d",
                        }}
                    >
                        {active.value === tab.value && (
                            <motion.div
                                layoutId='clickedbutton'
                                transition={{
                                    type: "spring",
                                    bounce: 0.3,
                                    duration: 0.6,
                                }}
                                className={cn(
                                    "absolute inset-0 header-gradient-light dark:header-gradient-dark rounded-full ",
                                    activeTabClassName
                                )}
                            />
                        )}
                        <div className='line-clamp-1'>
                            <p className='whitespace-nowrap relative flex justify-between text-black dark:text-white'>
                                {tab.title}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
            <FadeInDiv
                tabs={tabs}
                active={active}
                key={active.value}
                hovering={hovering}
                className={cn("mt-[4.5rem] md:mt-12", contentClassName)}
            />
        </>
    );
};

export const FadeInDiv = ({
    className,
    tabs,
    hovering,
}: {
    className?: string;
    key?: string;
    tabs: Tab[];
    active: Tab;
    hovering?: boolean;
}) => {
    const isActive = (tab: Tab) => {
        return tab.value === tabs[0].value;
    };
    return (
        <div className='relative w-full h-full'>
            {tabs.map((tab, idx) => (
                <motion.div
                    key={tab.value}
                    layoutId={tab.value}
                    style={{
                        scale: 1 - idx * 0.1,
                        top: hovering ? idx * -50 : 0,
                        zIndex: -idx,
                        opacity: idx < 3 ? 1 - idx * 0.1 : 0,
                    }}
                    animate={{
                        y: isActive(tab) ? [0, 40, 0] : 0,
                    }}
                    className={cn(
                        "w-full h-full absolute top-0 left-0",
                        className
                    )}
                >
                    {tab.content}
                </motion.div>
            ))}
        </div>
    );
};
