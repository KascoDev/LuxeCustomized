"use client"

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { AIHeading, AIContentBlock } from './StructuredData'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  items: FAQItem[]
  title?: string
}

export function FAQ({ items, title = "Frequently Asked Questions" }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-16 bg-white" role="region" aria-labelledby="faq-heading">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <AIHeading level={2} priority="normal" id="faq-heading">
            {title}
          </AIHeading>
          <AIContentBlock type="description" importance="normal">
            <p className="text-stone-600 mt-4">
              Everything you need to know about our digital templates and services.
            </p>
          </AIContentBlock>
        </div>

        <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
          {items.map((item, index) => (
            <div
              key={index}
              className="border border-stone-200 rounded-lg overflow-hidden"
              itemScope
              itemType="https://schema.org/Question"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between bg-stone-50 hover:bg-stone-100 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <AIHeading level={3} priority="normal">
                  <span className="font-medium text-stone-900 pr-4" itemProp="name">
                    {item.question}
                  </span>
                </AIHeading>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-stone-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-stone-500 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div
                  id={`faq-answer-${index}`}
                  className="px-6 py-4 bg-white"
                  itemScope
                  itemType="https://schema.org/Answer"
                >
                  <AIContentBlock type="content" importance="normal">
                    <p className="text-stone-600 leading-relaxed" itemProp="text">
                      {item.answer}
                    </p>
                  </AIContentBlock>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Pre-defined FAQ data for template business
export const templateFAQData: FAQItem[] = [
  {
    question: "What file formats do you provide?",
    answer: "All our templates are designed in Canva format for easy editing. You can download your final designs in PNG, PDF, or JPG formats directly from Canva."
  },
  {
    question: "Do I need a Canva Pro subscription?",
    answer: "Most of our templates work with free Canva accounts. However, some premium elements may require Canva Pro for full functionality. We clearly indicate this in the product description."
  },
  {
    question: "Can I use these templates for commercial purposes?",
    answer: "Yes! All our templates come with a commercial license, allowing you to use them for your business, client work, and commercial projects without additional fees."
  },
  {
    question: "How do I access my templates after purchase?",
    answer: "After purchase, you'll receive an email with your template links. Simply click the link to open the template in Canva, then save it to your account for future use."
  },
  {
    question: "Can I customize the colors and text?",
    answer: "Absolutely! Our templates are fully customizable. You can change colors, fonts, text, and images to match your brand. We also include brand color suggestions with each template."
  },
  {
    question: "What if I need help with customization?",
    answer: "We provide detailed customization guides with each template. If you need additional help, our support team is available via email to assist you."
  },
  {
    question: "Do you offer refunds?",
    answer: "Due to the digital nature of our products, we don't offer refunds once templates are accessed. However, if you experience technical issues, we're happy to help resolve them."
  },
  {
    question: "How often do you add new templates?",
    answer: "We add new templates weekly! Subscribe to our newsletter to be notified of new releases and exclusive designs."
  }
]