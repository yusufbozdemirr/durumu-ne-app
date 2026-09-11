import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandLogo } from '../components/common/BrandLogo';
import { ArrowRight, Lock, Mail, ShieldCheck, Loader2 } from 'lucide-react';
import { ADMIN_UID, isSystemAdmin } from '../utils/constants';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    return localStorage.getItem('durumu_remember_me') !== 'false';
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('durumu_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

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
      setError(err?.message || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol ediniz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Logo & Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <BrandLogo size="lg" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Kullanıcı Girişi</h2>
        <p className="mt-1 text-xs text-slate-500">
          Servis yönetim panelinize erişmek için giriş yapın.
        </p>
      </div>

      {/* Login Box */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 border border-slate-200/80 shadow-xs rounded-2xl">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  id="input-login-email"
                  required
                  placeholder="ornek@servis.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono transition-colors focus:outline-hidden focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Şifre
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  id="input-login-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs transition-colors focus:outline-hidden focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between py-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 font-medium hover:text-slate-900 transition-colors">
                <input
                  type="checkbox"
                  id="checkbox-remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 focus:ring-offset-0 transition-colors cursor-pointer"
                />
                <span>Hesabı hatırla (Oturumu açık tut)</span>
              </label>
            </div>

            {/* Primary Button */}
            <button
              type="submit"
              id="btn-login-submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Giriş Yapılıyor...</span>
                </>
              ) : (
                <>
                  <span>Giriş Yap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Business notice */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 leading-relaxed">
            İşletme hesabı açılışı için{' '}
            <a
              href="https://bozdemirdigital.com.tr"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-2 transition-colors inline-flex items-center gap-1"
            >
              BOZDEMIR DIGITAL
            </a>{' '}
            ile iletişime geçiniz.
          </div>
        </div>

        {/* Security assurance */}
        <div className="text-center mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Güvenli Oturum • Araç Durum Takip Yazılımı</span>
        </div>
      </div>
    </div>
  );
};
