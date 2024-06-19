"use client";
import Hero from "@/components/hero";
import { BackgroundGradient } from "@/components/ui/background-gradient";

export default function Home() {
    return (
        <BackgroundGradient>
            <main className='px-4 py-8 w-full h-screen'>
                <Hero />
            </main>
        </BackgroundGradient>
    );
}
