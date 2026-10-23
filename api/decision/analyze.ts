import { VercelRequest, VercelResponse } from '@vercel/node';
import cors from 'cors';

// CORS middleware for Vercel
const corsMiddleware = cors({
  origin: [
    "http://localhost:5173",
    "https://thetiebreaker.sergeitumanov.com",
    "https://thetiebreaker-open-tips.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apply CORS
  corsMiddleware(req, res, () => {
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    if (req.method === 'POST') {
      // Your existing logic here
      const { decision } = req.body;
      
      // ... your AI analysis code ...
      
      res.status(200).json({ result: 'data' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  });
}