import { RiHome6Line } from "react-icons/ri";
import { VscGithubAlt } from "react-icons/vsc";
import { IoPersonOutline } from "react-icons/io5";

export const menuItems = [
    {
        id: 1,
        title: "Home",
        sectionId: "hero",
        url: "/",
        icon: <RiHome6Line />,
    },
    {
        id: 2,
        title: "About",
        sectionId: "about",
        url: "/",
        icon: <IoPersonOutline />,
    },
    {
        id: 3,
        title: "Projects",
        sectionId: "my-projects",
        url: "https://github.com/Slavinto?tab=repositories",
        icon: <VscGithubAlt />,
    },
    // {
    //     id: 4,
    //     title: "Blog",
    //     sectionId: "blog",
    //     url: "/blog",
    //     icon: <BsJournalRichtext />,
    // },
    // {
    //     id: 5,
    //     title: "Test",
    //     sectionId: "test",
    //     url: "/just-for-test-route",
    //     icon: <BsJournalRichtext />,
    // },
];
