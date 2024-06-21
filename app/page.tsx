"use client";
import Hero from "@/components/hero";
import { BackgroundGradient } from "@/components/ui/background-gradient";

export default function Home() {
    return (
        <main className='px-4 py-8 w-full h-screen flex flex-col bg-blue-600'>
            <Hero />
        </main>
    );
}
