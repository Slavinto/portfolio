"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useOpponent(opponentId: string | null) {
    const supabase = createClient();

    return useQuery({
        queryKey: ["opponent-profile", opponentId],
        enabled: !!opponentId, // only fetch when we have an ID
        queryFn: async () => {
            if (!opponentId) return null;

            const { data, error } = await supabase
                .from("profiles")
                .select("id, username, avatar_url, bio")
                .eq("id", opponentId)
                .single();

            if (error) throw error;
            return data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });
}
