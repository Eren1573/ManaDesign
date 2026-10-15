import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderKanban, 
  Search, 
  Sparkles, 
  Tag, 
  Check, 
  ArrowRight, 
  CheckCircle2,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { AppNavbar } from '../components/AppNavbar';
import { Footer } from '../components/Footer';
import { PageMeta } from '../components/PageMeta';
import { useConvexData } from '../lib/convex-client';
import { formatPrice } from '../lib/store-catalog';
import { useAuth } from '../hooks/use-auth';

export const Store: React.FC = () => {
  const { templates, isTemplatePurchased } = useConvexData();
  const { isAuthenticated } = useAuth();
  
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Marketing' | 'Personal'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter((tpl) => {
    const matchesCategory = selectedCategory === 'All' || tpl.category === selectedCategory;
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 dark:bg-slate-950">
      <PageMeta
        title="Template Store | ManaDesign"
        description="Professional AI prompt systems for social media, festivals, and personal branding. Buy once, customize with your photos."
      />
      <AppNavbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800 mb-4 shadow-xs">
            <FolderKanban className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>CURATED PROMPT PACKS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Template Store
          </h1>

          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Professional prompt systems designed for visual consistency. Buy once, customize with your
            own photos, and maintain a signature style across every channel.
          </p>
        </div>

        {/* Guest sign-in nudge if not signed in */}
        {!isAuthenticated && (
          <div className="mb-8 p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
              <span className="text-sm text-sky-900 dark:text-sky-200">
                Browsing in demo mode. Any template you buy is immediately saved to your library for testing!
              </span>
            </div>
            <Link
              to="/auth"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white whitespace-nowrap transition-colors"
            >
              Sign in for cloud sync
            </Link>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 self-stretch sm:self-auto">
            {(['All', 'Marketing', 'Personal'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates & tags..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-base sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Grid of Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTemplates.map((tpl) => {
            const isPurchased = isTemplatePurchased(tpl.slug);

            return (
              <div
                key={tpl.id}
                className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden"
              >
                {/* Vibrant Gradient Cover */}
                <div
                  className={`h-40 w-full bg-gradient-to-tr ${tpl.gradientClass} p-6 flex flex-col justify-between text-white relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-xs">
                      {tpl.category}
                    </span>
                    {isPurchased ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Owned</span>
                      </span>
                    ) : (
                      <span className="text-lg font-extrabold bg-black/30 backdrop-blur-xs px-2.5 py-0.5 rounded-lg">
                        {formatPrice(tpl.priceCents)}
                      </span>
                    )}
                  </div>

                  <div className="z-10">
                    <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-xs">
                      {tpl.title}
                    </h3>
                    <p className="text-xs text-white/80 mt-0.5">
                      {tpl.promptCount} modular prompts included
                    </p>
                  </div>

                  {/* Decorative faint glow circle */}
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                </div>

                {/* Card Content */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {tpl.description}
                    </p>

                    {/* Highlights bullet points preview */}
                    <div className="space-y-1.5 mb-4">
                      {tpl.highlights.slice(0, 2).map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <Check className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{h}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {tpl.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      {tpl.recommendedModel}
                    </span>

                    <Link
                      to={`/store/${tpl.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284c7] hover:text-[#0369a1] dark:text-sky-400 dark:hover:text-sky-300 transition-colors"
                    >
                      <span>{isPurchased ? 'View in Library' : 'View pack'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </main>

      <Footer />
    </div>
  );
};
