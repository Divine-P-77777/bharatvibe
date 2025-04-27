'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ResetPasswordPage() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('')
    const searchParams = useSearchParams()
    const { resetPassword } = useAuth()
    const { toast } = useToast()
    const code = searchParams.get('code')

    useEffect(() => {
        const verifyCode = async () => {
            try {
                if (!code) throw new Error('Invalid or expired reset link')

                // Verify code existence in session storage
                const storedVerifier = sessionStorage.getItem('sb-code-verifier')
                if (!storedVerifier) {
                    throw new Error('Reset session expired - please request a new link')
                }

                setLoading(false)
                console.log('URL code:', code)
                console.log('Stored verifier:', sessionStorage.getItem('sb-code-verifier'))
            } catch (error: any) {
                setError(error.message)
                setLoading(false)
            }
        }

        verifyCode()
    }, [code])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            if (!code) throw new Error('Missing verification code')

            await resetPassword(password, code)

            toast({
                title: "Password Updated",
                description: "You can now login with your new password",
            })

            // Force full page reload to clear auth state
            window.location.href = '/auth'

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Reset Failed",
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
            <div className="min-h-screen flex items-center justify-center p-4 text-center">
                <div className="max-w-md space-y-4">
                    <h1 className="text-2xl font-bold text-red-500">Error</h1>
                    <p className="text-muted-foreground">{error}</p>
                    <Button onClick={() => window.location.href = '/auth/forgot-password'}>
                        Request New Reset Link
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Reset Password</h1>
                    <p className="text-muted-foreground">
                        Enter your new password below
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password" className=''>New Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
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
                                type={showConfirm ? "text" : "password"}
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
    )
}