import { ProjectTabsConstants } from "./interfaces";

// colors for react-toastify
export const contextClass = {
    success: "bg-blue-600",
    error: "bg-red-600",
    info: "bg-gray-600",
    warning: "bg-orange-400",
    default: "bg-indigo-600",
    dark: "bg-white-600 font-gray-300",
};

export const tabsDataWildOasisProject: ProjectTabsConstants[] = [
    {
        title: "Wild Oasis App | dashboard",
        value: "dashboard",
        imageName: "wild-oasis-dashboard",
        hasTheme: true,
    },
    {
        title: "Wild Oasis App | cabins",
        value: "cabins",
        imageName: "wild-oasis-cabins",
        hasTheme: true,
    },
    {
        title: "Wild Oasis App | users management",
        value: "users",
        imageName: "wild-oasis-users",
        hasTheme: true,
    },
];
export const tabsDataWildOasisWebsiteProject: ProjectTabsConstants[] = [
    {
        title: "Wild Oasis Website | homepage",
        value: "website-homepage",
        imageName: "wild-oasis-website-home",
    },
    {
        title: "Wild Oasis Website | cabins",
        value: "website-cabins",
        imageName: "wild-oasis-website-cabins",
    },
    {
        title: "Wild Oasis Website | reserve cabin",
        value: "website-reservation",
        imageName: "wild-oasis-website-reservation",
    },
];
