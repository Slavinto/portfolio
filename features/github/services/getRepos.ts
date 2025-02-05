import { IGitHubReposApi } from "../githubTypes";

export const getRepos = async ({
    pageParam,
}: {
    pageParam: number;
}): Promise<IGitHubReposApi> => {
    const response = await fetch(`/api/github/repos?page=${pageParam}`);

    if (!response.ok) throw new Error("Failed to fetch repositories");

    const data = await response.json();
    console.log({ data });
    return data;
};
