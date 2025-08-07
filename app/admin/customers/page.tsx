"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Clock, Mail } from "lucide-react"

export default function AdminCustomersPage() {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-stone-900 p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white mb-1 sm:mb-2">Customers</h1>
        <p className="text-xs sm:text-sm lg:text-base text-stone-400">Manage customer accounts and relationships</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center p-3 bg-stone-750 rounded-lg min-h-[60px]">
                <UserCheck className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0 mt-1 sm:mt-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base">Customer Profiles</p>
                  <p className="text-xs sm:text-sm text-stone-400">View detailed customer information</p>
                </div>
              </div>
              
              <div className="flex items-start sm:items-center p-3 bg-stone-750 rounded-lg min-h-[60px]">
                <Clock className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-1 sm:mt-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base">Purchase History</p>
                  <p className="text-xs sm:text-sm text-stone-400">Track all customer purchases</p>
                </div>
              </div>
              
              <div className="flex items-start sm:items-center p-3 bg-stone-750 rounded-lg min-h-[60px]">
                <Mail className="h-5 w-5 text-purple-400 mr-3 flex-shrink-0 mt-1 sm:mt-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base">Email Communication</p>
                  <p className="text-xs sm:text-sm text-stone-400">Send targeted emails to customers</p>
                </div>
              </div>
              
              <div className="flex items-start sm:items-center p-3 bg-stone-750 rounded-lg min-h-[60px]">
                <Users className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0 mt-1 sm:mt-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base">Customer Segments</p>
                  <p className="text-xs sm:text-sm text-stone-400">Group customers by behavior</p>
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