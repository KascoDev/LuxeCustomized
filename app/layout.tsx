import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Toaster } from 'sonner'
import { StructuredData } from '@/components/seo/StructuredData'
import { generateMetadata, generateOrganizationStructuredData, generateWebsiteStructuredData } from '@/lib/seo'
import './globals.css'

export const metadata: Metadata = generateMetadata({
  title: 'Premium Digital Canva Templates for Entrepreneurs & Creatives',
  description: 'Transform your brand with our curated collection of premium Canva templates. Instant download, professionally designed templates for social media, business, and marketing. Perfect for entrepreneurs, coaches, and creative professionals.',
  keywords: ['canva templates', 'digital templates', 'business templates', 'social media templates', 'entrepreneur resources'],
  contentType: 'e-commerce-product-catalog',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationData = generateOrganizationStructuredData()
  const websiteData = generateWebsiteStructuredData()

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
        <meta name="theme-color" content="#1c1917" />
        <meta name="msapplication-TileColor" content="#1c1917" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* SEO and Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* AI and Search Engine Hints */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        
        {/* AI-specific meta tags */}
        <meta name="ai-content-type" content="e-commerce-digital-templates" />
        <meta name="ai-target-audience" content="entrepreneurs, coaches, consultants, creative professionals" />
        <meta name="ai-business-model" content="b2c-digital-downloads" />
        <meta name="ai-primary-intent" content="purchase-premium-canva-templates" />
      </head>
      <body className={`antialiased ${GeistSans.className} safe-area-inset`}>
        <StructuredData data={[organizationData, websiteData]} />
        
        {/* Skip to main content for accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 rounded">
          Skip to main content
        </a>
        
        <div id="main-content">
          {children}
        </div>
        
        <Toaster />
      </body>
    </html>
  )
}
