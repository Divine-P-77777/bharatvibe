'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';

export default function AdminLoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
     
      await supabase.auth.signOut();
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/admin-login-callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
  
      if (error) {
        toast.error('Google login failed');
        console.error(error);
      }
    } catch (err) {
      toast.error('Unexpected login error');
      console.error(err);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center space-y-4 max-w-md w-full">
        <Shield className="h-12 w-12 mx-auto text-bharat-orange" />
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <p className="text-muted-foreground text-sm">
          Only authorized administrators can access this dashboard.
        </p>
        <Button onClick={handleLogin} disabled={loading} className="w-full">
          {loading ? 'Redirecting...' : 'Login with Google'}
        </Button>
      </div>
    </div>
  );
}
