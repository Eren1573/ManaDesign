import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Check, 
  Copy, 
  Sparkles, 
  CheckCircle2, 
  ShoppingBag, 
  Layers, 
  ShieldCheck, 
  Share2,
  BookmarkCheck
} from 'lucide-react';
import { AppNavbar } from '../components/AppNavbar';
import { Footer } from '../components/Footer';
import { PageMeta } from '../components/PageMeta';
import { useConvexData } from '../lib/convex-client';
import { formatPrice } from '../lib/store-catalog';
import { useAuth } from '../hooks/use-auth';
import { track } from '../lib/analytics';

export const TemplateDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { templates, isTemplatePurchased, purchaseTemplate } = useConvexData();
  const { isAuthenticated } = useAuth();

  const template = templates.find((t) => t.slug === slug);
  const isPurchased = slug ? isTemplatePurchased(slug) : false;

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [copiedPromptIdx, setCopiedPromptIdx] = useState<number | null>(null);

  React.useEffect(() => {
    if (template) {
      track({ name: 'template_viewed', props: { slug: template.slug, title: template.title } });
    }
  }, [template]);

  if (!template) {
    return (
      <div className="min-h-dvh flex flex-col bg-slate-50 dark:bg-slate-950">
        <AppNavbar showBack={true} />
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Template not found</h2>
          <p className="text-sm text-slate-500 mb-6">The requested template could not be located in our catalog.</p>
          <Link to="/store" className="px-4 py-2 rounded-xl bg-sky-600 text-white font-medium text-sm">
            Back to Template Store
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleCopyPrompt = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    track({ name: 'prompt_copied', props: { target: 'generic' } });
    setCopiedPromptIdx(idx);
    setTimeout(() => setCopiedPromptIdx(null), 2000);
  };

  const handleBuyNow = async () => {
    track({ name: 'checkout_started', props: { slug: template.slug, priceCents: template.priceCents } });
    setIsCheckingOut(true);
    try {
      /*
      // =========================================================================
      // Production Order Creation & Checkout Flow:
      // 1. orders.create mutation creates pending order document
      // const orderId = await convex.mutation('orders:create', {
      //   templateId: template.id,
      //   templateSlug: template.slug,
      //   amountCents: template.priceCents,
      //   userId: user?._id || 'guest',
      // });
      //
      // 2. payments.startCheckout action initiates gateway session
      // const checkout = await convex.action('payments:startCheckout', { orderId, userId: user?._id });
      //
      // Stripe / VLY Hosted Checkout Gateway:
      // if (checkout?.checkoutUrl) {
      //   window.location.href = checkout.checkoutUrl;
      //   return;
      // }
      //
      // Razorpay / UPI Integration Placeholder (Indian Payments - disabled):
      // const rzpOptions = {
      //   key: process.env.VITE_RAZORPAY_KEY_ID,
      //   amount: template.priceCents * 100, // INR in paise
      //   currency: 'INR',
      //   name: 'ManaDesign Studio',
      //   description: `${template.title} Prompt System`,
      //   order_id: checkout?.razorpayOrderId,
      //   prefill: { email: user?.email },
      //   theme: { color: '#0284c7' },
      //   handler: function (response: any) {
      //     // verify signature and mark paid via payments:verifyRazorpay
      //   }
      // };
      // const rzp = new (window as any).Razorpay(rzpOptions);
      // rzp.open();
      // =========================================================================
      */
      await purchaseTemplate(template.slug);
      
      // Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#38bdf8', '#10b981', '#f59e0b'],
      });

      // Brief pause to display celebration then redirect to Library
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 dark:bg-slate-950">
      <PageMeta
        title={`${template.title} | ManaDesign Template Store`}
        description={`${template.shortDescription} — ${template.promptCount} prompts, one-time purchase.`}
        url={`https://manadesign.app/store/${template.slug}`}
      />
      <AppNavbar showBack={true} />

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-28 sm:pb-12">
        
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Link to="/store" className="hover:text-sky-600">Template Store</Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200">{template.category}</span>
          <span>/</span>
          <span className="text-sky-600 dark:text-sky-400">{template.title}</span>
        </div>

        {/* Hero Cover Banner */}
        <div
          className={`w-full rounded-3xl bg-gradient-to-r ${template.gradientClass} p-8 sm:p-12 text-white relative overflow-hidden shadow-lg mb-10`}
        >
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-black/25 backdrop-blur-xs mb-4 inline-block">
              {template.category} Pack &middot; {template.promptCount} Modular Prompts
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4 drop-shadow-xs">
              {template.title}
            </h1>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl">
              {template.description}
            </p>
          </div>

          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Two-Column Grid: Details vs Sticky Purchase Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column (8 cols): Highlights & Sample Prompts */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* System Highlights */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <span>What's Included in This System</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {template.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {h}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Prompts */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Sample Prompts from This Pack
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Preview of copyable templates ready to test in your generator.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                  {template.samplePrompts.length} Sample Prompts
                </span>
              </div>

              <div className="space-y-4">
                {template.samplePrompts.map((promptText, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800 font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 group relative"
                  >
                    <p className="pr-10">{promptText}</p>
                    <button
                      onClick={() => handleCopyPrompt(promptText, idx)}
                      className="absolute top-3 right-3 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-xs"
                      title="Copy prompt"
                    >
                      {copiedPromptIdx === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Compatibility & Specifications
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block mb-1">Recommended Engine</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{template.recommendedModel}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block mb-1">Commercial License</span>
                  <span className="font-semibold text-emerald-600">Full Commercial Use</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block mb-1">Lifetime Updates</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Included free</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Sticky Purchase Card */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-lg">
              
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 font-medium">One-time purchase</span>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {formatPrice(template.priceCents)}
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Instant Access
                </span>
              </div>

              {/* Benefits list */}
              <div className="py-6 space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>{template.promptCount} modular master prompts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Instant copy to Midjourney & DALL-E</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Saved permanently to your personal library</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Full commercial rights for client projects</span>
                </div>
              </div>

              {/* Buy Button */}
              {isPurchased ? (
                <div className="space-y-3">
                  <div className="w-full py-3.5 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold text-sm flex items-center justify-center gap-2 border border-emerald-200 dark:border-emerald-800">
                    <BookmarkCheck className="w-4 h-4" />
                    <span>You own this template</span>
                  </div>
                  <Link
                    to="/dashboard"
                    className="w-full py-3 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>View in My Library</span>
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleBuyNow}
                  disabled={isCheckingOut}
                  className="w-full py-4 px-6 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-500/25 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isCheckingOut ? 'Unlocking Pack...' : 'Buy now'}</span>
                </button>
              )}

              <p className="mt-4 text-[11px] text-center text-slate-400 dark:text-slate-500">
                Demo checkout mode &middot; Instant delivery &middot; 100% satisfaction guarantee
              </p>

            </div>
          </div>

        </div>

      </main>

      {/* Sticky Bottom Bar on Mobile (<640px) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] bg-white/95 dark:bg-[#090e1c]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-white/10 z-40 sm:hidden flex items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[10px] text-slate-400 font-medium block">Lifetime Pack</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">
            {formatPrice(template.priceCents)}
          </span>
        </div>

        {isPurchased ? (
          <Link
            to="/dashboard"
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Open in Library</span>
          </Link>
        ) : (
          <button
            onClick={handleBuyNow}
            disabled={isCheckingOut}
            className="flex-1 py-3 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-500/25 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isCheckingOut ? 'Unlocking...' : 'Buy Pack Now'}</span>
          </button>
        )}
      </div>

      <Footer />
    </div>
  );
};

