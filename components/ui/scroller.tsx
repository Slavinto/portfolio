"use client";

import { motion, useScroll } from "framer-motion";

const Scroller = () => {
    const { scrollYProgress } = useScroll();

    return (
        <motion.div
            className='btn-gradient dark:btn-gradient-light w-full h-[2px] fixed top-0 z-[1000]'
            style={{ scaleX: scrollYProgress }}
        />
    );
};

export default Scroller;
