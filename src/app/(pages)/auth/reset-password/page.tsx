"use client"

import { useEffect, useState } from 'react'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuthReset'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'
import Lenis from "@studio-freight/lenis";
import { useAppSelector } from "@/store/hooks";
import Navbar from '@/components/layout/UserNav';
import Footer from '@/components/layout/Footer';

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { resetPassword} = useAuth()
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const { toast } = useToast()


   useEffect(() => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        smooth: true,
        smoothTouch: false,
      } as unknown as ConstructorParameters<typeof Lenis>[0]);
      
    
      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
    
      requestAnimationFrame(raf);
    
      return () => {
        lenis.destroy();
      };
    }, []);


  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        setError('Invalid or expired reset link')
      } else {
        setError(null)
      }
      setLoading(false)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Mismatch',
        description: 'Passwords do not match',
      })
      return
    }

    try {
      await supabase.auth.updateUser({ password })
      toast({
        title: 'Password Updated',
        description: 'You can now log in',
      })
      window.location.href = '/auth'
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Reset Failed',
        description: error.message,
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    )
  }

  if (error) {
    return (
      <><Navbar />
      <div
        className={`min-h-screen flex items-center justify-center p-4 text-center ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
      >
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-bold text-red-500">Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => (window.location.href = '/auth/forgot-password')}>
            Request New Reset Link
          </Button>
        </div>
      </div>
      <Footer/>
      </>
    )
  }

  return (
    <><Navbar />
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
    >
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground">Enter your new password</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirm"
                type={showConfirm ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-muted-foreground"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </div>
      </form>
    </div>
    <Footer/>
    </>
  )
}
