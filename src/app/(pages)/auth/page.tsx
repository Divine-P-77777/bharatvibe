
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from "@/(subcomponents)/Auth/LoginForm"
import SignUpForm from "@/(subcomponents)/Auth/SignUpForm"
import ForgotPasswordForm from "@/(subcomponents)/Auth/ForgotPasswordForm"
import { redirect } from 'next/navigation'
import { useAuth } from '@/(subcomponents)/Auth/AuthProvider'

export default function AuthPage() {
  const { session } = useAuth()
  
  if (session) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bharat-orange/5 to-bharat-red/5 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome to BharatVibe</CardTitle>
          <CardDescription>
            Connect with India's vibrant culture and community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm />
            </TabsContent>
          </Tabs>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}