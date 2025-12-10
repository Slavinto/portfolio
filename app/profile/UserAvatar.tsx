import React from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import Image from "next/image";

const UserAvatar = ({
    url,
    className,
}: {
    className?: string;
    url: string | null;
}) => {
    console.log({ url });
    return url ? (
        <div
            className={`overflow-hidden w-20 h-20 rounded-full object-cover border-common ${
                className ?? ""
            }`}
        >
            <Image alt='user avatar image' width={72} height={72} src={url} />
        </div>
    ) : (
        <FaRegCircleUser
            className={`w-20 h-20 object-cover ${className ?? ""}`}
        />
    );
};

export default UserAvatar;
