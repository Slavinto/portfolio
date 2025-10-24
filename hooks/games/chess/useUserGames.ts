// src/hooks/useUserGames.ts
"use client";

import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../auth/useUser";
import { GameTableData } from "@/types/supabase/database.types";

export function useUserGames() {
    const { data: user, isLoading: userLoading } = useUser();

    return useQuery({
        queryKey: ["userGames", user?.id],
        enabled: !!user, // only run if user exists
        queryFn: async () => {
            const { data, error } = await supabase
                .from("games")
                .select("*")
                .or(`player_white.eq.${user!.id},player_black.eq.${user!.id}`)
                .order("created_at", { ascending: false })
                .limit(10);

            if (error) throw error;

            return data as GameTableData[];
        },
    });
}
