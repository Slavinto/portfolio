import { useInfiniteQuery } from "@tanstack/react-query";
import { IGitHubReposApi } from "../githubTypes";
import { getRepos } from "../services/apiGithub";
// import { useSearchParams } from "next/navigation";

export const useInfiniteRepos = () => {
    // const searchParams = useSearchParams();
    // const pageParam = Number(searchParams.get("page")) || 1;
    // const perPage = Number(searchParams.get("per_page")) || 4;

    return useInfiniteQuery<IGitHubReposApi, Error>({
        queryKey: ["githubRepos"],
        queryFn: ({ pageParam = 1 }) =>
            getRepos({ pageParam: Number(pageParam), perPage: 8 }),
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
        initialPageParam: 1,
    });
};
