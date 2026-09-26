import React from 'react';
import { LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Animated Quorix Brand Wordmark */}
        <div className="flex items-center gap-3.5 group cursor-default">
          {/* Animated Floating Logo */}
          <div className="relative">
            {/* Ambient animated glow */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-md opacity-70 group-hover:opacity-100 transition duration-500 animate-aura"></div>
            
            {/* Logo Badge */}
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-xl border border-white/20 animate-logo-float">
              Q
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight gradient-animated">
                Quorix
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-950/60 text-indigo-400 border border-indigo-800/60 hidden sm:inline-block">
                AI Studio
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              منصة صناعة التطبيقات والأكواد الذكية
            </span>
          </div>
        </div>

        {/* User Status & Google Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 pr-4 shadow-sm">
              <span id="userStatus" className="text-xs sm:text-sm font-semibold text-emerald-400 leading-tight">
                مرحباً: {user.name}
              </span>
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-xl border border-slate-700 object-cover shadow-xs"
              />
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span id="userStatus" className="text-xs sm:text-sm text-slate-400 hidden md:inline">
                غير مسجل الدخول
              </span>
              <button
                onClick={onOpenAuth}
                className="login-btn flex items-center gap-2 text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-950 px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>تسجيل الدخول بـ جوجل</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
