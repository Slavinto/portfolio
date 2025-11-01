import React from "react";
import { ToastContainer } from "react-toastify";
import { contextClass } from "@/types/constants";

const CustomToastContainer = () => {
    return (
        <ToastContainer
            position='bottom-right'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick={true}
            toastClassName={(context) =>
                contextClass[context?.type || "default"] +
                " py-4 px-16 bg-white rounded-xl border border-neutral-100 dark:bg-black dark:border-white/[0.2] hover:border-neutral-200 dark:hover:border-neutral-500 group/btn overflow-hidden relative flex items-center justify-center"
            }
        />
    );
};

export default CustomToastContainer;
