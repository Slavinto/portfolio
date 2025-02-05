import { useInfiniteQuery } from "@tanstack/react-query";
import { IGitHubReposApi } from "../githubTypes";
import { getRepos } from "../services/getRepos";

export const useInfiniteRepos = () => {
    return useInfiniteQuery<IGitHubReposApi, Error>({
        queryKey: ["githubRepos"],
        queryFn: ({ pageParam }) =>
            getRepos({ pageParam } as { pageParam: number }),
        getNextPageParam: (lastPage) => lastPage.nextPage ?? false,
        initialPageParam: 1,
    });
};
