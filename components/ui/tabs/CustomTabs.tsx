"use client";

import Image from "next/image";
import { Tabs } from "./Tabs";
import { useTabsTheme } from "./useTabsTheme";
import { ReactNode } from "react";
import { ProjectTabsConstants } from "@/types/interfaces";
import Heading from "../text/Heading";
import { Headings } from "@/types/enums";

function Tab({ title, children }: { title: string; children: ReactNode }) {
    const { tabsTheme } = useTabsTheme();

    return (
        <div
            className={`pt-2 w-full border-common overflow-hidden relative h-full rounded-2xl text-xl md:text-4xl font-bold text-white header-gradient-${tabsTheme}`}
        >
            <Heading as={Headings.H4} classNames='text-muted-foreground'>
                {title}
            </Heading>
            {children}
        </div>
    );
}

const BackgroundImage = ({
    imageName,
    hasTheme,
}: {
    imageName: string;
    hasTheme: boolean;
}) => {
    const { tabsTheme } = useTabsTheme();

    if (!imageName || !tabsTheme) {
        return null;
    }

    return (
        <Image
            src={`/images/${
                hasTheme ? imageName + "-" + tabsTheme : imageName
            }.jpg`}
            alt='tab background image'
            width='1000'
            height='1000'
            className='w-[90%] sm:w-[85%] md:w-[80%] h-[92%] sm:h-[94%] md:h-[97%] object-contain object-left-top absolute -bottom-5 top-20 right-0 inset-x-0 rounded-xl mx-auto'
        />
    );
};

const generateTabsObjects = (tabsData: ProjectTabsConstants[]) => {
    return tabsData.map(({ title, value, imageName, hasTheme = false }) => ({
        title,
        value,
        content: (
            <Tab title={title.toUpperCase()}>
                <BackgroundImage imageName={imageName} hasTheme={hasTheme} />
            </Tab>
        ),
    }));
};

export function CustomTabs({ tabsData }: { tabsData: ProjectTabsConstants[] }) {
    const { tabsTheme, isThemeDark } = useTabsTheme();

    if (!tabsTheme) {
        return null;
    }

    return (
        <div className='h-[25rem] md:h-[43rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full items-start justify-start my-40'>
            <Tabs tabs={generateTabsObjects(tabsData)} />
        </div>
    );
}
