import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function useGame(gameId: string) {
    const supabase = createClient();
    return useQuery({
        queryKey: ["game", gameId],
        enabled: !!gameId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("games")
                .select("*")
                .eq("id", gameId)
                .single();
            if (error) throw error;
            return data;
        },
    });
}
