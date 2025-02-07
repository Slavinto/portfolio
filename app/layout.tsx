import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import ThemeToggleButton from "@/components/theme-toggle-button";
import localFont from "next/font/local";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import QueryProvider from "@/features/reactQuery/queryProvider";
const poppins = localFont({
    src: [
        {
            path: "../public/fonts/Poppins-Light.ttf",
            weight: "300",
            style: "normal",
        },
        {
            path: "../public/fonts/Poppins-Regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../public/fonts/Poppins-Medium.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "../public/fonts/Poppins-Semibold.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../public/fonts/Poppins-Bold.ttf",
            weight: "700",
            style: "normal",
        },
        {
            path: "../public/fonts/Poppins-ExtraBold.ttf",
            weight: "800",
            style: "normal",
        },
    ],
    variable: "--font-poppins",
});

// Poppins({ weight: ["300", "400", "500"], subsets: ["latin"] });

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
                    href='/icons/apple-touch-icon.png'
                />
                <link
                    rel='icon'
                    type='image/png'
                    sizes='32x32'
                    href='/icons/favicon-32x32.png'
                />
                <link
                    rel='icon'
                    type='image/png'
                    sizes='16x16'
                    href='/icons/favicon-16x16.png'
                />
                <link rel='manifest' href='/site.webmanifest' />
            </head>
            {/* className={`${poppins.className} h-full`} */}
            <body className={`${poppins.variable} h-screen`}>
                <QueryProvider>
                    <ThemeProvider attribute='class'>
                        <main className='font-poppins relative px-4 w-full flex flex-col text-foreground bg-background'>
                            <ThemeToggleButton />
                            {menu}
                            {children}
                        </main>
                    </ThemeProvider>
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryProvider>
            </body>
        </html>
    );
}
