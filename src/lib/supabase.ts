import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uymizhyjonhfpumrkxep.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bWl6aHlqb25oZnB1bXJreGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MTk4NjYsImV4cCI6MjA1MDI5NTg2Nn0.iA0hrdCx1s6jVIJlG-6YpYvk19r_-tGB9Ef6Z8-9NwQ';

export const supabase = createClient(supabaseUrl, supabaseKey);