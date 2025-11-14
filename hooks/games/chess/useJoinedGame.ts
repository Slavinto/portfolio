"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { joinGame } from "@/lib/services/chess-db";

export function useJoinedGame(gameId: string) {
    const supabase = createClient();
    return useQuery({
        queryKey: ["game", gameId],
        queryFn: async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) throw new Error("Not signed in");

            // try to fetch
            const { data: existingGame, error } = await supabase
                .from("games")
                .select("*")
                .eq("id", gameId)
                .single();

            if (error || !existingGame)
                throw error ?? new Error("Game not found");

            // join game if needed
            const joined = await joinGame(gameId);
            return joined;
        },
    });
}
