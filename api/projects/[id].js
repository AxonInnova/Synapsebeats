import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || (!serviceKey && !anonKey)) {
    return res.status(500).json({ error: 'Missing Supabase env vars' });
  }

  // do NOT expose service role key in frontend env ever
  const supabase = createClient(url, serviceKey || anonKey);

  const { data, error } = await supabase
    .from('projects')
    .select('id,title,description,data,is_public,owner_id,created_at')
    .eq('id', id)
    .eq('is_public', true)
    .maybeSingle();

  if (error || !data) {
    return res.status(404).json({ error: 'Not found' });
  }

  return res.status(200).json(data);
}
