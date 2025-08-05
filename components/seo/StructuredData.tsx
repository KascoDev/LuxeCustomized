import Script from 'next/script'

interface StructuredDataProps {
  data: object | object[]
}

export function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data : [data]
  
  return (
    <>
      {jsonLd.map((item, index) => (
        <Script
          key={index}
          id={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item)
          }}
        />
      ))}
    </>
  )
}

// AIEO-optimized content structure component
export function AIEOContentStructure({ 
  children, 
  section,
  contentType = 'main'
}: { 
  children: React.ReactNode
  section?: string
  contentType?: 'main' | 'article' | 'product' | 'category' | 'faq'
}) {
  const getSemanticTag = () => {
    switch (contentType) {
      case 'article': return 'article'
      case 'product': return 'section'
      case 'category': return 'section'
      case 'faq': return 'section'
      default: return 'main'
    }
  }

  const Tag = getSemanticTag() as keyof JSX.IntrinsicElements

  return (
    <Tag 
      data-content-type={contentType}
      data-section={section}
      itemScope={contentType === 'product' ? true : undefined}
      itemType={contentType === 'product' ? 'https://schema.org/Product' : undefined}
    >
      {children}
    </Tag>
  )
}

// AI-friendly heading structure
export function AIHeading({ 
  level, 
  children, 
  id,
  priority = 'normal'
}: { 
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  id?: string
  priority?: 'high' | 'normal' | 'low'
}) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements
  
  return (
    <Tag 
      id={id}
      data-ai-priority={priority}
      data-heading-level={level}
    >
      {children}
    </Tag>
  )
}

// AI-optimized content block
export function AIContentBlock({
  children,
  type = 'content',
  importance = 'normal'
}: {
  children: React.ReactNode
  type?: 'content' | 'description' | 'feature' | 'benefit' | 'specification'
  importance?: 'high' | 'normal' | 'low'
}) {
  return (
    <div 
      data-content-block={type}
      data-ai-importance={importance}
      role={type === 'description' ? 'complementary' : undefined}
    >
      {children}
    </div>
  )
}