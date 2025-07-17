import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .single();
    
    if (existingSubscriber) {
      return NextResponse.json(
        { success: false, message: 'Email is already subscribed' },
        { status: 409 }
      );
    }
    
    // Insert new subscriber
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        { 
          email, 
          subscribed_at: new Date().toISOString(),
          status: 'active'
        }
      ]);
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to subscribe to the newsletter' },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to the newsletter'
    });
    
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Failed to subscribe to the newsletter' },
      { status: 500 }
    );
  }
}