// src/hooks/useUser.ts
"use client";

import { createClient } from "@/lib/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useUser() {
    const supabase = createClient();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) throw error;
            return data.user;
        },
        staleTime: Infinity, // user data rarely changes
        gcTime: Infinity,
    });

    // Listen for auth state changes and invalidate query if session changes
    useEffect(() => {
        const { data: subscription } = supabase.auth.onAuthStateChange(() => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        });

        return () => subscription.subscription.unsubscribe();
    }, [queryClient]);

    return query;
}
