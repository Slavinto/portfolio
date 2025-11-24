"use client";

import React, { Fragment, useEffect } from "react";
import { AnimatedCard } from "@/components/ui";
import { getLanguageIcon } from "@/components/ui/languageIcons";
import { FaFileAlt } from "react-icons/fa";
import { createArrayOf } from "@/lib/helpers";
import { useInView } from "react-intersection-observer";
import { useInfiniteRepos } from "./hooks/useInfiniteRepos";
import { githubCardProps, IGitHubReposApi } from "./githubTypes";
import Link from "next/link";

const GitHubRepos = () => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        error,
    } = useInfiniteRepos();

    const isBusy = isLoading || isFetchingNextPage;
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    // if ((!isBusy && !data) || error) {
    //     return (
    //         <div className='w-full dark:h-screen flex justify-center'>
    //             <AnimatedCard
    //                 imagePath='/icons/android-chrome-192x192.png'
    //                 headerText='Oops something went wrong!'
    //                 descriptionText={
    //                     error ? error.message : "Failed to fetch GitHub data"
    //                 }
    //                 routerPath='/'
    //             />
    //         </div>
    //     );
    // }

    // return <GitHubReposSkeleton repeatPattern={3} />;

    return isBusy && (!data || !data?.pages) ? (
        <GitHubReposSkeleton repeatPattern={3} />
    ) : (
        <div className='flex flex-col gap-4 w-full items-center'>
            <h1 className='text-3xl font-bold'>My GitHub Repositories</h1>
            <div className={`grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8]`}>
                {data?.pages.map((page) => {
                    const { repos } = page as IGitHubReposApi;
                    return repos.map(
                        (
                            {
                                id,
                                html_url,
                                name,
                                created_at,
                                language,
                                description,
                            },
                            idx
                        ) => (
                            <Link key={id} href={html_url} className={``}>
                                <AnimatedCard
                                    classNames='bg-card-3 rounded-3xl h-full opacity-90 shadow-xl h-[20rem]'
                                    icon={
                                        language ? (
                                            getLanguageIcon(language)
                                        ) : (
                                            <FaFileAlt size={40} fill='white' />
                                        )
                                    }
                                    headerText={name}
                                    descriptionText={description}
                                />
                            </Link>
                        )
                    );
                })}
                {isBusy && <GitHubReposSkeleton repeatPattern={2} />}
            </div>
            <div className='flex items-center w-full' ref={ref}></div>
        </div>
    );
};

export default GitHubRepos;

const GitHubReposSkeleton = ({ repeatPattern }: { repeatPattern: number }) => {
    const fillerArray = createArrayOf(
        <div className='rounded-3xl w-full h-12 md:h-[3rem] dark:bg-white-200/10 bg-white/20' />,
        repeatPattern
    );
    return (
        <section
            id='github-skeleton'
            className={`sm:px-2 flex items-start justify-center content-container col-span-full min-w-full h-full`}
        >
            <div
                className={`flex flex-col flex-grow gap-6 md:gap-10 lg:gap-8 skeleton-container-light dark:skeleton-container-dark justify-center bg-skeleton rounded-3xl w-[${githubCardProps.width}] !h-[${githubCardProps.height}] p-4 md:p-8 lg:p-12 xl:p-24`}
            >
                {fillerArray.map((item, idx) => (
                    <Fragment key={idx}>{item}</Fragment>
                ))}
            </div>
        </section>
    );
};
