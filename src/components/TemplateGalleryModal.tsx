import React from 'react';
import { X, Layers, ArrowLeft, ShoppingBag, Columns3, Wallet } from 'lucide-react';
import { TEMPLATES, TemplateApp } from '../constants/templates';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: TemplateApp) => void;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-amber-400" />;
      case 'Columns3':
        return <Columns3 className="w-5 h-5 text-blue-400" />;
      case 'Wallet':
        return <Wallet className="w-5 h-5 text-emerald-400" />;
      default:
        return <Layers className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">معرض القوالب الجاهزة</h3>
              <p className="text-xs text-slate-400">تطبيقات كاملة مسبقة الصنع لتجربتها أو البناء عليها</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-slate-950 border border-slate-800 hover:border-blue-500/50 rounded-xl p-5 flex flex-col justify-between transition-all group shadow-sm hover:shadow-blue-900/10"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    {renderIcon(tmpl.icon)}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                    {tmpl.category}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition">
                  {tmpl.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-900 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onSelectTemplate(tmpl);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition cursor-pointer"
                >
                  <span>فتح في مساحة العمل</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
