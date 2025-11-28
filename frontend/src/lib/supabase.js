import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('--- SPY CODE START ---');
console.log('Full Env Object:', import.meta.env);
console.log('VITE_SUPABASE_URL Raw:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY Raw:', import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('Mode:', import.meta.env.MODE);
console.log('Is Dev?', import.meta.env.DEV);
console.log('Is Prod?', import.meta.env.PROD);
console.log('--- SPY CODE END ---');

console.log('Supabase Config Check:', {
    urlExists: !!supabaseUrl,
    keyExists: !!supabaseAnonKey,
    mode: import.meta.env.MODE
});

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Supabase URL or Anon Key is missing in environment variables!');
}

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
