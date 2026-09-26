import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configured API Keys
const DEFAULT_OPENAI_KEY = process.env.OPENAI_API_KEY || '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';
const DEFAULT_GROQ_KEY = process.env.GROQ_API_KEY || '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';
const DEFAULT_OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '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';

const SYSTEM_APP_BUILDER_PROMPT = `You are Quorix AI, an elite principal software engineer and UI/UX designer.
Generate a COMPLETE, flawless, single-page interactive web application in pure HTML with Tailwind CSS and Lucide icons.
MANDATORY RULES:
1. Return valid HTML5 with <!DOCTYPE html>, <html>, <head>, and <body>.
2. Include <script src="https://cdn.tailwindcss.com"></script> and <script src="https://unpkg.com/lucide@latest"></script>.
3. Include automatic lucide.createIcons() call on load and after any DOM update.
4. Ensure interactive JavaScript: dynamic state, CRUD actions, responsive UI, Arabic RTL or English LTR support.
5. Return the code inside a standard markdown code block:
\`\`\`html
<!DOCTYPE html>
...
</html>
\`\`\`
Provide clean, working, standalone code.`;

async function callGemini(promptText: string): Promise<string | null> {
  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  for (const model of modelsToTry) {
    try {
      const ai = new GoogleGenAI();
      const response = await ai.models.generateContent({
        model,
        contents: `${SYSTEM_APP_BUILDER_PROMPT}\n\nUser Request: ${promptText}`,
      });
      const text = response.text?.trim();
      if (text) return text;
    } catch (e: any) {
      console.warn(`Gemini model ${model} attempt failed:`, e?.message);
    }
  }
  return null;
}

async function callGroq(promptText: string, preferredModel?: string): Promise<string | null> {
  if (!DEFAULT_GROQ_KEY) return null;
  const models = preferredModel ? [preferredModel, 'openai/gpt-oss-120b', 'qwen/qwen3.8-27b'] : ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b'];
  for (const m of models) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DEFAULT_GROQ_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: m,
          messages: [
            { role: 'system', content: SYSTEM_APP_BUILDER_PROMPT },
            { role: 'user', content: promptText },
          ],
          temperature: 0.4,
        }),
      });
      if (res.ok) {
        const d = await res.json();
        const content = d.choices?.[0]?.message?.content?.trim();
        if (content) return content;
      }
    } catch (err: any) {
      console.warn(`Groq attempt with ${m} failed:`, err?.message);
    }
  }
  return null;
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json({ limit: '10mb' }));

  // Status / Health check
  app.get('/api/status', (req, res) => {
    res.json({
      status: 'ok',
      hasOpenAIKey: Boolean(DEFAULT_OPENAI_KEY),
      hasGroqKey: Boolean(DEFAULT_GROQ_KEY),
      hasGeminiKey: true,
      hasOpenRouterKey: Boolean(DEFAULT_OPENROUTER_KEY),
    });
  });

  // Prompt Enhancement Endpoint
  app.post('/api/enhance-prompt', async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({ error: 'Prompt is required' });
        return;
      }

      const instruction = `حول هذه الفكرة: "${prompt}" إلى مواصفة تطبيق ويب في 3 أسطر باللغة العربية تشمل الميزات والتصميم.`;
      const enhanced = await callGroq(instruction) || await callGemini(instruction);
      res.json({ enhancedPrompt: enhanced || prompt });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to enhance prompt' });
    }
  });

  // App Generation Endpoint
  app.post('/api/generate', async (req, res) => {
    const startTime = Date.now();
    try {
      const {
        prompt,
        model = 'openai:gpt-4o',
        apiKey,
        contextCode,
      } = req.body;

      if (!prompt) {
        res.status(400).json({ error: 'Prompt is required' });
        return;
      }

      const userMessage = contextCode
        ? `Existing code:\n\`\`\`html\n${contextCode}\n\`\`\`\n\nModifications requested:\n${prompt}\n\nPlease generate the full updated single-file HTML code.`
        : `Build this single-page web app completely:\n${prompt}`;

      let provider = 'openai';
      let modelName = model;

      if (model.includes(':')) {
        const parts = model.split(':');
        provider = parts[0];
        modelName = parts.slice(1).join(':');
      }

      let generatedContent: string | null = null;
      let usedModelName = modelName;
      let fallbackMessage: string | undefined = undefined;

      // 1. OPENAI (CHATGPT)
      if (provider === 'openai') {
        try {
          const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${DEFAULT_OPENAI_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: modelName.includes('mini') ? 'gpt-4o-mini' : 'gpt-4o',
              messages: [
                { role: 'system', content: SYSTEM_APP_BUILDER_PROMPT },
                { role: 'user', content: userMessage },
              ],
              temperature: 0.4,
            }),
          });

          if (openaiRes.ok) {
            const data = await openaiRes.json();
            generatedContent = data.choices?.[0]?.message?.content?.trim() || null;
            usedModelName = `${modelName} (OpenAI)`;
          } else {
            const errData = await openaiRes.json().catch(() => ({}));
            console.warn('OpenAI returned error status:', openaiRes.status, errData);
            if (errData?.error?.code === 'credit_balance_exhausted' || errData?.error?.type === 'insufficient_quota') {
              fallbackMessage = 'مفتاح OpenAI منتهي الرصيد، تم التوليد بنجاح وفوراً عبر محرك Groq فائق السرعة كبديل ذكي.';
            }
          }
        } catch (e: any) {
          console.warn('OpenAI fetch error:', e.message);
        }
      }

      // 2. GROQ PROVIDER
      if (!generatedContent && (provider === 'groq' || provider === 'openai')) {
        const groqContent = await callGroq(userMessage);
        if (groqContent) {
          generatedContent = groqContent;
          usedModelName = 'Llama / GPT-OSS (Groq LPU)';
          if (!fallbackMessage && provider === 'openai') {
            fallbackMessage = 'تم التوليد بسرعة فائقة عبر محرك Groq LPU.';
          }
        }
      }

      // 3. GOOGLE GEMINI PROVIDER
      if (!generatedContent) {
        const geminiContent = await callGemini(userMessage);
        if (geminiContent) {
          generatedContent = geminiContent;
          usedModelName = 'Gemini 3.8 Flash (Google)';
          if (!fallbackMessage) {
            fallbackMessage = 'تم التوليد بنجاح عبر محرك Google Gemini 3.8 Flash.';
          }
        }
      }

      // 4. OPENROUTER PROVIDER
      if (!generatedContent && DEFAULT_OPENROUTER_KEY) {
        try {
          const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${DEFAULT_OPENROUTER_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'deepseek/deepseek-chat',
              messages: [
                { role: 'system', content: SYSTEM_APP_BUILDER_PROMPT },
                { role: 'user', content: userMessage },
              ],
            }),
          });
          if (orRes.ok) {
            const orData = await orRes.json();
            generatedContent = orData.choices?.[0]?.message?.content?.trim() || null;
            usedModelName = 'DeepSeek V3 (OpenRouter)';
          }
        } catch (e: any) {
          console.warn('OpenRouter error:', e.message);
        }
      }

      const durationMs = Date.now() - startTime;
      const durationSec = (durationMs / 1000).toFixed(1);

      if (generatedContent) {
        res.json({
          content: generatedContent,
          modelUsed: usedModelName,
          durationSec,
          fallbackNotice: fallbackMessage,
        });
        return;
      }

      res.status(500).json({
        error: 'تعذر الاتصال بمزودي الذكاء الاصطناعي. يرجى إعادة المحاولة.',
      });
    } catch (err: any) {
      console.error('Server generation error:', err);
      res.status(500).json({ error: err.message || 'حدث خطأ أثناء معالجة الطلب' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Quorix Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
