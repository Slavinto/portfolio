"use client";
import Footer from "@/components/footer";
import { Grid } from "@/components/grid";
import Hero from "@/components/hero";
import MenuButton from "@/components/learn-framer-motion";
import ThemeToggleButton from "@/components/theme-toggle-button";

export default function Home() {
    return (
        <main className='relative px-4 w-full h-full flex flex-col text-foreground bg-background'>
            <MenuButton />
            <ThemeToggleButton />
            <Hero />
            <Grid />
            <Footer />
        </main>
    );
}
