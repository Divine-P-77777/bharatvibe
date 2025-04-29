import { createClient } from '@supabase/supabase-js'

// Safe client-side storage implementation
const storage = {
  getItem: (key: string) => {
    if (typeof window !== 'undefined') {
      return window.sessionStorage.getItem(key)
    }
    return null
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(key, value)
    }
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(key)
    }
  },
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      flowType: 'pkce',
      storage,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true
    }
  }
)