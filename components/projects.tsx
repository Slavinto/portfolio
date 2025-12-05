import React from "react";
import { motion } from "framer-motion";
import {
    tabsDataWildOasisProject,
    tabsDataWildOasisWebsiteProject,
} from "@/types/constants";
import { Headings } from "@/types/enums";
import { Heading } from "./ui";
import { CustomTabs } from "./ui/tabs/CustomTabs";

const Projects = () => {
    return (
        <section
            id='my-projects'
            className='py-[12.5rem] content-container flex flex-col mx-auto'
        >
            <motion.div initial='hidden' whileInView='visible'>
                <Heading
                    as={Headings.H2}
                    classNames='uppercase font-black text-center !text-white-100 !text-3xl md:!text-4xl lg:!text-5xl xl:!text-6xl !leading[3rem] md:!leading[5rem] lg:!leading-[7rem] xl:!leading-[9rem]'
                >
                    Recent Projects
                </Heading>
                <CustomTabs tabsData={tabsDataWildOasisProject} />
                <CustomTabs tabsData={tabsDataWildOasisWebsiteProject} />
            </motion.div>
        </section>
    );
};

export default Projects;
