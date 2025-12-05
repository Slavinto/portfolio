import { RiHome6Line } from "react-icons/ri";
import { VscGithubAlt } from "react-icons/vsc";
import { FaChess, FaRegQuestionCircle, FaRegUserCircle } from "react-icons/fa";
import { ButtonsCard } from "@/components/ui";

export const menuItems = [
    {
        id: 1,
        title: "",
        sectionId: "hero",
        url: "/",
        icon: (
            <ButtonsCard
                iconPosition='left'
                className='flex p-8 gap-4 w-full'
                icon={<RiHome6Line />}
            >
                Home
            </ButtonsCard>
        ),
    },
    {
        id: 2,
        title: "",
        sectionId: "about",
        url: "/",
        icon: (
            <ButtonsCard
                iconPosition='left'
                className='flex p-8 gap-4 w-full'
                icon={<FaRegQuestionCircle />}
            >
                About
            </ButtonsCard>
        ),
    },
    {
        id: 3,
        title: "",
        sectionId: "my-projects",
        url: "https://github.com/Slavinto?tab=repositories",
        icon: (
            <ButtonsCard
                iconPosition='left'
                className='flex p-8 gap-4 w-full'
                icon={<VscGithubAlt />}
            >
                Projects
            </ButtonsCard>
        ),
    },
    {
        id: 4,
        title: "",
        sectionId: "profile",
        url: "/auth/login",
        icon: (
            <ButtonsCard
                iconPosition='left'
                className='flex p-8 gap-4 w-full'
                icon={<FaRegUserCircle />}
            >
                Sign&nbsp;In
            </ButtonsCard>
        ),
    },
    {
        id: 5,
        title: "",
        sectionId: "chess",
        url: "/chess/",
        icon: (
            <ButtonsCard
                iconPosition='left'
                className='flex p-8 gap-4 w-full overflow-ellipsis'
                icon={<FaChess />}
            >
                Play&nbsp;some&nbsp;chess
            </ButtonsCard>
        ),
    },

    // {
    //     id: 5,
    //     title: "Test",
    //     sectionId: "test",
    //     url: "/just-for-test-route",
    //     icon: <BsJournalRichtext />,
    // },
];
