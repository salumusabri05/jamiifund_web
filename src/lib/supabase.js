import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mavaujxjkzyuhphpgtue.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hdmF1anhqa3p5dWhwaHBndHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2Mjc3NTIsImV4cCI6MjA2NTIwMzc1Mn0.gT90RdhPzgFQ7jfY6T0yB-Cb2ccpSTxUPfHoAyob2L4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
