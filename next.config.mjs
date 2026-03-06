/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: "/screen2-world-map-topic-selection",
                destination: "/world-map",
                permanent: true,
            },
            {
                source: "/screen3-grammar-topic-intro",
                destination: "/topic-intro",
                permanent: true,
            },
            {
                source: "/screen4-game-challenge",
                destination: "/challenge",
                permanent: true,
            },
            {
                source: "/screen4-challenge-screen",
                destination: "/challenge",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
