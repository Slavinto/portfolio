"use client";
import Footer from "@/components/footer";
import { Grid } from "@/components/grid";
import Hero from "@/components/hero";
import Projects from "@/components/projects";

export default function Home() {
    return (
        <>
            <Hero />
            <Grid />
            <Projects />
            <Footer />
        </>
    );
}
