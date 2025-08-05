import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-serif font-bold text-stone-900">
              LuxeCustomized
            </Link>
            <Link href="/" className="flex items-center text-stone-600 hover:text-stone-900 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Store
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-stone-200">
          <div className="p-8">
            <h1 className="text-3xl font-serif font-light text-stone-900 mb-8">Privacy Policy</h1>
            
            <div className="prose prose-stone max-w-none">
              <p className="text-stone-600 mb-6">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-medium text-stone-900 mb-4">Information We Collect</h2>
                <p className="text-stone-600 mb-4">
                  We collect information you provide directly to us, such as when you make a purchase, 
                  create an account, or contact us for support.
                </p>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>Email address for order confirmation and delivery</li>
                  <li>Payment information processed securely through Stripe</li>
                  <li>Purchase history and download preferences</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-medium text-stone-900 mb-4">How We Use Your Information</h2>
                <p className="text-stone-600 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Send you order confirmations and download links</li>
                  <li>Provide customer support</li>
                  <li>Improve our products and services</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-medium text-stone-900 mb-4">Information Sharing</h2>
                <p className="text-stone-600 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties, 
                  except as described in this policy:
                </p>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>Payment processors (Stripe) to process transactions</li>
                  <li>Email service providers (Resend) to deliver order confirmations</li>
                  <li>As required by law or to protect our rights</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-medium text-stone-900 mb-4">Data Security</h2>
                <p className="text-stone-600 mb-4">
                  We implement appropriate security measures to protect your personal information. 
                  However, no method of transmission over the Internet is 100% secure.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-medium text-stone-900 mb-4">Cookies</h2>
                <p className="text-stone-600 mb-4">
                  We use cookies and similar technologies to enhance your experience on our website, 
                  including authentication and preference storage.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-medium text-stone-900 mb-4">Your Rights</h2>
                <p className="text-stone-600 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt out of marketing communications</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-medium text-stone-900 mb-4">Changes to This Policy</h2>
                <p className="text-stone-600 mb-4">
                  We may update this privacy policy from time to time. We will notify you of any 
                  changes by posting the new policy on this page.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-medium text-stone-900 mb-4">Contact Us</h2>
                <p className="text-stone-600">
                  If you have any questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:privacy@luxecustomized.com" className="text-stone-900 underline">
                    privacy@luxecustomized.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}