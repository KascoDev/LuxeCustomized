"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, DollarSign, Users, Package, Calendar } from "lucide-react"

export default function AdminAnalyticsPage() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">Analytics</h1>
        <p className="text-sm sm:text-base text-stone-400">Track your store's performance and growth</p>
      </div>

      {/* Coming Soon Notice */}
      <Card className="bg-stone-800 border-stone-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="h-6 w-6 mr-3" />
            Advanced Analytics
          </CardTitle>
          <CardDescription className="text-stone-400">
            Comprehensive analytics dashboard coming soon
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-stone-300">
            <h3 className="font-semibold mb-3">Planned Analytics Features:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center p-3 bg-stone-750 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-400 mr-3" />
                <div>
                  <p className="font-medium">Sales Trends</p>
                  <p className="text-sm text-stone-400">Track revenue over time</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-stone-750 rounded-lg">
                <Users className="h-5 w-5 text-blue-400 mr-3" />
                <div>
                  <p className="font-medium">Customer Insights</p>
                  <p className="text-sm text-stone-400">Analyze customer behavior</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-stone-750 rounded-lg">
                <Package className="h-5 w-5 text-purple-400 mr-3" />
                <div>
                  <p className="font-medium">Product Performance</p>
                  <p className="text-sm text-stone-400">Best selling templates</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-stone-750 rounded-lg">
                <DollarSign className="h-5 w-5 text-yellow-400 mr-3" />
                <div>
                  <p className="font-medium">Revenue Reports</p>
                  <p className="text-sm text-stone-400">Detailed financial insights</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-stone-750 rounded-lg">
                <Calendar className="h-5 w-5 text-red-400 mr-3" />
                <div>
                  <p className="font-medium">Time-based Analysis</p>
                  <p className="text-sm text-stone-400">Daily, weekly, monthly views</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-stone-750 rounded-lg">
                <BarChart3 className="h-5 w-5 text-indigo-400 mr-3" />
                <div>
                  <p className="font-medium">Interactive Charts</p>
                  <p className="text-sm text-stone-400">Visual data representation</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-stone-600">
            <p className="text-stone-400 text-sm">
              Basic analytics are available on the Dashboard. Advanced features coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}