import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bookmark, 
  Trash2, 
  Copy, 
  Check, 
  Sparkles, 
  ShoppingBag, 
  ExternalLink, 
  Wand2, 
  Clock, 
  Layers,
  ArrowRight,
  Settings,
  Sun,
  Moon,
  Monitor,
  Key,
  LogOut,
  Save,
  User,
  CheckCircle2,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { AppNavbar } from '../components/AppNavbar';
import { Footer } from '../components/Footer';
import { PageMeta } from '../components/PageMeta';
import { useConvexData } from '../lib/convex-client';
import { formatPrice } from '../lib/store-catalog';
import { useAuth } from '../hooks/use-auth';
import { useDarkMode } from '../hooks/use-dark-mode';
import { getGeminiApiKey, setGeminiApiKey } from '../lib/gemini';

export const Dashboard: React.FC = () => {
  const { prompts, deletePrompt, templates, purchasedTemplateSlugs } = useConvexData();
  const { user, signOut, isAuthenticated } = useAuth();
  const { theme, setTheme } = useDarkMode();

  const [activeTab, setActiveTab] = useState<'prompts' | 'templates' | 'settings'>('prompts');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState(getGeminiApiKey());
  const [isSavedKey, setIsSavedKey] = useState(false);
  const [searchPromptQuery, setSearchPromptQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('manadesign_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('manadesign_favorites', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Filter templates that user owns
  const purchasedTemplates = templates.filter((t) => purchasedTemplateSlugs.includes(t.slug));

  // Filtered prompts based on search and favorite filter
  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch =
      !searchPromptQuery.trim() ||
      p.prompt.toLowerCase().includes(searchPromptQuery.toLowerCase()) ||
      p.subject?.toLowerCase().includes(searchPromptQuery.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(searchPromptQuery.toLowerCase()));

    const matchesFav = !showOnlyFavorites || favorites.includes(p._id);
    return matchesSearch && matchesFav;
  });

  const handleCopyPrompt = (promptText: string, id: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Remove this saved prompt from your library?')) {
      await deletePrompt(id);
    }
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(apiKeyInput);
    setIsSavedKey(true);
    setTimeout(() => setIsSavedKey(false), 2000);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 dark:bg-slate-950">
      <PageMeta
        title="My Library & Dashboard | ManaDesign"
        description="Manage your saved AI prompts, photo extractions, and purchased master template packs."
      />
      <AppNavbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        {/* Header with Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800 mb-3 shadow-xs">
              <Bookmark className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>PERSONAL WORKSPACE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              My Library
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Your saved AI prompts, photo extractions, and purchased template packs.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2 px-4 shadow-xs">
            <div className="text-center px-3 border-r border-slate-100 dark:border-slate-800">
              <span className="block text-lg font-bold text-slate-900 dark:text-white">{prompts.length}</span>
              <span className="text-[11px] text-slate-400">Prompts</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-lg font-bold text-sky-600 dark:text-sky-400">{purchasedTemplates.length}</span>
              <span className="text-[11px] text-slate-400">Templates</span>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-8 mb-8">
          <div className="inline-flex p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-x-auto">
            <button
              onClick={() => setActiveTab('prompts')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
                activeTab === 'prompts'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Saved Prompts ({prompts.length})
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
                activeTab === 'templates'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Purchased Templates ({purchasedTemplates.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap min-h-[44px] ${
                activeTab === 'settings'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Settings
            </button>
          </div>

          <Link
            to="/studio"
            className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white transition-colors min-h-[44px]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate New Prompt</span>
          </Link>
        </div>

        {/* PROMPTS TAB */}
        {activeTab === 'prompts' && (
          <div>
            {/* Search and Favorite Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  value={searchPromptQuery}
                  onChange={(e) => setSearchPromptQuery(e.target.value)}
                  placeholder="Search saved prompts by keyword or tag..."
                  className="w-full pl-4 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-base sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer min-h-[44px] ${
                    showOnlyFavorites
                      ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span>★</span>
                  <span>Favorites Only ({favorites.length})</span>
                </button>
              </div>
            </div>

            {filteredPrompts.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {prompts.length === 0 ? 'No prompts saved yet' : 'No matching prompts found'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                  {prompts.length === 0
                    ? 'Upload a photo in the Studio or generate an image to save your first campaign prompt.'
                    : 'Try clearing your search query or toggling off the favorites filter.'}
                </p>
                <Link
                  to="/studio"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs sm:text-sm font-semibold min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Go to Studio</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPrompts.map((p) => {
                  const isFav = favorites.includes(p._id);
                  return (
                    <div
                      key={p._id}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
                    >
                      <div>
                        {/* Top Bar: Thumbnail + Date + Actions (at least 44px tall buttons) */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            {p.thumbnail && (
                              <img
                                src={p.thumbnail}
                                alt="Thumbnail"
                                className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                              />
                            )}
                            <div>
                              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[200px]">
                                {p.subject || 'Studio Prompt'}
                              </span>
                              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(p.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                            {/* Favorite Button (>= 44px) */}
                            <button
                              onClick={() => toggleFavorite(p._id)}
                              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border transition-colors cursor-pointer ${
                                isFav
                                  ? 'bg-amber-50 text-amber-500 border-amber-300 dark:bg-amber-950/60 dark:border-amber-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:text-amber-500'
                              }`}
                              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              <span className="text-base">{isFav ? '★' : '☆'}</span>
                            </button>

                            {/* Copy Button (>= 44px) */}
                            <button
                              onClick={() => handleCopyPrompt(p.prompt, p._id)}
                              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/60 text-slate-600 dark:text-slate-300 hover:text-sky-600 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                              title="Copy prompt"
                            >
                              {copiedPromptId === p._id ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>

                            {/* Delete Button (>= 44px) */}
                            <button
                              onClick={() => handleDelete(p._id)}
                              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                              title="Delete prompt"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Prompt Content */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800 font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300 line-clamp-4">
                          {p.prompt}
                        </div>

                        {/* Tags */}
                        {p.tags && p.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {p.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bottom Action: Send to Studio (min-h-[44px] on mobile) */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">Midjourney &middot; DALL-E</span>
                        <Link
                          to={`/studio?tab=generate`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline min-h-[44px]"
                        >
                          <Wand2 className="w-4 h-4" />
                          <span>Open in Image Studio &rarr;</span>
                        </Link>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <div>
            {purchasedTemplates.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  No purchased templates yet
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                  Browse our curated packs for social grids, campaign launches, and editorial portraits.
                </p>
                <Link
                  to="/store"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Browse Template Store</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasedTemplates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div
                      className={`h-32 w-full bg-gradient-to-tr ${tpl.gradientClass} p-5 flex flex-col justify-between text-white relative`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/25">
                          {tpl.category}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                          Owned
                        </span>
                      </div>
                      <h3 className="text-lg font-bold tracking-tight text-white drop-shadow-xs">
                        {tpl.title}
                      </h3>
                    </div>

                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {tpl.description}
                      </p>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-medium">
                          {tpl.promptCount} prompts
                        </span>
                        <Link
                          to={`/store/${tpl.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#0284c7] hover:underline"
                        >
                          <span>View pack prompts</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-8">

            {/* 1. Appearance */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">Interface Appearance</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Switch between light mode, deep dark mode, or follow your system preference.</p>
              <div className="grid grid-cols-3 gap-3 max-w-md">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer capitalize ${
                      theme === t
                        ? 'border-sky-500 bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 shadow-xs ring-2 ring-sky-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {t === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
                    {t === 'dark' && <Moon className="w-4 h-4 text-sky-400" />}
                    {t === 'system' && <Monitor className="w-4 h-4 text-slate-400" />}
                    <span>{t}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Account Information */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Account Information</h2>
                {isAuthenticated ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Linked &amp; Verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Guest Mode</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Your profile credentials, sync status, and tier information.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
                {[
                  { label: 'User Identifier', value: user?._id || 'Guest Session', mono: true },
                  { label: 'Email Address', value: user?.email || 'guest@manadesign.studio', mono: false },
                  { label: 'Plan Tier', value: 'Creator Studio Pro (Demo Unlimited)', mono: false, highlight: true },
                  { label: 'Account Role', value: (user?.role || 'CREATOR').toUpperCase(), mono: false }
                ].map(({ label, value, mono, highlight }) => (
                  <div key={label} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 dark:text-slate-500 block mb-1">{label}</span>
                    <span className={`font-semibold ${ highlight ? 'text-sky-600 dark:text-sky-400' : 'text-slate-800 dark:text-slate-200' } ${ mono ? 'font-mono' : '' }`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              {isAuthenticated && (
                <button
                  onClick={() => { if (confirm('Sign out of your account?')) signOut(); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>

            {/* 3. Gemini API Key */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 mb-1">
                <ShieldCheck className="w-5 h-5 text-sky-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Gemini AI Engine</h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Provide your own Gemini API key for unlimited AI image prompt generation.</p>
              <form onSubmit={handleSaveApiKey} className="flex items-center gap-3 max-w-lg">
                <div className="relative flex-grow">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIza..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/70 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
                >
                  {isSavedKey ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                  <span>{isSavedKey ? 'Saved!' : 'Save Key'}</span>
                </button>
              </form>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};
