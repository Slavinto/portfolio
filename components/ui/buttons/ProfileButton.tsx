"use client";

import { FaRegUserCircle } from "react-icons/fa";

import { ButtonsCard } from "..";
import { useRouter } from "next/navigation";

const ProfileButton = () => {
    const router = useRouter();

    return (
        <ButtonsCard
            onClick={() => router.push("/profile")}
            className='cursor-pointer fixed z-50 lg:top-36 lg:right-4 right-36 top-4 border-2 rounded-xl w-12 h-12 flex items-center justify-center dark:btn-gradient btn-gradient-light'
            icon={<FaRegUserCircle className='w-8 h-8' />}
        />
    );
};
export default ProfileButton;
