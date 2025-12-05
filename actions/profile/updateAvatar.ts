"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadAvatar(file: File) {
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error("Unauthorized");
    }

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
            upsert: true,
        });

    if (uploadError) {
        throw new Error(uploadError.message);
    }

    // Update DB profile
    const { error: updateError } = await supabase
        .from("players")
        .update({ avatar_url: filePath })
        .eq("id", user.id);

    if (updateError) {
        throw new Error(updateError.message);
    }

    revalidatePath("/profile");

    return { success: true, path: filePath };
}
