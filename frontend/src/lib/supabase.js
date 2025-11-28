import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hupzfkchkusckjdzleme.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1cHpma2Noa3VzY2tqZHpsZW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMTE3ODIsImV4cCI6MjA3OTg4Nzc4Mn0.-Ez0CIcEqilRmnRzlgdiLyVEDJHmLc_p3VFvhBznjnU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
