import React, { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';

interface IterateBarProps {
  onIterate: (instruction: string) => void;
  isLoading: boolean;
}

export const IterateBar: React.FC<IterateBarProps> = ({ onIterate, isLoading }) => {
  const [instruction, setInstruction] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (instruction.trim() && !isLoading) {
      onIterate(instruction.trim());
      setInstruction('');
    }
  };

  const QUICK_REFINEMENTS = [
    'أضف زر للوضع الليلي الداكن (Dark Mode)',
    'أضف خاصية الفلترة والبحث السريع',
    'أضف إمكانية تصدير البيانات بصيغة CSV',
    'حسّن التصميم للأجهزة الذكية والشاشات الصغيرة',
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
        <Sparkles className="w-4 h-4 text-blue-400" />
        <span>تطوير وتعديل التطبيق بالذكاء الاصطناعي:</span>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          disabled={isLoading}
          placeholder="اطلب تعديلاً أو ميزة إضافية (مثال: أضف فلتر حسب السعر، أو إشعار تأكيد عند الحفظ...)"
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
        />
        <button
          type="submit"
          disabled={isLoading || !instruction.trim()}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition cursor-pointer ${
            isLoading || !instruction.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4 rotate-180" />
              <span>تطبيق</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Refinement Pills */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {QUICK_REFINEMENTS.map((text, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onIterate(text)}
            disabled={isLoading}
            className="text-[11px] bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 px-2.5 py-1 rounded-lg transition cursor-pointer"
          >
            + {text}
          </button>
        ))}
      </div>
    </div>
  );
};
