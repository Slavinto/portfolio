import { extractTotalPages, handleError } from "@/lib/helpers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const perPage = Number(searchParams.get("per_page")) || 4;

    const username = process.env.GITHUB_USERNAME;
    const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

    if (!username || !token) {
        return NextResponse.json(
            { error: "Missing GitHub credentials" },
            { status: 500 }
        );
    }

    const GITHUB_API_URL = `https://api.github.com/users/${username}/repos?sort=pushed&order=desc&per_page=${perPage}&page=${page}`;

    try {
        const response = await fetch(GITHUB_API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch repositories" },
                { status: response.status }
            );
        }

        const repos = await response.clone().json();
        const linkHeader = response.headers.get("Link");
        const totalPages = extractTotalPages(linkHeader);

        return NextResponse.json({
            repos,
            totalPages,
            nextPage: page < totalPages ? page + 1 : undefined,
        });
    } catch (error) {
        const newError = handleError(error);
        console.error(newError.message);
        return NextResponse.json({ error: newError.message }, { status: 500 });
    }
}
