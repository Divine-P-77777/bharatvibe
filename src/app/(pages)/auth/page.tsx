'use client'

import dynamic from 'next/dynamic';
import { redirect, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserNav from "@/components/layout/UserNav";
import Footer from "@/components/layout/Footer";
import { useAppSelector } from '@/store/hooks';

// Dynamic imports
const LoginForm = dynamic(() => import('./Auth/LoginForm'), { ssr: false });
const SignUpForm = dynamic(() => import('./Auth/SignUpForm'), { ssr: false });
const ForgotPasswordForm = dynamic(() => import('./Auth/ForgotPasswordForm'), { ssr: false });
const AdminLoginForm = dynamic(() => import('./Auth/AdminLoginForm'), { ssr: false });

export default function AuthPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  useEffect(() => {
    if (loading) return;
    if (user) {
      if (isAdmin) {
        redirect('/admin');
      } else {
        redirect('/');
      }
    }
  }, [user, isAdmin, loading]);


  return (
    <>
      <UserNav />
      <div className={`min-h-screen py-30 px-2 ${isDarkMode ? "bg-black" : "bg-white"}`}>
        <Card className="w-fit px-5 py-10 mx-auto">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className={` ${isDarkMode?"text-white":"text-black"} text-3xl font-bold tracking-tight`}>Welcome to BharatVibe</CardTitle>
            <CardDescription className={` ${isDarkMode?"text-white":"text-black"}`}>
              Connect with India's vibrant culture and community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="signup">
                <SignUpForm />
              </TabsContent>
              <TabsContent value="admin">
                <AdminLoginForm />
              </TabsContent>
            </Tabs>
            <div className='mx-auto flex justify-center pt-6'><ForgotPasswordForm /></div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}
