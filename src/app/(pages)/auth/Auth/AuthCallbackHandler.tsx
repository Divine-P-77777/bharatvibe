
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

const AuthCallbackHandler = () => {
  const [message, setMessage] = useState('Processing authentication...');
  const navigate = useNavigate();

  useEffect(() => {
    // The supabase client will automatically handle the hash fragment
    // We just need to redirect the user after it's done
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error processing authentication:', error);
          setMessage('Authentication failed. Please try again.');
          setTimeout(() => navigate('/auth'), 2000);
          return;
        }
        
        if (data.session) {
          // Successfully authenticated
          console.log('Authentication successful');
          setMessage('Authentication successful! Redirecting...');
          setTimeout(() => navigate('/'), 1000);
        } else {
          // No session found, redirect to auth page
          setMessage('No valid session found. Redirecting to login...');
          setTimeout(() => navigate('/auth'), 2000);
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        setMessage('Something went wrong. Redirecting to login...');
        setTimeout(() => navigate('/auth'), 2000);
      }
    };
    
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-bharat-orange/5 to-bharat-red/5">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-bharat-orange mx-auto" />
        <h1 className="text-2xl font-bold">{message}</h1>
      </div>
    </div>
  );
};

export default AuthCallbackHandler;