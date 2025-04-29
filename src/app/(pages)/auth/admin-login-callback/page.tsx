'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLoginCallback() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdminAccess = async () => {
      if (authLoading) return; // ✅ Wait until useAuth finishes
  
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
  
        if (!session?.user?.email || error) {
          throw new Error('Session not found');
        }
  
        // Insert primary admin if needed
        if (session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
          const { error: upsertError } = await supabase
            .from('admins')
            .upsert(
              { email: session.user.email, added_by: 'system' },
              { onConflict: 'email' }
            );
  
          if (upsertError && upsertError.code !== '23505') {
            throw upsertError;
          }
        }
  
        await supabase.auth.refreshSession(); 
  
        
        if (isAdmin) {
          toast.success('Admin access granted');
          router.replace('/admin');
        } else {
          throw new Error('Admin privileges not found');
        }
      } catch (error) {
        console.error('Admin verification failed:', error);
        toast.error('Administrator access denied');
        await supabase.auth.signOut();
        router.replace('/auth/admin-login');
      } finally {
        setLoading(false);
      }
    };
  
    verifyAdminAccess();
  }, [router, isAdmin, authLoading]);
  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bharat-orange"></div>
      </div>
    );
  }

  return null;
}