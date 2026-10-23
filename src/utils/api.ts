const configuredApiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL
)?.trim();

// UPDATE THIS: Replace with your actual Vercel backend URL.
// If your frontend and backend are in the SAME Vercel project, this custom domain works perfectly.
// If they are in separate Vercel projects, replace this with your backend's .vercel.app URL.
const productionApiBaseUrl = 'https://thetiebreaker.sergeitumanov.com';

const apiBaseUrl = (configuredApiBaseUrl || (import.meta.env.PROD ? productionApiBaseUrl : ''))
  .replace(/\/+$/, '');

export function apiUrl(path: string): string {
  return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export type ApiErrorKind = 'network' | 'unavailable' | 'request' | 'response';

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;

  constructor(message: string, kind: ApiErrorKind, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

const unreachableMessage =
  'Cannot reach the analysis service. It may be waking up or temporarily unavailable — wait about 30 seconds and try again.';
const unavailableMessage =
  'The analysis service is currently unavailable (the server is suspended or starting up). Please try again in a minute.';
const badResponseMessage =
  'The analysis service returned an unexpected response. Please try again.';

async function extractErrorMessage(response: Response): Promise<string | null> {
  try {
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;
    const data: unknown = await response.json();
    if (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string') {
      return data.error;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * POST JSON to the decision API and parse the JSON reply.
 * Throws an ApiError with a human-readable message for network, gateway,
 * and malformed-response failures so views never surface "Failed to fetch".
 */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(apiUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    // fetch only rejects for network/CORS/proxy failures. A suspended or
    // crashed host answers without CORS headers, which lands here too.
    throw new ApiError(unreachableMessage, 'network');
  }

  if (!response.ok) {
    const message = await extractErrorMessage(response);
    const status = response.status;
    throw new ApiError(
      message ||
        (status === 502 || status === 503 || status === 504
          ? unavailableMessage
          : `The analysis service rejected the request (HTTP ${status}).`),
      status === 502 || status === 503 || status === 504 ? 'unavailable' : 'request',
      status
    );
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError(badResponseMessage, 'response', response.status);
  }
}