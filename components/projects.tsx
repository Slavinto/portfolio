import React from "react";
import { motion } from "framer-motion";
import { tabsDataWildOasisProject } from "@/types/constants";
import { Headings } from "@/types/enums";
import { Heading } from "./ui";
import { CustomTabs } from "./ui/tabs/CustomTabs";

const Projects = () => {
    return (
        <section id='my-projects' className='py-[12.5rem] h-screen'>
            <motion.div initial='hidden' whileInView='visible'>
                <Heading as={Headings.H3}>Recent Projects</Heading>
                <CustomTabs tabsData={tabsDataWildOasisProject} />
            </motion.div>
        </section>
    );
};

export default Projects;
