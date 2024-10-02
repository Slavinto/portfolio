import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import ThemeToggleButton from "@/components/theme-toggle-button";
import { Suspense } from "react";
import Loading from "./loading";
import Home from "./page";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Slava's portfolio",
    description: "Modern and minimalistic portfolio for a web developer",
};

export default function RootLayout({
    children,
    menu,
}: Readonly<{
    children: React.ReactNode;
    menu: React.ReactNode;
}>) {
    return (
        <html lang='en' suppressHydrationWarning className=''>
            <body className={`${inter.className} h-full`}>
                <ThemeProvider attribute='class'>
                    <main className='relative px-4 w-full h-full flex flex-col text-foreground bg-background'>
                        <ThemeToggleButton />
                        {menu}
                        {children}
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
