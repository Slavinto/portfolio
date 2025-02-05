/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    distDir: "dist",
    images: {
        unoptimized: true,
        remotePatterns: [
            { protocol: "https", hostname: "images.unsplash.com" },
        ],
    },
    basePath: "/",
    assetPrefix: "/",
};

export default nextConfig;
