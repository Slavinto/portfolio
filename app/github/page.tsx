import GitHubRepos from "@/features/github/GitHubRepos";
import { createArrayOf } from "@/lib/helpers";
import React, { Fragment } from "react";

const GitHubPage = () => {
    return (
        <section
            id='github-repos'
            className='sm:px-12 pt-[9.5rem] content-container mx-auto'
        >
            <GitHubRepos />
        </section>
    );
};

export default GitHubPage;
