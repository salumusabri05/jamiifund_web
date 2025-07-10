import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

// Modify your API route to verify successful user creation
export async function POST(request) {
  try {
    const userData = await request.json();
    
    // Create user
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        firebase_uid: userData.firebase_uid,
        email: userData.email,
        full_name: userData.full_name || 'User',
        created_at: new Date().toISOString()
      })
      .select('id')
      .single();
    
    if (error) {
      console.error("Error creating user:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    // Verify the user was actually created
    const { data: verifyData, error: verifyError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', data.id)
      .single();
      
    if (verifyError || !verifyData) {
      return NextResponse.json({ 
        error: "User created but couldn't be verified" 
      }, { status: 500 });
    }
    
    return NextResponse.json({ user: data });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}