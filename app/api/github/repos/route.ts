import { IGitHubReposApi } from "@/features/github/githubTypes";
import { handleError } from "@/lib/helpers";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest
): Promise<NextResponse<IGitHubReposApi | { error: string }>> {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const per_page = Number(searchParams.get("per_page")) || 4;

    const username = process.env.GITHUB_USERNAME;
    const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
    const GITHUB_API_URL = `https://api.github.com/users/${username}/repos?per_page=${per_page}&page=${page}`;
    try {
        const response = await fetch(GITHUB_API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json",
            },
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error("GitHub API error: ", response.status, errorText);
            return NextResponse.json({ error: "Failed to fetch repositories" });
        }
        const linkHeader = response.headers.get("Link");
        const totalPages = extractTotalPages(linkHeader);
        const repos = await response.clone().json();

        // console.log({ repos });
        console.log("API Response Headers:", response.headers);
        console.log("API Response Body:", await response.clone().json());

        return NextResponse.json({
            repos,
            totalPages,
            nextPage: page < totalPages ? page + 1 : null,
        });
    } catch (error) {
        throw handleError(error);
    }
}

const extractTotalPages = (linkHeader: string | null) => {
    if (!linkHeader) {
        return 1;
    }
    try {
        const lastPageMatch = linkHeader.match(/&page=(\d+)>; rel="last"/);
        return lastPageMatch ? Number(lastPageMatch[1]) : 1;
    } catch (error) {
        console.error("Error extracting total pages: ", error);
        return 1;
    }
};
