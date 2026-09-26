import React, { useState } from 'react';
import { X, CheckCircle, Shield, Loader2, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { auth, googleProvider, signInWithPopup, doc, setDoc, db } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignInGoogle = async () => {
    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      
      const userProfile: UserProfile = {
        id: fbUser.uid,
        name: fbUser.displayName || 'مستخدم Google',
        email: fbUser.email || 'user@gmail.com',
        avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        provider: 'google',
        credits: 500,
      };

      // Save user to Firestore
      try {
        await setDoc(
          doc(db, 'users', fbUser.uid),
          {
            id: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (dbErr) {
        console.warn('Firestore user save warning:', dbErr);
      }

      onLogin(userProfile);
      onClose();
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('تم إغلاق نافذة تسجيل الدخول قبل الاكتمال.');
      } else if (err.code === 'auth/popup-blocked') {
        setAuthError('تم حظر النافذة المنبثقة من قبل المتصفح. يرجى السماح بالنوافذ المنبثقة لهذا الموقع.');
      } else {
        setAuthError(err.message || 'حدث خطأ أثناء الاتصال بخدمة Firebase Google Auth');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignInGuest = () => {
    const guestUser: UserProfile = {
      id: 'guest-' + Date.now(),
      name: 'مستخدم تجريبي',
      email: 'guest@appforge.local',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
      provider: 'guest',
      credits: 50,
    };
    onLogin(guestUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">تسجيل الدخول بـ Google</h3>
              <p className="text-xs text-slate-400">ربط مباشر وآمن عبر Firebase Authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {authError && (
          <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {/* Benefits list */}
        <div className="space-y-2 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>تسجيل دخول رسمي مشفر بحساب Google الخاص بك</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>حفظ ومزامنة كافة التطبيقات المنشأة في سحابة Firebase</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>تعديل وتحميل كود HTML لأي تطبيق من أي جهاز</span>
          </div>
        </div>

        {/* Sign In Options */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleSignInGoogle}
            disabled={isAuthenticating}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-4 rounded-xl transition shadow-md active:scale-98 cursor-pointer text-sm"
          >
            {isAuthenticating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>تسجيل الدخول بـ حساب Google</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSignInGuest}
            disabled={isAuthenticating}
            className="w-full flex items-center justify-center py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition text-xs cursor-pointer"
          >
            المتابعة كضيف (وضع التجربة السريع)
          </button>
        </div>

        <div className="text-center text-[11px] text-slate-500">
          مشروع Firebase: <span className="font-mono text-slate-400">second-loader-cvxch</span>
        </div>

      </div>
    </div>
  );
};
