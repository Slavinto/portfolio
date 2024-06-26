"use client";
import Hero from "@/components/hero";
import ThemeToggleButton from "@/components/theme-toggle-button";

export default function Home() {
    return (
        <main className='relative px-4 w-full h-screen flex flex-col text-foreground bg-background'>
            <ThemeToggleButton />
            <Hero />
        </main>
    );
}
