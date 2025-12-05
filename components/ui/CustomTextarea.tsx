import React, { MutableRefObject } from "react";

type CustomTextareaProps = {
    defaultValue?: string;
    value?: string;
    rows?: number;
    cols?: number;
    id?: string;
    handler?: React.ChangeEventHandler<HTMLTextAreaElement>;
    classNames?: string;
    name?: string;
    placeholder?: string;
    required?: boolean;
    ref?: MutableRefObject<HTMLTextAreaElement | null>;
};

const CustomTextarea = ({
    defaultValue,
    value,
    id,
    rows = 4,
    cols = 20,
    handler,
    classNames,
    name,
    placeholder = "Type a message…",
    ref,
    required = false,
}: CustomTextareaProps) => {
    return (
        <textarea
            className={`flex-1 text-muted-foreground px-4 py-2 bg-white rounded-xl border border-neutral-100 dark:bg-black dark:border-white/[0.2] hover:border-neutral-200 dark:hover:border-neutral-500 ring-0 outline-none ${classNames}`}
            id={id}
            rows={rows}
            ref={ref}
            cols={cols}
            defaultValue={defaultValue}
            value={value}
            onChange={handler}
            required={required}
            placeholder={placeholder}
            name={name}
        />
    );
};

export default CustomTextarea;
