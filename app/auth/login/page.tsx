"use client";

import AuthForm from "@/components/ui/forms/AuthForm";
import { useUser } from "@/hooks/auth/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const router = useRouter();
    const { data: user, isLoading } = useUser();

    useEffect(() => {
        if (!isLoading && !!user?.id) router.push("/");
    }, [user, isLoading]);

    return (
        <section className='w-full relative h-screen'>
            <AuthForm />
        </section>
    );
}
