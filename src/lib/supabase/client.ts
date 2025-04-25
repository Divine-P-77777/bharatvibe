import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = 'https://jnzmpmcsqswjhntnsvvo.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impuem1wbWNzcXN3amhudG5zdnZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNTgzODAsImV4cCI6MjA2MDczNDM4MH0.nihN9GHxhR6JZo1GZKqlf8qL76oGkgEzk6cb-6824uk';

// Create a singleton instance of the Supabase client
let supabaseClient: ReturnType<typeof createSupabaseClient<Database>>;

export const createClient = () => {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      }
    });
  }
  return supabaseClient;
};
