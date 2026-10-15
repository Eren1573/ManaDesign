import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Video, 
  User, 
  Layers, 
  ArrowLeft, 
  CheckCircle2, 
  Mail, 
  BellRing,
  ArrowRight
} from 'lucide-react';
import { AppNavbar } from '../components/AppNavbar';
import { Footer } from '../components/Footer';

const TOOLS_METADATA: Record<string, { title: string; subtitle: string; icon: any; description: string; expectedRelease: string }> = {
  video: {
    title: 'AI Video Studio',
    subtitle: 'Cinematic Video Generation from Photo & Text',
    icon: Video,
    description: 'Transform your prompt extractions and high-resolution photos into 4K fluid video clips with realistic physics, lighting continuity, and camera motion presets.',
    expectedRelease: 'Q2 2026',
  },
  avatar: {
    title: 'Avatar & Character Studio',
    subtitle: 'Anime, 3D Game, & Editorial Stylized Portraits',
    icon: User,
    description: 'Turn everyday creator selfies into consistent character styles: Shonen anime, comic illustration, hyper-detailed 3D game models, and high-fashion editorial covers.',
    expectedRelease: 'Q2 2026',
  },
  teams: {
    title: 'Team Workspaces & Brand Presets',
    subtitle: 'Collaborative Design Standards for Agencies',
    icon: Layers,
    description: 'Shared brand guidelines, locked color gamuts, approved model seeds, and centralized prompt libraries for marketing teams and creative agencies.',
    expectedRelease: 'Q3 2026',
  },
};

export const ToolsPreview: React.FC = () => {
  const { toolId } = useParams<{ toolId?: string }>();
  const currentKey = toolId && TOOLS_METADATA[toolId] ? toolId : 'video';
  const tool = TOOLS_METADATA[currentKey];
  const IconComponent = tool.icon;

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubscribed(true);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 dark:bg-[#070d18] text-slate-900 dark:text-slate-100">
      <AppNavbar showBack={true} />

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-2xl w-full bg-white dark:bg-[#0b1220] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xl p-8 sm:p-12 text-center relative overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800 mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>STUDIO ROADMAP &middot; COMING SOON</span>
          </div>

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0284c7] to-[#38bdf8] text-white flex items-center justify-center mx-auto mb-6 shadow-lg shadow-sky-500/20">
            <IconComponent className="w-8 h-8" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {tool.title}
          </h1>

          <p className="text-sm sm:text-base font-semibold text-sky-600 dark:text-sky-400 mt-2">
            {tool.subtitle}
          </p>

          <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto">
            {tool.description}
          </p>

          {/* Waitlist Form */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 max-w-md mx-auto">
            {isSubscribed ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>You're on the early access waitlist! We'll notify you first.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block text-left">
                  GET EARLY BETA ACCESS
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-grow">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your creator email..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-3 px-5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] active:scale-98 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap min-h-[44px]"
                  >
                    <BellRing className="w-4 h-4" />
                    <span>Join Waitlist</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 text-left">
                  Expected beta release: {tool.expectedRelease} &middot; Zero spam guarantee.
                </p>
              </form>
            )}
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              to="/studio"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Studio</span>
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
