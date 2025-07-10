import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { firebase_uid, email, full_name, password } = await request.json();
  
  try {
    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        firebase_uid
      }
    });
    
    if (authError) {
      console.error("Supabase Auth user creation error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }
    
    // 2. Store additional user data in users table
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        firebase_uid,
        email,
        full_name,
        created_at: new Date().toISOString()
      })
      .select();
      
    if (error) {
      console.error("Supabase user data creation error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}