import { createClient } from '@supabase/supabase-js';

// Server-side only - this file should never be imported in client components
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Required Supabase environment variables are missing');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);