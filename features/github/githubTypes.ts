export interface IGitHubRepos {
    id: number;
    name: string;
    description: string;
    html_url: string;
    created_at: string;
    language: string;
}

export interface IGitHubReposApi {
    repos: IGitHubRepos[];
    totalPages: number;
    nextPage: number | null;
}

export const githubCardProps = {
    width: "40rem",
    height: "20rem",
};
