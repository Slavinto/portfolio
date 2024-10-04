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
            <head>
                <link
                    rel='apple-touch-icon'
                    sizes='180x180'
                    href='/apple-touch-icon.png'
                />
                <link
                    rel='icon'
                    type='image/png'
                    sizes='32x32'
                    href='/favicon-32x32.png'
                />
                <link
                    rel='icon'
                    type='image/png'
                    sizes='16x16'
                    href='/favicon-16x16.png'
                />
                <link rel='manifest' href='/site.webmanifest' />
            </head>
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
