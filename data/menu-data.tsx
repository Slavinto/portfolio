import { RiHome6Line } from "react-icons/ri";
import { FaRegAddressBook } from "react-icons/fa6";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { BsJournalRichtext } from "react-icons/bs";
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
        url: "/",
        icon: <LiaProjectDiagramSolid />,
    },
    {
        id: 4,
        title: "Blog",
        sectionId: "blog",
        url: "/blog",
        icon: <BsJournalRichtext />,
    },
];
