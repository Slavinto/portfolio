import React, { MutableRefObject } from "react";

export type CustomInputType = "text" | "email" | "password" | "file";

type CustomInputProps = {
    defaultValue?: string | number;
    accept?: string;
    value?: string | number;
    id?: string;
    handler?: React.ChangeEventHandler<HTMLInputElement>;
    classNames?: string;
    disabled?: boolean;
    name?: string;
    onPaste?: React.ClipboardEventHandler<HTMLInputElement>;
    placeholder?: string;
    ref?: MutableRefObject<HTMLInputElement | null>;
    required?: boolean;
    type?: CustomInputType;
};

const CustomInput = ({
    accept,
    defaultValue,
    disabled,
    value,
    id,
    handler,
    classNames,
    name,
    onPaste,
    placeholder = "Type a message…",
    ref,
    required = false,
    type = "text",
}: CustomInputProps) => {
    console.log({ ValueInCustomInput: value });
    return (
        <input
            accept={accept}
            className={`flex-1 text-muted-foreground px-4 py-2 bg-white rounded-xl border-common ring-0 outline-none ${classNames}`}
            id={id}
            defaultValue={defaultValue}
            disabled={disabled}
            value={value}
            onChange={handler}
            onPaste={onPaste}
            placeholder={placeholder}
            ref={ref}
            required={required}
            type={type}
            name={name}
        />
    );
};

export default CustomInput;
