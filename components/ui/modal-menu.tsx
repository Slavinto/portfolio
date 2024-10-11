"use client";
import React from "react";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalTrigger,
} from "@/components/ui/animated-modal";
import ModalMenuButton from "./modal-menu-button";
import MenuItems from "./menu-items";

const ModalMenu = () => {
    return (
        <Modal>
            <ModalTrigger>
                {/* just a button component with styles */}
                <ModalMenuButton />
            </ModalTrigger>
            <ModalBody className='w-full sm:rounded-xl sm:max-w-[50%] lg:max-w-[40%] xl:max-w-[30%] max-h-[30%] md:max-h-[50%] items-center'>
                <ModalContent>
                    <MenuItems />
                </ModalContent>
            </ModalBody>
        </Modal>
    );
};

export default ModalMenu;
