import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request) {
  try {
    // Parse request body
    const { firebase_uid, email, full_name, password } = await request.json();
    
    // Validate required fields
    if (!firebase_uid || !email || !full_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create user in Supabase Auth
    // This uses the built-in auth.users table rather than a custom table
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name,
        firebase_uid
      }
    });
      
    if (error) {
      console.error("Supabase auth error:", error);
      
      // Handle user already exists case
      if (error.message.includes('already registered')) {
        return NextResponse.json({ 
          success: true,
          message: 'User already exists in database' 
        }, { status: 200 });
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Success - user created in Supabase Auth
    return NextResponse.json({ 
      success: true,
      message: 'User profile created successfully',
      data: {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata.full_name,
        firebase_uid: data.user.user_metadata.firebase_uid
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: 'Server error occurred: ' + error.message },
      { status: 500 }
    );
  }
}