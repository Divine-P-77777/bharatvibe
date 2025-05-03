'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function AuthCallback() {
  const router = useRouter()

  const handleAuth = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        router.push('/auth?error=Authentication failed')
        return
      }

      router.push('/')
    } catch {
      router.push('/auth?error=Unexpected error occurred')
    }
  }, [router])

  useEffect(() => {
    handleAuth()
  }, [handleAuth])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
    </div>
  )
}
