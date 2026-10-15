import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xs py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-md bg-slate-950 dark:bg-white flex items-center justify-center text-white dark:text-slate-950 font-mono text-xs font-bold">
              ✦_
            </div>
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
              ManaDesign
            </span>
          </Link>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">&middot;</span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The AI prompt and template studio for social media marketing.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-400">
          <Link to="/studio" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
            Studio
          </Link>
          <Link to="/store" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
            Template Store
          </Link>
          <Link to="/dashboard" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
            Library
          </Link>
          <Link to="/settings" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
            Settings
          </Link>
          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Gemini 2.5 Flash Connected
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
        <p>&copy; {new Date().getFullYear()} ManaDesign. Crafted for creators & marketing teams.</p>
        <p className="flex items-center gap-1">
          Powered by Google Gemini AI &middot; Midjourney, DALL-E & Stable Diffusion Ready
        </p>
      </div>
    </footer>
  );
};
