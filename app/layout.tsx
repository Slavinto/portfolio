import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import ThemeToggleButton from "@/components/ui/buttons/theme-toggle-button";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import QueryProvider from "@/features/reactQuery/queryProvider";
import { Poppins } from "next/font/google";
import GlobalModalProvider from "./modal-provider";
import ModalMenuButton from "@/components/ui/menus/modal-menu-button";
import ModalMenu from "@/components/ui/menus/modal-menu";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProfileButton from "@/components/ui/buttons/ProfileButton";

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

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

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
            <body className={`${poppins.variable} !h-full !w-full flex flex-1`}>
                <QueryProvider>
                    <ThemeProvider
                        attribute='class'
                        defaultTheme='system'
                        enableSystem={true}
                    >
                        <GlobalModalProvider>
                            <main className='font-poppins relative px-4 w-full flex flex-1 min-w-0 flex-col self-center text-foreground bg-background'>
                                <ThemeToggleButton />
                                <ModalMenu />
                                <ProfileButton />
                                {children}
                            </main>
                        </GlobalModalProvider>
                    </ThemeProvider>
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryProvider>
            </body>
        </html>
    );
}
