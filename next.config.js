/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            hostname: "mario.wiki.gallery"
        }]
    }
};

module.exports = nextConfig;
