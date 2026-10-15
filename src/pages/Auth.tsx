import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Mail, KeyRound, Sparkles, ArrowRight, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../hooks/use-auth';
import { AppNavbar } from '../components/AppNavbar';
import { Footer } from '../components/Footer';
import { PageMeta } from '../components/PageMeta';

export const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const returnTo = searchParams.get('returnTo') || '/dashboard';

  const { signIn, isLoading, user } = useAuth();

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    setErrorMsg('');
    setStep('otp');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setErrorMsg('Please enter the 6-digit verification code');
      return;
    }

    try {
      await signIn('email-otp', { email, code: otpCode });
      navigate(returnTo);
    } catch (err: any) {
      setErrorMsg('Invalid code. Please try again.');
    }
  };

  const handleGuestLogin = async () => {
    try {
      await signIn('anonymous');
      navigate(returnTo);
    } catch (err) {
      setErrorMsg('Could not start guest session');
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 dark:bg-slate-950">
      <PageMeta
        title="Sign In / Authenticate | ManaDesign"
        description="Sign in or link your email to access your saved prompt library, generated artwork, and purchased template packs."
      />
      <AppNavbar />

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 my-10">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-8 text-center">
          
          {/* Brand mark */}
          <div className="w-12 h-12 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center mx-auto mb-4 font-mono font-bold text-lg shadow-sm">
            ✦_
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {step === 'email' ? 'Welcome to ManaDesign' : 'Check your inbox'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-8">
            {step === 'email'
              ? 'Enter your email to sign in or save your prompt library.'
              : `We sent a 6-digit code to ${email}`}
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleSendEmail} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-sm transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue with Email</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    6-DIGIT VERIFICATION CODE
                  </label>
                  <button
                    type="button"
                    onClick={() => setOtpCode('123456')}
                    className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    Auto-fill test code (123456)
                  </button>
                </div>

                {/* Touch-Friendly Digit Display Boxes */}
                <div className="grid grid-cols-6 gap-2 mb-3">
                  {[0, 1, 2, 3, 4, 5].map((index) => {
                    const digit = otpCode[index] || '';
                    const isCurrent = otpCode.length === index;
                    return (
                      <div
                        key={index}
                        className={`h-12 sm:h-14 flex items-center justify-center rounded-2xl border-2 text-xl font-bold font-mono transition-all ${
                          digit
                            ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 text-slate-900 dark:text-white'
                            : isCurrent
                            ? 'border-sky-400 ring-2 ring-sky-400/20 bg-white dark:bg-slate-800'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-400'
                        }`}
                      >
                        {digit || <span className="opacity-20">&middot;</span>}
                      </div>
                    );
                  })}
                </div>

                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]*"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Type or paste 6-digit code..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base font-mono tracking-widest text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-sm transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <span>{isLoading ? 'Verifying...' : 'Verify & Continue'}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-center text-xs text-slate-500 hover:underline mt-2"
              >
                Change email address
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400">or</span>
            </div>
          </div>

          {/* Guest login */}
          <button
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>Continue as guest</span>
          </button>

          <p className="mt-6 text-[11px] text-slate-400">
            By signing in, you agree to ManaDesign Terms of Service and Privacy Policy.
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
};
