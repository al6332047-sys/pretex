import React, { useState, useEffect, useRef } from 'react';
import { Eye, Terminal, Copy, Check, Download, ArrowRight, Sparkles, CheckCircle2, RotateCw, Monitor, Smartphone, Tablet, ExternalLink, Maximize2 } from 'lucide-react';
import { IterateBar } from './IterateBar';
import { ActiveTab, ViewportMode } from '../types';

interface LiveStudioProps {
  prompt: string;
  selectedModel: string;
  isGenerating: boolean;
  generatedCode: string;
  rawResponse: string;
  currentTitle: string;
  onNewBuild: () => void;
  onIterate: (instruction: string) => void;
  errorMsg: string | null;
}

export const LiveStudio: React.FC<LiveStudioProps> = ({
  prompt,
  selectedModel,
  isGenerating,
  generatedCode,
  rawResponse,
  currentTitle,
  onNewBuild,
  onIterate,
  errorMsg,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('code');
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [copied, setCopied] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [buildStep, setBuildStep] = useState(1);
  const [iframeKey, setIframeKey] = useState(0);

  // Stopwatch timer in seconds
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [finalDuration, setFinalDuration] = useState<number | null>(null);

  const codeContainerRef = useRef<HTMLDivElement>(null);
  const fullCodeToDisplay = generatedCode || rawResponse;

  // Real-time stopwatch
  useEffect(() => {
    let timer: any;
    if (isGenerating) {
      setSecondsElapsed(0);
      setFinalDuration(null);
      const start = Date.now();
      timer = setInterval(() => {
        setSecondsElapsed(parseFloat(((Date.now() - start) / 1000).toFixed(1)));
      }, 100);
    } else if (secondsElapsed > 0 && finalDuration === null) {
      setFinalDuration(secondsElapsed);
    }
    return () => clearInterval(timer);
  }, [isGenerating]);

  // Multi-step build pipeline progression
  useEffect(() => {
    if (isGenerating) {
      setBuildStep(1);
      const t1 = setTimeout(() => setBuildStep(2), 700);
      const t2 = setTimeout(() => setBuildStep(3), 1500);
      const t3 = setTimeout(() => setBuildStep(4), 2500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else if (generatedCode) {
      setBuildStep(4);
    }
  }, [isGenerating, generatedCode]);

  // Code typewriter / streaming effect
  useEffect(() => {
    if (!fullCodeToDisplay) {
      if (isGenerating) {
        const initialLogs = `> Initializing Quorix AI Engine...\n> Prompt: "${prompt}"\n> Building complete single-page interactive application...\n> Adding Tailwind CSS & Lucide Icons...\n\n`;
        setStreamedText(initialLogs);
      }
      return;
    }

    // Stream the code rapidly into the terminal
    let idx = 0;
    const len = fullCodeToDisplay.length;
    const step = Math.max(120, Math.floor(len / 35));

    const interval = setInterval(() => {
      idx += step;
      if (idx >= len) {
        setStreamedText(fullCodeToDisplay);
        clearInterval(interval);
      } else {
        setStreamedText(fullCodeToDisplay.slice(0, idx));
        if (codeContainerRef.current) {
          codeContainerRef.current.scrollTop = codeContainerRef.current.scrollHeight;
        }
      }
    }, 20);

    return () => clearInterval(interval);
  }, [fullCodeToDisplay, isGenerating, prompt]);

  // Auto-switch to preview when generation completes!
  useEffect(() => {
    if (generatedCode && !isGenerating) {
      // Auto open preview so user immediately sees their working app
      setActiveTab('preview');
    }
  }, [generatedCode, isGenerating]);

  // Copy code handler
  const handleCopy = () => {
    const textToCopy = generatedCode || rawResponse;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Download HTML handler
  const handleDownload = () => {
    const textToDownload = generatedCode || rawResponse;
    if (!textToDownload) return;
    const blob = new Blob([textToDownload], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentTitle || 'quorix-app'}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Open in new tab
  const handleOpenExternal = () => {
    const textToOpen = generatedCode || rawResponse;
    if (!textToOpen) return;
    const blob = new Blob([textToOpen], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const lines = streamedText.split('\n');

  const getViewportWidthClass = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px] max-w-full rounded-2xl border-4 border-slate-700 my-4 shadow-2xl';
      case 'tablet':
        return 'w-[768px] max-w-full rounded-2xl border-4 border-slate-700 my-4 shadow-2xl';
      case 'desktop':
      default:
        return 'w-full h-full';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 animate-in fade-in duration-300">
      
      {/* Top IDE Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        
        {/* Left: Back button & Project Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNewBuild}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3.5 py-2 rounded-xl transition cursor-pointer shadow-xs"
            title="الرجوع لكتابة فكرة جديدة"
          >
            <ArrowRight className="w-4 h-4" />
            <span>فكرة جديدة</span>
          </button>

          <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></span>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold text-white tracking-tight">
                {currentTitle || 'تطبيق Quorix'}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                app.html · {selectedModel.split(':')[1] || selectedModel}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live Timer & Status Indicator */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono">
          {isGenerating ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
              <span className="text-amber-300 font-semibold">
                جاري البناء... ⏱️ {secondsElapsed}s
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">
                اكتمل البناء · ⏱️ {finalDuration || secondsElapsed || '1.8'} ثانية (200 OK)
              </span>
            </>
          )}
        </div>

        {/* Right: Tab Switches & Actions */}
        <div className="flex items-center gap-2">
          
          {/* Main Switches: Preview vs Code */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 shadow-inner">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>المعاينة الحية</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>الكود المصدري</span>
            </button>
          </div>

          {/* Quick Actions */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
            title="نسخ الكود"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{copied ? 'تم النسخ' : 'نسخ'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-md shadow-indigo-600/20"
            title="تحميل كود HTML"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تحميل HTML</span>
          </button>
        </div>

      </div>

      {/* Pipeline Steps Indicator */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <div className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
          buildStep >= 1 ? 'bg-slate-900 border-indigo-500/50 text-indigo-300' : 'bg-slate-950/40 border-slate-800 text-slate-500'
        }`}>
          <span className="font-mono text-indigo-400">[1/4]</span>
          <span className="truncate">تحليل المواصفات والأوامر</span>
        </div>

        <div className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
          buildStep >= 2 ? 'bg-slate-900 border-indigo-500/50 text-indigo-300' : 'bg-slate-950/40 border-slate-800 text-slate-500'
        }`}>
          <span className="font-mono text-indigo-400">[2/4]</span>
          <span className="truncate">حقن Tailwind وأيقونات الويب</span>
        </div>

        <div className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
          buildStep >= 3 ? 'bg-slate-900 border-indigo-500/50 text-indigo-300' : 'bg-slate-950/40 border-slate-800 text-slate-500'
        }`}>
          <span className="font-mono text-indigo-400">[3/4]</span>
          <span className="truncate">توليد شفرات JavaScript التفاعلية</span>
        </div>

        <div className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
          buildStep >= 4 ? 'bg-slate-900 border-emerald-500/50 text-emerald-300' : 'bg-slate-950/40 border-slate-800 text-slate-500'
        }`}>
          <span className="font-mono text-emerald-400">[4/4]</span>
          <span className="truncate">تطبيق كامل جاهز للتشغيل</span>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="relative">
        
        {/* VIEW 1: LIVE INTERACTIVE PREVIEW */}
        {activeTab === 'preview' && (
          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl flex flex-col h-[680px]">
            
            {/* Preview Toolbar */}
            <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-bold text-white">المعاينة الحية التفاعلية</span>
              </div>

              {/* Viewport switchers */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setViewport('desktop')}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    viewport === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="حاسوب (100%)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewport('tablet')}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    viewport === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="جهاز لوحي (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewport('mobile')}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    viewport === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="هاتف محمول (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIframeKey((k) => k + 1)}
                  className="flex items-center gap-1 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-800 transition cursor-pointer"
                  title="إعادة تحميل التطبيق"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">إعادة تشغيل</span>
                </button>

                <button
                  onClick={handleOpenExternal}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition cursor-pointer"
                  title="فتح في نافذة كاملة جديدة"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* iFrame Container */}
            <div className="flex-1 bg-slate-950 overflow-hidden flex items-center justify-center relative">
              {generatedCode ? (
                <iframe
                  key={iframeKey}
                  srcDoc={generatedCode}
                  title="Quorix Live Preview"
                  sandbox="allow-scripts allow-forms allow-modals allow-same-origin allow-popups"
                  className={`border-0 transition-all bg-white h-full ${getViewportWidthClass()}`}
                />
              ) : (
                <div className="text-center p-8 space-y-2 text-slate-400">
                  <RotateCw className="w-8 h-8 animate-spin mx-auto text-indigo-400" />
                  <p className="text-sm font-semibold">جاري تحضير المعاينة الحية...</p>
                  <p className="text-xs text-slate-500">يتم تجميع الكود البرمجي الآن</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* VIEW 2: CODE STREAMER / TYPEWRITER */}
        {activeTab === 'code' && (
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#090D16] shadow-2xl">
            {/* Terminal Top Bar */}
            <div className="bg-slate-950/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                <span className="ml-2 font-mono text-slate-300">quorix-build-streamer · HTML5</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-slate-500">
                  {lines.length} lines · {streamedText.length} bytes
                </span>
                {isGenerating && (
                  <span className="flex items-center gap-1 text-indigo-400 font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                    streaming...
                  </span>
                )}
              </div>
            </div>

            {/* Code Box with Line Numbers */}
            <div
              ref={codeContainerRef}
              className="h-[620px] overflow-y-auto p-4 sm:p-6 font-mono text-xs sm:text-sm text-left dir-ltr select-text scroll-smooth"
            >
              <div className="flex items-start">
                <div className="pr-4 border-r border-slate-800/80 select-none text-slate-600 text-right font-mono text-xs min-w-[40px] opacity-75">
                  {lines.map((_, i) => (
                    <div key={i} className="leading-6">
                      {i + 1}
                    </div>
                  ))}
                </div>

                <pre className="pl-4 font-mono leading-6 text-sky-300 whitespace-pre-wrap flex-1 bg-transparent border-0 p-0 m-0">
                  <code>{streamedText}</code>
                  {isGenerating && (
                    <span className="inline-block w-2.5 h-4 bg-indigo-400 ml-1 animate-pulse align-middle"></span>
                  )}
                </pre>
              </div>
            </div>

            {/* Floating Banner when Ready to View Preview */}
            {generatedCode && !isGenerating && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-indigo-500/60 rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-4 backdrop-blur-md animate-in slide-in-from-bottom-3 duration-300">
                <div className="flex items-center gap-2 text-white text-xs sm:text-sm font-bold">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>اكتمل البناء في {finalDuration || secondsElapsed || '1.8'} ثانية!</span>
                </div>
                <button
                  onClick={() => setActiveTab('preview')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>عرض المعاينة الحية الآن</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* AI Follow-up Iteration / Refinement Bar */}
      {generatedCode && !isGenerating && (
        <IterateBar onIterate={onIterate} isLoading={isGenerating} />
      )}

    </div>
  );
};
