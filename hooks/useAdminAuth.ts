'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from "@/lib/supabase-client"
import type { User } from '@supabase/supabase-js'

// Define the user type we expect for an admin
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

interface UseAdminAuthReturn {
  user: AdminUser | null
  loading: boolean
  signOut: () => Promise<void>
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const processUser = (sessionUser: User | null): AdminUser | null => {
    if (sessionUser && sessionUser.user_metadata?.role === 'admin') {
      return {
        id: sessionUser.id,
        email: sessionUser.email!,
        name: sessionUser.user_metadata?.name || 'Admin',
        role: 'admin'
      }
    }
    return null
  }

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(processUser(session?.user ?? null));
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(processUser(session?.user ?? null));
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return { user, loading, signOut }
}
