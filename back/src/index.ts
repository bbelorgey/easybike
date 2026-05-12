import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import contractsRouter from './routes/contracts';
import stationsRouter from './routes/stations';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5010;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173';

app.use(helmet());
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow any localhost port in dev
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || origin === ALLOWED_ORIGIN) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET'],
  })
);
app.use(express.json());

app.use('/api/contracts', contractsRouter);
app.use('/api/stations', stationsRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`EasyBike API démarrée sur le port ${PORT}`);
  console.log(`CORS autorisé pour: ${ALLOWED_ORIGIN}`);
});
