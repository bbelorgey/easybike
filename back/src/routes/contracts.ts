import { Router, type Request, type Response } from 'express';
import NodeCache from 'node-cache';
import axios from 'axios';

const router = Router();
const cache = new NodeCache({ stdTTL: 86400 });

const JCD_URL = 'https://api.jcdecaux.com/vls/v1/contracts';

interface Contract {
  name: string;
  commercial_name: string;
  cities: string[];
  country_code: string;
}

router.get('/', async (_req: Request, res: Response) => {
  try {
    const cached = cache.get<Contract[]>('contracts');
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached);
    }

    const { data } = await axios.get<Contract[]>(JCD_URL, {
      params: {
        apiKey: process.env.JCDECAUX_KEY,
      },
      timeout: 10_000,
    });

    const result = data
      .map(({ name, commercial_name, cities, country_code }) => ({
        name,
        commercial_name,
        cities,
        country_code,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    cache.set('contracts', result);
    res.setHeader('X-Cache', 'MISS');
    return res.json(result);
  } catch (err) {
    console.error('Erreur JCDecaux contracts:', err instanceof Error ? err.message : err);
    return res
      .status(502)
      .json({ error: 'Impossible de récupérer les contrats. Réessayez dans 60s.' });
  }
});

export default router;
