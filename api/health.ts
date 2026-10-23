import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isAnalysisConfigured } from '../server/decision-service';
import { handleCors } from './_lib/http';

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (handleCors(req, res)) return;
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    ok: true,
    service: 'the-tiebreaker-api',
    analysisConfigured: isAnalysisConfigured(),
    timestamp: new Date().toISOString(),
  });
}
