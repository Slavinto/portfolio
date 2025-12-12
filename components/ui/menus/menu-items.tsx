"use client";

import { motion } from "framer-motion";
import { menuItems } from "@/data";
import { useRouter } from "next/navigation";
import { useModal } from "../animated-modal";
import { useUser } from "@/hooks/auth/useUser";
import { ButtonsCard } from "../buttons/tailwindcss-buttons";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import Heading from "../text/Heading";
import { Headings } from "@/types/enums";

const MenuItems = () => {
    const router = useRouter();
    const { data: user, isLoading } = useUser();
    const { setOpen } = useModal();
    const supabase = createClient();
    const queryClient = useQueryClient();

    return (
        <motion.div className='flex flex-col gap-4 lg:gap-8 justify-center px-0 xs:px-0 sm:px-2'>
            {menuItems.map(({ id, sectionId, url, title, icon }) => {
                return !isLoading && !!user?.id && sectionId === "profile" ? (
                    <ButtonsCard
                        onClick={() => {
                            supabase.auth.signOut();
                            queryClient.invalidateQueries({
                                queryKey: ["user"],
                            });
                            queryClient.invalidateQueries({
                                queryKey: ["userGames"],
                            });
                            setOpen(false);
                        }}
                        key={id}
                        iconPosition='left'
                        className='flex flex-1 p-8 w-full cursor-pointer gap-2 items-center uppercase'
                        icon={
                            <Heading as={Headings.H4}>
                                <FaArrowRightToBracket />
                            </Heading>
                        }
                    >
                        <Heading as={Headings.H4}>Sign Out</Heading>
                    </ButtonsCard>
                ) : (
                    <div
                        onClick={() => {
                            const el = document.getElementById(sectionId);
                            el ? el.scrollIntoView() : router.push(url);
                            setOpen(false);
                        }}
                        className='cursor-pointer !w-full flex flex-1 gap-2 items-center uppercase'
                        key={id}
                    >
                        {!!icon && icon}
                        {!!title && title}
                    </div>
                );
            })}
        </motion.div>
    );
};

export default MenuItems;
