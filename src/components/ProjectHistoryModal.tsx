import React from 'react';
import { X, History, Trash2, ArrowLeft, Clock, Code, ExternalLink } from 'lucide-react';
import { GeneratedProject } from '../types';

interface ProjectHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: GeneratedProject[];
  onSelectProject: (project: GeneratedProject) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectHistoryModal: React.FC<ProjectHistoryModalProps> = ({
  isOpen,
  onClose,
  projects,
  onSelectProject,
  onDeleteProject,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">سجل التطبيقات والمشاريع</h3>
              <p className="text-xs text-slate-400">التطبيقات التي قمت بإنشائها مؤخراً</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-5 overflow-y-auto space-y-3">
          {projects.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-slate-600 stroke-[1.5]" />
              <p className="text-sm">لم تقم بإنشاء أي تطبيقات بعد.</p>
              <p className="text-xs text-slate-600">سيتم حفظ أي تطبيق تولده هنا تلقائياً.</p>
            </div>
          ) : (
            projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-slate-700 transition"
              >
                <div className="space-y-1 min-w-0">
                  <h4 className="font-bold text-sm text-white truncate">{proj.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1">{proj.prompt}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="font-mono">{new Date(proj.createdAt).toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>·</span>
                    <span className="text-indigo-400">{proj.model}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectProject(proj);
                      onClose();
                    }}
                    className="flex items-center gap-1 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    <span>فتح</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteProject(proj.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition cursor-pointer"
                    title="حذف المشروع"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
