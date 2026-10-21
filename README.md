# TieBreaker

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express)
![Google GenAI](https://img.shields.io/badge/Google_GenAI-Flash-4285F4?logo=google)

**TieBreaker** is an AI-powered decision intelligence workbench that transforms complex personal, career, and business choices into structured, mathematically-backed comparisons. 

Instead of relying on gut feeling, TieBreaker applies five distinct analytical frameworks to identify an objective, weighted winner, complete with scenario projections and stress-testing.

> *Vibecoded by [Sergei Tumanov](https://web.sergeitumanov.com) in 2026. Built to showcase modern, AI-assisted full-stack development with a focus on clean architecture and exceptional UX.*

---

## Key Features

- **5 Analytical Lenses**: 
1. **Weighted Pros & Cons**: Net ledger balances with 1–5 importance scaling.
2. **Decision Matrix**: Side-by-side criterion scoring multiplied by weight.
3. **Scenario Explorer**: Best-case, most likely, and worst-case narrative projections with probability weighting.
4. **Strategic SWOT**: 2×2 grid mapping internal/external forces with actionable mitigation strategies.
5. **Sensitivity & Devil’s Advocate**: Interactive methodology mixer to stress-test the mathematical verdict and identify reversal thresholds.

- **Real-Time Composite Scoring**: A unified 0–100 scoring engine that instantly recalculates as weights are adjusted.
- **Modern, Accessible UI**: Clean, minimalist interface with persistent Light/Dark mode support and responsive Tailwind CSS v4 styling.
- **Local-First Persistence**: All decision dossiers are securely saved to `localStorage`, ensuring zero data loss between sessions.
- **AI Synthesis Fallbacks**: Multi-tier Gemini API integration with graceful deterministic fallbacks if the API is unreachable.

---

## Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Lucide React |
| **Backend** | Express.js, `tsx` (TypeScript execution), Vite Middleware |
| **AI Integration** | `@google/genai` (Gemini Flash models with strict JSON schema parsing) |
| **Tooling** | Vite, ESLint, TypeScript, Git |

---

## Architecture Overview

TieBreaker uses a **unified full-stack architecture**. The Express server (`server.ts`) acts as both the API layer (handling `/api/decision/*` endpoints for AI analysis) and the static file server for the production Vite build. During development, Vite's HMR (Hot Module Replacement) is injected via middleware, providing a seamless developer experience without needing to run two separate terminal processes.

---

## Project Structure

```text
thetiebreaker/
├── public/                 # Static assets (e.g., favicon.svg)
├── src/
│   ├── components/         # Modular React UI components (Views, Modals)
│   ├── data/               # Static data and sample templates
│   ├── i18n/               # Translation dictionaries and localization logic
│   ├── types/              # Strict TypeScript interfaces and data models
│   ├── utils/              # Pure functions (scoring engine, validation, API helpers)
│   ├── App.tsx             # Main application layout and state management
│   └── main.tsx            # React 19 entry point
├── .env.example            # Environment variable template
├── .gitignore              # Secure ignore rules
├── package.json            # Dependencies and scripts
├── server.ts               # Express backend + Vite dev middleware
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite bundler configuration
```

## ⚙️ Getting Started (Local Development)
Follow these steps to run TieBreaker locally on your machine.

Prerequisites
- Node.js (v20.x or higher recommended)
- npm or pnpm

Installation
1. Clone the repository:
```bash
   git clone https://github.com/SergeiTWeb/thetiebreaker.git
   cd thetiebreaker
```

2. Install dependencies:
```bash
   npm install
```

3. Set up environment variables:
Copy the example file and add your Google AI API key.
```bash
    cp .env.example .env
```
Open .env and add your key:
```bash
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=3000
```
(Note: The app includes a deterministic fallback, so it will still function for manual data entry even without an API key, but AI synthesis requires it).

4. Start the development server:
```bash
  npm run dev
```
The app will be available at http://localhost:3000. 
Vite HMR will automatically reflect any code changes.

## Deployment
This project is designed for easy deployment on Node.js-compatible platforms like Render or Railway.

- Connect your GitHub repository to the platform.
- Set the Build Command: npm install && npm run build
- Set the Start Command: npm start (This runs tsx server.ts)
- Add your GEMINI_API_KEY to the platform's Environment Variables dashboard.
- Deploy! The platform will compile the Vite frontend into the dist/ folder, and the Express server will automatically serve it.

## 🤝 Contributing & Open Source
TieBreaker is open source. 
Feel free to fork the repository, submit issues, or open pull requests if you have ideas for new analytical frameworks or UI improvements.

## Author
Sergei Tumanov
[PORTFOLIO/WEBSITE](https://web.sergeitumanov.com) | [GITHUB PROJECTS](https://github.com/SergeiTWeb)