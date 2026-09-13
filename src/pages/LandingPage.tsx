import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PlateDisplay } from '../components/common/PlateDisplay';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Clock,
  Wrench,
  Building2,
  Send,
  RefreshCw,
  QrCode,
  MessageCircle,
  PhoneCall,
  Check,
  Layers,
  Zap,
  HelpCircle,
} from 'lucide-react';
import {
  SUPPORT_PHONE_DISPLAY,
  getWhatsAppDirectUrl,
} from '../utils/constants';

interface DemoStage {
  key: string;
  stepNumber: number;
  label: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  description: string;
  note: string;
  estimatedDelivery: string;
  updatedAgo: string;
}

const DEMO_STAGES: DemoStage[] = [
  {
    key: 'received',
    stepNumber: 1,
    label: 'Araç Kabul Edildi',
    badge: 'Kabul Edildi',
    badgeBg: 'bg-slate-100/80',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-200',
    dotColor: 'bg-slate-400',
    description: 'Aracınız atölyemize giriş yapmış olup ilk servis kaydı oluşturulmuştur.',
    note: 'Müşteri şikayeti: Periyodik bakım ve fren kontrolü talebi.',
    estimatedDelivery: 'Bugün 18:00',
    updatedAgo: '1 saat önce',
  },
  {
    key: 'diagnosis',
    stepNumber: 2,
    label: 'Arıza Tespiti Yapılıyor',
    badge: 'Arıza Tespiti',
    badgeBg: 'bg-blue-950/80',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-700',
    dotColor: 'bg-blue-400',
    description: 'Teknisyenlerimiz motor, fren sistemi ve diagnostik cihaz kontrollerini gerçekleştiriyor.',
    note: 'Ön fren diskleri ve balatalarda aşınma tespit edildi.',
    estimatedDelivery: 'Yarın 14:00',
    updatedAgo: '45 dk önce',
  },
  {
    key: 'waiting_parts',
    stepNumber: 3,
    label: 'Parça Tedarik Sürecinde',
    badge: 'Parça Bekleniyor',
    badgeBg: 'bg-amber-950/80',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-700',
    dotColor: 'bg-amber-400',
    description: 'Orijinal filtreler, motor yağı ve fren parçalarının servise ulaşması bekleniyor.',
    note: 'Orijinal parçalar sipariş edildi, sevkiyat yolda.',
    estimatedDelivery: 'Yarın 16:30',
    updatedAgo: '20 dk önce',
  },
  {
    key: 'repair',
    stepNumber: 4,
    label: 'Onarım & Bakım Yapılıyor',
    badge: 'Onarımda',
    badgeBg: 'bg-teal-50/90',
    badgeText: 'text-teal-600',
    badgeBorder: 'border-emerald-600',
    dotColor: 'bg-emerald-400',
    description: 'Motor yağı, filtreler yenileniyor ve fren sistemi montaj işlemleri usta tezgahında devam ediyor.',
    note: 'Fren diskleri montajı tamamlandı, yağ değişimi yapılıyor.',
    estimatedDelivery: 'Bugün 17:30',
    updatedAgo: '5 dk önce',
  },
  {
    key: 'testing',
    stepNumber: 5,
    label: 'Test & Son Kontroller',
    badge: 'Test Aşamasında',
    badgeBg: 'bg-indigo-950/80',
    badgeText: 'text-indigo-300',
    badgeBorder: 'border-indigo-700',
    dotColor: 'bg-indigo-400',
    description: 'Tamir işlemleri tamamlandı; fren test cihazı ve yol güvenlik kontrolleri uygulanıyor.',
    note: 'Yol testi ve OBD elektronik kontrolü olumlu tamamlandı.',
    estimatedDelivery: 'Bugün 16:45',
    updatedAgo: 'Az önce',
  },
  {
    key: 'ready',
    stepNumber: 6,
    label: 'Teslime Hazır',
    badge: 'Teslime Hazır',
    badgeBg: 'bg-teal-100/90',
    badgeText: 'text-emerald-200',
    badgeBorder: 'border-teal-500',
    dotColor: 'bg-emerald-400',
    description: 'Tüm bakım ve onarım işlemleri eksiksiz tamamlandı. Aracınızı güvenle teslim alabilirsiniz.',
    note: 'Araç yıkandı ve atölye önü teslim alanına park edildi.',
    estimatedDelivery: 'Hemen Teslim Edilebilir',
    updatedAgo: 'Şimdi',
  },
];

export const LandingPage: React.FC = () => {
  const { currentUser, userProfile, isAdmin, isAuthenticated } = useApp();
  const [selectedStageIdx, setSelectedStageIdx] = useState(3); // Default to "Onarım"
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const currentDemo = DEMO_STAGES[selectedStageIdx];

  // Truly authenticated user check (requires valid profile or admin)
  const isTrulyAuthenticated =
    isAuthenticated &&
    currentUser &&
    (isAdmin || (userProfile && userProfile.businessId));

  const whatsappHeroUrl = getWhatsAppDirectUrl(
    'Merhaba, Durumu Ne? sistemi hakkında bilgi almak istiyorum.'
  );
  const whatsappFloatingUrl = getWhatsAppDirectUrl(
    'Merhaba, Durumu Ne? hakkında görüşmek istiyorum.'
  );

  const faqs = [
    {
      q: 'Müşterilerimin aracını takip etmesi için bir uygulama indirmesi gerekir mi?',
      a: 'Hayır, kesinlikle gerekmez. Müşterinize gönderdiğiniz bağlantı veya QR kod, telefonun tarayıcısında anında açılır. Şifre girmelerine veya herhangi bir program yüklemelerine gerek yoktur.',
    },
    {
      q: '7 günlük ücretsiz deneme için kredi kartı bilgisi gerekiyor mu?',
      a: 'Hayır. Deneme sürümünü 1 dakikada sadece adınızı ve servisinizin adını girerek başlatabilirsiniz. Kredi kartı veya taahhüt istenmez.',
    },
    {
      q: 'WhatsApp mesajı nasıl gönderilir? Sistem kontör harcar mı?',
      a: 'Durumu Ne? herhangi bir SMS veya WhatsApp kontörü satmaz. Servis panelinizde tek bir tuşa bastığınızda doğrudan cihazınızın WhatsApp uygulaması açılır; müşterinizin adı ve araca özel canlı takip linki hazır mesaj şablonuyla gelir.',
    },
    {
      q: 'Servis kabul fişlerine QR kod ekleyebilir miyim?',
      a: 'Evet. Panelden her araç için tek tıkla yazdırılabilir QR kodlu araç takip kartı üretebilirsiniz. Müşterinize teslim fişi olarak verebilir, cama veya anahtarlığa iliştirebilirsiniz.',
    },
    {
      q: 'Hangi cihazlardan paneli kullanabilirim?',
      a: 'Durumu Ne? modern bulut tabanlı bir web yazılımıdır. Cep telefonunuzdan, tabletinizden veya atölyenizdeki masaüstü bilgisayarınızdan aynı anda kesintisiz erişebilirsiniz.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-teal-500/30 selection:text-white relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-emerald-500/10 via-emerald-900/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-[800px] -left-48 w-96 h-96 bg-teal-500/5 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-[1600px] -right-48 w-96 h-96 bg-blue-600/5 blur-[130px] pointer-events-none rounded-full" />

      {/* Modern Top Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo with large favicon */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <img
              src="/favicon.png"
              alt="Durumu Ne? Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl p-1 bg-white border border-slate-200 shadow-md object-contain group-hover:border-teal-500 transition-colors shrink-0"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-teal-600 transition-colors">
                  DURUMU NE?
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-600 border border-teal-200">
                  PRO
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                Canlı Araç Durum Takip Platformu
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#urun-ozellikleri" className="hover:text-teal-600 transition-colors">
              Ürün Özellikleri
            </a>
            <a href="#canli-simulasyon" className="hover:text-teal-600 transition-colors">
              Canlı Önizleme
            </a>
            <a href="#nasil-calisir" className="hover:text-teal-600 transition-colors">
              Nasıl Çalışır?
            </a>
            <Link to="/paketler" className="hover:text-teal-600 transition-colors">
              Paketler & Fiyatlar
            </Link>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            {/* WhatsApp direct contact */}
            <a
              href={whatsappHeroUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 border-[#25D366]/30 transition-colors shadow-sm cursor-pointer"
              title="WhatsApp Destek Hattı"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              <span>{SUPPORT_PHONE_DISPLAY}</span>
            </a>

            {isTrulyAuthenticated ? (
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                id="btn-nav-dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-colors shadow-md shadow-emerald-600/30"
              >
                <span>Yönetim Paneline Git</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  id="btn-nav-dealer-login"
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors"
                >
                  Bayi Girişi
                </Link>
                <Link
                  to="/hosgeldiniz"
                  id="btn-nav-try-free"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-all shadow-md shadow-emerald-600/30"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-900" />
                  <span>7 Gün Ücretsiz</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 sm:pt-18 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Prominent Large Favicon Logo */}
            <div className="flex justify-center mb-2">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-teal-500/20 blur-xl animate-pulse" />
                <img
                  src="/favicon.png"
                  alt="Durumu Ne?"
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-2 bg-white border-2 border-teal-500/40 shadow-2xl object-contain"
                />
              </div>
            </div>

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50/70 border border-teal-200 text-teal-600 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Oto Servisler İçin Canlı Araç Durum Takip Platformu</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Müşteriniz Aracını Canlı Takip Etsin,{' '}
              <span className="text-teal-600 underline decoration-emerald-500/40 underline-offset-8">
                Telefon Trafiği Sıfırlansın
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Araç kabulden teslime 6 aşamalı şeffaf takip. Tek tıkla WhatsApp üzerinden müşterinize özel link gönderin; "aracım ne zaman çıkar?" sorularına kalıcı olarak son verin.
            </p>

            {/* Call to Actions */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/hosgeldiniz"
                id="btn-hero-start-free"
                className="w-full sm:w-auto px-7 py-3.5 text-sm font-extrabold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-900" />
                <span>7 Gün Ücretsiz Deneyin</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/login"
                id="btn-hero-dealer-login"
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-slate-500" />
                <span>Bayi Girişi</span>
              </Link>

              <a
                href={whatsappHeroUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-hero-whatsapp-info"
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 border-[#25D366]/30 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp İletişim</span>
              </a>
            </div>

            {/* Micro assurances */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#25D366]" />
                <span>Kredi Kartı Gerekmez</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#25D366]" />
                <span>Müşterinin Uygulama İndirmesine Gerek Yok</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#25D366]" />
                <span>1 Dakikada Kurulum</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CANLI SİMÜLASYON BÖLÜMÜ (MÜŞTERİ TAKİP EKRANI CANLI ÖNİZLEME) */}
      <section id="canli-simulasyon" className="py-16 sm:py-24 border-t border-slate-200 bg-white/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50/80 text-teal-600 border border-teal-200 text-xs font-bold mb-3 shadow-sm">
              <Smartphone className="w-3.5 h-3.5 text-teal-600" />
              <span>Gerçek Müşteri Deneyimi</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Müşterinizin Telefonunda Gördüğü Canlı Takip Ekranı
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Aşağıdaki aşama butonlarına tıklayarak müşterinizin aşamaları anlık olarak nasıl izlediğini deneyimleyin.
            </p>
          </div>

          {/* Interactive Stage Selector Buttons */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {DEMO_STAGES.map((st, idx) => {
                const isActive = selectedStageIdx === idx;
                return (
                  <button
                    key={st.key}
                    type="button"
                    onClick={() => setSelectedStageIdx(idx)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer ${
                      isActive
                        ? 'bg-teal-600 text-slate-900 border-teal-500 shadow-lg shadow-emerald-600/30 scale-[1.02]'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-200 hover:text-white'
                    }`}
                  >
                    <span className="block text-[10px] opacity-80 uppercase tracking-wider mb-0.5">
                      {idx + 1}. Aşama
                    </span>
                    <span className="truncate block">{st.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real Customer Phone Frame Mockup */}
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-[38px] p-3 sm:p-4 border-4 border-slate-200 shadow-2xl relative">
              {/* Phone Speaker Notch */}
              <div className="w-28 h-4 bg-slate-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-slate-50 mr-2" />
                <div className="w-12 h-1 bg-slate-700 rounded-full" />
              </div>

              {/* Screen Inner Container (Dark navy customer tracking interface) */}
              <div className="bg-slate-50 rounded-[28px] border border-slate-200 p-4 sm:p-5 space-y-4 text-slate-900">
                {/* Header in phone */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <img
                      src="/favicon.png"
                      alt="Logo"
                      className="w-8 h-8 rounded-lg object-contain border border-teal-500/40 bg-white p-0.5"
                    />
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        Örnek Oto Servis & Bakım
                      </h4>
                      <span className="text-[10px] text-teal-600 flex items-center gap-1 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Canlı Araç Durumu
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">
                    Şifresiz
                  </span>
                </div>

                {/* Real Turkish License Plate Box in Customer View */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center space-y-2.5 shadow-md">
                  <div className="flex justify-center">
                    <PlateDisplay plate="34 ABC 789" size="lg" />
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Volkswagen Golf 1.5 TSI
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Model Yılı: 2022 • Şasi: WVWZZZ...
                    </p>
                  </div>

                  {/* Dynamic Status Banner */}
                  <div className="p-3.5 rounded-xl border border-teal-200/80 bg-teal-50/70 flex flex-col items-center justify-center gap-1 text-center">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-teal-600">
                      Mevcut Aşama ({currentDemo.stepNumber} / 6)
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-base font-black text-emerald-200">
                        {currentDemo.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-normal mt-0.5">
                      {currentDemo.description}
                    </p>
                  </div>

                  {/* Estimated Delivery & Update */}
                  <div className="grid grid-cols-2 gap-2 text-left pt-1">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1">
                        <Clock className="w-3 h-3 text-teal-600" />
                        Tahmini Teslim
                      </span>
                      <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                        {currentDemo.estimatedDelivery}
                      </p>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 text-teal-600" />
                        Son Güncelleme
                      </span>
                      <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                        {currentDemo.updatedAgo}
                      </p>
                    </div>
                  </div>

                  {/* Technician Note */}
                  <div className="p-2.5 bg-amber-950/50 rounded-xl border border-amber-800/60 text-left text-xs">
                    <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block mb-0.5">
                      Usta Notu:
                    </span>
                    <p className="text-amber-100 font-mono text-[11px] leading-relaxed">
                      "{currentDemo.note}"
                    </p>
                  </div>
                </div>

                {/* 6 Stages Timeline Simulation */}
                <div className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-2 shadow-md">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Aşama Çizelgesi
                    </span>
                    <span className="text-[10px] font-semibold text-teal-600">
                      Canlı
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {DEMO_STAGES.map((st, i) => {
                      const isPast = i < selectedStageIdx;
                      const isCurrent = i === selectedStageIdx;
                      return (
                        <div
                          key={st.key}
                          className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                            isCurrent
                              ? 'bg-teal-50/80 border border-teal-200 text-slate-900 font-bold shadow-sm'
                              : isPast
                              ? 'bg-slate-50/60 text-slate-600'
                              : 'bg-transparent text-slate-500'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                isPast
                                  ? 'bg-teal-600 text-slate-900'
                                  : isCurrent
                                  ? 'bg-teal-500 text-white animate-pulse'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {isPast ? <Check className="w-3 h-3" /> : i + 1}
                            </div>
                            <span>{st.label}</span>
                          </div>

                          <span className="text-[10px] opacity-80 font-mono">
                            {isPast ? 'Tamamlandı' : isCurrent ? 'İşlemde' : 'Sırada'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Direct Action Buttons for Customer */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="tel:05415266022"
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
                    <span>Servisi Ara</span>
                  </a>
                  <a
                    href={whatsappHeroUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-teal-600 hover:bg-teal-500 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <div className="text-center pt-1 text-[10px] text-slate-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-teal-600" />
                  <span>Güvenli Takip Sayfası • Durumu Ne?</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ÜRÜN ÖZELLİKLERİ BÖLÜMÜ */}
      <section id="urun-ozellikleri" className="py-16 sm:py-24 border-t border-slate-200 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50/70 text-teal-600 border border-teal-200 text-xs font-bold mb-3 shadow-sm">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span>Modern Servis Yönetimi</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Ürün Özellikleri
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-500">
              Atölyenizi karışık defterlerden, kaybolan notlardan ve gün boyu çalan servis telefonlarından kurtaran akıllı özellikler.
            </p>
          </div>

          {/* 4 Feature Bento Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 hover:border-teal-500/60 hover:shadow-xl transition-all shadow-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center shadow-sm">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Tek Tıkla WhatsApp ile Canlı Durum Paylaşımı
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Her araca özel benzersiz, şifresiz bir canlı takip bağlantısı üretilir. Servis panelinden tek bir tuşla müşterinizin telefonuna hazır WhatsApp mesajı gönderilir.
              </p>
              <ul className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>SMS veya kontör ücreti ödemezsiniz</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Müşterinin telefonunda tek dokunuşla açılır</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 hover:border-teal-500/60 hover:shadow-xl transition-all shadow-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center shadow-sm">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                6 Aşamalı Şeffaf Durum Çizelgesi
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Araç kabul, arıza tespiti, parça bekleme, bakım onarım, test ve teslime hazır aşamalarını saniyeler içinde güncelleyin. Müşteriniz aracın nerede olduğunu bilerek güvenir.
              </p>
              <ul className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Tahmini teslim saati ve usta notları</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Zaman damgalı otomatik aşama geçmişi</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 hover:border-teal-500/60 hover:shadow-xl transition-all shadow-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center shadow-sm">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Yazdırılabilir QR Kodlu Kabul Kartları
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Her yeni araç kabulünde sistem otomatik olarak QR kodlu takip kartı hazırlar. Yazıcıdan tek tıkla çıktı alıp araç kabul fişi olarak müşterinize verin.
              </p>
              <ul className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Müşteri kamerasını tuttuğunda durum hemen açılır</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Servisinizin kurumsal imajını anında yükseltir</span>
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 hover:border-teal-500/60 hover:shadow-xl transition-all shadow-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center shadow-sm">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Sıfır Telefon Trafiği & Günde 2+ Saat Tasarruf
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                "Ustam benim araba ne oldu, parça geldi mi?" soruları %85 oranında azalır. Ustalarınız ve siz telefon yanıtlamak yerine servisteki araçları tamamlamaya odaklanırsınız.
              </p>
              <ul className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Daha az bölünme, daha yüksek iş tamamlama hızı</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Memnun kalan müşterilerden tavsiye ve referans</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR BÖLÜMÜ */}
      <section id="nasil-calisir" className="py-16 sm:py-24 border-t border-slate-200 bg-white/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50/70 text-teal-600 border border-teal-200 text-xs font-bold mb-3 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-teal-600" />
              <span>3 Kolay Adım</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Nasıl Çalışır?
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Karmaşık eğitimler veya teknik bilgi gerekmez. 1 dakikada kullanmaya başlayabilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 text-center space-y-4 shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-emerald-600/30">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">Aracı Kaydedin</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Servise gelen aracın plakasını, marka ve modelini yazın. Sistem anında araca özel güvenli takip sayfası oluşturur.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 text-center space-y-4 shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-emerald-600/30">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">Aşamayı Güncelleyin</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Araç onarımdayken veya parça beklerken tek tıkla yeni aşamaya geçirin, dilerseniz kısa bir usta notu ekleyin.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 text-center space-y-4 shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-emerald-600/30">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">Müşteriniz Canlı İzlesin</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Müşteriniz WhatsApp linkinden veya QR koddan aracının durumunu canlı izler. İş bittiğinde "Hazır" bildirimi gider.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SIKÇA SORULAN SORULAR (SSS) */}
      <section className="py-16 sm:py-20 border-t border-slate-200 bg-slate-50 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50/70 text-teal-600 border border-teal-200 text-xs font-bold mb-3 shadow-sm">
              <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
              <span>Merak Edilenler</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sıkça Sorulan Sorular
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-slate-200 overflow-hidden transition-all shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-4 px-5 sm:px-6 flex items-center justify-between text-left text-sm sm:text-base font-bold text-slate-900 hover:text-teal-600 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-teal-600 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DIRECT WHATSAPP CALLOUT BANNER */}
      <section className="py-12 border-t border-slate-200 relative bg-gradient-to-r from-emerald-950/50 via-[#0c152a] to-emerald-950/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
              Hızlı İletişim & Canlı Destek
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Sorularınız mı var? Doğrudan WhatsApp'tan bize yazın
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              İletişim Hattı: <span className="text-slate-900 font-bold">{SUPPORT_PHONE_DISPLAY}</span>
            </p>
          </div>

          <a
            href={whatsappHeroUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm flex items-center gap-2.5 transition-all shadow-lg shadow-emerald-700/30 shrink-0 cursor-pointer"
          >
            <WhatsAppIcon className="w-5 h-5 text-white" />
            <span>WhatsApp ile Mesaj Gönder</span>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-slate-200">
            {/* Brand column with logo */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="/favicon.png"
                  alt="Durumu Ne? Logo"
                  className="w-10 h-10 rounded-xl p-1 bg-white border border-slate-200 object-contain shadow-sm"
                />
                <span className="font-black text-base text-slate-900 tracking-tight">
                  DURUMU NE?
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Oto servisler için canlı araç durum takip ve müşteri bilgilendirme yazılımı.
              </p>
              <p className="text-xs text-teal-600 font-bold">
                WhatsApp: {SUPPORT_PHONE_DISPLAY}
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                Hızlı Bağlantılar
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#urun-ozellikleri" className="hover:text-teal-600 transition-colors">
                    Ürün Özellikleri
                  </a>
                </li>
                <li>
                  <a href="#canli-simulasyon" className="hover:text-teal-600 transition-colors">
                    Canlı Önizleme
                  </a>
                </li>
                <li>
                  <Link to="/paketler" className="hover:text-teal-600 transition-colors">
                    Paketler & Fiyatlar
                  </Link>
                </li>
                <li>
                  <Link to="/hosgeldiniz" className="hover:text-teal-600 transition-colors">
                    7 Gün Ücretsiz Dene
                  </Link>
                </li>
              </ul>
            </div>

            {/* Portal access */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                Servis Girişi
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className="hover:text-teal-600 transition-colors">
                    Bayi Girişi
                  </Link>
                </li>
                <li>
                  <Link to="/hosgeldiniz" className="hover:text-teal-600 transition-colors">
                    Yeni Bayi Hesabı Aç
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                Yasal & Güvenlik
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/kvkk" className="hover:text-teal-600 transition-colors">
                    KVKK Aydınlatma Metni
                  </Link>
                </li>
                <li>
                  <Link to="/gizlilik-politikasi" className="hover:text-teal-600 transition-colors">
                    Gizlilik Politikası
                  </Link>
                </li>
                <li>
                  <Link to="/cerez-politikasi" className="hover:text-teal-600 transition-colors">
                    Çerez Politikası
                  </Link>
                </li>
                <li>
                  <Link to="/kullanim-kosullari" className="hover:text-teal-600 transition-colors">
                    Kullanım Şartları
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#25D366]" />
              <span>© 2026 Durumu Ne? Tüm hakları saklıdır.</span>
            </div>
            <span>Destek & Bilgi: {SUPPORT_PHONE_DISPLAY}</span>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON (BOTTOM RIGHT) */}
      <a
        href={whatsappFloatingUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="floating-whatsapp-btn"
        className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-emerald-900/40 flex items-center justify-center transition-transform hover:scale-110 group cursor-pointer"
        title="WhatsApp Destek Hattı (0541 526 60 22)"
      >
        <WhatsAppIcon className="w-6 h-6 text-white" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-extrabold pl-0 group-hover:pl-2">
          WhatsApp Destek
        </span>
      </a>
    </div>
  );
};
