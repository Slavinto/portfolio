"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updatePlayerProfile(data: {
    username?: string;
    bio?: string;
    avatar_url?: string;
}) {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
        .from("players")
        .update(data)
        .eq("id", user.id);

    if (error) throw error;

    return { success: true };
}
