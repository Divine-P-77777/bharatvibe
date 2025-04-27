
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from "./Auth/LoginForm"
import SignUpForm from "./Auth/SignUpForm"
import ForgotPasswordForm from "./Auth/ForgotPasswordForm"
import { redirect } from 'next/navigation'
import { useAuth } from './Provider/AuthProvider'
import { useEffect } from'react';
import UserNav from "@/components/layout/UserNav";  
import Footer from "@/components/layout/Footer";

export default function AuthPage() {
  const { user } = useAuth();
  

  useEffect(() => {
    if (user) {
      redirect('/');
    }
  }, [user, redirect]);

  return (
    <>  <UserNav />
    <div className="min-h-screen pt-10 bg-black">
    
      <Card className="w-fit px-5 py-10 mx-auto">
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
    {/* <Footer/> */}
    </>
  )
}