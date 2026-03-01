import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // lol don't panic, just add your env vars and refresh
  console.warn('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function listPublicProjects(limit = 12) {
  // quick helper for feed pages later
  return supabase
    .from('projects')
    .select('id,title,description,created_at')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit);
}

export async function getProjectById(id) {
  // tiny wrapper so page code stays clean
  return supabase.from('projects').select('*').eq('id', id).maybeSingle();
}
