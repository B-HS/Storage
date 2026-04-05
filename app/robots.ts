import type { MetadataRoute } from 'next'

const robots = (): MetadataRoute.Robots => ({
    rules: [
        {
            userAgent: '*',
            allow: '/',
            disallow: ['/storage', '/mypage'],
        },
    ],
})

export default robots
