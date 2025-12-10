"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function usePlayers(playerId: string | null, opponentId: string | null) {
    const supabase = createClient();

    // Only include non-null IDs
    const ids = [playerId, opponentId].filter((id) => !!id) as string[];

    // Enable only if there is at least 1 valid ID
    const enabled = ids.length > 0;

    return useQuery({
        queryKey: ["players", ...ids],
        enabled,
        queryFn: async () => {
            if (!enabled) return { player: null, opponent: null };

            const { data, error } = await supabase
                .from("players")
                .select("*")
                .in("id", ids);

            if (error) throw error;

            return {
                player: data.find((p) => p.id === playerId) || null,
                opponent: data.find((p) => p.id === opponentId) || null,
            };
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}
