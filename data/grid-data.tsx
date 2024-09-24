import { LuBook } from "react-icons/lu";
import { FaReact, FaCheck, FaRegCopy } from "react-icons/fa";
import { BsBinoculars } from "react-icons/bs";
import { SiGraphql } from "react-icons/si";
import { TbBrandTypescript } from "react-icons/tb";
import { RiTailwindCssLine, RiNextjsLine } from "react-icons/ri";

import { motion } from "framer-motion";
import Image from "next/image";
import { ButtonsCard } from "@/components/ui";
import { useState } from "react";

const HeaderOne = () => {
    return <div className=''></div>;
};

const HeaderThree = () => {
    return (
        <div className='flex items-center justify-center'>
            <div className='center-absolute'>
                <div className='flex transform hover:scale-110 transition duration-400'>
                    {techStackItems.map(({ id, icon }) => (
                        <div
                            key={id}
                            className={`${
                                id !== 1 ? "-ml-1 " : ""
                            }p-2 rounded-full border dark:border-white-100 border-black-400 dark:icon-bg-dark icon-bg-light invisible md:visible`}
                        >
                            {icon}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const HeaderFour = () => {
    const copy = <FaRegCopy className='size-5' />;
    const check = <FaCheck className='size-5' />;

    const text1 = "Copy My Email";
    const text2 = "Email Copied";

    const [icon, setIcon] = useState(copy);
    const [text, setText] = useState(text1);

    const handleCopy = () => {
        navigator.clipboard
            .writeText("slava3669@gmail.com")
            .then(() => {
                setIcon(check);
                setText(text2);
                setTimeout(() => {
                    setIcon(copy);
                    setText(text1);
                }, 500);
            })
            .catch((err) => {
                console.error("Error copying text to clipboard:", err);
            });
    };

    return (
        <div className='center-absolute'>
            <ButtonsCard
                onClick={handleCopy}
                icon={icon}
                iconPosition='left'
                className='w-48 md:w-[250px] lg:w-[400px] xl:w-[500px] h-[70px] lg:h-[140px] xl:h-[180px] dark:bg-transparent bg-transparent border themed-text-icons transform hover:-translate-y-1 transition duration-400'
            >
                <button className='p-2 rounded-lg font-bold themed-text-icons'>
                    {text}
                </button>
            </ButtonsCard>
        </div>
    );
};

const techStackItems = [
    {
        id: 1,
        icon: <RiNextjsLine stroke='#fff' className='responsive-icons' />,
    },
    {
        id: 2,
        icon: <RiTailwindCssLine className='responsive-icons' />,
    },
    {
        id: 3,
        icon: <TbBrandTypescript className='responsive-icons' />,
    },
];

export const gridItems = [
    {
        id: 1,
        title: <h4 className='grid-item-header'>Understand the problem</h4>,
        description: (
            <span className='grid-description-text'>
                I prioritize analytical thinking, which helps to find the best
                solution for the problem
            </span>
        ),
        header: <HeaderOne />,
        className: "relative z-10",
        icon: <LuBook className='responsive-icons' />,
    },
    {
        id: 2,
        title: <h4 className='grid-item-header'>Detailed approach</h4>,
        description: (
            <span className='grid-description-text'>
                I pay attention to detail - this is important for quality code
            </span>
        ),
        header: <HeaderOne />,
        className: "relative z-10",
        icon: <BsBinoculars className='responsive-icons text-neutral-500' />,
    },
    {
        id: 3,
        title: <h4 className='grid-item-header'>My tech stack</h4>,
        description: (
            <span className='grid-description-text max-w-56'>
                I strive to learn something new every day
            </span>
        ),
        header: <HeaderThree />,
        className: "md:col-span-2 md:row-span-2 z-10",
        icon: <FaReact className='responsive-icons text-neutral-500' />,
    },
    {
        id: 4,
        title: "",
        description: <></>,
        header: <HeaderFour />,
        className: "md:col-span-2 md:row-span-2 z-10",
        icon: <></>,
    },
];
