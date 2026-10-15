import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Upload, 
  Copy, 
  Check, 
  ArrowRight, 
  User, 
  X,
  Languages,
  Edit3
} from 'lucide-react';
import { TrendingPoster, PosterLanguage, buildPosterPrompt } from '../lib/trending-posters';
import { fileToDataUrl } from '../lib/image';
import { track } from '../lib/analytics';

interface PosterTemplateCardProps {
  poster: TrendingPoster;
  compact?: boolean;
  onEditPoster?: (poster: TrendingPoster) => void;
  onSelectForStudio?: (poster: TrendingPoster, customGreeting: string, customName: string, lang: PosterLanguage, photoUrl: string | null) => void;
  onApplyPoster?: (poster: TrendingPoster, customGreeting: string, customName: string, lang: PosterLanguage, photoUrl: string | null) => void;
}

export const PosterTemplateCard: React.FC<PosterTemplateCardProps> = ({
  poster,
  compact = false,
  onEditPoster,
  onSelectForStudio,
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedLanguage, setSelectedLanguage] = useState<PosterLanguage>('English');
  const [customGreeting, setCustomGreeting] = useState(poster.greetingsByLang['English'] || poster.greeting);
  const [customName, setCustomName] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Switch language and update default greeting
  const handleLanguageChange = (lang: PosterLanguage) => {
    setSelectedLanguage(lang);
    setCustomGreeting(poster.greetingsByLang[lang] || poster.greeting);
  };

  // Photo upload handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setPhotoPreview(dataUrl);
    } catch (err) {
      console.error('Failed to read image:', err);
    }
  };

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    const readyPrompt = buildPosterPrompt(poster, {
      customGreeting,
      customName,
      language: selectedLanguage,
      hasPhoto: !!photoPreview,
    });
    navigator.clipboard.writeText(readyPrompt);
    track({ name: 'prompt_copied', props: { target: 'generic' } });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyToGenerator = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation();
    track({ name: 'poster_clicked', props: { slug: poster.slug, title: poster.title } });
    if (onApplyPoster) {
      onApplyPoster(poster, customGreeting, customName, selectedLanguage, photoPreview);
    } else {
      handleTriggerEdit(e);
    }
  };

  const handleTriggerEdit = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation();
    track({ name: 'poster_clicked', props: { slug: poster.slug, title: poster.title } });
    if (onEditPoster) {
      onEditPoster(poster);
    } else if (onApplyPoster) {
      onApplyPoster(poster, customGreeting, customName, selectedLanguage, photoPreview);
    } else if (onSelectForStudio) {
      onSelectForStudio(poster, customGreeting, customName, selectedLanguage, photoPreview);
    } else {
      navigate(`/studio?template=${poster.slug}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTriggerEdit();
    }
  };

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`Trending poster template: ${poster.title}. Press Enter to edit.`}
      onKeyDown={handleKeyDown}
      className="group relative flex flex-col rounded-3xl bg-white dark:bg-[#0b1220] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 overflow-hidden cursor-pointer text-left"
    >
      {/* Hidden File Input for photo picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* Card Header with Full Title & Category */}
      <div className="p-4 sm:p-5 pb-3 flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2 min-w-0">
          <span 
            className="w-3 h-3 rounded-full shrink-0" 
            style={{ backgroundColor: poster.accent }} 
          />
          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
            {poster.title}
          </h4>
        </div>
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
          {poster.category}
        </span>
      </div>

      {/* Main 4:5 Canvas Container */}
      <div className="relative aspect-[4/5] w-full bg-gradient-to-br from-slate-950 via-slate-900 to-[#040814] overflow-hidden flex flex-col justify-between p-4 sm:p-6 select-none">
        
        {/* Dynamic Background Gradient Artwork */}
        <div 
          className={`absolute inset-0 bg-gradient-to-tr ${poster.gradient} opacity-25 mix-blend-screen pointer-events-none transition-opacity duration-500 group-hover:opacity-35`} 
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />

        {/* Top Garland / Toran Header */}
        <div className="relative z-10 w-full flex items-center justify-between border-b border-white/20 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">🌺</span>
            <span className="text-xs font-semibold tracking-wider text-amber-200/90 uppercase">
              Festival Toran
            </span>
            <span className="text-sm">🍃</span>
          </div>
          <span className="text-[10px] font-mono text-white/60 tracking-widest">4:5 PROMPT</span>
        </div>

        {/* Center Canvas Layout: Left Greeting & Right Photo Cutout */}
        <div className="relative z-10 grid grid-cols-12 gap-3 items-center my-auto w-full">
          
          {/* Left Area: Greeting & Subtitle */}
          <div className="col-span-7 flex flex-col pr-1">
            <span className="text-[11px] sm:text-xs uppercase tracking-widest font-bold text-amber-300 drop-shadow-sm mb-1 truncate">
              {poster.subtitle}
            </span>
            <h3 
              className="font-extrabold text-white leading-tight drop-shadow-md break-words"
              style={{ fontSize: 'clamp(1rem, 2.5vw + 0.4rem, 1.45rem)' }}
            >
              {customGreeting}
            </h3>
            
            <p className="mt-2 text-[10px] sm:text-xs text-white/70 line-clamp-2">
              Ready-to-render Midjourney & Gemini prompt
            </p>
          </div>

          {/* Right Area: Photo Cutout Slot */}
          <div className="col-span-5 flex flex-col items-center justify-center">
            {photoPreview ? (
              <div className="relative w-22 h-28 sm:w-26 sm:h-32 rounded-2xl overflow-hidden border-2 border-white/80 shadow-xl bg-slate-900 group/photo">
                <img src={photoPreview} alt="Cutout" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoPreview(null);
                  }}
                  aria-label="Remove photo preview"
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/75 hover:bg-black text-white cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="w-22 h-28 sm:w-26 sm:h-32 rounded-2xl border-2 border-dashed border-white/50 hover:border-amber-300 bg-white/10 hover:bg-white/20 backdrop-blur-md flex flex-col items-center justify-center text-center p-2 transition-all cursor-pointer group/btn"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-1 group-hover/btn:scale-110 transition-transform">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-white leading-tight">
                  + Add photo
                </span>
                <span className="text-[9px] text-white/60">Live slot</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Blank Pure White Name Banner (Live Editable Inline) */}
        <div className="relative z-10 w-full mt-auto">
          <div className="w-full bg-white rounded-xl px-3 py-2 shadow-md flex items-center justify-between gap-2 border border-slate-200">
            <input
              type="text"
              value={customName}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Type your name / brand here..."
              className="w-full bg-transparent text-slate-900 font-bold text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none"
            />
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
              Banner
            </span>
          </div>
        </div>

      </div>

      {/* Card Controls Strip */}
      <div className="p-4 bg-slate-50 dark:bg-[#070d18] border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-3">
        
        {/* Language selector chips */}
        <div className="flex items-center justify-between gap-1" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Languages className="w-3.5 h-3.5 text-sky-500" />
            <span className="text-xs font-semibold">Language:</span>
          </div>
          <div className="flex items-center gap-1">
            {(['English', 'Hindi', 'Telugu', 'Tamil'] as PosterLanguage[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => handleLanguageChange(lang)}
                className={`px-2 py-0.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  selectedLanguage === lang
                    ? 'bg-[#0284c7] text-white font-bold'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {lang === 'English' ? 'EN' : lang === 'Hindi' ? 'हिन्दी' : lang === 'Telugu' ? 'తెలుగు' : 'தமிழ்'}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons: Copy Prompt + Edit / Customize Poster */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopyPrompt}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy prompt'}</span>
          </button>

          {onApplyPoster ? (
            <button
              type="button"
              onClick={handleApplyToGenerator}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0284c7] hover:bg-[#0369a1] active:scale-98 transition-all cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Use in Generator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleTriggerEdit}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0284c7] hover:bg-[#0369a1] active:scale-98 transition-all cursor-pointer shadow-sm"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Poster</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
