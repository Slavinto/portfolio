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
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (error) throw error;
            return user; // user | null
        },

        // IMPORTANT
        initialData: undefined,
        staleTime: 5 * 60 * 1000, // cache auth state
        gcTime: 10 * 60 * 1000,
        retry: false,
    });

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            queryClient.setQueryData(["user"], session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [queryClient, supabase]);

    return query;
}
