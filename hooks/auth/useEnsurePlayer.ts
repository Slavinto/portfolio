"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useRef } from "react";
import { useUser } from "./useUser";

export function useEnsurePlayer() {
    const supabase = createClient();
    const ranRef = useRef<boolean>(false);
    const { data: user } = useUser();

    useEffect(() => {
        if (!user || ranRef.current) {
            return;
        }

        ranRef.current = true;
        try {
            const ensurePlayer = async () => {
                const { error } = await supabase
                    .from("players")
                    .upsert(
                        { id: user.id, username: user.email },
                        { onConflict: "id" }
                    );
            };

            ensurePlayer();
        } catch (error) {
            console.info("Failed to ensure player row: ", error);
        }
    }, [user?.id]);
}
