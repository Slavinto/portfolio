"use client";

import React, { CSSProperties, useEffect, useState } from "react";
import { motion, stagger } from "framer-motion";
import { menuItems } from "@/data";
import { useSafeAnimate } from "@/utils/hooks";
import { useRouter, usePathname } from "next/navigation";

const MenuButton = () => {
    const router = useRouter();
    const [scope, animate] = useSafeAnimate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const staggerMenuItems = stagger(0.2, { startDelay: 0.15 });

    const closeMenu = async () => {
        await animate([
            [".s-item-1", menuItemVariants.menuCloseItem1, { at: 0.4 }],
            [".s-item-2", menuItemVariants.menuCloseItem2, { at: 0.5 }],
            [
                ".s-item-3",
                { ...menuItemVariants.menuCloseItem3, visibility: "visible" },
                { at: 0.6 },
            ],
        ]);

        // collapse menu wrapper
        animate([
            [
                ".menu-container",
                menuContainer.containerClose,
                transitions.menuTransition,
            ],
            [
                ".span-wrapper",
                menuWrapper.wrapperClose,
                { ...transitions.menuTransition, at: "-0.2" },
            ],
            [
                ".menu-items-container",
                menuContainer.menuItemsHide,
                menuContainer.menuItemsHide.transition,
            ],
        ]);
        // animate span items from center to initial positions
        await animate([
            [
                ".s-item-1",
                menuItemVariants.menuCloseItem1Initial,
                { ...transitions.spanTransition, type: "spring" },
            ],
            [
                ".s-item-2",
                menuItemVariants.menuCloseItem2Initial,
                { ...transitions.spanTransition, type: "spring" },
            ],
            [
                ".s-item-3",
                menuItemVariants.menuCloseItem3Initial,
                { ...transitions.spanTransition },
            ],
        ]);
    };

    const openMenu = async () => {
        //absolute positioning in the center
        await animate([
            [".s-item-1", menuVariants.menuOpen, transitions.spanTransition],
            [".s-item-2", menuVariants.menuOpen, transitions.spanTransition],
            [
                ".s-item-3",
                {
                    ...menuVariants.menuOpen,
                    visibility: "hidden",
                },
                { at: 0.1 },
            ],
        ]);

        // rotate span items on menu open animation
        animate([
            [
                ".s-item-1",
                menuItemVariants.menuOpenItem1,
                { ...transitions.spanTransition, type: "spring" },
            ],
            [
                ".s-item-2",
                menuItemVariants.menuOpenItem2,
                { ...transitions.spanTransition, type: "spring" },
            ],
            [
                ".s-item-3",
                menuItemVariants.menuOpenItem3,
                { ...transitions.spanTransition },
            ],
        ]);

        // open menu container and position wrapper
        animate([
            [
                ".menu-container",
                menuContainer.containerOpen,
                { duration: 0.2, at: 0.3 },
            ],
            [
                ".span-wrapper",
                menuWrapper.wrapperOpen,
                { ...transitions.menuTransition, at: "-0.2" },
            ],
            [
                ".menu-items-container",
                menuContainer.menuItemsShow,
                menuContainer.menuItemsShow.transition,
            ],
        ]);

        // show menu items with stagger
        animate([
            [
                ".menu-item",
                { opacity: 1 },
                { delay: isMenuOpen ? staggerMenuItems : 0 },
            ],
        ]);
    };

    const handleMenuClick = () => {
        setIsMenuOpen((prev) => !prev);
    };

    useEffect(() => {
        isMenuOpen ? openMenu() : closeMenu();
    }, [isMenuOpen]);

    const menuVariants = {
        menuOpen: {
            top: "1.25rem",
        },
    };

    const menuWrapper = {
        wrapperClose: {
            top: "0rem",
            right: "0rem",
        },
        wrapperOpen: {
            top: "0.5rem",
            right: "0.5rem",
        },
    };

    const menuContainer = {
        containerOpen: {
            // width: "20rem",
            width: "var(--width-to)",
            height: "var(--height-to)",
            borderWidth: "2px",
            transition: {
                duration: 0.2,
                at: 0.3,
            },
        },
        containerClose: {
            // width: "0rem",
            width: "var(--width-from)",
            height: "var(--height-from)",
            borderWidth: "0px",
        },
        menuItemsShow: {
            opacity: 1,
            display: "flex",
            y: "18px",
            transition: { at: "-0.2" },
        },
        menuItemsHide: {
            opacity: 0,
            display: "none",
            y: "-12px",
            transition: { at: "-0.2" },
        },
    };

    const menuItemVariants = {
        menuOpenItem1: {
            rotate: "45deg",
            y: "0.1rem",
        },
        menuOpenItem2: {
            y: "0.1rem",
            rotate: "-45deg",
        },
        menuOpenItem3: {
            // rotate: "45deg",
            // visibility: "hidden",
        },

        menuCloseItem1: {
            y: "0rem",
            rotate: "0deg",
        },
        menuCloseItem1Initial: {
            top: "0.75rem",
        },
        menuCloseItem2: {
            y: "0rem",
            rotate: "0deg",
        },
        menuCloseItem2Initial: {
            top: "1.25rem",
        },
        menuCloseItem3: {
            // visibility: "visible",
        },
        menuCloseItem3Initial: {
            top: "1.75rem",
        },
    };

    const transitions = {
        menuTransition: {
            duration: 0.3,
        },
        spanTransition: {
            duration: 0.5,
            at: 0.3,
        },
    };

    return (
        <motion.div ref={scope} className='fixed z-50 top-[5rem] right-4'>
            <motion.div
                variants={menuContainer}
                className='dark:bg-background bg-white dark:border-white/[0.2] flex justify-center relative rounded-lg menu-container'
                // style={{ width: "0rem", height: "0rem", borderWidth: "0px" }}
                style={
                    {
                        "--width-from": "0rem",
                        "--width-to": "20rem",
                        "--height-from": "0rem",
                        "--height-to": "40rem",
                    } as CSSProperties
                }
            >
                <motion.div
                    // animate={
                    //     isMenuOpen ? "menuItemsVisible" : "menuItemsHidden"
                    // }
                    initial={{ display: "none" }}
                    className='
                    menu-items-container
                     flex flex-col px-16 pt-6 gap-8 opacity-100'
                >
                    {menuItems.map(({ id, sectionId, url, title, icon }) => (
                        <motion.div
                            onClick={() => {
                                const el = document.getElementById(sectionId);
                                el ? el.scrollIntoView() : router.push(url);
                                setIsMenuOpen(false);
                            }}
                            animate={{}}
                            className='menu-item cursor-pointer flex gap-2 items-center uppercase text-3xl'
                            key={id}
                        >
                            <motion.div>{icon}</motion.div>
                            <motion.div>{title}</motion.div>
                        </motion.div>
                    ))}
                </motion.div>
                <motion.div
                    onClick={handleMenuClick}
                    style={{
                        top: "0rem",
                        right: "0rem",
                    }}
                    variants={menuWrapper}
                    className='dark:hover:border-neutral-500 hover:border-neutral-200 span-wrapper absolute dark:btn-gradient btn-gradient-light border-neutral-100 border-2 dark:border-white/[0.2] w-12 h-12 rounded-lg 
                    flex items-center justify-center cursor-pointer'
                >
                    <motion.div
                        variants={menuVariants}
                        className='span-container linear-mask w-full h-full flex flex-col items-end relative p-2'
                    >
                        <motion.span
                            variants={menuItemVariants}
                            transition={transitions.spanTransition}
                            style={{
                                width: "1.8rem",
                                height: "5%",
                                top: "0.75rem",
                                left: "0.5rem",
                            }}
                            className='span-item s-item-1 dark:bg-white-300 bg-black-200 absolute'
                        ></motion.span>
                        <motion.span
                            variants={menuItemVariants}
                            transition={transitions.spanTransition}
                            style={{
                                width: "1.8rem",
                                height: "5%",
                                top: "1.25rem",
                                left: "0.5rem",
                            }}
                            className='span-item s-item-2 dark:bg-white-300 bg-black-200 absolute'
                        ></motion.span>
                        <motion.span
                            variants={menuItemVariants}
                            transition={transitions.spanTransition}
                            style={{
                                width: "0.9rem",
                                height: "5%",
                                top: "1.75rem",
                                right: "0.5rem",
                            }}
                            className='span-item s-item-3 dark:bg-white-300 bg-black-200 absolute'
                        ></motion.span>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default MenuButton;
