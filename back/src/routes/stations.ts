import { Router, type Request, type Response } from 'express';
import NodeCache from 'node-cache';
import axios from 'axios';

const router = Router();
const cache = new NodeCache({ stdTTL: 60 });

const JCD_URL = 'https://api.jcdecaux.com/vls/v1/stations';

router.get('/', async (req: Request, res: Response) => {
  const city = (typeof req.query.city === 'string' ? req.query.city : '').trim() || 'toulouse';
  const cacheKey = `stations:${city}`;

  try {
    const cached = cache.get<unknown[]>(cacheKey);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached);
    }

    const { data } = await axios.get<unknown[]>(JCD_URL, {
      params: {
        contract: city,
        apiKey: process.env.JCDECAUX_KEY,
      },
      timeout: 8_000,
    });

    cache.set(cacheKey, data);
    res.setHeader('X-Cache', 'MISS');
    return res.json(data);
  } catch (err) {
    console.error('Erreur JCDecaux:', err instanceof Error ? err.message : err);
    return res
      .status(502)
      .json({ error: 'Impossible de récupérer les stations. Réessayez dans 60s.' });
  }
});

export default router;
