import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  FolderKanban, 
  Sliders, 
  User, 
  Menu, 
  X, 
  Flame, 
  Layers, 
  HelpCircle,
  LogIn,
  Bookmark
} from 'lucide-react';
import { useAuth } from '../hooks/use-auth';

interface AppNavbarProps {
  showBack?: boolean;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({ showBack }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  const isLanding = location.pathname === '/';
  const returnTo = encodeURIComponent(location.pathname + location.search);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  // Handle Escape key and focus trap inside mobile menu
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        hamburgerButtonRef.current?.focus();
        return;
      }

      if (e.key === 'Tab' && mobileMenuRef.current) {
        const focusableElements = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Smooth scroll handler for anchor links
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (isLanding) {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${targetId}`);
      }
    }
    setMobileMenuOpen(false);
  };

  // Avatar component
  const renderAvatar = () => {
    if (isAuthenticated && user) {
      const initial = (user.name?.[0] || user.email?.[0] || 'U').toUpperCase();
      return (
        <Link
          to="/settings"
          aria-label={`Profile settings for ${user.name || 'user'}`}
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-[#0284c7] to-[#38bdf8] text-white font-bold text-xs shadow-sm hover:ring-2 hover:ring-sky-400 hover:ring-offset-2 dark:hover:ring-offset-slate-900 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
          title={`Signed in as ${user.name || user.email}`}
        >
          {user.image ? (
            <img src={user.image} alt={user.name || 'User'} className="w-full h-full object-cover rounded-full" />
          ) : (
            <span>{initial}</span>
          )}
        </Link>
      );
    }

    return (
      <Link
        to={`/auth?returnTo=${returnTo}`}
        aria-label="Sign in"
        className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-400 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
        title="Sign in to your account"
      >
        <User className="w-4 h-4" />
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 dark:bg-[#090e1c]/90 border-b border-slate-200/70 dark:border-white/10 transition-colors pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        
        {/* Left Section: Back Button or Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back to previous page"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white transition-colors cursor-pointer mr-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0284c7] via-[#0ea5e9] to-[#38bdf8] flex items-center justify-center text-white shadow-md shadow-sky-500/20 transition-transform group-hover:scale-105">
              <Sparkles className="w-4 h-4 text-white fill-white/20" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
              ManaDesign
            </span>
          </Link>
        </div>

        {/* Center Section: Desktop Navigation Links (How it works / Trending / Templates / Tools) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main Navigation">
          <a
            href={isLanding ? '#how-it-works' : '/#how-it-works'}
            onClick={(e) => handleAnchorClick(e, 'how-it-works')}
            className="text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            How it works
          </a>
          <a
            href={isLanding ? '#trending' : '/#trending'}
            onClick={(e) => handleAnchorClick(e, 'trending')}
            className="text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Trending</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40">
              Hot
            </span>
          </a>
          <Link
            to="/store"
            className="text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            Templates
          </Link>
          <a
            href={isLanding ? '#tools' : '/#tools'}
            onClick={(e) => handleAnchorClick(e, 'tools')}
            className="text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            Tools
          </a>
        </nav>

        {/* Right Section: Ordered strictly [My library / Sign in] → [Open Studio] → [Profile avatar] */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* 1. [My library / Sign in] */}
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800 transition-all shadow-xs"
            >
              <Bookmark className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>My library</span>
            </Link>
          ) : (
            <Link
              to={`/auth?returnTo=${returnTo}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800 transition-all shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Sign in</span>
            </Link>
          )}

          {/* 2. [Open Studio] */}
          <Link
            to="/studio"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#0284c7] hover:bg-[#0369a1] active:scale-98 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Studio</span>
          </Link>

          {/* 3. [Profile avatar] (Avatar LAST, far right) */}
          {renderAvatar()}

          {/* Mobile menu toggle (hamburger) for screens < 768px */}
          <button
            ref={hamburgerButtonRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-panel"
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Glass Panel */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-panel"
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="md:hidden border-b border-slate-200/80 dark:border-white/10 glass-strong shadow-xl px-4 py-5 transition-all"
        >
          <nav className="flex flex-col gap-2" aria-label="Mobile Navigation Links">
            <a
              href={isLanding ? '#how-it-works' : '/#how-it-works'}
              onClick={(e) => handleAnchorClick(e, 'how-it-works')}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>How it works</span>
            </a>

            <a
              href={isLanding ? '#trending' : '/#trending'}
              onClick={(e) => handleAnchorClick(e, 'trending')}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>Trending Posters</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40">
                Hot
              </span>
            </a>

            <Link
              to="/store"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
            >
              <FolderKanban className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Template Store</span>
            </Link>

            <a
              href={isLanding ? '#tools' : '/#tools'}
              onClick={(e) => handleAnchorClick(e, 'tools')}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
            >
              <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Creator Tools</span>
            </a>

            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
            >
              <Sliders className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Settings</span>
            </Link>

            {/* Separator */}
            <div className="my-2 border-t border-slate-200/60 dark:border-slate-800" />

            {/* Mobile Actions: My Library / Sign In */}
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Bookmark className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>My library</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">View saved</span>
              </Link>
            ) : (
              <Link
                to={`/auth?returnTo=${returnTo}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:text-sky-300 dark:hover:bg-sky-900/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <LogIn className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>Sign in / Create account</span>
                </div>
                <span className="text-xs font-normal">Free</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
