"use client";
import Footer from "@/components/footer";
import Projects from "@/components/projects";
import { HeroSkeleton } from "@/components/hero";
import dynamic from "next/dynamic";
import { GridSkeleton } from "@/components/grid";
import { ButtonsCard } from "@/components/ui";
import { useRouter } from "next/navigation";

export default function Home() {
    const Hero = dynamic(() => import("@/components/hero"), {
        ssr: false,
        loading: () => <HeroSkeleton repeatPattern={3} />,
    });
    const Grid = dynamic(() => import("@/components/grid"), {
        ssr: false,
        loading: () => <GridSkeleton />,
    });
    const router = useRouter();
    return (
        <>
            <Hero />
            <Grid />
            <Projects />
            <ButtonsCard
                onClick={() => router.push("/chess")}
                className='self-center cursor-pointer dark:btn-gradient btn-gradient-light lg:w-[25rem] lg:h-[8rem] md:w-[20rem] md:h-[6rem] h-[4rem] w-[15rem] gap-1 mt-[2rem] md:mt-[4rem]'
            >
                Play some chess
            </ButtonsCard>
            <Footer />
        </>
    );
}
