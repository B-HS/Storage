import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    cacheComponents: true,
    reactCompiler: true,
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'blogimg.gumyo.net' },
            { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
        ],
    },
}

export default nextConfig
