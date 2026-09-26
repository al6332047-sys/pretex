import { AIModel } from '../types';

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'openai:gpt-4o',
    name: 'ChatGPT (GPT-4o)',
    provider: 'OpenAI',
    badge: 'الأقوى ذكاءً 🤖',
    description: 'النموذج الأقوى من OpenAI لبناء التطبيقات المتطورة والمنطق المعقد.',
  },
  {
    id: 'openai:gpt-4o-mini',
    name: 'ChatGPT (GPT-4o Mini)',
    provider: 'OpenAI',
    badge: 'سريع واقتصادي ⚡',
    description: 'نموذج سريع وذكي للتطبيقات والواجهات التفاعلية من OpenAI.',
  },
  {
    id: 'groq:llama-3.3-70b-versatile',
    name: 'Llama 3.3 70B',
    provider: 'Groq',
    badge: 'سريع وقوي ⚡',
    description: 'معالجة فائقة السرعة على خوادم Groq LPU، ممتاز للتطبيقات التفاعلية.',
  },
  {
    id: 'groq:llama-3.1-8b-instant',
    name: 'Llama 3.1 8B',
    provider: 'Groq',
    badge: 'خفيف وفوري 🚀',
    description: 'استجابة لحظية في أجزاء من الثانية للأفكار والنماذج الأولية.',
  },
  {
    id: 'gemini:gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    provider: 'Google',
    badge: 'الجيل الأحدث 🌟',
    description: 'النموذج الرسمي الأحدث من Google فائق السرعة ومعالجة الكود البرمجي.',
  },
  {
    id: 'gemini:gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro',
    provider: 'Google',
    badge: 'الأعلى استدلالاً 🧠',
    description: 'قدرات استدلال متقدمة وبناء أنظمة وتطبيقات متكاملة بدون أخطاء.',
  },
  {
    id: 'openrouter:deepseek/deepseek-chat',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    badge: 'كود دقيق',
    description: 'نموذج فائق الذكاء وممتاز في إنتاج كود الويب البرمجي المتكامل.',
  },
  {
    id: 'openrouter:anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    badge: 'الأعلى إتقاناً',
    description: 'النموذج الرائد في تصميم واجهات المستخدم المعقدة وكتابة الكود النظيف.',
  },
];
