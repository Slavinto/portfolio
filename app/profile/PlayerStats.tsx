import { Heading } from "@/components/ui";
import CustomInput from "@/components/ui/CustomInput";
import { Headings } from "@/types/enums";
import { IPlayer } from "@/types/interfaces";
import React from "react";

const PlayerStats = ({ player }: { player: IPlayer }) => {
    return (
        <div className='flex flex-col gap-4  max-w-64'>
            <Heading
                as={Headings.H3}
                classNames='text-muted-foreground text-2xl font-bold w-full'
            >
                Player&nbsp;Stats
            </Heading>
            <Heading
                as={Headings.H4}
                classNames='text-muted-foreground font-thin w-full'
            >
                Wins:
            </Heading>
            <CustomInput
                id={"player-wins"}
                disabled={true}
                classNames='text-muted-foreground !bg-muted'
                defaultValue={player.wins}
            />
            <Heading
                as={Headings.H4}
                classNames='text-muted-foreground font-thin w-full'
            >
                Losses:
            </Heading>{" "}
            <CustomInput
                id={"player-losses"}
                disabled={true}
                classNames='text-muted-foreground !bg-muted'
                defaultValue={player.losses}
            />
            <Heading
                as={Headings.H4}
                classNames='text-muted-foreground font-thin w-full'
            >
                Draws:
            </Heading>{" "}
            <CustomInput
                id={"player-draws"}
                disabled={true}
                classNames='text-muted-foreground !bg-muted'
                defaultValue={player.draws}
            />
        </div>
    );
};

export default PlayerStats;
