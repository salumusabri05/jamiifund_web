import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client (uses anon key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Required Supabase environment variables are missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
