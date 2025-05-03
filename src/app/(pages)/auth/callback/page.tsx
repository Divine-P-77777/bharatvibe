'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleRedirect = async () => {
      const hash = window.location.hash
      const params = new URLSearchParams(hash.slice(1)) // remove #
      const type = params.get('type')
      const access_token = params.get('access_token')

      if (type !== 'recovery' || !access_token) {
        router.push('/auth?error=Invalid or expired link')
        return
      }

      // Let Supabase auto-detect session from URL
      await supabase.auth.getSession()

      router.push('/auth/reset-password')
    }

    handleRedirect()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
    </div>
  )
}
