/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: "export",
    // distDir: "dist",
    images: {
        // unoptimized: true,
        remotePatterns: [
            { protocol: "https", hostname: "images.unsplash.com" },
        ],
    },
    // basePath: "/portfolio",
    // assetPrefix: "/portfolio/",
};

export default nextConfig;
