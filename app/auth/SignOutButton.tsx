"use client";

import React from "react";
import { ButtonsCard, Heading } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/components/ui/animated-modal";
import { Headings } from "@/types/enums";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { usePathname, useRouter } from "next/navigation";

const SignOutButton = () => {
    const { setOpen } = useModal();
    const supabase = createClient();
    const queryClient = useQueryClient();
    const router = useRouter();
    const path = usePathname();

    return (
        <ButtonsCard
            onClick={() => {
                queryClient.invalidateQueries({
                    queryKey: ["user"],
                });
                queryClient.invalidateQueries({
                    queryKey: ["userGames"],
                });
                setOpen(false);
                supabase.auth.signOut();

                if (path !== "/") {
                    router.push("/");
                }
            }}
            key={Math.random()}
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
    );
};

export default SignOutButton;
