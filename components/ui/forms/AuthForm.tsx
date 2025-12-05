"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import Heading from "../text/Heading";
import { Headings } from "@/types/enums";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

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
                toast.info("Check your email to confirm your account.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                const user = await supabase.auth.getUser();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='center-absolute w-full max-w-sm p-6 rounded-xl border border-border bg-card shadow-sm'>
            <form
                onSubmit={handleAuth}
                className='flex flex-col gap-4 text-foreground'
            >
                <Heading as={Headings.H4}>
                    {isSignUp ? "Create Account" : "Sign In"}
                </Heading>

                <CustomInput
                    value={email}
                    handler={(e) => setEmail(e.target.value)}
                    required={true}
                    placeholder='Email'
                    type='email'
                    name='email'
                />
                <CustomInput
                    type='password'
                    name='password'
                    placeholder='Password'
                    value={password}
                    handler={(e) => setPassword(e.target.value)}
                    required={true}
                />

                {error && (
                    <p className='text-red-500 text-sm text-center'>{error}</p>
                )}

                <CustomButton type='submit' disabled={loading}>
                    {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
                </CustomButton>

                <div className='flex flex-col'>
                    <span className='text-center text-sm text-muted-foreground mb-4'>
                        {isSignUp ? "Already have an account?" : "New here?"}{" "}
                    </span>
                    <CustomButton
                        type='button'
                        handler={() => {
                            setIsSignUp((v) => !v);
                            // await signupWithPassword(email, password);
                        }}
                    >
                        {isSignUp ? "Sign in" : "Sign up"}
                    </CustomButton>
                </div>
            </form>
        </div>
    );
}
