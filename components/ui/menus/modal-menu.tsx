"use client";

import {
    ModalTrigger,
    ModalBody,
    ModalContent,
} from "@/components/ui/animated-modal";
import ModalMenuButton from "./modal-menu-button";
import MenuItems from "./menu-items";

export default function ModalMenu() {
    return (
        <>
            <ModalTrigger>
                <ModalMenuButton />
            </ModalTrigger>

            <ModalBody className='w-full xs:max-w-[50%]'>
                <ModalContent>
                    <MenuItems />
                </ModalContent>
            </ModalBody>
        </>
    );
}
