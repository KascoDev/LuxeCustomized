"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-client"

export default function AdminTestPage() {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    // Get current session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      console.log('Current session:', { session, error })
      setSession(session)
      setUser(session?.user || null)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth change:', event, session?.user?.email)
      setSession(session)
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async () => {
    console.log('🔐 Starting login test...')
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@luxecustomized.com',
      password: 'admin123'
    })
    
    console.log('Login result:', { data, error })
    
    if (data.user) {
      console.log('User details:', {
        id: data.user.id,
        email: data.user.email,
        metadata: data.user.user_metadata
      })
      
      // Wait a moment then check session
      setTimeout(async () => {
        const { data: sessionCheck } = await supabase.auth.getSession()
        console.log('Session check after login:', {
          hasSession: !!sessionCheck.session,
          hasUser: !!sessionCheck.session?.user,
          role: sessionCheck.session?.user?.user_metadata?.role
        })
      }, 1000)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const checkBrowserStorage = () => {
    console.log('🗄️ Checking browser storage...')
    const keys = Object.keys(localStorage).filter(key => key.includes('supabase'))
    console.log('Supabase localStorage keys:', keys)
    keys.forEach(key => {
      console.log(key, localStorage.getItem(key))
    })
  }

  return (
    <div className="min-h-screen bg-stone-900 p-8">
      <div className="max-w-2xl mx-auto text-white">
        <h1 className="text-2xl font-bold mb-8">Admin Auth Test</h1>
        
        <div className="mb-8 p-4 bg-stone-800 rounded">
          <h2 className="text-lg font-semibold mb-4">Session Status:</h2>
          <p>Has Session: {session ? 'Yes' : 'No'}</p>
          <p>Has User: {user ? 'Yes' : 'No'}</p>
          <p>Email: {user?.email || 'N/A'}</p>
          <p>Role: {user?.user_metadata?.role || 'N/A'}</p>
          <p>User ID: {user?.id || 'N/A'}</p>
        </div>

        <div className="space-x-4 space-y-4">
          <button 
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mr-4"
          >
            Test Login
          </button>
          
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded mr-4"
          >
            Test Logout
          </button>
          
          <button 
            onClick={checkBrowserStora