"use client";

import { getAvatarUrl } from "@/app/profile/getAvatarUrl";
import { useQuery } from "@tanstack/react-query";

export function usePlayerAvatar(path: string | null) {
    if (!path) {
        return { data: null, isLoading: null, error: null };
    }

    return useQuery({
        queryKey: ["playerAvatar", path],
        queryFn: async () => {
            const playerAvatar = await getAvatarUrl(path);

            return { playerAvatar };
        },
        staleTime: 1000 * 60 * 5,
    });
}
