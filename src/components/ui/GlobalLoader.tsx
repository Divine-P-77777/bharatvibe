'use client'

import { useState, useEffect } from 'react'

export default function GlobalLoader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md bg-black/30">
      <div className="w-16 h-16 border-4 border-orange-500 border-dashed rounded-full animate-spin"></div>
    </div>
  )
}
