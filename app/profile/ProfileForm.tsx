"use client";

import { updatePlayerProfile } from "@/actions/profile/updatePlayerProfile";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import CustomInput from "../../components/ui/CustomInput";
import CustomButton from "../../components/ui/CustomButton";
import Heading from "../../components/ui/text/Heading";
import { Headings } from "@/types/enums";
import CustomTextarea from "../../components/ui/CustomTextarea";
import ChessGameSkeleton from "../../components/ui/patterns/ChessGameSkeleton";
import ProfileHeader from "./ProfileHeader";
import { toast } from "react-toastify";
import CustomToastContainer from "@/components/ui/CustomToastContainer";
import PlayerStats from "./PlayerStats";
import { usePlayers } from "@/hooks/games/usePlayers";

export default function ProfileForm({ user }: { user: User }) {
    const { data: players, isLoading } = usePlayers(user.id, null);

    const player = players?.player;
    const [bio, setBio] = useState<string>(player?.bio ?? "");
    const [username, setUsername] = useState<string>(player?.username ?? "");
    if (isLoading)
        return (
            <div className='w-full'>
                <ChessGameSkeleton repeatPattern={3} />
            </div>
        );
    if (!player || !player.bio || !player.username) {
        return null;
    }
    async function save() {
        if (!bio || !username) {
            toast.error("Please fill in your profile details");
            return;
        }
        await updatePlayerProfile({ bio, username });
    }
    console.log({ username });
    return (
        <>
            <CustomToastContainer />
            <div className='flex flex-col w-full text-center'>
                <Heading
                    as={Headings.H3}
                    classNames='text-muted-foreground text-2xl font-bold mb-4 w-full'
                >
                    {`${player.username}'s`}&nbsp;Profile
                </Heading>

                <div className='md:grid md:grid-cols-3 md:items-end gap-12 flex flex-col mt-8 items-center'>
                    <ProfileHeader player={player} />

                    <div className='flex flex-col gap-4  max-w-64'>
                        <CustomInput
                            classNames='w-full'
                            defaultValue={player?.username}
                            placeholder={username ?? "Set your username"}
                            handler={(e) => setUsername(e.target.value)}
                        />

                        <CustomTextarea
                            cols={40}
                            classNames='w-full'
                            defaultValue={player?.bio}
                            placeholder='Type in something about yourself'
                            handler={(e) => setBio(e.target.value)}
                        />

                        <CustomButton handler={save} classNames='w-full'>
                            Save
                        </CustomButton>
                    </div>
                    <PlayerStats player={player} />
                </div>
            </div>
        </>
    );
}
