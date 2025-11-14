"use client";

import { useUser } from "@/hooks/auth/useUser";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AuthForm() {
    const { data: user } = useUser();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    if (user) {
        router.back();
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast.error("Login failed");
            return;
        }

        // Try refreshing cookies / layouts
        router.refresh();
        router.push("/chess");
    };

    return (
        <form className='flex flex-col gap-2 w-full items-center mt-12'>
            <input
                name='email-input'
                type='email'
                className='p-2 btn-border bg-primary'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                name='password-input'
                type='password'
                className='p-2 btn-border'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} className='p-2 btn-border'>
                Sign in with Email
            </button>
        </form>
    );
}
