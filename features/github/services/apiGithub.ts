export async function getRepos({
    pageParam = 1,
    perPage = 8,
}: {
    pageParam: number;
    perPage: number;
}) {
    console.log("TEST");
    const res = await fetch(
        `/api/github/repos?page=${pageParam}&per_page=${perPage}`
    );

    if (!res.ok) {
        throw new Error("Failed to fetch repositories");
    }

    return res.json();
}
