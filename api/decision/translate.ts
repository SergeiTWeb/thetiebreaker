import type { VercelRequest, VercelResponse } from '@vercel/node';
import { translateDecision } from '../../server/decision-service.js';
import { handleCors, methodNotAllowed, respond } from '../_lib/http.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handleCors(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res);
  await respond(req, res, translateDecision);
}
