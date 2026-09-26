import React, { useState, useRef, useEffect } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  Maximize2,
  Minimize2,
  ExternalLink,
  Download,
  Copy,
  Check,
  Code2,
  Eye,
  Columns,
  AlertCircle
} from 'lucide-react';
import { ViewportMode, ActiveTab } from '../types';

interface PreviewFrameProps {
  code: string;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  title: string;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({
  code,
  activeTab,
  setActiveTab,
  title,
}) => {
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [copied, setCopied] = useState(false);
  const [key, setKey] = useState(0); // for iframe reloading
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_') || 'app'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenNewWindow = () => {
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const reloadIframe = () => {
    setKey((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const getViewportWidthClass = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px] max-w-full shadow-2xl rounded-2xl border-4 border-slate-700 my-4';
      case 'tablet':
        return 'w-[768px] max-w-full shadow-2xl rounded-2xl border-4 border-slate-700 my-4';
      case 'desktop':
      default:
        return 'w-full h-full';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all shadow-xl ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-0' : 'h-[620px] sm:h-[680px]'
      }`}
    >
      {/* Frame Toolbar */}
      <div className="bg-slate-950/90 border-b border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: View Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>المعاينة الحية</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'code'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>محرر الكود</span>
          </button>
          <button
            onClick={() => setActiveTab('both')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'both'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>عرض مقسم</span>
          </button>
        </div>

        {/* Center: Responsive Viewport Switcher (Shown in preview mode) */}
        {activeTab !== 'code' && (
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewport === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="سطح المكتب (100%)"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewport === 'tablet' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="جهاز لوحي (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewport === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="هاتف محمول (375px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {activeTab !== 'code' && (
            <button
              onClick={reloadIframe}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition cursor-pointer"
              title="إعادة تشغيل التطبيق"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition cursor-pointer"
            title="نسخ الكود بالكامل"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'تم النسخ!' : 'نسخ الكود'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1.5 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition cursor-pointer"
            title="تحميل كملف HTML مستقل جاهز للعمل"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تحميل HTML</span>
          </button>

          <button
            onClick={handleOpenNewWindow}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition cursor-pointer"
            title="فتح في نافذة جديدة مستقلة"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition cursor-pointer"
            title={isFullscreen ? 'تصغير الشاشة' : 'ملء الشاشة'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* Frame Body Content */}
      <div className="flex-1 bg-slate-950 overflow-hidden flex items-center justify-center relative">
        {code ? (
          <iframe
            key={key}
            srcDoc={code}
            title={title || 'التطبيق المنشأ'}
            sandbox="allow-scripts allow-forms allow-modals allow-same-origin allow-popups"
            className={`border-0 transition-all bg-white ${getViewportWidthClass()}`}
          />
        ) : (
          <div className="text-center p-8 space-y-3 text-slate-500">
            <AlertCircle className="w-12 h-12 mx-auto text-slate-600 stroke-[1.5]" />
            <p className="text-sm">لا يوجد كود متاح للمعاينة حتى الآن.</p>
            <p className="text-xs text-slate-600">اكتب فكرتك أعلاه واضغط "إنشاء التطبيق" للبدء فوراً.</p>
          </div>
        )}
      </div>
    </div>
  );
};
