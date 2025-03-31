"use client";

import Image from "next/image";
import { Tabs } from "./Tabs";
import { useTabsTheme } from "./useTabsTheme";
import { ReactNode } from "react";
import { ProjectTabsConstants } from "@/types/interfaces";
import { tabsDataWildOasisProject } from "@/types/constants";

function Tab({ title, children }: { title: string; children: ReactNode }) {
    const { tabsTheme } = useTabsTheme();

    return (
        <div
            className={`w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white  header-gradient-${tabsTheme}`}
        >
            <p>{title}</p>
            {children}
        </div>
    );
}

const BackgroundImage = ({ imageName }: { imageName: string }) => {
    const { tabsTheme } = useTabsTheme();

    return (
        <Image
            src={`/images/${imageName}-${tabsTheme}.jpg`}
            alt='tab background image'
            width='1000'
            height='1000'
            className='object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto'
        />
    );
};

const generateTabsObjects = (tabsData: ProjectTabsConstants[]) => {
    return tabsData.map(({ title, value, imageName }) => ({
        title,
        value,
        content: (
            <Tab title={title.toUpperCase()}>
                <BackgroundImage imageName={imageName} />
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
        <div className='h-[20rem] md:h-[43rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-40'>
            <Tabs tabs={generateTabsObjects(tabsData)} />
        </div>
    );
}
