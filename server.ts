import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import {
  analyzeDecision,
  challengeDecision,
  generateScenarios,
  isAnalysisConfigured,
  translateDecision,
  type ServiceResult,
} from './server/decision-service.js';

const app = express();
const port = Number(process.env.PORT) || 3000;
const directory = path.dirname(fileURLToPath(import.meta.url));

const configuredOrigins = (process.env.CLIENT_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://thetiebreaker.sergeitumanov.com',
  'https://thetiebreaker-open-tips.vercel.app',
  ...configuredOrigins,
];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`Blocked CORS request from origin: ${origin}`);
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
  maxAge: 86400,
}));

app.use(express.json({ limit: '1mb' }));

function handle(run: (body: unknown) => Promise<ServiceResult>) {
  return async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const result = await run(req.body);
      res.status(result.status).json(result.body);
    } catch (error) {
      console.error('Decision API error:', error);
      res.status(500).json({
        error: 'The analysis service failed unexpectedly. Please try again in a moment.',
      });
    }
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'the-tiebreaker-api', analysisConfigured: isAnalysisConfigured() });
});
app.post('/api/decision/analyze', handle(analyzeDecision));
app.post('/api/decision/translate', handle(translateDecision));
app.post('/api/decision/scenarios', handle(generateScenarios));
app.post('/api/decision/challenge', handle(challengeDecision));

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(directory, 'dist')));
    app.get('*', (_req, res) => res.sendFile(path.join(directory, 'dist', 'index.html')));
  }
  app.listen(port, '0.0.0.0', () => console.log(`The Tiebreaker is running on http://localhost:${port}`));
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exitCode = 1;
});
