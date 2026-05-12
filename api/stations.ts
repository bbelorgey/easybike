import type { VercelRequest, VercelResponse } from '@vercel/node';

const JCD_URL = 'https://api.jcdecaux.com/vls/v1/stations';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const city =
    (typeof req.query.city === 'string' ? req.query.city : '').trim() || 'toulouse';

  try {
    const url = new URL(JCD_URL);
    url.searchParams.set('contract', city);
    url.searchParams.set('apiKey', process.env.JCDECAUX_KEY ?? '');

    const response = await fetch(url.toString());
    if (!response.ok) {
      return res.status(502).json({ error: `JCDecaux error: ${response.status}` });
    }
    const data = await response.json();

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    return res.status(200).json(data);
  } catch (err) {
    console.error('stations error:', err);
    return res.status(502).json({ error: 'Impossible de récupérer les stations.' });
  }
}
