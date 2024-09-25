import { RiHome6Line } from "react-icons/ri";
import { FaRegAddressBook } from "react-icons/fa6";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { BsJournalRichtext } from "react-icons/bs";
import { IoPersonOutline } from "react-icons/io5";

export const menuItems = [
    {
        id: 1,
        title: "Home",
        url: "hero",
        icon: <RiHome6Line />,
    },
    {
        id: 2,
        title: "About",
        url: "about",
        icon: <IoPersonOutline />,
    },
    {
        id: 3,
        title: "Projects",
        url: "my-projects",
        icon: <LiaProjectDiagramSolid />,
    },
    {
        id: 4,
        title: "Blog",
        url: "blog",
        icon: <BsJournalRichtext />,
    },
];
