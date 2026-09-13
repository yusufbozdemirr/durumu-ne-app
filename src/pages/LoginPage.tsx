import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import {
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import {
  isSystemAdmin,
  getWhatsAppDirectUrl,
  SUPPORT_PHONE_DISPLAY,
} from '../utils/constants';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, currentUser, userProfile, isAdmin, isAuthenticated, isLoading } =
    useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    return localStorage.getItem('durumu_remember_me') !== 'false';
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-redirect if already logged in and "remember me" was active
  useEffect(() => {
    if (!isLoading && isAuthenticated && currentUser) {
      if (isAdmin || isSystemAdmin(currentUser.uid, currentUser.email)) {
        navigate('/admin', { replace: true });
      } else if (userProfile?.businessId) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, currentUser, userProfile, isAdmin, navigate]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('durumu_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Restrict to digits only
    const digitsOnly = e.target.value.replace(/\D/g, '');
    setPassword(digitsOnly);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Lütfen e-posta ve şifrenizi giriniz.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const profile = await login(email.trim(), password, rememberMe);

      // Save or remove remembered credentials
      if (rememberMe) {
        localStorage.setItem('durumu_remembered_email', email.trim());
        localStorage.setItem('durumu_remember_me', 'true');
      } else {
        localStorage.removeItem('durumu_remembered_email');
        localStorage.setItem('durumu_remember_me', 'false');
      }

      // Role based redirection
      if (profile.role === 'admin' || isSystemAdmin(profile.uid, profile.email)) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(
        err?.message ||
          'Giriş yapılamadı. Lütfen e-posta ve şifrenizi kontrol ediniz.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappHelpUrl = getWhatsAppDirectUrl(
    'Merhaba, Durumu Ne? bayi girişi konusunda yardıma ihtiyacım var.'
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 relative selection:bg-teal-500/30 selection:text-white">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-80 bg-teal-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Top bar with back SVG button (NO "Servis Portalı" badge as requested) */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between z-10">
        <Link
          to="/"
          id="btn-login-back"
          className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-md transition-colors inline-flex items-center gap-1.5 text-xs font-semibold"
          title="Ana Sayfaya Dön"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ana Sayfa</span>
        </Link>
      </div>

      {/* Main Form Center Box */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md my-auto z-10 pt-4">
        {/* Top Logo & Title */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <img
              src="/favicon.png"
              alt="Durumu Ne? Logo"
              className="w-16 h-16 rounded-2xl shadow-xl border border-slate-200 p-1.5 bg-white object-contain"
            />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Bayi Girişi
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Servis yönetim panelinize erişmek için oturum açın
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white py-8 px-6 sm:px-8 border border-slate-200 shadow-2xl rounded-2xl">
          {error && (
            <div className="mb-4 p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-300 font-medium leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  id="input-login-email"
                  required
                  placeholder="ali.yilmaz@ornekoto.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900 placeholder:text-slate-500 font-mono transition-colors focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Password input (Numeric Only PIN) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-600">
                  Şifre
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  En az 6 karakter
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="input-login-password"
                  inputMode="numeric"
pattern="[0-9]*"
required
                  placeholder="Şifreniz"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900 placeholder:text-slate-500 font-mono tracking-widest transition-colors focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 p-0.5 rounded transition-colors"
                  title={showPassword ? 'Şifreyi Gizle' : 'Şifreyi Göster'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 font-medium hover:text-slate-900 transition-colors">
                <input
                  type="checkbox"
                  id="checkbox-remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 border-slate-200 bg-slate-50 focus:ring-emerald-600 focus:ring-offset-0 transition-colors cursor-pointer"
                />
                <span>Oturumu açık tut</span>
              </label>

              <a
                href={whatsappHelpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-teal-600 hover:text-teal-600 transition-colors inline-flex items-center gap-1 font-semibold"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-teal-600" />
                <span>Yardım Al</span>
              </a>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              id="btn-login-submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 active:bg-emerald-700 disabled:opacity-50 rounded-xl transition-colors shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 mt-3 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Giriş Yapılıyor...</span>
                </>
              ) : (
                <>
                  <span>Bayi Girişi Yap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Trial Registration CTA */}
          <div className="mt-6 pt-5 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              Henüz servis hesabınız yok mu?
            </p>
            <Link
              to="/hosgeldiniz"
              id="link-login-to-register"
              className="mt-2.5 inline-flex items-center justify-center gap-2 w-full py-3 px-3 text-xs font-bold text-teal-600 bg-teal-50/60 hover:bg-teal-100/60 border border-teal-200/80 rounded-xl transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>7 Gün Ücretsiz Denemeyi Başlat</span>
            </Link>
          </div>
        </div>

        {/* Security assurance */}
        <div className="text-center mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Güvenli Oturum • Durumu Ne? Servis Takip Platformu</span>
        </div>
      </div>

      {/* Subtle Footer */}
      <footer className="text-center text-[11px] text-slate-500 mt-6 z-10 flex items-center justify-center gap-2">
        <WhatsAppIcon className="w-3.5 h-3.5 text-teal-600" />
        <span>
          Destek Hattı:{' '}
          <span className="text-slate-900 font-semibold">
            {SUPPORT_PHONE_DISPLAY}
          </span>
        </span>
      </footer>
    </div>
  );
};
