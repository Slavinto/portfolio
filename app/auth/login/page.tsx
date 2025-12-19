"use client";

import AuthForm from "@/components/ui/forms/AuthForm";
import { useUser } from "@/hooks/auth/useUser";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const router = useRouter();
    const { data: user, isLoading } = useUser();
    const supabase = createClient();

    useEffect(() => {
        if (!isLoading && user) {
            router.replace("/");
        }
    }, [user, isLoading, router]);

    return (
        <section className='w-full relative h-screen'>
            <AuthForm />
        </section>
    );
}
