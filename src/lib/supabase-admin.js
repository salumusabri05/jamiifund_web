import { createClient } from '@supabase/supabase-js';

// Create a separate admin client with service_role key
const supabaseUrl = 'https://mavaujxjkzyuhphpgtue.supabase.co';
const supabaseServiceKey= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hdmF1anhqa3p5dWhwaHBndHVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTYyNzc1MiwiZXhwIjoyMDY1MjAzNzUyfQ.COa3zYBPHAHEYJvpUwqxQ9k97FUMyahuhT5T-cPM9vw'

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export { supabaseAdmin };