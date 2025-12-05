"use client";
// fetches player and opponent at once

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function usePlayers(playerId: string | null, opponentId: string | null) {
    const supabase = createClient();
    const enabled = !!playerId && !!opponentId;

    return useQuery({
        queryKey: ["players", playerId, opponentId],
        enabled,
        queryFn: async () => {
            if (!enabled) return null;

            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .in("id", [playerId, opponentId]); // 🚀 one query

            if (error) throw error;

            const player = data.find((p) => p.id === playerId) || null;
            const opponent = data.find((p) => p.id === opponentId) || null;

            return { player, opponent };
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}
