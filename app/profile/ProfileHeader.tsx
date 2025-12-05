import { getAvatarUrl } from "@/app/profile/getAvatarUrl";
import { IPlayer } from "@/types/interfaces";
import { useEffect, useState } from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import AvatarUploader from "./AvatarUploader";

export default function ProfileHeader({ player }: { player: IPlayer }) {
    const [avatar, setAvatar] = useState<string | null>(null);

    useEffect(() => {
        const setUserAvatar = async () => {
            if (!avatar) {
                const avatar = await getAvatarUrl(player.avatar_url);
                setAvatar(avatar);
            }
        };
        setUserAvatar();
    }, [player.avatar_url]);

    return (
        <div className='flex flex-col items-center gap-12 max-w-64'>
            {avatar ? (
                <img
                    src={avatar}
                    className='w-20 h-20 rounded-full object-cover border-common'
                />
            ) : (
                <FaRegCircleUser className='w-20 h-20 object-cover' />
            )}
            <AvatarUploader setAvatar={setAvatar} />
        </div>
    );
}
