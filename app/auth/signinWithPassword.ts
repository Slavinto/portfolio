"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const signInWithPassword = async (
    e: React.FormEvent,
    email: string,
    password: string
) => {
    const router = useRouter();
    e.preventDefault();

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (!data || error) {
        toast.error("Login failed");
        return;
    }

    // Try refreshing cookies / layouts
    router.refresh();
    router.push("/chess");
};
