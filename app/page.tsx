"use client";
import Footer from "@/components/footer";
import Projects from "@/components/projects";
import { HeroSkeleton } from "@/components/hero";
import dynamic from "next/dynamic";
import { GridSkeleton } from "@/components/grid";

export default function Home() {
    const Hero = dynamic(() => import("@/components/hero"), {
        ssr: false,
        loading: () => <HeroSkeleton />,
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
            <Footer />
        </>
    );
}
