"use client";

import { uploadAvatar } from "@/actions/profile/updateAvatar";
import { ButtonsCard } from "@/components/ui";
import CustomInput from "@/components/ui/CustomInput";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import CustomButton from "@/components/ui/CustomButton";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

export default function AvatarUploader({
    prevPath,
    setAvatarPath,
}: {
    prevPath: string | null;
    setAvatarPath: Dispatch<SetStateAction<string | null>>;
}) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {}, [inputRef.current]);

    async function handleUpload() {
        if (!file) {
            toast.error("Please select a file to upload. 100KB max");
            return;
        }
        const { path } = await uploadAvatar(file);
        // const newAvatar = await getAvatarUrl(path);
        setAvatarPath(path);
        queryClient.invalidateQueries({
            queryKey: ["playerAvatar", prevPath],
        });
        console.log("setting avatar to: ", path);
    }

    return (
        <div className='text-muted-foreground flex flex-col gap-4 max-w-64'>
            <CustomInput
                ref={inputRef}
                type='file'
                classNames='hidden'
                accept='image/*'
                handler={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <CustomButton handler={() => inputRef.current?.click()}>
                Select file
            </CustomButton>
            <CustomInput
                disabled={true}
                classNames='text-muted-foreground !bg-muted'
                value={file?.name ?? "No files selected"}
                // placeholder='Selected file'
            />
            <ButtonsCard onClick={handleUpload} className='px-4 py-2'>
                Upload
            </ButtonsCard>
        </div>
    );
}
