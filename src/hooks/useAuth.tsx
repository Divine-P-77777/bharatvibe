// src/hooks/useAuth.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  session: Session | null
  user: User | null
  loading: boolean
  isAdmin: boolean
  signUp: (email: string, password: string, username: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  signOut: () => Promise<void>;
  resetPassword: (newPassword: string, code?: string) => Promise<void>;
}


const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isAdmin: true,
  signUp: async () => { },
  signIn: async () => { },
  signInWithGoogle: async () => { },
  signOut: async () => { },
  forgotPassword: async () => { },
  resetPassword: async () => { }
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
  
    const checkAdminStatus = async () => {
      const { data, error } = await supabase.rpc('is_admin');
      setIsAdmin(!error && !!data);
    };
  
    checkAdminStatus();
  }, [user]);
  

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    initializeAuth()

    return () => subscription?.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, username: string) => {
    const { data: existingUser } = await supabase
      .from('profiles')
      .select()
      .eq('username', username)
      .single()

    if (existingUser) throw new Error('Username already taken')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }
    })

    if (error) throw error
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.href = '/'; 
  };

  const forgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    if (error) throw error
  }

  const resetPassword = async (newPassword: string) => {
    // Get the code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      throw new Error('No verification code found');
    }

    const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);

    if (codeError) {
      throw new Error(`Code exchange failed: ${codeError.message}`);
    }

    // Then update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });
  
    if (updateError) {
      throw new Error(`Password update failed: ${updateError.message}`);
    }

    // Clear PKCE code verifier from session storage
    sessionStorage.removeItem('sb-code-verifier');
    sessionStorage.removeItem('sb-provider-token');
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        isAdmin,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        forgotPassword,
        resetPassword
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}