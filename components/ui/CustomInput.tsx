import React from "react";

export type CustomInputType = "text" | "email" | "password";

type CustomInputProps = {
    value: string;
    id?: string;
    handler?: React.ChangeEventHandler<HTMLInputElement>;
    classNames?: string;
    name?: string;
    placeholder?: string;
    required?: boolean;
    type?: CustomInputType;
};

const CustomInput = ({
    value,
    id = "",
    handler,
    classNames = "",
    name = "",
    placeholder = "Type a message…",
    required = false,
    type = "text",
}: CustomInputProps) => {
    return (
        <input
            className={`flex-1 px-2 py-1 bg-white rounded-xl border border-neutral-100 
                dark:bg-black dark:border-white/[0.2] 
                hover:border-neutral-200 dark:hover:border-neutral-500 
                ring-0 outline-none ${classNames}`}
            id={id}
            value={value}
            onChange={handler}
            required={required}
            placeholder={placeholder}
            type={type}
            name={name}
        />
    );
};

export default CustomInput;
