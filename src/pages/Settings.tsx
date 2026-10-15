import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  Monitor, 
  User, 
  Key, 
  Trash2, 
  LogOut, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Zap,
  Save,
  Mail,
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { AppNavbar } from '../components/AppNavbar';
import { Footer } from '../components/Footer';
import { PageMeta } from '../components/PageMeta';
import { useDarkMode, Theme } from '../hooks/use-dark-mode';
import { useAuth } from '../hooks/use-auth';
import { getGeminiApiKey, setGeminiApiKey } from '../lib/gemini';

export const Settings: React.FC = () => {
  const { theme, setTheme } = useDarkMode();
  const { user, signIn, signOut, isAuthenticated } = useAuth();

  const [apiKeyInput, setApiKeyInput] = useState(getGeminiApiKey());
  const [isSavedKey, setIsSavedKey] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Inline Account Linking state
  const [linkEmail, setLinkEmail] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState(false);
  const [linkError, setLinkError] = useState('');

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(apiKeyInput);
    setIsSavedKey(true);
    setTimeout(() => setIsSavedKey(false), 2000);
  };

  const handleResetData = () => {
    if (confirm('Reset your library prompts and orders to initial demo state?')) {
      localStorage.removeItem('manadesign_prompts');
      localStorage.removeItem('manadesign_orders');
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  const handleInlineLinkAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkEmail || !linkEmail.includes('@')) {
      setLinkError('Please enter a valid email address');
      return;
    }

    setLinkError('');
    setIsLinking(true);
    try {
      // Complete email link via simulated OTP
      await signIn('email-otp', { email: linkEmail, code: '123456' });
      setLinkSuccess(true);
      setTimeout(() => setLinkSuccess(false), 3000);
    } catch (err: any) {
      setLinkError('Failed to link account. Please try again.');
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 dark:bg-[#070d18] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <PageMeta
        title="Settings & Preferences | ManaDesign"
        description="Manage theme preferences, API keys, and account authentication on ManaDesign."
      />
      <AppNavbar />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Settings & Preferences
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your visual appearance, account details, and AI engine integrations.
          </p>
        </div>

        <div className="space-y-8">
          
          {/* 1. Appearance / Theme (Horizontal Segmented Toggle) */}
          <div className="bg-white dark:bg-[#0c1427] rounded-3xl border border-slate-200/80 dark:border-[#1e293b] p-6 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Interface Appearance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Switch between light mode, deep dark mode, or follow your system preference.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:max-w-md">
              <button
                onClick={() => setTheme('light')}
                className={`min-h-[44px] w-full flex items-center justify-center gap-2 p-3 rounded-2xl border text-sm font-semibold transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-sky-500 bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 shadow-xs ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#111c38]'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light</span>
              </button>

              <button
                onClick={() => setTheme('dark')}
                className={`min-h-[44px] w-full flex items-center justify-center gap-2 p-3 rounded-2xl border text-sm font-semibold transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-sky-500 bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 shadow-xs ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#111c38]'
                }`}
              >
                <Moon className="w-4 h-4 text-sky-400" />
                <span>Dark</span>
              </button>

              <button
                onClick={() => setTheme('system')}
                className={`min-h-[44px] w-full flex items-center justify-center gap-2 p-3 rounded-2xl border text-sm font-semibold transition-all cursor-pointer ${
                  theme === 'system'
                    ? 'border-sky-500 bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 shadow-xs ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#111c38]'
                }`}
              >
                <Monitor className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>System</span>
              </button>
            </div>
          </div>

          {/* 2. Account Information & Sign-in Link */}
          <div className="bg-white dark:bg-[#0c1427] rounded-3xl border border-slate-200/80 dark:border-[#1e293b] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Account Information
              </h2>
              {isAuthenticated ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Linked & Verified</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Guest Mode (Not Linked)</span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Your profile credentials, sync status, and tier information.
            </p>

            {/* Profile Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#080e1d] border border-slate-100 dark:border-[#1e293b]">
                <span className="text-slate-400 dark:text-slate-500 block mb-1">User Identifier</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {user?._id || 'Guest Session'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#080e1d] border border-slate-100 dark:border-[#1e293b]">
                <span className="text-slate-400 dark:text-slate-500 block mb-1">Email Address</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {user?.email || 'guest@manadesign.studio'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#080e1d] border border-slate-100 dark:border-[#1e293b]">
                <span className="text-slate-400 dark:text-slate-500 block mb-1">Plan Tier</span>
                <span className="font-semibold text-sky-600 dark:text-sky-400">
                  Creator Studio Pro (Demo Unlimited)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#080e1d] border border-slate-100 dark:border-[#1e293b]">
                <span className="text-slate-400 dark:text-slate-500 block mb-1">Account Role</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase">
                  {user?.role || 'CREATOR'}
                </span>
              </div>
            </div>

            {/* SIGN IN / ACCOUNT LINKING CALLOUT (Automatic Link) */}
            {!isAuthenticated ? (
              <div className="mb-6 p-5 rounded-2xl bg-sky-50/70 dark:bg-[#0a152e] border border-sky-200 dark:border-sky-900/60">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-sky-950 dark:text-sky-200">
                      Link Your Email to Save Your Library
                    </h3>
                    <p className="text-xs text-sky-800/80 dark:text-sky-300/80 mt-0.5 leading-relaxed">
                      You are currently using a temporary guest session. Link your email below to automatically preserve your saved prompts, purchased templates, and sync across devices.
                    </p>
                  </div>
                </div>

                {linkSuccess ? (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Your account has been successfully linked and verified!</span>
                  </div>
                ) : (
                  <form onSubmit={handleInlineLinkAccount} className="mt-4 flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-grow">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={linkEmail}
                        onChange={(e) => setLinkEmail(e.target.value)}
                        placeholder="Enter your email to link account..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-sky-200 dark:border-sky-800 bg-white dark:bg-[#080e1d] text-base sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLinking}
                      className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      <span>{isLinking ? 'Linking...' : 'Link Email Now'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}

                {linkError && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 mt-2 font-medium">
                    {linkError}
                  </p>
                )}

                <div className="mt-3 pt-3 border-t border-sky-100 dark:border-sky-900/40 flex items-center justify-between text-[11px] text-sky-800/70 dark:text-sky-400/80">
                  <span>Instant demo OTP verification</span>
                  <Link
                    to="/auth?returnTo=/settings"
                    className="font-semibold text-sky-600 dark:text-sky-300 hover:underline"
                  >
                    Open dedicated sign-in page &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50/60 dark:bg-[#071d18] border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs text-emerald-900 dark:text-emerald-200">
                    Your account is actively linked to <strong>{user?.email}</strong>. All prompts and purchased packs are synced.
                  </span>
                </div>
                <Link
                  to="/auth?returnTo=/settings"
                  className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline shrink-0"
                >
                  Switch Account
                </Link>
              </div>
            )}

            {/* Footer row: Sign-out button (Full width & min-h 44px on mobile) */}
            <div className="pt-4 border-t border-slate-100 dark:border-[#1e293b] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Current session: {user?.name || 'Guest Creator'}
              </span>
              <button
                onClick={signOut}
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>

          {/* 3. Google Gemini AI Key Config */}
          <div className="bg-white dark:bg-[#0c1427] rounded-3xl border border-slate-200/80 dark:border-[#1e293b] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Key className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Google Gemini API Key (Optional)
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Connect your own Gemini API key for live calls to Gemini 2.5 Flash / Gemini 3.8 Flash Vision and Imagen models. If left blank, ManaDesign uses built-in smart prompt generation.
            </p>

            <form onSubmit={handleSaveApiKey} className="space-y-4 max-w-xl">
              <div className="relative">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#080e1d] text-base sm:text-sm font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavedKey ? 'Key Saved!' : 'Save Key'}</span>
                </button>

                {apiKeyInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setApiKeyInput('');
                      setGeminiApiKey('');
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline cursor-pointer"
                  >
                    Clear key
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* 4. Data Management / Reset */}
          <div className="bg-white dark:bg-[#0c1427] rounded-3xl border border-slate-200/80 dark:border-[#1e293b] p-6 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Reset Demo Data
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Restore your library and purchases back to pristine initial state for testing.
            </p>

            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1e293b] hover:bg-slate-50 dark:hover:bg-[#111c38] text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{resetSuccess ? 'Data Reset!' : 'Reset Demo Library'}</span>
            </button>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};
