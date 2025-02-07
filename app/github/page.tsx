import GitHubRepos from "@/features/github/GitHubRepos";
import React from "react";

const GitHubPage = () => {
    return (
        <section
            id='github-repos'
            className='sm:px-12 pt-[9.5rem] bg-background content-container mx-auto'
        >
            <GitHubRepos />
        </section>
    );
};

export default GitHubPage;
