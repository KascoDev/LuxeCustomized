"use client"

import { useEffect } from 'react'
import Script from 'next/script'

interface SEOAnalyticsProps {
  gaId?: string
  gtagId?: string
  enableWebVitals?: boolean
}

export function SEOAnalytics({ 
  gaId = process.env.NEXT_PUBLIC_GA_ID,
  gtagId = process.env.NEXT_PUBLIC_GTAG_ID,
  enableWebVitals = true 
}: SEOAnalyticsProps) {
  
  useEffect(() => {
    // Track Core Web Vitals for SEO performance monitoring
    if (enableWebVitals && typeof window !== 'undefined') {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log)
        getFID(console.log)
        getFCP(console.log)
        getLCP(console.log)
        getTTFB(console.log)
      })
    }
  }, [enableWebVitals])

  return (
    <>
      {/* Google Analytics 4 */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_title: document.title,
                page_location: window.location.href,
                send_page_view: true,
                // Enhanced ecommerce for template purchases
                custom_map: {
                  'custom_parameter_1': 'template_category',
                  'custom_parameter_2': 'template_price'
                }
              });
              
              // Track AI-friendly events
              gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                content_group1: 'digital_templates',
                content_group2: 'ecommerce'
              });
            `}
          </Script>
        </>
      )}

      {/* Enhanced E-commerce tracking */}
      <Script id="ecommerce-tracking" strategy="afterInteractive">
        {`
          // Track template views for SEO insights
          function trackTemplateView(productId, productName, category, price) {
            if (typeof gtag !== 'undefined') {
              gtag('event', 'view_item', {
                currency: 'USD',
                value: price,
                items: [{
                  item_id: productId,
                  item_name: productName,
                  category: category,
                  quantity: 1,
                  price: price
                }]
              });
            }
          }
          
          // Track template purchases
          function trackTemplatePurchase(transactionId, items, value) {
            if (typeof gtag !== 'undefined') {
              gtag('event', 'purchase', {
                transaction_id: transactionId,
                value: value,
                currency: 'USD',
                items: items
              });
            }
          }
          
          // Make functions globally available
          window.trackTemplateView = trackTemplateView;
          window.trackTemplatePurchase = trackTemplatePurchase;
        `}
      </Script>

      {/* SEO Performance Monitoring */}
      <Script id="seo-performance" strategy="afterInteractive">
        {`
          // Monitor page load performance for SEO
          window.addEventListener('load', function() {
            // Check if page is indexed
            if (document.querySelector('meta[name="robots"]')) {
              const robotsMeta = document.querySelector('meta[name="robots"]').content;
              console.log('SEO: Robots meta tag:', robotsMeta);
            }
            
            // Monitor structured data
            const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
            console.log('SEO: Structured data scripts found:', structuredData.length);
            
            // Track AI-specific meta tags
            const aiContentType = document.querySelector('meta[name="ai-content-type"]');
            if (aiContentType) {
              console.log('SEO: AI content type:', aiContentType.content);
            }
            
            // Performance metrics for SEO
            if ('performance' in window) {
              const navigation = performance.getEntriesByType('navigation')[0];
              const paintEntries = performance.getEntriesByType('paint');
              
              console.log('SEO Performance Metrics:', {
                loadTime: navigation.loadEventEnd - navigation.loadEventStart,
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
                firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
              });
            }
          });
          
          // Track search interactions for SEO insights
          document.addEventListener('DOMContentLoaded', function() {
            const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="search" i]');
            searchInputs.forEach(input => {
              input.addEventListener('input', function(e) {
                if (e.target.value.length > 2) {
                  if (typeof gtag !== 'undefined') {
                    gtag('event', 'search', {
                      search_term: e.target.value,
                      content_type: 'templates'
                    });
                  }
                }
              });
            });
          });
        `}
      </Script>

      {/* AI Crawler Hints */}
      <Script id="ai-crawler-hints" strategy="afterInteractive">
        {`
          // Provide additional context for AI crawlers
          window.seoMetadata = {
            businessType: 'Digital Template Marketplace',
            primaryProducts: 'Canva Templates',
            targetAudience: ['entrepreneurs', 'coaches', 'creative professionals'],
            keyFeatures: ['instant download', 'commercial license', 'customizable'],
            contentCategories: ${JSON.stringify(['business templates', 'social media templates', 'marketing materials'])},
            lastUpdated: new Date().toISOString(),
            contentQuality: {
              originalContent: true,
              professionalDesign: true,
              commercialLicense: true,
              instantDelivery: true
            }
          };
          
          // Schema.org hints for better AI understanding
          if (typeof window !== 'undefined') {
            window.addEventListener('load', () => {
              const schemaHints = document.createElement('script');
              schemaHints.type = 'application/ld+json';
              schemaHints.textContent = JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Digital Template Collection",
                "description": "Premium Canva templates for professional use",
                "numberOfItems": document.querySelectorAll('[data-product-id]').length,
                "itemListOrder": "https://schema.org/ItemListOrderDescending"
              });
              document.head.appendChild(schemaHints);
            });
          }
        `}
      </Script>
    </>
  )
}

// Export utility functions for manual tracking
export const trackTemplateView = (productId: string, productName: string, category: string, price: number) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', 'view_item', {
      currency: 'USD',
      value: price,
      items: [{
        item_id: productId,
        item_name: productName,
        category: category,
        quantity: 1,
        price: price
      }]
    })
  }
}

export const trackTemplatePurchase = (transactionId: string, items: any[], value: number) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'USD',
      items: items
    })
  }
}