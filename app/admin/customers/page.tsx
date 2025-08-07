"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Clock, Mail } from "lucide-react"

export default function AdminCustomersPage() {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-stone-900 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">Customers</h1>
        <p className="text-sm sm:text-base text-stone-400">Manage customer accounts and relationships</p>
      </div>

      {/* Coming Soon Notice */}
      <Card className="bg-stone-800 border-stone-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="h-6 w-6 mr-3" />
            Customer Management
          </CardTitle>
          <CardDescription className="text-stone-400">
            Customer management features are coming soon
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-stone-300">
            <h3 className="font-semibold mb-3">Planned Features:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-3 bg-stone-750 rounded-lg">
                <UserCheck className="h-5 w-5 text-blue-400 mr-3" />
                <div>
                  <p className="font-medium">Customer Profiles</p>
                  <p className="text-sm text-stone-400">View detailed customer information</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-stone-750 rounded-lg">
                <Clock className="h-5 w-5 text-green-400 mr-3" />
                <div>
                  <p className="font-medium">Purchase History</p>
                  <p className="text-sm text-stone-400">Track all customer purchases</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-stone-750 rounded-lg">
                <Mail className="h-5 w-5 text-purple-400 mr-3" />
                <div>
                  <p className="font-medium">Email Communication</p>
                  <p className="text-sm text-stone-400">Send targeted emails to customers</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-stone-750 rounded-lg">
                <Users className="h-5 w-5 text-orange-400 mr-3" />
                <div>
                  <p className="font-medium">Customer Segments</p>
                  <p className="text-sm text-stone-400">Group customers by behavior</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-stone-600">
            <p className="text-stone-400 text-sm">
              For now, you can view customer information through the Orders section.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}