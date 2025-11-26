"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signupWithPassword } from "../signupWithPassword";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await signupWithPassword(email, password);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        // If email confirmation is disabled:
        router.push("/auth/login");

        // If enabled -> redirect to "check your inbox" page
        // router.push("/auth/verify");
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen'>
            <form
                onSubmit={handleSubmit}
                className='w-full max-w-sm p-6 bg-white dark:bg-neutral-900 rounded-lg shadow'
            >
                <h2 className='text-xl font-semibold mb-4'>Sign up</h2>

                {error && <p className='mb-4 text-red-500 text-sm'>{error}</p>}

                <input
                    type='email'
                    placeholder='Email'
                    className='w-full p-2 border rounded mb-3'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type='password'
                    placeholder='Password'
                    className='w-full p-2 border rounded mb-4'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type='submit'
                    disabled={loading}
                    className='w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400'
                >
                    {loading ? "Creating account..." : "Sign Up"}
                </button>
            </form>
        </div>
    );
}
