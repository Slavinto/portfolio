export const handleError = (error: unknown): Error => {
    if (error instanceof Error) {
        return error;
    }
    if (typeof error === "string") {
        return new Error(error);
    }
    return new Error(JSON.stringify(error));
};

export const createArrayOf = <T>(element: T, length: number): T[] => {
    let arr: T[] = [];
    for (let i = 0; i < length; i++) {
        arr.push(element);
    }
    return arr;
};

export const extractTotalPages = (linkHeader: string | null) => {
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

export function extractGameIdFromText(text: string): string | null {
    try {
        const url = new URL(text.trim());
        const match = url.pathname.match(/\/chess\/game\/([a-f0-9-]{36})$/i);
        return match?.[1] ?? null;
    } catch {
        return null;
    }
}
