import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Camera, 
  Wand2, 
  Copy, 
  Check, 
  Video, 
  User, 
  Layers, 
  ChevronRight,
  ChevronDown,
  Flame,
  HelpCircle,
  Tag,
  Share2
} from 'lucide-react';
import { AppNavbar } from '../components/AppNavbar';
import { Footer } from '../components/Footer';
import { PosterTemplateCard } from '../components/PosterTemplateCard';
import { PageMeta } from '../components/PageMeta';
import { getSortedTrendingPosters } from '../lib/trending-posters';
import { STORE_TEMPLATES } from '../lib/store-catalog';

// Self-contained inline SVG Data URIs for demo widget (zero external image hosts, guaranteed fast & offline-safe)
const SAMPLE_IMAGE_PERFUME = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230c1427"/><stop offset="100%" stop-color="%231e293b"/></linearGradient><linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23fbbf24"/><stop offset="100%" stop-color="%23d97706"/></linearGradient><radialGradient id="sun" cx="50%" cy="40%" r="50%"><stop offset="0%" stop-color="%2338bdf8" stop-opacity="0.3"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs><rect width="600" height="450" fill="url(%23bg)"/><circle cx="300" cy="200" r="180" fill="url(%23sun)"/><path d="M160,340 L440,340 L410,380 L190,380 Z" fill="%23334155" opacity="0.9"/><rect x="250" y="160" width="100" height="170" rx="16" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" stroke-width="2"/><rect x="275" y="125" width="50" height="35" rx="4" fill="url(%23gold)"/><circle cx="300" cy="240" r="24" fill="url(%23gold)" opacity="0.8"/><text x="300" y="246" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23ffffff">MANA</text><path d="M0,380 Q150,370 300,380 T600,380 L600,450 L0,450 Z" fill="%230284c7" opacity="0.35"/></svg>`;

const SAMPLE_IMAGE_COFFEE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%"><defs><linearGradient id="cbg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231c1917"/><stop offset="100%" stop-color="%23292524"/></linearGradient><linearGradient id="warmSun" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f59e0b" stop-opacity="0.4"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs><rect width="600" height="450" fill="url(%23cbg)"/><polygon points="0,0 240,0 480,450 0,450" fill="url(%23warmSun)"/><rect x="180" y="240" width="240" height="140" rx="8" fill="%2344403c"/><ellipse cx="300" cy="240" rx="120" ry="25" fill="%2357534e"/><rect x="270" y="180" width="60" height="60" rx="6" fill="%23e7e5e4"/><path d="M290,165 Q300,140 290,120" stroke="%23ffffff" stroke-width="3" fill="none" opacity="0.6"/><path d="M310,165 Q320,140 310,120" stroke="%23ffffff" stroke-width="3" fill="none" opacity="0.6"/><text x="300" y="415" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23a8a29e">BRUTALIST ESPRESSO BAR</text></svg>`;

const SAMPLE_IMAGE_PORTRAIT = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%"><defs><linearGradient id="pbg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2309090b"/><stop offset="100%" stop-color="%2318181b"/></linearGradient><radialGradient id="rim" cx="65%" cy="35%" r="60%"><stop offset="0%" stop-color="%2338bdf8" stop-opacity="0.5"/><stop offset="50%" stop-color="%230284c7" stop-opacity="0.2"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs><rect width="600" height="450" fill="url(%23pbg)"/><circle cx="350" cy="200" r="190" fill="url(%23rim)"/><ellipse cx="320" cy="210" rx="75" ry="95" fill="%2327272a"/><path d="M220,450 C220,340 420,340 420,450 Z" fill="%233f3f46"/><circle cx="305" cy="200" r="6" fill="%2338bdf8" opacity="0.9"/><circle cx="340" cy="200" r="6" fill="%2338bdf8" opacity="0.9"/><text x="300" y="420" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23e4e4e7">EXECUTIVE EDITORIAL PORTRAIT</text></svg>`;

// Demo sample presets for interactive widget
const DEMO_SAMPLES = [
  {
    id: 'perfume',
    name: 'Minimal Luxury Perfume',
    category: 'Product Shot',
    img: SAMPLE_IMAGE_PERFUME,
    prompt: 'Commercial hero product photograph of a luxury frosted glass fragrance bottle with embossed gold typography, resting on a sculptured rough sandstone pedestal, serene shallow water rippling with delicate caustic sunlight reflections, diffuse northern daylight, 100mm macro f/2.8, Hasselblad H6D-100c, magazine editorial grade --ar 16:9 --style raw',
    lighting: 'Soft ambient daylight + caustic water refractions',
    tags: ['E-Commerce', 'Cosmetics', 'Studio', '8K', 'Macro']
  },
  {
    id: 'coffee',
    name: 'Artisanal Coffee Bar',
    category: 'Branding',
    img: SAMPLE_IMAGE_COFFEE,
    prompt: 'Architectural interior detail of modern brutalist concrete cafe, warm directional morning sunlight casting angular window shadows, micro-cement flooring, matte black espresso machine with delicate steam plume, minimalist Scandinavian aesthetic, Leica M11 35mm f/1.4 --ar 4:5',
    lighting: 'Warm angular morning sunbeams',
    tags: ['Architecture', 'Branding', 'Interior', 'Editorial']
  },
  {
    id: 'portrait',
    name: 'Executive Studio Portrait',
    category: 'Personal Feed',
    img: SAMPLE_IMAGE_PORTRAIT,
    prompt: 'Intimate editorial magazine studio portrait of female creative director, dramatic split key light, deep charcoal seamless backdrop, sharp catchlights in eyes, authentic pores and natural skin texture, Leica SL2 90mm f/2 APO-Summicron, GQ cover standard --ar 4:5',
    lighting: 'Dramatic Profoto beauty dish + rim highlight',
    tags: ['Headshots', 'Editorial', 'Vanity Fair', 'Skin Texture']
  }
];

// FAQ Data
const FAQ_ITEMS = [
  {
    question: 'Which AI image generators do the prompts work with?',
    answer: 'Every prompt generated by ManaDesign is cross-tested and structured for seamless compatibility with Midjourney (v5 & v6), ChatGPT (DALL·E 3), Google Gemini Imagen 3, Stable Diffusion XL, Flux, and Ideogram. Simply copy with one click and paste directly into your generator of choice.'
  },
  {
    question: 'Are my uploaded photos stored on your servers?',
    answer: 'No. Your uploaded photos are analyzed ephemerally solely to read composition, lighting, camera angles, and color palettes. We do not store, distribute, or use your uploaded imagery for model training.'
  },
  {
    question: 'How does pricing work?',
    answer: 'You can test photo-to-prompt extraction and create images for free without an account. For creators and marketing teams seeking signature visual consistency, our curated template systems in the Template Store are one-time lifetime purchases with zero recurring subscription fees.'
  },
  {
    question: 'What is your refund policy?',
    answer: 'Because prompt packs contain instantly accessible digital assets, full sample prompts and feature breakdowns are displayed transparently before purchase. If a template fails to perform as described, contact support within 14 days and we will resolve the issue or process a refund.'
  },
  {
    question: 'Why does the store indicate payments are in demo mode?',
    answer: 'ManaDesign is currently running in full evaluation demo mode (PAYMENTS_ENABLED = false). You can test the checkout workflow without entering any payment credentials, and purchased template packs are unlocked instantly into your library for exploration.'
  }
];

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDemo, setSelectedDemo] = useState(DEMO_SAMPLES[0]);
  const [copiedToast, setCopiedToast] = useState(false);

  // Sorted posters (top 3 shown on landing)
  const sortedPosters = getSortedTrendingPosters();

  // FAQ open state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedDemo.prompt);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2400);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 dark:bg-[#070d18] text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-sky-500 selection:text-white">
      <PageMeta
        title="ManaDesign — AI Prompt & Template Studio"
        description="Upload any photo and get a precise, copyable AI image prompt in seconds. Works with Midjourney, DALL·E, Gemini, Stable Diffusion and more."
        url="https://manadesign.app/"
      />
      <AppNavbar />

      <main className="flex-grow">
        {/* HERO SECTION (Phase 2: Tightened vertical spacing, clamp scaling, wrapped gradient phrase) */}
        <section className="relative pt-6 sm:pt-10 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
          
          {/* Decorative ambient background blur */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-56 bg-sky-200/40 dark:bg-sky-900/20 blur-3xl -z-10 rounded-full pointer-events-none" />

          {/* Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold bg-sky-50/90 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/80 shadow-xs mb-3 sm:mb-4"
          >
            <span className="text-sky-600 dark:text-sky-400 font-bold text-xs">✦</span>
            <span>Photo → copyable prompt, in seconds</span>
          </motion.div>

          {/* Main Headline (clamp scaled: ~2rem on 360px up to 4.5rem on desktop, gradient phrase stays together) */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            style={{ fontSize: 'clamp(2rem, 5.2vw + 0.5rem, 4.5rem)' }}
            className="font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl leading-[1.12] text-balance"
          >
            Campaign-grade imagery,{' '}
            <span className="inline-block whitespace-nowrap text-[#0284c7] dark:text-[#38bdf8]">
              from a single photo
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-700 dark:text-slate-200 max-w-2xl leading-relaxed"
          >
            ManaDesign is an AI image studio for social media marketing and personal projects.
            Upload any photo and get a precise, copyable prompt that recreates its look in
            ChatGPT, Gemini, Midjourney, DALL·E, and Stable Diffusion.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
          >
            <Link
              to="/studio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm sm:text-base font-semibold text-white bg-slate-900 hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 active:scale-98 transition-all shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate your first prompt</span>
            </Link>

            <a
              href="#trending"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm sm:text-base font-semibold text-slate-700 dark:text-white bg-transparent border border-slate-300 dark:border-white/25 hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-400 transition-all shadow-xs"
            >
              <Flame className="w-4 h-4 text-rose-500" />
              <span>Explore trending posters</span>
            </a>
          </motion.div>

          {/* Contrast-compliant sub-copy (WCAG AA 4.5:1) */}
          <p className="mt-3 text-xs font-medium text-slate-600 dark:text-slate-300">
            Free to try &middot; no account required to generate &middot; sign in to keep a library and buy templates
          </p>

          {/* INTERACTIVE DEMO WIDGET (Partially visible above fold on 1366x768 & 390x844) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 sm:mt-8 w-full max-w-5xl bg-white dark:bg-[#0b1220] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xl overflow-hidden text-left"
          >
            {/* Top preset bar */}
            <div className="bg-slate-50 dark:bg-slate-950/60 px-5 sm:px-6 py-2.5 sm:py-3 border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Live Interactive Demo</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 hidden sm:inline">Try preset:</span>
                {DEMO_SAMPLES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => setSelectedDemo(sample)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedDemo.id === sample.id
                        ? 'bg-[#0284c7] text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {sample.category}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Content: Stack vertically on mobile, 2 columns on tablet/desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
              
              {/* Left Column: YOU UPLOAD (WCAG AA High Contrast) */}
              <div className="p-5 sm:p-7 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                    YOU UPLOAD
                  </h3>
                  <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 group">
                    <img
                      src={selectedDemo.img}
                      alt={selectedDemo.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-85" />
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <p className="text-xs font-medium text-sky-300">{selectedDemo.category}</p>
                      <p className="text-sm font-bold truncate">{selectedDemo.name}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                  <span>Gemini Vision analyzes framing & lighting</span>
                  <Link
                    to="/studio"
                    className="inline-flex items-center gap-1 font-bold text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    <span>Upload your own</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Column: MANADESIGN RETURNS (WCAG AA High Contrast) */}
              <div className="p-5 sm:p-7 flex flex-col justify-between bg-slate-50/50 dark:bg-slate-950/20">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      MANADESIGN RETURNS
                    </h3>
                    <div className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-sky-100/80 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800">
                      <span>Midjourney &middot; DALL-E &middot; SD</span>
                    </div>
                  </div>

                  {/* Copyable Prompt Box */}
                  <div 
                    onClick={handleCopy}
                    title="Click to copy sample prompt"
                    className="relative p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed min-h-[130px] shadow-xs cursor-pointer hover:border-sky-400 transition-colors"
                  >
                    {selectedDemo.prompt}
                  </div>

                  {/* Metadata tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selectedDemo.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions with Copy Toast */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {copiedToast ? 'Copied to clipboard!' : 'One click to paste into Midjourney / Gemini'}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0284c7] hover:bg-[#0369a1] transition-colors cursor-pointer ml-auto shadow-xs active:scale-98"
                  >
                    {copiedToast ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedToast ? 'Copied!' : 'Copy prompt'}</span>
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </section>

        {/* TRENDING POSTERS SECTION (#trending) — Landing shows top 3 only */}
        <section id="trending" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-900/40 mb-3">
                <Flame className="w-3.5 h-3.5" />
                <span>TRENDING FESTIVAL POSTERS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Upcoming Festivals & Occasions
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                Ready-to-render poster artwork with traditional toran borders, custom multi-lingual greetings,
                and dedicated cutout space for your personal or brand photo.
              </p>
            </div>

            {/* Total template count badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {sortedPosters.length} ready-to-run templates
              </span>
            </div>
          </div>

          {/* 3-Column Responsive Grid — shows top 3 sorted by date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {sortedPosters.slice(0, 3).map((poster) => (
              <PosterTemplateCard 
                key={poster.id} 
                poster={poster}
                onEditPoster={(p) => navigate(`/studio?template=${p.slug}`)}
              />
            ))}
          </div>

          {/* Bottom link to Studio — shows all posters with full filter */}
          <div className="mt-8 text-center">
            <Link
              to="/studio?tab=trending"
              className="inline-flex items-center gap-2 text-sm font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              <span>View all {sortedPosters.length} festival templates in Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Built for two jobs:{' '}
              <span className="text-[#0284c7] dark:text-[#38bdf8]">
                your brand and your life
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              One studio covers the campaign calendar and the personal feed — with the same standard
              of quality.
            </p>
          </motion.div>

          {/* 3 Step Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
            
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-[#0b1220] rounded-3xl p-8 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-[#0e1e38] text-sky-600 dark:text-[#38bdf8] flex items-center justify-center mb-6">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Upload a photo
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  A product shot, a location, a frame you can't get out of your head. Any image works as
                  the starting point.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-[#0b1220] rounded-3xl p-8 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-[#0e1e38] text-sky-600 dark:text-[#38bdf8] flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  AI reads the picture
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Vision models break down subject, composition, lighting, palette and style — the
                  details that make an image feel professional.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-[#0b1220] rounded-3xl p-8 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-[#0e1e38] text-sky-600 dark:text-[#38bdf8] flex items-center justify-center mb-6">
                  <Wand2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Copy your prompt
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  You get a polished text-to-image prompt, ready for your generator of choice — and
                  ready to reuse across a whole campaign.
                </p>
              </div>
            </motion.div>

          </div>

          <div className="mt-10">
            <Link
              to="/studio"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm sm:text-base font-semibold text-slate-950 bg-[#38bdf8] hover:bg-[#7dd3fc] active:scale-98 transition-all shadow-md shadow-sky-500/20"
            >
              <span>Start with your photo</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>
          </div>
        </section>

        {/* TEMPLATE STORE PREVIEW SECTION (Phase 2: "What's inside a template pack" preview) */}
        <section id="templates" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-[#0b1220] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-lg p-6 sm:p-10 lg:p-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Left Column: Heading, description & CTA */}
              <div className="lg:col-span-5 flex flex-col items-start">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-4">
                  <BookOpen className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>TEMPLATE STORE</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  Consistent feeds, without a design team
                </h3>

                <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Curated prompt systems for product launches, content calendars, local businesses and
                  personal portfolios. Buy a template once, apply it to your own photos, and keep a
                  coherent visual language across every post.
                </p>

                <div className="mt-6 sm:mt-8">
                  <Link
                    to="/store"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-slate-950 bg-[#38bdf8] hover:bg-[#7dd3fc] active:scale-98 transition-all shadow-md shadow-sky-500/20"
                  >
                    <span>Browse the full store</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Template Pack Previews (What's inside: prompt count, sample prompt, target audience) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                {STORE_TEMPLATES.slice(0, 3).map((tpl) => (
                  <Link
                    key={tpl.id}
                    to={`/store/${tpl.slug}`}
                    className="group p-5 rounded-2xl bg-slate-50 hover:bg-sky-50/50 dark:bg-[#0e1626]/90 dark:hover:bg-[#121c30] border border-slate-200/70 dark:border-white/10 flex flex-col gap-3 transition-all hover:border-sky-300 dark:hover:border-white/20 shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-[#38bdf8] transition-colors">
                            {tpl.title}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300">
                            {tpl.promptCount} prompts
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {tpl.shortDescription}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-sky-700 dark:text-[#38bdf8]">
                          ${(tpl.priceCents / 100).toFixed(0)}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* What's Inside Teaser */}
                    <div className="pt-2.5 border-t border-slate-200/60 dark:border-white/5 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <Tag className="w-3 h-3 text-sky-500" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Target audience:</span>
                        <span>{tpl.tags.join(', ')}</span>
                      </div>
                      {tpl.samplePrompts?.[0] && (
                        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-400 truncate">
                          <span className="text-sky-600 dark:text-sky-400 font-bold mr-1">Sample:</span>
                          {tpl.samplePrompts[0]}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

            </div>
          </motion.div>
        </section>

        {/* FAQ ACCORDION SECTION (Phase 2: Complete FAQ covering tools, privacy, pricing, refunds, demo mode) */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Everything you need to know
            </h2>
          </div>

          <div className="space-y-3.5">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0b1220] overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-sky-600 dark:text-sky-400' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ROADMAP / TOOLS SECTION */}
        <section id="tools" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              More <span className="text-[#0284c7] dark:text-[#38bdf8]">tools</span> for every creator
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              The studio roadmap extends the same idea — professional output from simple inputs — into
              video, character and team work.
            </p>
          </motion.div>

          {/* 3 Roadmap Cards with COMING SOON Badge */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
            
            {/* Card 1: AI Video Studio */}
            <Link
              to="/tools/video"
              className="bg-white dark:bg-[#0b1220] rounded-3xl p-8 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-sky-300 dark:hover:border-white/20 transition-all hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#0e1626] flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:scale-105 transition-transform">
                    <Video className="w-5 h-5 text-sky-500" />
                  </div>
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#131d2e] dark:border dark:border-white/5 text-slate-600 dark:text-slate-400">
                    COMING SOON
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  AI Video Studio
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Generate cinematic clips from text or your best images — click to join the early access waitlist.
                </p>
              </div>
            </Link>

            {/* Card 2: Avatar & Character Studio */}
            <Link
              to="/tools/avatar"
              className="bg-white dark:bg-[#0b1220] rounded-3xl p-8 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-sky-300 dark:hover:border-white/20 transition-all hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#0e1626] flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:scale-105 transition-transform">
                    <User className="w-5 h-5 text-sky-500" />
                  </div>
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#131d2e] dark:border dark:border-white/5 text-slate-600 dark:text-slate-400">
                    COMING SOON
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  Avatar & Character Studio
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Turn selfies into shonen anime, comic book or 3D game character styles with specialized portraits.
                </p>
              </div>
            </Link>

            {/* Card 3: Team Workspaces */}
            <Link
              to="/tools/teams"
              className="bg-white dark:bg-[#0b1220] rounded-3xl p-8 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-sky-300 dark:hover:border-white/20 transition-all hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#0e1626] flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:scale-105 transition-transform">
                    <Layers className="w-5 h-5 text-sky-500" />
                  </div>
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#131d2e] dark:border dark:border-white/5 text-slate-600 dark:text-slate-400">
                    COMING SOON
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  Team Workspaces
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Shared libraries and brand presets so agencies and marketing teams can work from one visual standard.
                </p>
              </div>
            </Link>

          </div>

          {/* BOTTOM BANNER (Phase 2: Buttons stack full-width on mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 bg-white dark:bg-[#0e1626] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xl p-8 sm:p-14 text-center max-w-4xl mx-auto"
          >
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Your next post starts with a prompt
            </h3>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              Create an account to save your library and purchase templates — or start generating right away, no sign-up needed.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 w-full sm:w-auto">
              <Link
                to="/studio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-slate-950 bg-[#38bdf8] hover:bg-[#7dd3fc] active:scale-98 transition-all shadow-md shadow-sky-500/25"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Open the Studio</span>
              </Link>
              <Link
                to="/auth"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-slate-700 dark:text-white bg-slate-50 dark:bg-[#131b2c] border border-slate-200 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-[#182339] transition-all shadow-xs"
              >
                <User className="w-4 h-4 text-slate-500 dark:text-slate-300" />
                <span>Sign up free</span>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
