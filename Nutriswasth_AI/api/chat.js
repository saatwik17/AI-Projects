import { GoogleGenAI } from '@google/genai';

const FAST_MODELS = [
  'gemini-2.5-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest',
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = (
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    ''
  ).trim();

  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured in environment variables.',
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { contents, systemInstruction, temperature = 0.7 } = body || {};

    if (!contents) {
      return res.status(400).json({ error: 'Missing contents in request body' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Race models in parallel so whichever model is active responds in ~1-2s
    const winner = await Promise.any(
      FAST_MODELS.map(async (modelName) => {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature,
          },
        });
        if (!response || !response.text) {
          throw new Error(`Empty response from ${modelName}`);
        }
        return { text: response.text, model: modelName };
      })
    );

    return res.status(200).json(winner);
  } catch (err) {
    console.error('[api/chat] Error:', err);
    return res.status(502).json({
      error: err?.message || 'Failed to generate response',
    });
  }
}
