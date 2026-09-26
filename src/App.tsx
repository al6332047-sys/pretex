import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptBox } from './components/PromptBox';
import { LiveStudio } from './components/LiveStudio';
import { AuthModal } from './components/AuthModal';
import { requestAppGeneration } from './services/aiService';
import { GeneratedProject, UserProfile } from './types';
import { AlertTriangle, Sparkles } from 'lucide-react';
import {
  auth,
  firebaseSignOut,
  onAuthStateChanged,
  db,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
} from './firebase';

const STORAGE_KEYS = {
  USER: 'quorix_user_profile',
  PROJECTS: 'quorix_saved_projects',
};

export default function App() {
  // Main App State
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('openai:gpt-4o');
  const [currentTitle, setCurrentTitle] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [rawResponse, setRawResponse] = useState<string>('');
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // Loading & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  // User & Projects
  const [user, setUser] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<GeneratedProject[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // 1. Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const uProfile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || 'مستخدم Quorix',
          email: fbUser.email || '',
          avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
          provider: 'google',
          credits: 500,
        };
        setUser(uProfile);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(uProfile));

        // Load user's projects from Firestore
        try {
          const q = query(collection(db, 'projects'), where('userId', '==', fbUser.uid));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const remoteProjects: GeneratedProject[] = [];
            snap.forEach((d) => {
              const data = d.data();
              remoteProjects.push({
                id: d.id,
                title: data.title,
                prompt: data.prompt,
                model: data.model,
                code: data.code,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
              });
            });
            remoteProjects.sort((a, b) => b.createdAt - a.createdAt);
            setProjects(remoteProjects);
            localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(remoteProjects));
          }
        } catch (dbErr) {
          console.warn('Failed to fetch remote Firestore projects:', dbErr);
        }
      } else {
        const localUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (localUser) {
          try {
            const parsed = JSON.parse(localUser);
            if (parsed.provider === 'guest') {
              setUser(parsed);
            }
          } catch {
            // ignore
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Load stored projects
  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      }
    } catch (e) {
      console.error('Failed to load local storage:', e);
    }
  }, []);

  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
  };

  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // ignore
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const handleDirectGoogleLogin = async () => {
    try {
      const { signInWithPopup: popupSignIn, googleProvider: gProvider } = await import('./firebase');
      await popupSignIn(auth, gProvider);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setIsAuthOpen(true);
      }
    }
  };

  const saveProject = async (title: string, pPrompt: string, pModel: string, code: string) => {
    const projId = 'proj-' + Date.now();
    const newProj: GeneratedProject = {
      id: projId,
      title,
      prompt: pPrompt,
      model: pModel,
      code,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [newProj, ...projects.filter((p) => p.title !== title)];
    setProjects(updated);

    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Sync to Firestore if user logged in
    if (user && user.provider === 'google') {
      try {
        await setDoc(doc(db, 'projects', projId), {
          id: projId,
          userId: user.id,
          title,
          prompt: pPrompt,
          model: pModel,
          code,
          createdAt: newProj.createdAt,
          updatedAt: newProj.updatedAt,
        });
      } catch (fsErr) {
        console.warn('Firestore project save warning:', fsErr);
      }
    }
  };

  // Generation Handler: Immediately opens the live studio screen!
  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    const generatedTitle = prompt.trim().substring(0, 35) + (prompt.trim().length > 35 ? '...' : '');
    setCurrentTitle(generatedTitle);
    setIsStudioOpen(true);
    setIsLoading(true);
    setErrorMsg(null);
    setFallbackNotice(null);
    setGeneratedCode('');
    setRawResponse('');

    try {
      const result = await requestAppGeneration({
        prompt: prompt.trim(),
        model: selectedModel,
      });

      if (!result.rawText && !result.code) {
        throw new Error('لم يتم استلام كود صالح من المحرك.');
      }

      setRawResponse(result.rawText || result.code);
      setGeneratedCode(result.code || result.rawText);

      if (result.fallbackNotice) {
        setFallbackNotice(result.fallbackNotice);
      }

      await saveProject(generatedTitle, prompt.trim(), result.modelUsed, result.code || result.rawText);
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMsg(err.message || 'حدث خطأ أثناء معالجة الطلب عبر المحرك الذكي.');
    } finally {
      setIsLoading(false);
    }
  };

  // Iterative Modification Handler
  const handleIterate = async (instruction: string) => {
    if (!instruction.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);
    setFallbackNotice(null);

    try {
      const result = await requestAppGeneration({
        prompt: instruction.trim(),
        model: selectedModel,
        contextCode: generatedCode,
      });

      if (!result.code) {
        throw new Error('فشل تطبيق التعديل على الكود.');
      }

      setGeneratedCode(result.code);
      setRawResponse(result.rawText || result.code);
      if (result.fallbackNotice) {
        setFallbackNotice(result.fallbackNotice);
      }

      await saveProject(currentTitle + ' (معدل)', instruction, result.modelUsed, result.code);
    } catch (err: any) {
      console.error('Iteration error:', err);
      setErrorMsg(err.message || 'حدث خطأ أثناء تعديل التطبيق.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* High-tech cosmic ambient glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-indigo-900/25 via-purple-900/15 to-transparent blur-3xl -z-10 pointer-events-none"></div>
      <div className="fixed -bottom-20 right-0 w-96 h-96 bg-purple-900/15 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Top Bar Header */}
      <Header
        user={user}
        onOpenAuth={handleDirectGoogleLogin}
        onLogout={handleLogout}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-6">
        
        {/* Error Notification Banner */}
        {errorMsg && (
          <div className="bg-rose-950/80 border border-rose-800/80 rounded-2xl p-4 flex items-center justify-between gap-3 text-rose-300 text-xs sm:text-sm animate-in fade-in duration-200 shadow-xl">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-rose-400 hover:text-white px-2 py-1 cursor-pointer font-medium"
            >
              إغلاق
            </button>
          </div>
        )}

        {/* Fallback Notice Banner */}
        {fallbackNotice && (
          <div className="bg-indigo-950/80 border border-indigo-800/80 rounded-2xl p-3.5 flex items-center gap-2 text-indigo-300 text-xs sm:text-sm animate-in fade-in duration-200 shadow-xl">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{fallbackNotice}</span>
          </div>
        )}

        {/* Switch Between Initial Grand Prompt Box OR The Live Studio Code Screen */}
        {isStudioOpen ? (
          <LiveStudio
            prompt={prompt}
            selectedModel={selectedModel}
            isGenerating={isLoading}
            generatedCode={generatedCode}
            rawResponse={rawResponse}
            currentTitle={currentTitle}
            onNewBuild={() => {
              setIsStudioOpen(false);
              setGeneratedCode('');
              setRawResponse('');
            }}
            onIterate={handleIterate}
            errorMsg={errorMsg}
          />
        ) : (
          <section className="w-full pt-4 sm:pt-8">
            <PromptBox
              prompt={prompt}
              setPrompt={setPrompt}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-sm py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Quorix © 2026 · محرك صناعة التطبيقات والأكواد الذكية</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-slate-400 hover:text-indigo-400 font-medium transition cursor-pointer"
          >
            للأعلى ↑
          </button>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
