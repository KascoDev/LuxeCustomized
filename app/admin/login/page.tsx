"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase-client"

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }
    
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (error) {
        toast.error(error.message)
        return
      }
      
      if (!data.user) {
        toast.error('Login failed - no user data')
        return
      }

      if (data.user.user_metadata?.role === 'admin') {
        toast.success('Welcome back!')
        router.push('/admin')
      } else {
        toast.error('Access denied: Admin privileges required')
        await supabase.auth.signOut()
      }
    } catch (error) {
      toast.error('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-stone-700 rounded-lg flex items-center justify-center mb-6">
            <Shield className="h-6 w-6 text-stone-300" />
          </div>
          <Link href="/" className="text-3xl font-serif font-bold text-white">
            LuxeCustomized
          </Link>
          <h2 className="mt-6 text-2xl font-light text-white">Admin Access</h2>
          <p className="mt-2 text-stone-400">Sign in to manage your store</p>
        </div>

        <div className="bg-stone-800 rounded-lg border border-stone-700 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="text-stone-200 font-medium">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 bg-stone-700 border-stone-600 text-white placeholder:text-stone-400"
                placeholder="admin@luxecustomized.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-stone-200 font-medium">
                Password
              </Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-stone-700 border-stone-600 text-white placeholder:text-stone-400"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-stone-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-stone-400" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-white text-stone-900 hover:bg-stone-100 py-3"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in to Admin"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-stone-400 hover:text-stone-300 transition-colors">
              ← Back to store
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}