export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.BOT_WEBHOOK_SECRET;
  const suppliedSecret = req.headers['x-bot-secret'];

  if (secret && suppliedSecret !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id, url } = req.body || {};
  const projectUrl =
    url || (id ? `${process.env.VITE_API_BASE || req.headers.origin || ''}/projects/${id}` : null);

  if (!projectUrl) {
    return res.status(400).json({ error: 'Missing id or url' });
  }

  // lol this is intentionally tiny for staging previews
  // wire this to your Discord webhook / worker if you want full auto posting
  return res.status(202).json({ ok: true, projectUrl });
}
