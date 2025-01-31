import { BsFiletypeScss } from "react-icons/bs";
import { FaJs, FaPython, FaJava, FaPhp, FaRust, FaHtml5 } from "react-icons/fa";
import { SiTypescript, SiSharp, SiGo, SiSwift, SiRuby } from "react-icons/si";

const languageIcons: Record<string, JSX.Element> = {
    JavaScript: <FaJs className='text-yellow-500 size-10' fill='white' />,
    HTML: <FaHtml5 className='text-blue-900 size-10' fill='white' />,
    SCSS: <BsFiletypeScss className='text-rose-600 size-10' fill='white' />,
    TypeScript: <SiTypescript className='text-blue-500 size-10' fill='white' />,
    Python: <FaPython className='text-blue-400 size-10' fill='white' />,
    Java: <FaJava className='text-red-600 size-10' fill='white' />,
    PHP: <FaPhp className='text-purple-600 size-10' fill='white' />,
    Rust: <FaRust className='text-orange-600 size-10' fill='white' />,
    CSharp: <SiSharp className='text-purple-500 size-10' fill='white' />,
    Go: <SiGo className='text-blue-500 size-10' fill='white' />,
    Swift: <SiSwift className='text-orange-500 size-10' fill='white' />,
    Ruby: <SiRuby className='text-red-500 size-10' fill='white' />,
};

export function getLanguageIcon(language: string | null) {
    return language && languageIcons[language] ? languageIcons[language] : null;
}
