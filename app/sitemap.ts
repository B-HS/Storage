import type { MetadataRoute } from 'next'

const sitemap = (): MetadataRoute.Sitemap => [
    {
        url: 'https://storage.gumyo.net',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 1,
    },
    {
        url: 'https://storage.gumyo.net/login',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
    },
]

export default sitemap
