"use client";

import { createClient } from "@/lib/supabase/client";

export async function signupWithPassword(email: string, password: string) {
    const supabase = createClient();
    console.log({ email, password });
    return await supabase.auth.signUp({ email, password });
}
