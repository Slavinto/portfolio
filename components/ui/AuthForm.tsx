"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import Heading from "./Heading";
import { Headings } from "@/types/enums";

export default function AuthForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSignUp, setIsSignUp] = useState(false);
    const supabase = createClient();

    async function handleAuth(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert("Check your email to confirm your account.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                const user = await supabase.auth.getUser();
                console.log({ user });
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='w-full max-w-sm p-6 rounded-xl border border-border bg-card shadow-sm'>
            <form
                onSubmit={handleAuth}
                className='flex flex-col gap-4 text-foreground'
            >
                <Heading as={Headings.H4}>
                    {isSignUp ? "Create Account" : "Sign In"}
                </Heading>

                <input
                    type='email'
                    name='email'
                    placeholder='Email address'
                    className='p-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-primary outline-none'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    className='p-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-primary outline-none'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && (
                    <p className='text-red-500 text-sm text-center'>{error}</p>
                )}

                <button
                    type='submit'
                    disabled={loading}
                    className='p-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50'
                >
                    {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
                </button>

                <p className='text-center text-sm text-muted-foreground'>
                    {isSignUp ? "Already have an account?" : "New here?"}{" "}
                    <button
                        type='button'
                        className='text-primary hover:underline'
                        onClick={() => setIsSignUp((v) => !v)}
                    >
                        {isSignUp ? "Sign in" : "Sign up"}
                    </button>
                </p>
            </form>
        </div>
    );
}
