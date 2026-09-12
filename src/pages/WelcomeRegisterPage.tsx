import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandLogo } from '../components/common/BrandLogo';
import { PlateDisplay } from '../components/common/PlateDisplay';
import {
  ArrowRight,
  Lock,
  Mail,
  User,
  Building2,
  Phone,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Smartphone,
  Zap,
} from 'lucide-react';
import { SUPPORT_PHONE_DISPLAY } from '../utils/constants';

export const WelcomeRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerTrial } = useApp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError('Lütfen adınızı ve soyadınızı giriniz.');
      return;
    }
    if (!email.trim()) {
      setError('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }
    if (!businessName.trim()) {
      setError('Lütfen oto servis / işletme adınızı giriniz.');
      return;
    }
    if (!password) {
      setError('Lütfen bir şifre belirleyiniz.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await registerTrial({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        businessName: businessName.trim(),
        phone: phone.trim(),
      });

      // Navigate to dashboard after successful account & business registration
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err?.message || 'Kayıt işlemi gerçekleştirilemedi. Lütfen bilgilerinizi kontrol ediniz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-800/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Header */}
      <header className="h-16 border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between z-20 backdrop-blur-md bg-slate-950/70 sticky top-0">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            id="btn-register-back"
            className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Geri Dön"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2.5">
            <img
              src="/favicon.png"
              alt="Logo"
              className="w-8 h-8 rounded-lg object-contain border border-emerald-500/30"
            />
            <span className="font-extrabold text-base tracking-tight text-white">
              DURUMU NE?
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Zaten hesabınız var mı?
          </span>
          <Link
            to="/login"
            id="link-welcome-login"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-colors"
          >
            Bayi Girişi
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 z-10 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          {/* Left Column: SaaS Value Proposition & Live Visual */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>7 Gün Tam Özellikli Ücretsiz Deneme</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Servisinizi Tek Tıkla <span className="text-emerald-400">Dijitalleştirin</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg">
                Müşterilerinize telefonla laf anlatmaya son verin. Araç durumunu tek tıkla güncelleyin; müşteriniz cebinden canlı takip etsin.
              </p>
            </div>

            {/* Live Customer Simulation Card */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <PlateDisplay plate="34 ABC 789" size="md" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Volkswagen Golf 1.5 TSI</h4>
                    <p className="text-[11px] text-slate-400">Canlı Müşteri Görünümü</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Onarım / Bakım
                </span>
              </div>

              {/* Progress Steps Simulation */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 font-semibold">
                  <span className="text-[10px] uppercase block text-emerald-400 font-bold">1. Kabul</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mx-auto mt-1" />
                </div>
                <div className="p-2 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 font-semibold">
                  <span className="text-[10px] uppercase block text-emerald-400 font-bold">2. Teşhis</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mx-auto mt-1" />
                </div>
                <div className="p-2 rounded-xl bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/40">
                  <span className="text-[10px] uppercase block">3. Onarım</span>
                  <div className="w-2 h-2 rounded-full bg-white mx-auto mt-1.5 animate-ping" />
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 font-medium">
                  <span className="text-[10px] uppercase block">4. Teslim</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700 mx-auto mt-1.5" />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  Müşteriye özel şifresiz takip bağlantısı
                </span>
                <span className="font-bold text-emerald-400">Kredi Kartı Gerekmez</span>
              </div>
            </div>

            {/* Core Benefits */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Kredi kartı gerekmeden 7 gün tam erişim</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tek tıkla WhatsApp üzerinden hazır durum mesajı gönderimi</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Yazdırılabilir QR kodlu araç kabul fişleri</span>
              </div>
            </div>
          </div>

          {/* Right Column: Modern Registration Form */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Ücretsiz Servis Hesabınızı Açın
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  1 dakikada hesabınızı açın ve servisteki araçlarınızı kaydetmeye başlayın.
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 bg-rose-950/80 border border-rose-800/80 rounded-xl text-xs text-rose-300 font-medium leading-relaxed">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name & Surname */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Adınız <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        id="input-register-firstname"
                        required
                        placeholder="Ali"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          setError('');
                        }}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 transition-colors focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Soyadınız <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="input-register-lastname"
                      required
                      placeholder="Yılmaz"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setError('');
                      }}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 transition-colors focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                {/* Business Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    İşletme / Servis Adı <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="input-register-business-name"
                      required
                      placeholder="Kardeşler Oto Servis"
                      value={businessName}
                      onChange={(e) => {
                        setBusinessName(e.target.value);
                        setError('');
                      }}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 transition-colors focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Telefon Numarası
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      id="input-register-phone"
                      placeholder="0541 526 60 22"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setError('');
                      }}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 transition-colors focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    E-posta Adresi <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      id="input-register-email"
                      required
                      placeholder="ali.yilmaz@ornekoto.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 font-mono transition-colors focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Şifre <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="input-register-password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 font-mono transition-colors focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded transition-colors"
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

                {/* Submit CTA */}
                <button
                  type="submit"
                  id="btn-register-submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 rounded-xl transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Hesap Açılıyor...</span>
                    </>
                  ) : (
                    <>
                      <span>7 Günlük Ücretsiz Denemeyi Başlat</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Terms hint */}
              <p className="text-[11px] text-slate-500 text-center mt-4">
                Kayıt olarak{' '}
                <Link to="/kullanim-kosullari" className="text-emerald-400 hover:underline">
                  Kullanım Koşulları
                </Link>
                'nı ve{' '}
                <Link to="/gizlilik-politikasi" className="text-emerald-400 hover:underline">
                  Gizlilik Politikası
                </Link>
                'nı kabul etmiş olursunuz.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-800/80 bg-slate-950/80 text-center text-xs text-slate-500 z-10">
        <div className="flex items-center justify-center gap-1.5 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>© 2026 Durumu Ne? Tüm hakları saklıdır. Destek Hattı: {SUPPORT_PHONE_DISPLAY}</span>
        </div>
      </footer>
    </div>
  );
};
