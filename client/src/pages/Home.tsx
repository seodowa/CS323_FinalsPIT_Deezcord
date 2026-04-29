import { useState, useEffect } from 'react';
import AsyncButton from '../components/AsyncButton';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const [rooms] = useState<{ id: string, name: string }[]>([
    { id: '1', name: 'General Discussion' },
    { id: '2', name: 'Project Alpha' },
    { id: '3', name: 'Random Memes' },
  ]);
  const { addToast } = useToast();
  const { logout } = useAuth();

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setTimeout(() => setIsDarkMode(true), 0);
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      setTimeout(() => setIsDarkMode(false), 0);
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleLogout = async () => {
    // Simulate async logout for UI feedback
    await new Promise(resolve => setTimeout(resolve, 600));
    logout();
    addToast('You have been signed out.', 'info');
    // Force a full reload to reset App.tsx state completely
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950 relative overflow-hidden font-sans text-slate-900 dark:text-slate-50 transition-colors duration-500">
      
      {/* Background Blobs for Visual Aesthetics (Matched with Login/Register) */}
      <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-blue-500/30 dark:bg-blue-500/15 rounded-full blur-[80px] z-0 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[20%] w-[350px] h-[350px] bg-purple-500/30 dark:bg-purple-500/15 rounded-full blur-[80px] z-0 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* Sidebar - Glassmorphic to match theme */}
      <aside className="w-72 bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border-r border-slate-200/50 dark:border-white/10 flex flex-col z-10 transition-colors duration-500 shadow-sm">
        <div className="p-6 border-b border-slate-200/50 dark:border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-blue-500 dark:text-blue-400">Deezcord</h2>
          {mounted && (
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-white/10 hover:scale-105 hover:shadow-md transition-all duration-300"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 1V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 21V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.22 4.22L5.64 5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.36 18.36L19.78 19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.22 19.78L5.64 18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 mb-2">
            Available Rooms
          </div>
          {rooms.map(room => (
            <button 
              key={room.id}
              className="w-full text-left px-3 py-2 rounded-xl bg-transparent hover:bg-white/50 dark:hover:bg-slate-700/50 border border-transparent hover:border-slate-200/50 dark:hover:border-white/10 transition-all duration-200 group flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center text-blue-500 dark:text-blue-400 font-bold group-hover:bg-blue-500 group-hover:text-white dark:group-hover:bg-blue-500 dark:group-hover:text-white transition-all">
                #
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">{room.name}</span>
            </button>
          ))}
          <button className="w-full text-left px-3 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-slate-500 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-200 mt-4 flex items-center gap-3 bg-transparent hover:bg-blue-50/50 dark:hover:bg-blue-900/20">
             <div className="w-8 h-8 flex items-center justify-center text-xl">+</div>
             <span className="font-medium">Create Room</span>
          </button>
        </div>

        <div className="p-4 border-t border-slate-200/50 dark:border-white/10">
          <AsyncButton 
            onClick={handleLogout}
            className="w-full px-4 py-2.5 bg-white/50 dark:bg-slate-700/50 hover:bg-red-500/90 dark:hover:bg-red-500/90 text-red-500 dark:text-red-400 hover:text-white dark:hover:text-white rounded-xl font-semibold border border-red-100 dark:border-red-900/30 hover:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Sign Out
          </AsyncButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col z-10">
        {/* Header - Glassmorphic */}
        <header className="h-20 border-b border-slate-200/50 dark:border-white/10 flex items-center px-8 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-sm shadow-blue-500/20">
              #
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-50">General Discussion</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">The main hub for all members</p>
            </div>
          </div>
        </header>

        {/* Welcome Message Area */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
          {/* Glassmorphic Card (Matches Login Card) */}
          <div className="max-w-2xl w-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-3xl p-10 md:p-12 text-center shadow-2xl animate-fade-in-up">
            <div className="w-24 h-24 bg-blue-500 rounded-3xl mx-auto mb-8 flex items-center justify-center text-5xl shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/20">
              👋
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-slate-50">Welcome to Deezcord</h2>
            <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
              You've successfully joined the community! Select a room from the sidebar to start chatting or create a new one to invite your friends.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-white/5 text-left shadow-sm transition-transform hover:-translate-y-1 duration-300">
                  <div className="w-10 h-10 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-500 mb-4 text-xl">⚡</div>
                  <h3 className="font-bold mb-2 text-slate-900 dark:text-slate-50">Real-time Chat</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Powered by WebSockets for instant, low-latency messaging across all active rooms.</p>
               </div>
               <div className="p-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-white/5 text-left shadow-sm transition-transform hover:-translate-y-1 duration-300">
                  <div className="w-10 h-10 bg-purple-500/10 dark:bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-500 mb-4 text-xl">🔒</div>
                  <h3 className="font-bold mb-2 text-slate-900 dark:text-slate-50">Safe & Secure</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Protected by Supabase Authentication ensuring your data and identity remain private.</p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
