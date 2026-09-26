import React, { useState } from 'react';
import { X, Key, ShieldCheck, Check, RotateCcw, Eye, EyeOff, Zap, Sparkles } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetToDefault = () => {
    setInputKey('');
    onSaveApiKey('');
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">المفاتيح المدمجة في النظام (3 مفاتيح نشطة)</h3>
              <p className="text-xs text-slate-400">كافة المفاتيح الثلاثة تم ربطها وتفعيلها في الخادم للتشغيل الفوري</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Active Keys List */}
        <div className="space-y-2.5">
          {/* Key 1: Groq */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-orange-500/10 text-orange-400 rounded-lg">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Groq API Key</span>
                  <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 px-2 py-0.2 rounded-full font-mono">
                    نشط ومفعّل ⚡
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  gsk_obdAlI6zLpmMXPic...ZieT5W
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-400">Llama 3.3 70B & 3.1 8B</span>
          </div>

          {/* Key 2: Gemini */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Google Gemini API Key</span>
                  <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 px-2 py-0.2 rounded-full font-mono">
                    نشط ومفعّل 🌟
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  AQ.Ab8RN6IwJi4Lk5q...gaCbQ
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-400">Gemini 1.5 Flash & Pro</span>
          </div>

          {/* Key 3: OpenRouter */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>OpenRouter API Key</span>
                  <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 px-2 py-0.2 rounded-full font-mono">
                    نشط ومفعّل 🚀
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  sk-or-v1-9f6e9380...880754
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-400">DeepSeek & Claude</span>
          </div>
        </div>

        {/* Custom Override Option */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-300">
            تخصيص مفتاح إضافي من المتصفح (اختياري):
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="لصق مفتاح مخصص إضافي..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 pl-10"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute left-3 top-2.5 text-slate-500 hover:text-slate-300 transition"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة التعيين للمفاتيح المدمجة</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition cursor-pointer"
            >
              إغلاق
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/30 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>تم التأكيد!</span>
                </>
              ) : (
                <span>حفظ التعديلات</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
