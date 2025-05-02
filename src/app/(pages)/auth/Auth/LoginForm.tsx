import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAppSelector } from '@/store/hooks'

interface LoginFormData {
  email: string
  password: string
}

const LoginForm = () => {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signIn, signInWithGoogle } = useAuth()
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode)

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true)
      await signIn(data.email, data.password)
      toast({ title: 'Success!', description: 'Logged in successfully' })
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to log in',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      await signInWithGoogle()
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to log in with Google',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-[Inter]">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            id="email"
            type="email"
            placeholder="Enter your email"
            className={`pl-10 ${isDarkMode ? 'text-white' : 'text-black'}`}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            {...register('password', { required: 'Password is required' })}
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className={`pl-10 pr-10 ${isDarkMode ? 'text-white' : 'text-black'}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-2.5"
          >
            {showPassword ? (
              <EyeOff
                className={`h-5 w-5 ${
                  isDarkMode ? 'text-orange-400' : 'text-black'
                }`}
              />
            ) : (
              <Eye
                className={`h-5 w-5 ${
                  isDarkMode ? 'text-orange-400' : 'text-black'
                }`}
              />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-fit mx-auto px-10 btn-grad"
        disabled={loading}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Login
      </Button>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span
            className={`px-3 text-muted-foreground rounded-4xl ${
              isDarkMode
                ? 'bg-black text-orange-200'
                : 'bg-white text-gray-900'
            }`}
          >
            Or continue with
          </span>
        </div>
      </div>

      {/* Google Button */}
      <Button
  type="button"
  variant="outline"
  onClick={handleGoogleLogin}
  className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
  disabled={loading}
>
  <img
    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
    alt="Google"
    className="h-5 w-5"
  />
  <span className="text-sm font-medium">
    Continue with Google
  </span>
</Button>

    </form>
  )
}

export default LoginForm
