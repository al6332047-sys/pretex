import React from 'react';
import { Loader2, Zap, Sparkles } from 'lucide-react';

interface PromptBoxProps {
  prompt: string;
  setPrompt: (val: string) => void;
  selectedModel: string;
  setSelectedModel: (val: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const PromptBox: React.FC<PromptBoxProps> = ({
  prompt,
  setPrompt,
  selectedModel,
  setSelectedModel,
  onGenerate,
  isLoading,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (prompt.trim() && !isLoading) {
        onGenerate();
      }
    }
  };

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl mx-auto space-y-6">
      
      {/* Grand Hero Headlines */}
      <div className="text-center space-y-3 pt-4 pb-2 relative">
        {/* Soft background light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-indigo-500/15 blur-3xl -z-10 rounded-full pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-xs sm:text-sm font-semibold mb-1 shadow-sm">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>الجيل الجديد من منصة Quorix لصناعة التطبيقات والأكواد الذكية</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          ماذا تريد أن تبني مع{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Quorix
          </span>
          ؟
        </h1>

        <p className="subtitle text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          محرك ذكي فائق القوة لتوليد تطبيقات الويب الكاملة والأكواد التفاعلية في ثوانٍ معدودة بدقة مذهلة.
        </p>
      </div>

      {/* Grand Expansive Search / Generation Box */}
      <div className="relative group">
        {/* Ambient Halo Border Effect */}
        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl group-hover:opacity-40 group-focus-within:opacity-60 transition duration-500 -z-10"></div>

        <div className="search-box-container bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-[1.75rem] p-6 sm:p-8 lg:p-9 shadow-2xl shadow-black/40 group-focus-within:border-indigo-500 group-focus-within:shadow-indigo-500/20 transition-all">
          
          {/* Large Expansive Textarea */}
          <div className="relative">
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={5}
              placeholder="اكتب فكرة التطبيق بالتفصيل أو الطلب البرمجي هنا... (مثال: صمم منصة تفاعلية لإدارة المبيعات مع لوحة تحكم ورسوم بيانية وإحصائيات فورية وسلة فواتير)"
              className="w-full min-h-[160px] sm:min-h-[200px] lg:min-h-[220px] bg-transparent border-0 text-white placeholder:text-slate-500 text-base sm:text-xl lg:text-2xl focus:ring-0 focus:outline-none resize-none leading-relaxed font-medium"
              disabled={isLoading}
            />
          </div>

          {/* Controls Bar */}
          <div className="controls-bar flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-4 pt-5 border-t border-slate-800/80">
            
            {/* Model Selector & Hint */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs sm:text-sm font-bold text-slate-400">المحرك:</span>
              <select
                id="modelSelect"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isLoading}
                className="bg-slate-950 border border-slate-700 hover:border-slate-600 text-slate-100 text-xs sm:text-base font-semibold rounded-xl px-4 py-2.5 sm:py-3 focus:outline-none focus:border-indigo-500 transition cursor-pointer shadow-sm min-w-[240px]"
              >
                <optgroup label="✨ نماذج ChatGPT (OpenAI)">
                  <option value="openai:gpt-4o">GPT-4o (الرائد - OpenAI)</option>
                  <option value="openai:gpt-4o-mini">GPT-4o Mini (سريع وذكي - OpenAI)</option>
                </optgroup>
                <optgroup label="⚡ نماذج Groq الفائقة">
                  <option value="groq:llama-3.3-70b-versatile">Llama 3.3 70B (Groq)</option>
                  <option value="groq:llama-3.1-8b-instant">Llama 3.1 8B (Groq)</option>
                </optgroup>
                <optgroup label="🌟 نماذج Google Gemini">
                  <option value="gemini:gemini-3.8-flash">Gemini 3.8 Flash (الأحدث - Google)</option>
                  <option value="gemini:gemini-3.1-pro-preview">Gemini 3.1 Pro (الأعلى ذكاءً - Google)</option>
                </optgroup>
                <optgroup label="🚀 نماذج OpenRouter">
                  <option value="openrouter:deepseek/deepseek-chat">DeepSeek V3 (كود دقيق)</option>
                  <option value="openrouter:anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                </optgroup>
              </select>

              <span className="text-xs text-slate-500 hidden lg:inline font-mono">
                اضغط <kbd className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md font-mono text-[11px] border border-slate-700">Ctrl + Enter</kbd> للإرسال
              </span>
            </div>

            {/* Big Energetic Submit Button */}
            <button
              type="button"
              onClick={onGenerate}
              disabled={isLoading || !prompt.trim()}
              className={`submit-btn flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-lg text-white shadow-lg transition-all cursor-pointer ${
                isLoading || !prompt.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-95'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري البناء... ⏳</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-amber-300 text-amber-300" />
                  <span>إنشاء الآن ⚡</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
