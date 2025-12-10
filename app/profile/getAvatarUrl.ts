"use client";

import { createClient } from "@/lib/supabase/client";

export async function getAvatarUrl(path: string | null) {
    if (!path) return null;

    const supabase = createClient();

    const { data, error } = await supabase.storage
        .from("avatars")
        .createSignedUrl(path, 60 * 60); // 1 hour

    if (error) {
        console.error("Signed URL error: ", error);
        return null;
    }

    return data.signedUrl;
}
