import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://jnzmpmcsqswjhntnsvvo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impuem1wbWNzcXN3amhudG5zdnZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNTgzODAsImV4cCI6MjA2MDczNDM4MH0.nihN9GHxhR6JZo1GZKqlf8qL76oGkgEzk6cb-6824uk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
