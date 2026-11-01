import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { GoogleGenAI } from '@google/genai';

const MODELS_TO_TRY = [
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-3-flash-preview',
];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = (
    process.env.GEMINI_API_KEY ||
    env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    env.VITE_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    env.GOOGLE_API_KEY ||
    ''
  ).trim();

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'local-api-chat-middleware',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method === 'OPTIONS') {
              res.statusCode = 200;
              res.end();
              return;
            }
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            const freshEnv = loadEnv(mode, process.cwd(), '');
            const currentKey = (
              process.env.GEMINI_API_KEY ||
              freshEnv.GEMINI_API_KEY ||
              process.env.VITE_GEMINI_API_KEY ||
              freshEnv.VITE_GEMINI_API_KEY ||
              process.env.GOOGLE_API_KEY ||
              freshEnv.GOOGLE_API_KEY ||
              apiKey ||
              ''
            ).trim();

            if (!currentKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'GEMINI_API_KEY is not configured.' }));
              return;
            }

            let rawBody = '';
            req.on('data', (chunk) => {
              rawBody += chunk;
            });

            req.on('end', async () => {
              try {
                const body = JSON.parse(rawBody || '{}');
                const { contents, systemInstruction, temperature = 0.7 } = body;

                const ai = new GoogleGenAI({
                  apiKey: currentKey,
                  httpOptions: {
                    headers: {
                      'User-Agent': 'aistudio-build',
                    },
                  },
                });
                let lastError: any = null;

                for (const modelName of MODELS_TO_TRY) {
                  try {
                    const response = await ai.models.generateContent({
                      model: modelName,
                      contents,
                      config: {
                        systemInstruction,
                        temperature,
                      },
                    });
                    if (response && response.text) {
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ text: response.text, model: modelName }));
                      return;
                    }
                  } catch (err: any) {
                    lastError = err;
                  }
                }

                res.statusCode = 502;
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    error: lastError?.message || 'All Gemini models failed to respond.',
                  })
                );
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err?.message || 'Server error' }));
              }
            });
          });
        },
      },
    ],
    define: {
      'import.meta.env.GEMINI_API_KEY': JSON.stringify(apiKey),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(apiKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
