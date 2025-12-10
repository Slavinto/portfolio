import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { getAvatarUrl } from "@/app/profile/getAvatarUrl";
import UserAvatar from "@/app/profile/UserAvatar";
import React, { ReactNode, useEffect, useState } from "react";

type PlayerCardProps = {
    // isPlayer: boolean;
    playerId: string | null;
    icon?: ReactNode;
};

const PlayerCard = ({ playerId, icon }: PlayerCardProps) => {
    const { state } = useChessGamePageContext();
    const [playerAvatar, setPlayerAvatar] = useState<string | null>(null);
    const [playerName, setPlayerName] = useState<string | null>(null);

    useEffect(() => {
        const player =
            state?.player?.id === playerId
                ? state?.player
                : state?.opponent?.id === playerId
                ? state?.opponent
                : null;

        setPlayerName(player?.username ?? "Unknown");

        if (!player) {
            return;
        }
        const initUrls = async () => {
            const avatar = await getAvatarUrl(player.avatar ?? null);
            setPlayerAvatar(avatar);
        };
        initUrls();
    }, [playerId]);

    return (
        <div className='border-common flex items-center gap-4 p-4 rounded-xl'>
            {<span className='text-3xl'>{icon ?? <></>}</span>}
            <div className='flex items-center flex-col'>
                <UserAvatar className='!w-8 !h-8' url={playerAvatar} />
                <span className='text-sm'>{playerName}</span>
            </div>
        </div>
    );
};

export default PlayerCard;
