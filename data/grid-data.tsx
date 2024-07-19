import { LuBook } from "react-icons/lu";
import { FaReact } from "react-icons/fa";
import { BsBinoculars } from "react-icons/bs";
import { SiGraphql } from "react-icons/si";
import { RiTailwindCssLine, RiNextjsLine } from "react-icons/ri";

import { motion } from "framer-motion";
import Image from "next/image";

const HeaderOne = () => {
    return <div className=''></div>;
};

const techStackItems = [
    {
        id: 1,
        icon: <RiNextjsLine className='w-6 h-6' />,
    },
    {
        id: 2,
        icon: <RiTailwindCssLine className='w-6 h-6' />,
    },
    {
        id: 3,
        icon: <SiGraphql className='w-6 h-6' />,
    },
];

export const gridItems = [
    {
        id: 1,
        title: "Understand the problem",
        description: (
            <span className='text-sm'>
                I prioritize analytical thinking, which helps to find the best
                solution for the problem
            </span>
        ),
        header: <HeaderOne />,
        className: "relative z-10",
        icon: <LuBook className='h-6 w-6 text-neutral-500' />,
    },
    {
        id: 2,
        title: "Detailed approach",
        description: (
            <span className='text-sm'>
                I pay attention to detail - this is important for quality code
            </span>
        ),
        header: <HeaderOne />,
        className: "relative z-10",
        icon: <BsBinoculars className='h-6 w-6 text-neutral-500' />,
    },
    {
        id: 3,
        title: "My tech stack",
        description: (
            <span className='text-sm max-w-56'>
                I strive to learn something new every day
            </span>
        ),
        header: (
            <div className='flex center-absolute items-center justify-center'>
                <div className='flex'>
                    {techStackItems.map(({ id, icon }) => (
                        <div
                            key={id}
                            className={`${
                                id !== 1 ? "-ml-1 " : ""
                            }p-2 rounded-full border-2 dark:border-white-100 border-black-400 dark:icon-bg bg-primary-foreground`}
                        >
                            {icon}
                        </div>
                    ))}
                </div>
            </div>
        ),
        className: "md:col-span-2 md:row-span-2 z-10",
        icon: <FaReact className='h-6 w-6 text-neutral-500' />,
    },
    {
        id: 4,
        title: "Understand the problem",
        description: (
            <span className='text-sm'>
                I prioritize analytical thinking, which helps to find the best
                solution for the problem
            </span>
        ),
        header: <HeaderOne />,
        className: "md:col-span-3 md:row-span-2 relative z-10",
        icon: <LuBook className='h-6 w-6 text-neutral-500' />,
    },
];
