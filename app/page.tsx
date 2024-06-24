"use client";
import Hero from "@/components/hero";
import ThemeToggleButton from "@/components/theme-toggle-button";

export default function Home() {
    return (
        <main className='relative px-4 pt-[150px] w-full h-screen flex flex-col background text-foreground'>
            <ThemeToggleButton />
            <Hero />
        </main>
    );
}
