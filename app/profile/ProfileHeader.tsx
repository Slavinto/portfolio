import { IPlayer } from "@/types/interfaces";
import { useState } from "react";
import AvatarUploader from "./AvatarUploader";
import UserAvatar from "./UserAvatar";
import { usePlayerAvatar } from "@/hooks/usePlayerAvatar";

export default function ProfileHeader({ player }: { player: IPlayer }) {
    const [avatarPath, setAvatarPath] = useState<string | null>(
        player.avatar_url
    );
    const { data, isLoading, error } = usePlayerAvatar(avatarPath);
    if (isLoading || error) {
        return null;
    }

    return (
        <div className='flex flex-col items-center gap-12 max-w-64'>
            <UserAvatar url={data?.playerAvatar ?? null} />
            <AvatarUploader
                prevPath={avatarPath}
                setAvatarPath={setAvatarPath}
            />
        </div>
    );
}
