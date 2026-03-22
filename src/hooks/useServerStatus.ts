import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export const useServerStatus = () => {
  const [isServerDown, setIsServerDown] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkServer = async () => {
      try {
        // Perform a lightweight query to verify Supabase stability
        const { error } = await supabase.from('profiles').select('id').limit(1);
        
        if (error) {
           // We infer server is down if it returns common failure codes for downed/paused projects
           const errorMessage = error.message.toLowerCase();
           if (errorMessage.includes('failed to fetch') || error.code === '503' || errorMessage.includes('paused') || error.code === 'PGRST000') {
               if (mounted) setIsServerDown(true);
               
               // Notify our Next.js API to track server down iterations and send emails
               await fetch('/api/server-status', { method: 'POST' });
           } else {
               if (mounted) setIsServerDown(false);
           }
        } else {
          if (mounted) setIsServerDown(false);
        }
      } catch (err) {
        if (mounted) setIsServerDown(true);
        await fetch('/api/server-status', { method: 'POST' });
      } finally {
        if (mounted) setIsChecking(false);
      }
    };

    checkServer();

    return () => {
      mounted = false;
    };
  }, []);

  return { isServerDown, isChecking };
};
