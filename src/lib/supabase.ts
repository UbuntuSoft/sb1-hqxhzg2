import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = 'https://iwfrdydxcanlsdkcakin.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3ZnJkeWR4Y2FubHNka2Nha2luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3NjAyNDIsImV4cCI6MjA0NzMzNjI0Mn0.LPOxYeS_kWi9GkF4VhYYXdT8WWPKi6GnYs2sT9eeQww';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});