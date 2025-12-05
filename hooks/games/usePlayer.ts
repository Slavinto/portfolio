"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function usePlayer(playerId: string | null) {
    const supabase = createClient();

    return useQuery({
        queryKey: ["player-profile", playerId],
        enabled: !!playerId, // only fetch when we have an ID
        queryFn: async () => {
            if (!playerId) return null;

            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", playerId)
                .single();

            if (error) throw error;
            return data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });
}
