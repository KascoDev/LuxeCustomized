import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { AuthProvider } from '@/components/providers/session-provider'
import { Toaster } from 'sonner'
import { StructuredData } from '@/components/seo/StructuredData'
import { generateMetadata, generateOrganizationStructuredData } from '@/lib/seo'
import './globals.css'

export const metadata: Metadata = generateMetadata({
  title: 'Premium Digital Canva Templates for Entrepreneurs & Creatives',
  description: 'Transform your brand with our curated collection of premium Canva templates. Instant download, professionally designed templates for social media, business, and marketing. Perfect for entrepreneurs, coaches, and creative professionals.',
  keywords: ['canva templates', 'digital templates', 'business templates', 'social media templates', 'entrepreneur resources'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationData = generateOrganizationStructuredData()

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1c1917" />
        <meta name="msapplication-TileColor" content="#1c1917" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="antialiased">
        <StructuredData data={organizationData} />
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
