import { IGitHubRepos } from "../githubTypes";

export const getRepos = async (): Promise<IGitHubRepos[]> => {
    const response = await fetch("/api/github/repos");
    if (!response.ok) throw new Error("Failed to fetch repositories");
    return response.json();
};
