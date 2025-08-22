"use client";
import Footer from "@/components/footer";
import Projects from "@/components/projects";
import { HeroSkeleton } from "@/components/hero";
import dynamic from "next/dynamic";
import { GridSkeleton } from "@/components/grid";
import { ChessBoard } from "@/components/games/chess";

export default function Home() {
    const Hero = dynamic(() => import("@/components/hero"), {
        ssr: false,
        loading: () => <HeroSkeleton repeatPattern={3} />,
    });
    const Grid = dynamic(() => import("@/components/grid"), {
        ssr: false,
        loading: () => <GridSkeleton />,
    });
    return (
        <>
            <Hero />
            <Grid />
            <Projects />
            <main className='flex flex-col w-full'>
                <ChessBoard />
            </main>
            <Footer />
        </>
    );
}
