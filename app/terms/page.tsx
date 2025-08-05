import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
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
            <h1 className="text-3xl font-serif font-light text-stone-900 mb-8">Terms of Service</h1>
            
            <div className="prose prose-stone max-w-none">
              <p className="text-stone-600 mb-6">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-medium text-stone-900 mb-4">Agreement to Terms</h2>
                <p className="text-stone-600 mb-4">
                  By accessing and using LuxeCustomized, you accept and agree to be bound by the 
                  terms and provision of this agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-medium text-stone-900 mb-4">Description of Service</h2>
                <p className="text-stone-600 mb-4">
                  LuxeCustomized provides digital Canva templates for commercial and personal use. 
                  All products are delivered digitally through email and download links.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-medium text-stone-900 mb-4">License and Usage Rights</h2>
                <p className="text-stone-600 mb-4">
                  Upon purchase, you receive a non-exclusive, non-transferable license to use the 
                  digital templates for:
                </p>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>Personal and commercial projects</li>
                  <li>Client work (with proper licensing)</li>
                  <li>Social media content creation</li>
                  <li>Marketing materials</li>
                </ul>
                <p className="text-stone-600 mt-4">
                  You may NOT:
                </p>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>Resell, redistribute, or share the original template files</li>
                  <li>Claim ownership of the original designs</li>
                  <li>Use the templates for illegal or harmful purposes</li>
                </ul>
              </section>

              <section className="mb-8 bg-red-50 border border-red-200 rounded-lg p-6">
                <h2 className="text-xl font-medium text-red-900 mb-4">NO REFUND POLICY</h2>
                <p className="text-red-700 mb-4 font-medium">
                  Due to the digital nature of our products, ALL SALES ARE FINAL. 
                  We do not offer refunds, returns, or exchanges.
                </p>
                <p className="text-red-600 mb-4">
                  By making a purchase, you acknowledge that:
                </p>
                <ul className="list-disc pl-6 text-red-600 space-y-2">
                  <li>You have read and understood this no-refund policy</li>
                  <li>Digital products cannot be returned once delivered</li>
                  <li>You are responsible for ensuring compatibility with your intended use</li>
                  <li>Technical issues on your end do not qualify for refunds</li>
                </ul>
                <p className="text-red-600 mt-4">
                  Please review all product details carefully before purchasing. 
                  Contact support if you have questions BEFORE making your purchase.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-medium text-stone-900 mb-4">Download and Access</h2>
                <p className="text-stone-600 mb-4">
                  Download links are provided via email and expire after 7 days. 
                  You are responsible for downloading your purchases within this timeframe.
                </p>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>Download links are single-use and cannot be regenerated</li>
                  <li>Templates open directly in Canva for editing</li>
                  <li>You must have a Canva account to use the templates</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-medium text-stone-900 mb-4">Intellectual Property</h2>
                <p className="text-stone-600 mb-4">
                  All templates, designs, and content are protected by copyright and other 
                  intellectual property laws. LuxeCustomized retains all rights not expressly granted.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-medium text-stone-900 mb-4">Limitation of Liability</h2>
                <p className="text-stone-600 mb-4">
                  LuxeCustomized shall not be liable for any indirect, incidental, special, 
                  consequential, or punitive damages arising out of your use of our products or services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-medium text-stone-900 mb-4">Technical Support</h2>
                <p className="text-stone-600 mb-4">
                  We provide limited technical support for download and access issues. 
                  We do not provide design support or Canva training.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-medium text-stone-900 mb-4">Modifications to Terms</h2>
                <p className="text-stone-600 mb-4">
                  We reserve the right to modify these terms at any time. 
                  Changes will be effective immediately upon posting.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-medium text-stone-900 mb-4">Governing Law</h2>
                <p className="text-stone-600 mb-4">
                  These terms shall be governed by and construed in accordance with applicable laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-medium text-stone-900 mb-4">Contact Information</h2>
                <p className="text-stone-600">
                  For questions about these Terms of Service, contact us at{" "}
                  <a href="mailto:support@luxecustomized.com" className="text-stone-900 underline">
                    support@luxecustomized.com
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