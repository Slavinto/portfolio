import { ButtonsCard } from "@/components/ui";
import { FC } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { Bounce, toast } from "react-toastify";

export const ToastModal = (
    onConfirm: () => void,
    options?: { message?: string; onDecline?: () => void }
) => {
    toast(
        <ModalToast
            onConfirm={onConfirm}
            onDecline={options?.onDecline}
            message={options?.message}
        />,
        {
            position: "top-center",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            transition: Bounce,
            toastId: "modal-toast",
        }
    );
    return null;
};

const ModalToast = ({
    onConfirm,
    onDecline,
    message,
}: {
    onConfirm: () => void;
    onDecline?: () => void;
    message?: string;
}) => {
    return (
        <div className='flex flex-col items-center gap-2'>
            <div className='flex gap-4 items-center'>
                <FaQuestionCircle className='text-5xl mb-2' />
                <p className='mb-2 font-medium p-2'>
                    {message ? message : "Are you sure you want to proceed?"}
                </p>
            </div>
            <div className='flex gap-2'>
                <ButtonsCard
                    onClick={() => {
                        onConfirm();
                        toast.dismiss("modal-toast");
                    }}
                    className='px-4 py-2 cursor-pointer'
                >
                    Confirm
                </ButtonsCard>
                <ButtonsCard
                    className='px-4 py-2 cursor-pointer'
                    onClick={() => {
                        onDecline?.();
                        toast.dismiss("modal-toast");
                    }}
                >
                    Decline
                </ButtonsCard>
            </div>
        </div>
    );
};
