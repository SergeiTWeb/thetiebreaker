import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { ServiceResult } from '../../server/decision-service';

const defaultOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://thetiebreaker.sergeitumanov.com',
  'https://thetiebreaker-open-tips.vercel.app',
];

const configuredOrigins = (process.env.CLIENT_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([...defaultOrigins, ...configuredOrigins]);

/**
 * Applies CORS headers and answers preflight requests.
 * Returns true when the request was a preflight and has already been answered.
 */
export function handleCors(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin;
  res.setHeader('Vary', 'Origin');

  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.status(204).end();
    return true;
  }

  return false;
}

function readBody(req: VercelRequest): unknown {
  const body = req.body;
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

/** Runs a service call and always answers with JSON, even on unexpected failures. */
export async function respond(
  req: VercelRequest,
  res: VercelResponse,
  run: (body: unknown) => Promise<ServiceResult>
): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const result = await run(readBody(req));
    res.status(result.status).json(result.body as Record<string, unknown>);
  } catch (error) {
    console.error('Decision API error:', error);
    res.status(500).json({
      error: 'The analysis service failed unexpectedly. Please try again in a moment.',
    });
  }
}

export function methodNotAllowed(res: VercelResponse): void {
  res.status(405).json({ error: 'Method not allowed. Use POST.' });
}
