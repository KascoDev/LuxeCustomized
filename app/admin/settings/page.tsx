"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Store, Mail, CreditCard, Shield, Palette } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-stone-900 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">Settings</h1>
        <p className="text-sm sm:text-base text-stone-400">Configure your store settings and preferences</p>
      </div>

      {/* Coming Soon Notice */}
      <Card className="bg-stone-800 border-stone-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="h-6 w-6 mr-3" />
            Store Configuration
          </CardTitle>
          <CardDescription className="text-stone-400">
            Store settings and configuration options coming soon
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-stone-300">
            <h3 className="font-semibold mb-3">Planned Settings:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-3 bg-stone-750 rounded-lg">
                <Store className="h-5 w-5 text-blue-400 mr-3" />
                <div>
                  <p className="font-medium">Store Information</p>
                  <p className="text-sm text-stone-400">Business name, address, contact</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-stone-750 rounded-lg">
                <Mail className="h-5 w-5 text-green-400 mr-3" />
                <div>
                  <p className="font-medium">Email Settings</p>
                  <p className="text-sm text-stone-400">SMTP configuration, templates</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-stone-750 rounded-lg">
                <CreditCard className="h-5 w-5 text-purple-400 mr-3" />
                <div>
                  <p className="font-medium">Payment Settings</p>
                  <p className="text-sm text-stone-400">Stripe, payment methods</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-stone-750 rounded-lg">
                <Shield className="h-5 w-5 text-red-400 mr-3" />
                <div>
                  <p className="font-medium">Security Settings</p>
                  <p className="text-sm text-stone-400">Admin access, API keys</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-stone-750 rounded-lg">
                <Palette className="h-5 w-5 text-yellow-400 mr-3" />
                <div>
                  <p className="font-medium">Theme & Branding</p>
                  <p className="text-sm text-stone-400">Colors, logos, styling</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-stone-750 rounded-lg">
                <Settings className="h-5 w-5 text-indigo-400 mr-3" />
                <div>
                  <p className="font-medium">General Settings</p>
                  <p className="text-sm text-stone-400">Site preferences, features</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-stone-600">
            <p className="text-stone-400 text-sm">
              Configure basic settings through environment variables for now.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}