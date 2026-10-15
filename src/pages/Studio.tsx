import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Info, 
  RefreshCw, 
  Wand2, 
  Download, 
  Bookmark, 
  Check, 
  Copy, 
  Maximize2,
  X,
  Flame,
  Share2,
  Languages,
  User,
  ArrowRight,
  AlertCircle,
  Camera,
  Trash2,
  ChevronDown,
  ChevronUp,
  History,
  FileText
} from 'lucide-react';
import { AppNavbar } from '../components/AppNavbar';
import { Footer } from '../components/Footer';
import { PromptResultCard, PromptGeneratingCard } from '../components/PromptResultCard';
import { PosterTemplateCard } from '../components/PosterTemplateCard';
import { PageMeta } from '../components/PageMeta';
import { fileToDataUrl } from '../lib/image';
import { useConvexData } from '../lib/convex-client';
import { VisionPromptResult } from '../lib/gemini';
import { 
  TRENDING_POSTERS, 
  TrendingPoster, 
  PosterCategory, 
  PosterLanguage, 
  getSortedTrendingPosters, 
  buildPosterPrompt 
} from '../lib/trending-posters';
import { track } from '../lib/analytics';

// Instant sample images for quick testing
const QUICK_SAMPLES = [
  {
    name: 'Luxury Cosmetics',
    url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    note: 'Emphasize soft caustic water reflections and sandstone podium',
  },
  {
    name: 'Modern Architecture',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    note: 'Capture morning warm sun rays through tall windows',
  },
  {
    name: 'Studio Portrait',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    note: 'Keep natural skin texture and high-contrast studio catchlight',
  },
  {
    name: 'Streetwear Apparel',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    note: 'Focus on ring flash aesthetic and raw urban textures',
  },
];

// Available styles for Image Generation
const IMAGE_STYLES = [
  'Photorealistic',
  'Cinematic',
  'Minimalist Studio',
  'Editorial Fashion',
  'Cyberpunk',
  '3D Render',
  'Anime',
  'Vintage Film',
];

// Aspect ratios with Phase 3 & 4 9:16 Story option
const ASPECT_RATIOS = [
  { label: '4:5 Portrait (Instagram & Poster Feed)', value: '4:5' },
  { label: '9:16 Story (Reels / TikTok / WhatsApp Story)', value: '9:16' },
  { label: '1:1 Square (Instagram Post)', value: '1:1' },
  { label: '16:9 Landscape (YouTube / Web)', value: '16:9' },
  { label: '3:2 Classic Photo', value: '3:2' },
  { label: '2:3 Vertical Portrait', value: '2:3' },
  { label: '21:9 Ultrawide Banner', value: '21:9' },
];

export const Studio: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTabParam = searchParams.get('tab');
  const initialTab = initialTabParam === 'generate' 
    ? 'generate' 
    : initialTabParam === 'trending' 
    ? 'trending' 
    : 'vision';
  
  const [activeTab, setActiveTab] = useState<'vision' | 'trending' | 'generate'>(initialTab);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const posterModalPhotoInputRef = useRef<HTMLInputElement>(null);

  const { prompts, deletePrompt, savePrompt, generateImagePromptAction, generateImageAction } = useConvexData();

  // Tab 1 (Photo to Prompt) states
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [optionalNote, setOptionalNote] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('Reading composition, lighting & focal depth...');
  const [visionResult, setVisionResult] = useState<VisionPromptResult | null>(null);
  const [isSavedPrompt, setIsSavedPrompt] = useState(false);
  const [visionError, setVisionError] = useState<string | null>(null);

  // Tab 2 (Trending Posters) states
  const [selectedPosterCategory, setSelectedPosterCategory] = useState<PosterCategory | 'All'>('All');
  
  // Poster Edit Modal state: ONLY opens when user clicks "Edit Poster"
  const [editingPoster, setEditingPoster] = useState<TrendingPoster | null>(null);
  const [modalGreeting, setModalGreeting] = useState('');
  const [modalName, setModalName] = useState('');
  const [modalLanguage, setModalLanguage] = useState<PosterLanguage>('English');
  const [modalPhoto, setModalPhoto] = useState<string | null>(null);

  // Tab 3 (Generate Image) states
  const [genPrompt, setGenPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Photorealistic');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('4:5');
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [activeGenImage, setActiveGenImage] = useState<string | null>(null);
  const [savedGenImage, setSavedGenImage] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);

  // UI Toast notification with optional retry action
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error';
    onRetry?: () => void;
  } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'error' = 'success', onRetry?: () => void) => {
    setToastMessage({ text, type, onRetry });
    setTimeout(() => {
      setToastMessage((cur) => (cur?.text === text ? null : cur));
    }, 4500);
  }, []);

  // Collapsible saved prompts on mobile
  const [isSavedPromptsExpandedMobile, setIsSavedPromptsExpandedMobile] = useState(false);

  // Memoized prompt history array
  const memoizedPrompts = useMemo(() => prompts, [prompts]);

  // Memoized sorted posters
  const sortedPosters = useMemo(() => getSortedTrendingPosters(), []);
  const filteredPosters = useMemo(() => {
    return selectedPosterCategory === 'All'
      ? sortedPosters
      : sortedPosters.filter((p) => p.category === selectedPosterCategory);
  }, [selectedPosterCategory, sortedPosters]);

  // Deep Link Handling: /studio?template=<slug>
  useEffect(() => {
    const templateSlug = searchParams.get('template');
    if (templateSlug) {
      const found = TRENDING_POSTERS.find(
        (p) =>
          p.slug === templateSlug ||
          p.id === templateSlug ||
          p.aliases?.includes(templateSlug) ||
          (templateSlug === 'happy-diwali' && (p.id === 'diwali' || p.slug === 'happy-diwali'))
      );
      if (found) {
        // Open the poster edit modal directly
        setEditingPoster(found);
        setModalGreeting(found.greetingsByLang['English'] || found.greeting);
        setModalLanguage('English');
        setModalName('');
        setModalPhoto(null);
        setActiveTab('trending');
      }
      
      // Clean up the search parameter
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('template');
      newParams.set('tab', 'trending');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Synchronize activeTab with URL search params
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'generate' && activeTab !== 'generate') {
      setActiveTab('generate');
    } else if (tabParam === 'trending' && activeTab !== 'trending') {
      setActiveTab('trending');
    } else if ((tabParam === 'vision' || tabParam === 'create') && activeTab !== 'vision') {
      setActiveTab('vision');
    }
  }, [searchParams, activeTab]);

  const handleTabSwitch = (tab: 'vision' | 'trending' | 'generate') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // File size & type validation
  const validateAndLoadFile = useCallback(async (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Unsupported file type. Please upload a JPG, PNG, or WebP image.', 'error');
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB limit
    if (file.size > maxSize) {
      showToast('File size exceeds 10MB limit. Please choose a smaller image.', 'error');
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setUploadedImage(dataUrl);
      setVisionResult(null);
      setIsSavedPrompt(false);
      setVisionError(null);
      showToast('Photo loaded successfully!');
    } catch (err) {
      console.error('Failed to process image:', err);
      showToast('Failed to read image file.', 'error');
    }
  }, [showToast]);

  // Handle file input selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndLoadFile(file);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndLoadFile(file);
    }
  };

  // Paste from clipboard support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            validateAndLoadFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [validateAndLoadFile]);

  // Generate Prompt from Photo (Tab 1)
  const handleGeneratePrompt = async () => {
    if (!uploadedImage) return;

    setIsAnalyzing(true);
    setVisionError(null);
    setAnalysisStep('Analyzing composition, lighting & focal depth...');

    const timer1 = setTimeout(() => {
      setAnalysisStep('Extracting subject silhouettes & color palette...');
    }, 1800);
    const timer2 = setTimeout(() => {
      setAnalysisStep('Optimizing prompt for Midjourney v6 & Gemini Imagen...');
    }, 3600);

    try {
      const result = await generateImagePromptAction(uploadedImage, optionalNote);
      setVisionResult(result);
      setIsSavedPrompt(false);
      track({ name: 'prompt_generated', props: { source: 'vision' } });
    } catch (err: any) {
      console.error('Vision prompt generation error:', err);
      const friendlyError = err?.message || 'Gemini Vision rate limited or temporarily unavailable. Please retry.';
      setVisionError(friendlyError);
      showToast(friendlyError, 'error', handleGeneratePrompt);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsAnalyzing(false);
    }
  };

  // Save prompt to library
  const handleSaveToLibrary = async () => {
    if (!visionResult) return;
    try {
      await savePrompt({
        prompt: visionResult.prompt,
        thumbnail: uploadedImage || undefined,
        subject: visionResult.subject,
        lighting: visionResult.lighting,
        composition: visionResult.composition,
        palette: visionResult.palette,
        tags: visionResult.tags,
      });
      setIsSavedPrompt(true);
      showToast('Saved to your prompt library!');
    } catch (err) {
      showToast('Failed to save prompt to library.', 'error');
    }
  };

  // Delete saved prompt with error handling & failure toast
  const handleDeleteSavedPrompt = useCallback(async (id: string) => {
    try {
      const ok = await deletePrompt(id);
      if (ok) {
        showToast('Prompt removed from library.');
      } else {
        showToast('Failed to remove prompt from library.', 'error');
      }
    } catch (err) {
      showToast('Failed to remove prompt from library.', 'error');
    }
  }, [deletePrompt, showToast]);

  // Transfer prompt from vision to Tab 3
  const handleSendToImageGen = (promptText: string) => {
    setGenPrompt(promptText);
    setActiveTab('generate');
    setSearchParams({ tab: 'generate' });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Open the poster edit modal
  const handleOpenEditPosterModal = (poster: TrendingPoster) => {
    setEditingPoster(poster);
    setModalGreeting(poster.greetingsByLang['English'] || poster.greeting);
    setModalLanguage('English');
    setModalName('');
    setModalPhoto(null);
  // Transfer any poster configuration directly into the generator and scroll smoothly
  const applyPoster = useCallback((
    poster: TrendingPoster, 
    customGreeting?: string, 
    customName?: string, 
    lang?: PosterLanguage, 
    photo?: string | null
  ) => {
    const finalPrompt = buildPosterPrompt(poster, {
      customGreeting: customGreeting || poster.greetingsByLang[lang || 'English'] || poster.greeting,
      customName: customName || '',
      language: lang || 'English',
      hasPhoto: !!photo,
    });

    setGenPrompt(finalPrompt);
    setSelectedAspectRatio('4:5');
    setEditingPoster(null); // Close the modal if open
    setActiveTab('generate');
    setSearchParams({ tab: 'generate' });

    setTimeout(() => {
      const el = document.getElementById('image-generator');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
    }, 60);

    showToast(`Loaded "${poster.title}" into Image Generator!`);
  }, [setSearchParams, showToast]);

  // Apply Poster Edit Modal changes and transfer to generator
  const handleApplyPosterAndGenerate = () => {
    if (!editingPoster) return;
    applyPoster(editingPoster, modalGreeting, modalName, modalLanguage, modalPhoto);
  };

  // Generate Image from text prompt (Tab 3)
  const handleGenerateImage = async () => {
    if (!genPrompt.trim()) return;

    setIsGeneratingImg(true);
    setSavedGenImage(false);
    setGenError(null);
    try {
      const res = await generateImageAction(genPrompt, selectedStyle, selectedAspectRatio);
      setActiveGenImage(res.imageUrl);
      setGeneratedImages((prev) => [res.imageUrl, ...prev.slice(0, 5)]);
      track({ name: 'prompt_generated', props: { source: 'template' } });
      showToast('Artwork synthesized successfully!');
    } catch (err: any) {
      console.error('Image generation error:', err);
      const userFriendlyMsg = err?.message || 'Gemini Imagen API rate limit or error encountered. Please click Retry.';
      setGenError(userFriendlyMsg);
      showToast(userFriendlyMsg, 'error', handleGenerateImage);
    } finally {
      setIsGeneratingImg(false);
    }
  };

  // Save generated image prompt to library
  const handleSaveGenImage = async () => {
    if (!activeGenImage || !genPrompt) return;
    try {
      await savePrompt({
        prompt: genPrompt,
        thumbnail: activeGenImage,
        tags: [selectedStyle, selectedAspectRatio, 'Generated'],
      });
      setSavedGenImage(true);
      showToast('Saved artwork to library!');
    } catch (err) {
      showToast('Failed to save artwork.', 'error');
    }
  };

  // Separate "Download image" handler (as real blob download)
  const handleDownloadImage = (imgUrl: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imgUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 1024;
      canvas.height = img.naturalHeight || 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `manadesign-${Date.now()}.png`;
          link.click();
          URL.revokeObjectURL(url);
          showToast('Image downloaded as PNG!');
        }, 'image/png');
      }
    };
    img.onerror = () => {
      const link = document.createElement('a');
      link.href = imgUrl;
      link.download = `manadesign-${Date.now()}.png`;
      link.click();
    };
  };

  // Separate "Copy image" handler using Clipboard API with fallback
  const handleCopyImage = async (imgUrl: string) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imgUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 1024;
      canvas.height = img.naturalHeight || 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error('Blob conversion failed');
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          showToast('Image copied to clipboard!');
        } catch (e) {
          // Fallback to copying URL text
          await navigator.clipboard.writeText(imgUrl);
          showToast('Copied image link to clipboard.');
        }
      }, 'image/png');
    } catch (e) {
      await navigator.clipboard.writeText(imgUrl);
      showToast('Copied image link to clipboard.');
    }
  };

  // Share via WhatsApp with Web Share API fallback
  const handleShareWhatsApp = async () => {
    const shareText = `Check out this artwork created on ManaDesign AI Studio!\nPrompt: ${genPrompt}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ManaDesign Poster Artwork',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // Fallback
      }
    }

    const waUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${window.location.href}`)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-slate-100 transition-colors">
      <PageMeta
        title={
          editingPoster
            ? `${editingPoster.title} Poster Template | ManaDesign Studio`
            : activeTab === 'trending'
            ? 'Trending Festival & Event Posters | ManaDesign Studio'
            : activeTab === 'generate'
            ? 'AI Image Generator | ManaDesign Studio'
            : 'AI Prompt Studio — Photo to Prompt | ManaDesign'
        }
        description={
          editingPoster
            ? `Customize ${editingPoster.title} poster with your photo cutout and greetings in English, Hindi, Telugu, and Tamil. Ready-to-render AI prompts.`
            : 'Upload a photo to get a precise AI prompt, browse festival poster templates, or generate images — all in one studio.'
        }
        image={editingPoster ? '/og-festival.svg' : '/og-landing.svg'}
      />
      <AppNavbar showBack={true} />

      {/* Floating Status Toast */}
      {toastMessage && (
        <div className="fixed top-18 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-w-sm">
          <div className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold border ${
            toastMessage.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800'
          }`}>
            <div className="flex items-center gap-2">
              {toastMessage.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" /> : <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
              <span>{toastMessage.text}</span>
            </div>
            {toastMessage.onRetry && (
              <button
                onClick={() => {
                  const retry = toastMessage.onRetry;
                  setToastMessage(null);
                  retry?.();
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 cursor-pointer transition-colors shadow-xs"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 transition-all duration-300">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>
              {activeTab === 'generate'
                ? 'IMAGE SYNTHESIS STUDIO'
                : activeTab === 'trending'
                ? 'TRENDING POSTER STUDIO'
                : 'PHOTO TO PROMPT STUDIO'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-all">
            {activeTab === 'generate' ? (
              <>
                Prompt in.{' '}
                <span className="text-[#0284c7] dark:text-[#38bdf8]">
                  Photo out.
                </span>
              </>
            ) : activeTab === 'trending' ? (
              <>
                Occasion ready.{' '}
                <span className="text-[#0284c7] dark:text-[#38bdf8]">
                  Festivals & feeds.
                </span>
              </>
            ) : (
              <>
                Photo in.{' '}
                <span className="text-[#0284c7] dark:text-[#38bdf8]">
                  Prompt out.
                </span>
              </>
            )}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 transition-all max-w-xl mx-auto leading-relaxed">
            {activeTab === 'generate'
              ? 'Enter a prompt to synthesize campaign-grade imagery with Gemini Imagen, customize styles, and export for social feeds.'
              : activeTab === 'trending'
              ? 'Pick an upcoming festival or celebration, customize multi-lingual greetings, add a photo slot, and render ready-to-run poster art.'
              : 'Upload any photo to extract a precise, reusable text-to-image prompt optimized for Midjourney and Gemini.'}
          </p>
        </div>

        {/* 3-Tab Segmented Switcher */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-1">
          <div className="inline-flex p-1 rounded-full bg-slate-200/80 dark:bg-[#0c1424] border border-slate-200 dark:border-white/10 shadow-xs">
            <button
              onClick={() => handleTabSwitch('vision')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'vision'
                  ? 'bg-[#0284c7] dark:bg-[#38bdf8] text-white dark:text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Photo to Prompt</span>
            </button>

            <button
              onClick={() => handleTabSwitch('trending')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'trending'
                  ? 'bg-[#0284c7] dark:bg-[#38bdf8] text-white dark:text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4 text-rose-500" />
              <span>Trending Posters</span>
            </button>

            <button
              onClick={() => handleTabSwitch('generate')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'generate'
                  ? 'bg-[#0284c7] dark:bg-[#38bdf8] text-white dark:text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>Generate Image</span>
            </button>
          </div>
        </div>

        {/* TAB 1: PHOTO TO PROMPT (Phase 4: Stack single-col <1024px, camera accept="image/*", paste-from-clipboard, 16px inputs on mobile, error retry) */}
        {activeTab === 'vision' && (
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Step 1: Upload your photo (lg:col-span-6) */}
            <div className="w-full lg:col-span-6 bg-white dark:bg-[#0b1220] rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold text-sm flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Upload your photo
                  </h2>
                </div>
                <span className="text-xs text-slate-400 hidden sm:inline">Paste with Ctrl+V</span>
              </div>

              {/* File Input with Camera Support */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {!uploadedImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-sky-300 dark:border-sky-800 hover:border-sky-500 dark:hover:border-sky-600 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-sky-50/30 dark:bg-sky-950/20 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Tap to take photo or choose image
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    JPG, PNG, WebP up to 10MB &middot; Drag & Drop or Paste
                  </p>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group bg-slate-950">
                  <img
                    src={uploadedImage}
                    alt="Uploaded source"
                    className="w-full max-h-[300px] object-contain mx-auto"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs font-medium transition-colors cursor-pointer"
                    >
                      Change photo
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Preset Samples */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                  Or test with sample photos:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {QUICK_SAMPLES.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setUploadedImage(sample.url);
                        setOptionalNote(sample.note);
                        setVisionResult(null);
                        setIsSavedPrompt(false);
                        setVisionError(null);
                      }}
                      className="text-left p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-400 hover:bg-sky-50/50 dark:hover:bg-slate-800 transition-all text-xs font-medium text-slate-700 dark:text-slate-300 truncate cursor-pointer"
                    >
                      {sample.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Note Field (16px font on mobile to prevent iOS zoom) */}
              <div className="mt-6">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                  OPTIONAL NOTE
                </label>
                <textarea
                  rows={3}
                  value={optionalNote}
                  onChange={(e) => setOptionalNote(e.target.value)}
                  placeholder="e.g. 'Keep the product in sharp focus and the background soft and warm'"
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#070d19] p-3 text-base sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-none"
                />
              </div>
            </div>

            {/* Step 2: Get your prompt (lg:col-span-6) */}
            <div className="w-full lg:col-span-6 bg-white dark:bg-[#0b1220] rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[460px]">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-7 h-7 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold text-sm flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Get your prompt
                  </h2>
                </div>

                {/* Generate Prompt Button */}
                <button
                  onClick={handleGeneratePrompt}
                  disabled={!uploadedImage || isAnalyzing}
                  className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    uploadedImage && !isAnalyzing
                      ? 'bg-[#0284c7] hover:bg-[#0369a1] text-white active:scale-98'
                      : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAnalyzing ? 'Analyzing photo...' : 'Generate prompt'}</span>
                </button>

                {!uploadedImage && (
                  <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-2">
                    Upload a photo first - then this lights up.
                  </p>
                )}

                {/* Error Banner with Retry Button */}
                {visionError && (
                  <div className="mt-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-rose-800 dark:text-rose-300">Vision Analysis Error</h4>
                        <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">{visionError}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleGeneratePrompt}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shrink-0"
                    >
                      Retry Analysis
                    </button>
                  </div>
                )}

                {/* Output Area */}
                <div className="mt-6">
                  {isAnalyzing ? (
                    <PromptGeneratingCard stepText={analysisStep} />
                  ) : visionResult ? (
                    <PromptResultCard
                      result={visionResult}
                      onSave={handleSaveToLibrary}
                      isSaved={isSavedPrompt}
                      onSendToImageGen={handleSendToImageGen}
                      selectedAspectRatio={selectedAspectRatio}
                    />
                  ) : (
                    <div className="p-8 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                        <Info className="w-5 h-5" />
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Your prompt will appear here - one click to copy it.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Tip */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Optimized for Gemini Vision & Midjourney v6</span>
                <span className="text-sky-600 dark:text-sky-400 font-medium">100% Copyable</span>
              </div>
            </div>

            {/* Saved Prompts History (Collapsible on mobile <1024px, stacked in workbench) */}
            <div className="w-full lg:col-span-12 mt-4">
              <div className="bg-white dark:bg-[#0b1220] rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <History className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Saved Prompt Library ({memoizedPrompts.length})
                    </h3>
                  </div>

                  {/* Toggle button on mobile */}
                  <button
                    onClick={() => setIsSavedPromptsExpandedMobile(!isSavedPromptsExpandedMobile)}
                    className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                    aria-label="Toggle saved prompts"
                  >
                    {isSavedPromptsExpandedMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* List of saved prompts */}
                <div className={`${isSavedPromptsExpandedMobile ? 'block' : 'hidden'} lg:block mt-4`}>
                  {memoizedPrompts.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                      No saved prompts yet. Generate a prompt above and click "Save to Library".
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {memoizedPrompts.slice(0, 6).map((item) => (
                        <div
                          key={item._id}
                          className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between gap-2"
                        >
                          <p className="text-xs font-mono text-slate-800 dark:text-slate-200 line-clamp-3">
                            {item.prompt}
                          </p>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800">
                            <button
                              onClick={() => handleSendToImageGen(item.prompt)}
                              className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer min-h-[36px] flex items-center"
                            >
                              Use in Generator &rarr;
                            </button>
                            <button
                              onClick={() => handleDeleteSavedPrompt(item._id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                              title="Delete from library"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: TRENDING POSTERS (Phase 3 & 4: 3 Posters per row, Edit Modal only appears on click) */}
        {activeTab === 'trending' && (
          <div className="flex flex-col gap-6">
            
            {/* Category Filter Chips Bar */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar flex-nowrap">
                {(['All', 'Festivals', 'Birthdays', 'Business'] as (PosterCategory | 'All')[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedPosterCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedPosterCategory === cat
                        ? 'bg-[#0284c7] text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat === 'All' ? '🌟 All Occasions' : cat === 'Festivals' ? '🎉 Festivals' : cat === 'Birthdays' ? '🎂 Birthdays & Milestones' : '💼 Business & Store'}
                  </button>
                ))}
              </div>

              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:inline">
                {filteredPosters.length} templates
              </span>
            </div>

            {/* 3 Posters Per Row Grid (1 col mobile, 2 cols tablet, 3 on desktop for optimal visibility) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredPosters.map((poster) => (
                <PosterTemplateCard
                  key={poster.id}
                  poster={poster}
                  onEditPoster={handleOpenEditPosterModal}
                  onApplyPoster={applyPoster}
                />
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: GENERATE IMAGE (Phase 4: 2-col mobile generated grid, always-visible buttons on touch, retry, 16px inputs) */}
        {activeTab === 'generate' && (
          <div id="image-generator" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-24">
            
            {/* Left Column: Prompt Input & Settings (16px font on mobile) */}
            <div className="lg:col-span-6 bg-white dark:bg-[#0b1220] rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Create with Gemini Imagen
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Type or refine your creative prompt, pick an artistic style and social aspect ratio.
              </p>

              {/* Prompt Textarea (text-base on mobile, sm:text-sm) */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                  TEXT PROMPT
                </label>
                <textarea
                  rows={5}
                  value={genPrompt}
                  onChange={(e) => setGenPrompt(e.target.value)}
                  placeholder="Describe your scene in detail... (e.g. 'A sleek titanium water bottle floating in zero gravity against a dark cosmic backdrop with cyan rim lighting')"
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#070d19] p-4 text-base sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all leading-relaxed"
                />
              </div>

              {/* Quick style inspiration chips */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                  CHOOSE STYLE
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {IMAGE_STYLES.map((style) => (
                    <button
                      key={style}
                      onClick={() => setSelectedStyle(style)}
                      className={`p-2 rounded-xl text-xs font-medium text-center transition-all cursor-pointer ${
                        selectedStyle === style
                          ? 'bg-[#0284c7] dark:bg-[#38bdf8] text-white dark:text-slate-950 font-semibold shadow-xs'
                          : 'bg-slate-50 dark:bg-[#0e1626] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-[#131d2e]'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio Selector (text-base on mobile, sm:text-sm) */}
              <div className="mb-8">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                  ASPECT RATIO
                </label>
                <select
                  value={selectedAspectRatio}
                  onChange={(e) => setSelectedAspectRatio(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070d19] p-3 text-base sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {ASPECT_RATIOS.map((ar) => (
                    <option key={ar.value} value={ar.value}>
                      {ar.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Error Banner with Retry */}
              {genError && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-rose-800 dark:text-rose-300">Generation Error</h4>
                      <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">{genError}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleGenerateImage}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shrink-0"
                  >
                    Retry Generate
                  </button>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerateImage}
                disabled={!genPrompt.trim() || isGeneratingImg}
                className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                  genPrompt.trim() && !isGeneratingImg
                    ? 'bg-[#0284c7] hover:bg-[#0369a1] dark:bg-[#38bdf8] dark:hover:bg-[#7dd3fc] text-white dark:text-slate-950 active:scale-98'
                    : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                }`}
              >
                {isGeneratingImg ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Rendering artwork with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate Artwork</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Column: Output Image Preview with separate Download Image & Copy Image */}
            <div className="lg:col-span-6 bg-white dark:bg-[#0b1220] rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[500px]">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Rendered Artwork
                  </h3>
                  {activeGenImage && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={handleSaveGenImage}
                        disabled={savedGenImage}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          savedGenImage
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <Bookmark className={`w-3 h-3 ${savedGenImage ? 'fill-emerald-600' : ''}`} />
                        <span>{savedGenImage ? 'Saved' : 'Save'}</span>
                      </button>

                      {/* Download Image Button */}
                      <button
                        onClick={() => handleDownloadImage(activeGenImage)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#0284c7] hover:bg-[#0369a1] text-white transition-colors cursor-pointer"
                        title="Download image as PNG"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>

                      {/* Copy Image Button */}
                      <button
                        onClick={() => handleCopyImage(activeGenImage)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                        title="Copy image to clipboard"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>

                      {/* WhatsApp Share Button */}
                      <button
                        onClick={handleShareWhatsApp}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#25D366] hover:bg-[#20ba59] text-white transition-colors cursor-pointer"
                        title="Share on WhatsApp"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  )}
                </div>

                {isGeneratingImg ? (
                  <div className="w-full flex flex-col gap-4">
                    {/* 4-Image Skeleton Grid */}
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                      {[1, 2, 3, 4].map((slot) => (
                        <div
                          key={slot}
                          className="relative rounded-2xl bg-slate-900 border border-slate-800/90 overflow-hidden flex flex-col items-center justify-center p-4 min-h-[130px] sm:min-h-[160px] aspect-square shadow-inner"
                        >
                          <div className="w-8 h-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin mb-3" />
                          <div className="w-3/4 h-2 rounded-full bg-slate-800 animate-pulse mb-1.5" />
                          <div className="w-1/2 h-2 rounded-full bg-slate-800/60 animate-pulse mb-3" />
                          <span className="text-[10px] font-mono font-semibold text-sky-400">
                            Render {slot} of 4
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Progress Text */}
                    <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 text-center">
                      <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-sky-900 dark:text-sky-200">
                        <Sparkles className="w-4 h-4 text-sky-500 animate-spin" />
                        <span>Synthesizing 4-variation batch with Gemini Imagen...</span>
                      </div>
                      <p className="text-xs text-sky-700/80 dark:text-sky-300/80 mt-1">
                        Applying {selectedStyle} lighting &middot; Aspect ratio {selectedAspectRatio} &middot; 4K upscale
                      </p>
                    </div>
                  </div>
                ) : activeGenImage ? (
                  <div className="relative group rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <img
                      src={activeGenImage}
                      alt="Generated result"
                      className="w-full h-auto object-contain max-h-[440px] mx-auto"
                    />
                    
                    {/* Action buttons ALWAYS visible on touch / mobile, hover on desktop */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setModalImage(activeGenImage)}
                        className="p-2 rounded-lg bg-black/75 hover:bg-black text-white cursor-pointer transition-colors shadow-md min-h-[40px] min-w-[40px] flex items-center justify-center"
                        title="Expand fullscreen"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      No artwork generated yet
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                      Fill in the prompt on the left or select a trending poster template to render.
                    </p>
                  </div>
                )}

                {/* Generated Images Grid (2 columns on mobile, copy/download ALWAYS visible on touch) */}
                {generatedImages.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Generated Variations ({generatedImages.length}):
                      </span>
                      <span className="text-[11px] text-slate-400">Tap to select & inspect</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {generatedImages.map((imgUrl, i) => (
                        <div
                          key={i}
                          onClick={() => setActiveGenImage(imgUrl)}
                          className={`relative aspect-square rounded-2xl overflow-hidden border cursor-pointer group transition-all ${
                            activeGenImage === imgUrl ? 'ring-2 ring-sky-500 shadow-md' : 'border-slate-200 dark:border-slate-800 hover:border-sky-400'
                          }`}
                        >
                          <img src={imgUrl} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                          
                          {/* Copy & Download action ALWAYS visible on touch/mobile, hover on desktop */}
                          <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/85 via-black/50 to-transparent flex items-center justify-between gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-bold text-white px-1">#{i + 1}</span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadImage(imgUrl);
                                }}
                                className="p-1 rounded-md bg-white/20 hover:bg-white/40 text-white min-h-[30px] min-w-[30px] flex items-center justify-center cursor-pointer"
                                title="Download image"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyImage(imgUrl);
                                }}
                                className="p-1 rounded-md bg-white/20 hover:bg-white/40 text-white min-h-[30px] min-w-[30px] flex items-center justify-center cursor-pointer"
                                title="Copy image"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {activeGenImage && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Style: {selectedStyle}</span>
                  <span>Ratio: {selectedAspectRatio}</span>
                </div>
              )}
            </div>

            {/* Saved Prompts History in Generate Tab (Collapsible on mobile <1024px, stacked in workbench) */}
            <div className="w-full lg:col-span-12 mt-4">
              <div className="bg-white dark:bg-[#0b1220] rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <History className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Saved Prompt Library ({memoizedPrompts.length})
                    </h3>
                  </div>

                  {/* Toggle button on mobile */}
                  <button
                    onClick={() => setIsSavedPromptsExpandedMobile(!isSavedPromptsExpandedMobile)}
                    className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                    aria-label="Toggle saved prompts"
                  >
                    {isSavedPromptsExpandedMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* List of saved prompts */}
                <div className={`${isSavedPromptsExpandedMobile ? 'block' : 'hidden'} lg:block mt-4`}>
                  {memoizedPrompts.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                      No saved prompts yet. Generate a prompt in Photo to Prompt or enter text to save.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {memoizedPrompts.slice(0, 6).map((item) => (
                        <div
                          key={item._id}
                          className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between gap-2"
                        >
                          <p className="text-xs font-mono text-slate-800 dark:text-slate-200 line-clamp-3">
                            {item.prompt}
                          </p>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800">
                            <button
                              onClick={() => {
                                setGenPrompt(item.prompt);
                                window.scrollTo({ top: 300, behavior: 'smooth' });
                              }}
                              className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer min-h-[36px] flex items-center"
                            >
                              Load in Generator &rarr;
                            </button>
                            <button
                              onClick={() => handleDeleteSavedPrompt(item._id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                              title="Delete from library"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* POSTER EDIT MODAL (Phase 3 & 4: ONLY comes when user clicks "Edit Poster") */}
      {editingPoster && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setEditingPoster(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-white dark:bg-[#0b1220] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 text-left my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: editingPoster.accent }} 
                />
                <div>
                  <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">
                    Customizing: {editingPoster.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Edit greeting, recipient name, and photo slot before synthesizing image
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingPoster(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <div className="space-y-5 mt-5">
              
              {/* Language Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                  GREETING LANGUAGE
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['English', 'Hindi', 'Telugu', 'Tamil'] as PosterLanguage[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setModalLanguage(lang);
                        const translated = editingPoster.greetingsByLang[lang] || editingPoster.greeting;
                        setModalGreeting(translated);
                      }}
                      className={`py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center ${
                        modalLanguage === lang
                          ? 'bg-[#0284c7] text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Greeting Headline Input (16px on mobile) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                  GREETING HEADLINE
                </label>
                <input
                  type="text"
                  value={modalGreeting}
                  onChange={(e) => setModalGreeting(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Name / Brand Banner Input (16px on mobile) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                  NAME / BRAND BANNER
                </label>
                <input
                  type="text"
                  value={modalName}
                  placeholder="e.g. John Doe / Mana Studio"
                  onChange={(e) => setModalName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Photo Cutout Slot */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                  PHOTO CUTOUT (RIGHT HALF OF POSTER)
                </label>
                <input
                  ref={posterModalPhotoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const dataUrl = await fileToDataUrl(file);
                      setModalPhoto(dataUrl);
                    }
                  }}
                />

                {modalPhoto ? (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <img src={modalPhoto} alt="Cutout" className="w-12 h-12 rounded-xl object-cover border border-sky-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Photo loaded into cutout</p>
                      <button
                        onClick={() => setModalPhoto(null)}
                        className="text-xs text-rose-500 hover:underline mt-0.5"
                      >
                        Remove photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => posterModalPhotoInputRef.current?.click()}
                    className="w-full p-4 rounded-2xl border-2 border-dashed border-sky-300 dark:border-sky-800 hover:border-sky-500 flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-sky-50/40 dark:hover:bg-sky-950/20 transition-all cursor-pointer"
                  >
                    <User className="w-4 h-4 text-sky-500" />
                    <span>+ Add personal or brand photo cutout</span>
                  </button>
                )}
              </div>

            </div>

            {/* Modal Actions */}
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setEditingPoster(null)}
                className="px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyPosterAndGenerate}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#0284c7] hover:bg-[#0369a1] active:scale-98 transition-all shadow-md cursor-pointer"
              >
                <span>Proceed to Generate Artwork</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      {modalImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            <img src={modalImage} alt="Expanded preview" className="w-full h-auto object-contain" />
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
