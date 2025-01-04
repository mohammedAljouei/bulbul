import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://saqbribfjoeexklhvsso.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhcWJyaWJmam9lZXhrbGh2c3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMTQ4MTQsImV4cCI6MjA1MTU5MDgxNH0.aRgWG-Y3u6FDYJr12RSYBudXWOAufPZueg5pfJqLC0M';

export const supabase = createClient(supabaseUrl, supabaseKey);