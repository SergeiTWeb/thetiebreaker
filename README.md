# The Tiebreaker

A decision-analysis workspace for comparing choices with weighted pros and cons, a comparison matrix, scenarios, SWOT, and sensitivity checks.

## Run locally

Prerequisite: Node.js.

1. Install dependencies with `npm install`.
2. Add the server credential to `.env` using the variable shown in `.env.example`.
3. Start the app with `npm run dev`.

The credential is used by the server only. Do not put it in frontend code or commit `.env`. For deployment, configure it through the hosting provider's secret manager.

## Checks

- `npm test`
- `npm run lint`
- `npm run build`

Developed by Sergei Tumanov | web.sergeitumanov.com | 2026