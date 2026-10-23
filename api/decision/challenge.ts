import type { VercelRequest, VercelResponse } from '@vercel/node';
import { challengeDecision } from '../../server/decision-service';
import { handleCors, methodNotAllowed, respond } from '../_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handleCors(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res);
  await respond(req, res, challengeDecision);
}
