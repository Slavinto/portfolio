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
        <div className='border-common flex items-center p-2 gap-1 xs:gap-4 2xs:p-2 sm:p-4 rounded-xl'>
            {<div className='text-middle'>{icon ?? <></>}</div>}
            <div className='flex items-center flex-col gap-1 xs:gap-2'>
                <UserAvatar
                    className='!w-6 !h-6 md:!w-8 md:!h-8'
                    url={playerAvatar}
                />
                <span className='text-middle'>{playerName}</span>
            </div>
        </div>
    );
};

export default PlayerCard;
