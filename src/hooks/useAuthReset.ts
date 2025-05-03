import { supabase } from '@/lib/supabase/client'

export function useAuth() {
  const resetPassword = async (newPassword: string, code: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    }, {
      emailRedirectTo: `${window.location.origin}/auth`,
      token: code,
    } as any);

    if (error) throw new Error(error.message);
  };

  return {
    resetPassword,
  };
}