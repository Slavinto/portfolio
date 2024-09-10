import { RiHome6Line } from "react-icons/ri";
import { FaRegAddressBook } from "react-icons/fa6";

export const menuItems = [
    { id: 1, title: "Home", url: "hero", icon: <RiHome6Line /> },
    { id: 2, title: "About", url: "about", icon: <FaRegAddressBook /> },
    {
        id: 3,
        title: "Projects",
        url: "my-projects",
        icon: <FaRegAddressBook />,
    },
];
