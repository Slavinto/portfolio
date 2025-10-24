import { supabase } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useGameSubscription(gameId: string) {
    const queryClient = useQueryClient();
    useEffect(() => {
        const channel = supabase
            .channel(`game-${gameId}`)
            .on(
                "postgres_changes",
                {
                    event: "*", // INSERT | UPDATE | DELETE
                    schema: "public",
                    table: "games",
                    filter: `id=eq.${gameId}`,
                },
                (payload) => {
                    // Update React Query cache
                    if (payload.eventType === "UPDATE" && payload.new) {
                        queryClient.setQueryData(["game", gameId], payload.new);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [gameId, queryClient]);
}
