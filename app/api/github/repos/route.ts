import { handleError } from "@/lib/helpers";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || 1;
    const per_page = searchParams.get("per_page") || 10;

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
            return NextResponse.json({ error: "Failed to fetch repositories" });
        }
        const data = await response.json();
        console.log({ data });
        return NextResponse.json(data);
    } catch (error) {
        throw handleError(error);
    }
}
