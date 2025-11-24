import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import ThemeToggleButton from "@/components/ui/buttons/theme-toggle-button";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import QueryProvider from "@/features/reactQuery/queryProvider";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    weight: ["300", "400", "500", "600", "700", "800"],
    subsets: ["latin"],
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
                {/* <link rel='manifest' href='/site.webmanifest' /> */}
            </head>
            {/* className={`${poppins.className} h-full`} */}
            <body className={`${poppins.variable} h-screen`}>
                <QueryProvider>
                    <ThemeProvider
                        attribute='class'
                        defaultTheme='system'
                        enableSystem={true}
                    >
                        <main className='font-poppins relative px-4 w-full flex flex-col flex-grow text-foreground bg-background'>
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
