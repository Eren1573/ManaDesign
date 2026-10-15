import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldAlert, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/use-auth';

interface RequireAuthProps {
  children: React.ReactNode;
  redirectImmediately?: boolean;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children, redirectImmediately = false }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Guests are allowed to access most features, but if strict auth is needed:
  // Allow if authenticated OR if user object exists (guest mode is permitted for demo)
  if (!user) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);

    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Sign in required
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          Sign in to access your personal prompt library, view purchased templates, and sync across devices.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to={`/auth?returnTo=${returnUrl}`}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-sm transition-colors shadow-sm"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign in or create account</span>
          </Link>

          <Link
            to="/studio"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>Try studio first</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
