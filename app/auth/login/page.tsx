"use client";

import { supabase } from "@/lib/supabase/client";
import { useState } from "react";

export default function AuthForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        let { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        console.log({ data });
        if (error) console.error(error);
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
