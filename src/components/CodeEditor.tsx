import React, { useState, useEffect } from 'react';
import { Play, Copy, Check, WrapText } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onCodeChange: (newCode: string) => void;
  onApplyChanges: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onCodeChange,
  onApplyChanges,
}) => {
  const [localCode, setLocalCode] = useState(code);
  const [isModified, setIsModified] = useState(false);
  const [isWordWrap, setIsWordWrap] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLocalCode(code);
    setIsModified(false);
  }, [code]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalCode(e.target.value);
    setIsModified(e.target.value !== code);
    onCodeChange(e.target.value);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(localCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const lineCount = localCode.split('\n').length;

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
      {/* Editor Sub-header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="font-mono text-[11px] text-slate-300">index.html</span>
          <span className="text-[11px]">·</span>
          <span className="text-[11px] font-mono">{lineCount} سطر</span>
          {isModified && (
            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-medium">
              تعديلات غير محفوظة
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsWordWrap(!isWordWrap)}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              isWordWrap
                ? 'bg-slate-800 border-slate-700 text-blue-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="التفاف الأسطر تلقائياً"
          >
            <WrapText className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
          </button>

          <button
            onClick={onApplyChanges}
            disabled={!isModified}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold text-xs transition cursor-pointer ${
              isModified
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>تحديث المعاينة</span>
          </button>
        </div>
      </div>

      {/* Editor Textarea with Line Numbers */}
      <div className="flex-1 flex overflow-hidden font-mono text-xs sm:text-sm bg-slate-950">
        <textarea
          dir="ltr"
          value={localCode}
          onChange={handleChange}
          spellCheck={false}
          className={`flex-1 w-full h-full p-4 bg-transparent text-emerald-400 font-mono resize-none focus:outline-none selection:bg-blue-600 selection:text-white leading-relaxed ${
            isWordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'
          }`}
          placeholder="<!-- كود الـ HTML الخاص بالتطبيق سيظهر هنا -->"
        />
      </div>
    </div>
  );
};
