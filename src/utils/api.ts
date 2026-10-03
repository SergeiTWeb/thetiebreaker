const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const productionApiBaseUrl = 'https://thetiebreaker-l1jn.onrender.com';

const apiBaseUrl = (configuredApiBaseUrl || (import.meta.env.PROD ? productionApiBaseUrl : ''))
  .replace(/\/+$/, '');

export function apiUrl(path: string): string {
  return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}