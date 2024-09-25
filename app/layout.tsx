import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import MenuButton from "@/components/menu-button";
import ThemeToggleButton from "@/components/theme-toggle-button";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Slava's portfolio",
    description: "Modern and minimalistic portfolio for a web developer",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' suppressHydrationWarning className=''>
            <body className={`${inter.className} h-full`}>
                <ThemeProvider attribute='class'>
                    <main className='relative px-4 w-full h-full flex flex-col text-foreground bg-background'>
                        <ThemeToggleButton />
                        <MenuButton />
                        {children}
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
