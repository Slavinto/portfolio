import { RiHome6Line } from "react-icons/ri";
import { VscGithubAlt } from "react-icons/vsc";
import { FaChess, FaRegQuestionCircle, FaRegUserCircle } from "react-icons/fa";
import { ButtonsCard, Heading } from "@/components/ui";
import { Headings } from "@/types/enums";

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
                icon={
                    <Heading as={Headings.H4}>
                        <RiHome6Line />
                    </Heading>
                }
            >
                <Heading as={Headings.H4}>Home</Heading>
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
                icon={
                    <Heading as={Headings.H4}>
                        <FaRegQuestionCircle />
                    </Heading>
                }
            >
                <Heading as={Headings.H4}>About</Heading>
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
                icon={
                    <Heading as={Headings.H4}>
                        <VscGithubAlt />
                    </Heading>
                }
            >
                <Heading as={Headings.H4}>Projects</Heading>
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
                icon={
                    <Heading as={Headings.H4}>
                        <FaRegUserCircle />
                    </Heading>
                }
            >
                <Heading as={Headings.H4}>Sign&nbsp;In</Heading>
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
                icon={
                    <Heading as={Headings.H4}>
                        <FaChess />
                    </Heading>
                }
            >
                <Heading as={Headings.H4}>Play&nbsp;some&nbsp;chess</Heading>
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
