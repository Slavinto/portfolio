"use client";

import { motion } from "framer-motion";
import { menuItems } from "@/data";
import { useRouter } from "next/navigation";
import { useModal } from "./animated-modal";

const MenuItems = () => {
    const router = useRouter();
    const { setOpen } = useModal();
    return (
        <motion.div className='flex flex-col gap-4 lg:gap-8 justify-center'>
            {menuItems.map(({ id, sectionId, url, title, icon }) => (
                <motion.div
                    onClick={() => {
                        const el = document.getElementById(sectionId);
                        el ? el.scrollIntoView() : router.push(url);
                        setOpen(false);
                    }}
                    animate={{}}
                    className='menu-item cursor-pointer flex gap-2 items-center uppercase text-3xl lg:text-4xl xl:text-5xl'
                    key={id}
                >
                    <motion.div>{icon}</motion.div>
                    <motion.div>{title}</motion.div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default MenuItems;
