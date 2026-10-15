import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Bookmark, 
  Sparkles, 
  Wand2, 
  SunMedium, 
  Camera, 
  Palette,
  Sparkle,
  SlidersHorizontal,
  Flame,
  Crop
} from 'lucide-react';
import { VisionPromptResult } from '../lib/gemini';
import { formatForMidjourney, formatForDallE, formatForStableDiffusion } from '../lib/prompt-formatters';
import { track } from '../lib/analytics';

interface PromptResultCardProps {
  result: VisionPromptResult;
  onSave?: () => void;
  isSaved?: boolean;
  onSendToImageGen?: (prompt: string) => void;
  onRefinePrompt?: (refinedPrompt: string) => void;
  selectedAspectRatio?: string;
}

export const PromptResultCard: React.FC<PromptResultCardProps> = ({
  result,
  onSave,
  isSaved,
  onSendToImageGen,
  onRefinePrompt,
  selectedAspectRatio = '4:5',
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState(result.prompt);

  // Sync if result changes
  React.useEffect(() => {
    setCurrentPrompt(result.prompt);
  }, [result.prompt]);

  const copyWithFeedback = (text: string, type: 'generic' | 'midjourney' | 'dalle' | 'sd') => {
    navigator.clipboard.writeText(text);
    track({ name: 'prompt_copied', props: { target: type } });
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Base prompt with auto-appended aspect ratio
  const getPromptWithRatio = () => {
    if (currentPrompt.includes('--ar')) return currentPrompt;
    return `${currentPrompt} --ar ${selectedAspectRatio}`;
  };

  // Optimize for Midjourney v6
  const copyMidjourney = () => {
    const p = formatForMidjourney(currentPrompt, selectedAspectRatio);
    copyWithFeedback(p, 'midjourney');
  };

  // Optimize for DALL·E 3
  const copyDallE = () => {
    const p = formatForDallE(currentPrompt);
    copyWithFeedback(p, 'dalle');
  };

  // Optimize for Stable Diffusion XL
  const copyStableDiffusion = () => {
    const p = formatForStableDiffusion(currentPrompt);
    copyWithFeedback(p, 'sd');
  };

  // Quick Refine Chips handlers
  const handleRefine = (modifier: string, label: string) => {
    let newPrompt = currentPrompt;
    if (label === 'More cinematic') {
      newPrompt = `${currentPrompt}, dramatic cinematic anamorphic lighting, subtle teal and orange color grade, Panavision 70mm lens, film atmosphere`;
    } else if (label === 'Change palette') {
      newPrompt = `${currentPrompt}, sophisticated neutral palette with warm champagne gold accents, muted pastel tones and delicate rim highlights`;
    } else if (label === 'Shorter version') {
      // Extract main keywords concisely
      const parts = currentPrompt.split(',');
      newPrompt = parts.slice(0, Math.min(3, parts.length)).join(',') + ` --ar ${selectedAspectRatio}`;
    } else if (label === 'Add detail') {
      newPrompt = `${currentPrompt}, hyper-detailed micro-surface textures, delicate specular highlights, authentic tactile depth, 8k macro detail`;
    }

    setCurrentPrompt(newPrompt);
    if (onRefinePrompt) {
      onRefinePrompt(newPrompt);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#0b1220] rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 p-5 sm:p-6 shadow-sm transition-all text-left">
      {/* Header with platform support badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>Copyable AI Prompt</span>
        </div>

        <div className="flex items-center gap-2">
          {onSave && (
            <button
              onClick={onSave}
              disabled={isSaved}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-600' : ''}`} />
              <span>{isSaved ? 'Saved to Library' : 'Save to Library'}</span>
            </button>
          )}

          <button
            onClick={() => copyWithFeedback(getPromptWithRatio(), 'standard')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#0284c7] hover:bg-[#0369a1] text-white transition-all cursor-pointer shadow-xs active:scale-98"
          >
            {copiedType === 'standard' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedType === 'standard' ? 'Copied with Ratio!' : 'Copy Prompt'}</span>
          </button>
        </div>
      </div>

      {/* Main Copyable Prompt Text Box */}
      <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-[#070d19] border border-slate-200/80 dark:border-slate-800 font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 selection:bg-sky-200 dark:selection:bg-sky-900 shadow-inner">
        {currentPrompt}
        {!currentPrompt.includes('--ar') && (
          <span className="text-sky-600 dark:text-sky-400 font-bold ml-1">
            --ar {selectedAspectRatio}
          </span>
        )}
      </div>

      {/* Target Generator Optimizer Copy Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Optimize & Copy for:
        </span>
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={copyMidjourney}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            {copiedType === 'midjourney' ? <Check className="w-3 h-3 text-emerald-500" /> : <Sparkles className="w-3 h-3 text-indigo-500" />}
            <span>Midjourney v6</span>
          </button>

          <button
            onClick={copyDallE}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            {copiedType === 'dalle' ? <Check className="w-3 h-3 text-emerald-500" /> : <Sparkle className="w-3 h-3 text-emerald-500" />}
            <span>DALL·E 3</span>
          </button>

          <button
            onClick={copyStableDiffusion}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            {copiedType === 'sd' ? <Check className="w-3 h-3 text-emerald-500" /> : <SlidersHorizontal className="w-3 h-3 text-amber-500" />}
            <span>Stable Diffusion</span>
          </button>
        </div>
      </div>

      {/* Quick-Refine Chips */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <Wand2 className="w-3.5 h-3.5 text-sky-500" />
          <span>Quick Refine:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'More cinematic', icon: '🎬' },
            { label: 'Change palette', icon: '🎨' },
            { label: 'Shorter version', icon: '⚡' },
            { label: 'Add detail', icon: '🔍' },
          ].map((chip) => (
            <button
              key={chip.label}
              onClick={() => handleRefine('', chip.label)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-sky-800 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/80 transition-colors cursor-pointer"
            >
              <span>{chip.icon}</span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Breakdown details */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
        {result.lighting && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
            <SunMedium className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Lighting: </span>
              <span className="text-slate-600 dark:text-slate-400">{result.lighting}</span>
            </div>
          </div>
        )}

        {result.composition && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
            <Camera className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Camera: </span>
              <span className="text-slate-600 dark:text-slate-400">{result.composition}</span>
            </div>
          </div>
        )}

        {result.palette && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 sm:col-span-2">
            <Palette className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Palette: </span>
              <span className="text-slate-600 dark:text-slate-400">{result.palette}</span>
            </div>
          </div>
        )}
      </div>

      {/* Tags & Action Link */}
      <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {result.tags?.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {onSendToImageGen && (
          <button
            onClick={() => onSendToImageGen(getPromptWithRatio())}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 cursor-pointer group"
          >
            <Wand2 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
            <span>Generate Image with this prompt &rarr;</span>
          </button>
        )}
      </div>
    </div>
  );
};

export const PromptGeneratingCard: React.FC<{ stepText?: string }> = ({
  stepText = 'Reading composition, lighting, camera and focal depth...',
}) => {
  return (
    <div className="w-full bg-white dark:bg-[#0b1220] rounded-2xl sm:rounded-3xl border border-sky-300 dark:border-sky-800/80 p-8 shadow-sm flex flex-col items-center justify-center text-center">
      <div className="relative w-14 h-14 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-sky-100 dark:border-sky-950 animate-ping opacity-40"></div>
        <div className="w-14 h-14 rounded-full border-3 border-sky-500 border-t-transparent animate-spin flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-sky-500 animate-pulse" />
        </div>
      </div>
      <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
        Reading the image with Gemini Vision
      </h4>
      <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm">
        {stepText}
      </p>

      {/* Progress step indicators */}
      <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-400">
        <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
          Extracting subject
        </span>
        <span>&middot;</span>
        <span>Analyzing light</span>
        <span>&middot;</span>
        <span>Optimizing prompt</span>
      </div>
    </div>
  );
};
