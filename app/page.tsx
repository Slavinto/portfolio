"use client";
import { Grid } from "@/components/grid";
import Hero from "@/components/hero";
import ThemeToggleButton from "@/components/theme-toggle-button";

export default function Home() {
    return (
        <main className='relative px-4 w-full h-full flex flex-col text-foreground bg-background'>
            <ThemeToggleButton />
            <Hero />
            <Grid />
        </main>
    );
}
