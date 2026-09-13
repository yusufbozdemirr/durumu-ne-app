import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PlateDisplay } from '../components/common/PlateDisplay';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
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
  Check,
  MessageCircle,
} from 'lucide-react';
import {
  SUPPORT_PHONE_DISPLAY,
  getWhatsAppDirectUrl,
} from '../utils/constants';

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only accept numeric digits
    const digitsOnly = e.target.value.replace(/\D/g, '');
    setPassword(digitsOnly);
    setError('');
  };

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
      setError('Lütfen şifrenizi giriniz.');
      return;
    }
    if (password.length < 6) {
      setError('Şifreniz en az 6 karakter olmalıdır.');
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

      // Show approval waiting dialog
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(
        err?.message ||
          'Kayıt işlemi gerçekleştirilemedi. Lütfen bilgilerinizi kontrol ediniz.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappRepUrl = getWhatsAppDirectUrl(
    `Merhaba, ${businessName || 'işletmem'} için 7 günlük deneme sürümü talebinde bulundum. Onay hakkında bilgi alabilir miyim?`
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-teal-500/30 selection:text-white relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Top Header */}
      <header className="h-16 border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between z-20 backdrop-blur-md bg-white/90 sticky top-0">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            id="btn-register-back"
            className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Geri Dön"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2.5">
            <img
              src="/favicon.png"
              alt="Logo"
              className="w-8 h-8 rounded-lg object-contain border border-teal-500/30 p-0.5 bg-slate-50"
            />
            <span className="font-extrabold text-base tracking-tight text-slate-900">
              DURUMU NE?
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Zaten hesabınız var mı?
          </span>
          <Link
            to="/login"
            id="link-welcome-login"
            className="text-xs font-bold text-teal-600 hover:text-teal-600 px-4 py-2 rounded-xl bg-slate-100/80 border border-slate-200 hover:border-teal-500/50 hover:bg-slate-100 transition-colors"
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50/60 text-teal-600 border border-teal-200/80 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>7 Gün Tam Özellikli Ücretsiz Deneme</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Servisinizi Tek Tıkla{' '}
                <span className="text-teal-600">Dijitalleştirin</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-500 leading-relaxed max-w-lg">
                Müşterilerinize sürekli telefonda durum anlatmaya son verin.
                Aracın aşamasını tek dokunuşla güncelleyin, müşteriniz cebinden
                canlı takip etsin.
              </p>
            </div>

            {/* Live Customer Simulation Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <PlateDisplay plate="34 ABC 789" size="md" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">
                      Volkswagen Golf 1.5 TSI
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Canlı Müşteri Görünümü
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50/80 text-teal-600 border border-teal-200">
                  Onarım / Bakım
                </span>
              </div>

              {/* Progress Steps Simulation */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-teal-50/40 border border-teal-200/60 text-teal-600 font-semibold">
                  <span className="text-[10px] uppercase block text-teal-600 font-bold">
                    1. Kabul
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mx-auto mt-1" />
                </div>
                <div className="p-2 rounded-xl bg-teal-50/40 border border-teal-200/60 text-teal-600 font-semibold">
                  <span className="text-[10px] uppercase block text-teal-600 font-bold">
                    2. Teşhis
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mx-auto mt-1" />
                </div>
                <div className="p-2 rounded-xl bg-teal-600 text-white font-bold shadow-xs">
                  <span className="text-[10px] uppercase block">3. Onarım</span>
                  <div className="w-2 h-2 rounded-full bg-white mx-auto mt-1.5 animate-ping" />
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 font-medium">
                  <span className="text-[10px] uppercase block">4. Teslim</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mx-auto mt-1.5" />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-teal-600" />
                  Müşteriye özel şifresiz takip bağlantısı
                </span>
                <span className="font-bold text-teal-600">
                  Kredi Kartı Gerekmez
                </span>
              </div>
            </div>

            {/* Core Benefits */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2.5 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Kredi kartı gerekmeden 7 gün tam erişim</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>
                  Tek tıkla WhatsApp üzerinden hazır durum mesajı gönderimi
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Yazdırılabilir QR kodlu araç kabul fişleri</span>
              </div>
            </div>
          </div>

          {/* Right Column: Modern Registration Form */}
          <div className="lg:col-span-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Ücretsiz Servis Hesabınızı Açın
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  1 dakikada başvurunuzu iletin, müşteri temsilcimiz onayladıktan
                  sonra 7 günlük denemeniz başlasın.
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-300 font-medium leading-relaxed">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name & Surname */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Adınız <span className="text-teal-600">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
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
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900 placeholder:text-slate-500 transition-colors focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Soyadınız <span className="text-teal-600">*</span>
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
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900 placeholder:text-slate-500 transition-colors focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Business Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    İşletme / Servis Adı{' '}
                    <span className="text-teal-600">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
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
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900 placeholder:text-slate-500 transition-colors focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Phone Number with 0555 555 55 55 placeholder */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Telefon Numarası
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      id="input-register-phone"
                      placeholder="0555 555 55 55"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setError('');
                      }}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900 placeholder:text-slate-500 transition-colors focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    E-posta Adresi <span className="text-teal-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
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
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900 placeholder:text-slate-500 font-mono transition-colors focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Password (NUMERIC ONLY) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-600">
                      Şifre{' '}
                      <span className="text-teal-600">*</span>
                    </label>
                    <span className="text-[11px] text-teal-600 font-mono">
                      En az 6 karakter
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="input-register-password"
                      inputMode="numeric"
pattern="[0-9]*"
required
                      placeholder="Şifre"
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

                {/* Submit CTA */}
                <button
                  type="submit"
                  id="btn-register-submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 active:bg-emerald-700 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Talep Gönderiliyor...</span>
                    </>
                  ) : (
                    <>
                      <span>7 Günlük Deneme Talebini Gönder</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Terms hint */}
              <p className="text-[11px] text-slate-500 text-center mt-4">
                Kayıt olarak{' '}
                <Link
                  to="/kullanim-kosullari"
                  className="text-teal-600 hover:underline"
                >
                  Kullanım Koşulları
                </Link>
                'nı ve{' '}
                <Link
                  to="/gizlilik-politikasi"
                  className="text-teal-600 hover:underline"
                >
                  Gizlilik Politikası
                </Link>
                'nı kabul etmiş olursunuz.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Success / Pending Approval Modal Dialog */}
      {showSuccessModal && (
        <div
          id="dialog-pending-approval"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <div className="bg-white border border-teal-500/50 rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl text-center relative space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-teal-50/80 border border-teal-500/40 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-600 border border-teal-200 mb-2">
                Talep Gönderildi
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Başvurunuz Başarıyla Alındı!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Müşteri temsilcimiz talebinizi onayladıktan sonra{' '}
                <span className="text-teal-600 font-semibold">
                  7 günlük deneme süreniz
                </span>{' '}
                başlatılacaktır.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-left text-xs space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-500">İşletme Adı:</span>
                <span className="font-semibold text-slate-900">{businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Yetkili Kişi:</span>
                <span className="font-semibold text-slate-900">
                  {firstName} {lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">E-posta:</span>
                <span className="font-mono text-slate-900">{email}</span>
              </div>
              {phone && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Telefon:</span>
                  <span className="text-slate-900">{phone}</span>
                </div>
              )}
            </div>

            <div className="space-y-2.5 pt-1">
              <a
                href={whatsappRepUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp'tan Hızlı Onay Al</span>
              </a>

              <button
                type="button"
                id="btn-dialog-close-home"
                onClick={() => navigate('/')}
                className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Anasayfaya Dön
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-500 z-10">
        <div className="flex items-center justify-center gap-1.5 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>
            © 2026 Durumu Ne? Tüm hakları saklıdır. Destek Hattı:{' '}
            {SUPPORT_PHONE_DISPLAY}
          </span>
        </div>
      </footer>
    </div>
  );
};
