import React from "react";
import { motion } from "framer-motion";

const Projects = () => {
    return (
        <section id='my-projects' className='pt-[12.5rem]'>
            <motion.div initial='hidden' whileInView='visible'>
                <h2 className='text-5xl'>Recent Projects</h2>
            </motion.div>
        </section>
    );
};

export default Projects;
