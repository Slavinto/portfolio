"use client";
import React from "react";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalTrigger,
} from "@/components/ui/animated-modal";
import FramerMenu from "./modal-menu-button";
import MenuItems from "./menu-items";

const ModalMenu = () => {
    return (
        <Modal>
            <ModalTrigger>
                {/* just a button component with styles */}
                <FramerMenu />
            </ModalTrigger>
            <ModalBody className='w-full md:max-w-[50%] lg:max-w-[40%] xl:max-w-[30%] max-h-[30%] md:max-h-[50%] items-center'>
                <ModalContent className='justify-center md:p-[6.5rem] lg:p-[9rem]'>
                    <MenuItems />
                </ModalContent>
            </ModalBody>
        </Modal>
    );
};

export default ModalMenu;
