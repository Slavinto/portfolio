"use client";
import GitHubRepos from "@/features/github/GitHubRepos";
import React, { Suspense } from "react";

const GitHubPage = () => {
    return (
        <Suspense>
            <section
                id='github-repos'
                className='sm:px-12 pt-[9.5rem] bg-background content-container mx-auto'
            >
                <GitHubRepos />
            </section>
        </Suspense>
    );
};

export default GitHubPage;
