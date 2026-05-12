import type { VercelRequest, VercelResponse } from '@vercel/node';

const JCD_URL = 'https://api.jcdecaux.com/vls/v1/contracts';

interface Contract {
  name: string;
  commercial_name: string | null;
  cities: string[] | null;
  country_code: string | null;
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const url = new URL(JCD_URL);
    url.searchParams.set('apiKey', process.env.JCDECAUX_KEY ?? '');

    const response = await fetch(url.toString());
    if (!response.ok) {
      return res.status(502).json({ error: `JCDecaux error: ${response.status}` });
    }
    const data = (await response.json()) as Contract[];

    const result = data
      .map(({ name, commercial_name, cities, country_code }) => ({
        name,
        commercial_name,
        cities,
        country_code,
      }))
      .filter((c) => c.name && c.name !== 'jcdecauxbike')
      .sort((a, b) => a.name.localeCompare(b.name));

    // Cache 24h côté CDN Vercel
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
    return res.status(200).json(result);
  } catch (err) {
    console.error('contracts error:', err);
    return res.status(502).json({ error: 'Impossible de récupérer les contrats.' });
  }
}
