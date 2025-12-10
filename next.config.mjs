/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            { protocol: "https", hostname: "images.unsplash.com" },
            {
                protocol: "https",
                hostname: process.env.NEXT_PUBLIC_SUPABASE_URL,
            },
        ],
    },
    env: {
        GITHUB_USERNAME: process.env.GITHUB_USERNAME,
        GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    },
};

export default nextConfig;
