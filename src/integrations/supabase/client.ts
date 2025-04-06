import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hsmzfaigrvfuegcartef.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzbXpmYWlncnZmdWVnY2FydGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NzAyNjIsImV4cCI6MjA1OTE0NjI2Mn0.UYdlQwS2-UFxuIKxtijYnHSoM9LoYhlp3GANqVA86HA";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);