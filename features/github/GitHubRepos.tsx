"use client";

import React, { Fragment, useState } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getRepos } from "./services/getRepos";
import { AnimatedCard, ButtonsCard } from "@/components/ui";
import { getLanguageIcon } from "@/components/ui/languageIcons";
import { FaFileAlt } from "react-icons/fa";
import { createArrayOf } from "@/lib/helpers";
import Link from "next/link";

const GitHubRepos = () => {
    const [page, setPage] = useState(1);
    const {
        data: repos,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["githubRepos"],
        queryFn: getRepos,
        getNextPageParam: (lastPage, pages) =>
            lastPage.length === 5 ? pages.length + 1 : undefined,
    });

    if ((!isLoading && !repos) || error) {
        return (
            <div className='w-full dark:h-screen flex justify-center'>
                <AnimatedCard
                    imagePath='/icons/android-chrome-192x192.png'
                    headerText='Oops something went wrong!'
                    descriptionText={
                        error ? error.message : "Failed to fetch GitHub data"
                    }
                    routerPath='/'
                />
            </div>
        );
    }
    return isLoading ? (
        <GitHubReposSkeleton repeatPattern={10} />
    ) : (
        <div className='flex flex-col gap-4 w-full'>
            <h1 className='text-xl font-bold'>My GitHub Repositories</h1>
            <div className='grid grid-cols-2 gap-8 '>
                {repos &&
                    repos.map(
                        ({
                            id,
                            html_url,
                            name,
                            created_at,
                            language,
                            description,
                        }) => (
                            <div key={id} className='w-56 block'>
                                <Link href={html_url}>
                                    <AnimatedCard
                                        classNames='bg-card-3 rounded-3xl'
                                        // routerPath={html_url}
                                        icon={
                                            language ? (
                                                getLanguageIcon(language)
                                            ) : (
                                                <FaFileAlt
                                                    size={40}
                                                    fill='white'
                                                />
                                            )
                                        }
                                        headerText={name}
                                        descriptionText={description}
                                    />
                                </Link>
                            </div>
                        )
                    )}
            </div>
            <div className='flex items-center'>
                <ButtonsCard className='w-12 h-4'>{page - 1}</ButtonsCard>
                <ButtonsCard>{page}</ButtonsCard>
                <ButtonsCard>{page + 1}</ButtonsCard>
            </div>
        </div>
    );
};

export default GitHubRepos;

const GitHubReposSkeleton = ({ repeatPattern }: { repeatPattern: number }) => {
    const fillerArray = createArrayOf(
        <div className='rounded-3xl w-full !h-12 md:h-[3rem] dark:bg-white-200/10 bg-white/20' />,
        repeatPattern
    );
    console.log({ fillerArray });
    return (
        <section
            id='github-skeleton'
            className='sm:px-12 content-container mx-auto h-screen'
        >
            <div className='flex flex-col gap-6 md:gap-10 lg:gap-12 skeleton-container-light dark:skeleton-container-dark items-center justify-center text-center bg-skeleton rounded-3xl w-full h-fit p-4 md:p-8 lg:p-12 xl:p-24'>
                {fillerArray.map((item, idx) => (
                    <Fragment key={idx}>{item}</Fragment>
                ))}
            </div>
        </section>
    );
};
