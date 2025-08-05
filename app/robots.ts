import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://luxecustomized.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/account/',
          '/order/',
          '*.json',
          '/manifest.json',
        ],
      },
      // Special rules for AI crawlers (ChatGPT, Claude, etc.)
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'CCBot',
          'Claude-Web',
          'anthropic-ai',
          'Google-Extended'
        ],
        allow: [
          '/',
          '/product/',
          '/category/',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/account/',
          '/order/',
        ],
      },
      // Allow search engines full access
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Slurp',
          'DuckDuckBot',
          'Baiduspider',
          'YandexBot',
          'facebookexternalhit'
        ],
        allow: '/',
        disallow: [
          '/admin/',
          '/api/webhooks/',
          '/account/',
          '/order/success',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}