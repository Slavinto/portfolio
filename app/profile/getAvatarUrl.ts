"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAvatarUrl(path: string | null) {
    if (!path) return null;

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.storage
        .from("avatars")
        .createSignedUrl(path, 60 * 60); // 1 hour

    if (error) return null;

    return data.signedUrl;
}
