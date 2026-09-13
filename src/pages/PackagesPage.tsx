import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandLogo } from '../components/common/BrandLogo';
import {
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  LogOut,
  Sparkles,
  Car,
  QrCode,
  Smartphone,
  Headphones,
  ArrowLeft,
  Zap,
  AlertTriangle,
} from 'lucide-react';
import {
  getProUpgradeWhatsAppUrl,
  getWhatsAppDirectUrl,
  SUPPORT_PHONE_DISPLAY,
} from '../utils/constants';

export const PackagesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    business,
    planStatus,
    logout,
    isAdmin,
    isAuthenticated,
  } = useApp();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isExpiredUserLoggedIn = Boolean(
    isAuthenticated && !isAdmin && business && planStatus?.isExpired
  );

  const canReturnToDashboard =
    isAuthenticated && (isAdmin || planStatus.canAccessDashboard);
  const upgradeWhatsAppUrl = getProUpgradeWhatsAppUrl(business?.name);
  const generalWhatsAppUrl = getWhatsAppDirectUrl(
    'Merhaba, Durumu Ne? paketleri ve lisanslama hakkında bilgi almak istiyorum.'
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            id="link-packages-back-home"
            className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Geri Dön"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <BrandLogo size="md" />
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {canReturnToDashboard && (
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  id="btn-packages-return-dashboard"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Panele Dön</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={handleLogout}
                id="btn-packages-logout"
                className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Çıkış Yap</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                id="btn-packages-dealer-login"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Bayi Girişi
              </Link>
              <Link
                to="/hosgeldiniz"
                id="btn-packages-try-free"
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-colors shadow-md shadow-emerald-600/30"
              >
                7 Gün Ücretsiz Dene
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col items-center">
        {/* Expired alert banner */}
        {isExpiredUserLoggedIn ? (
          <div className="w-full max-w-xl mx-auto mb-8 bg-amber-950/60 border border-amber-800/80 rounded-2xl p-5 shadow-xl text-left space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-900/80 text-amber-200 border border-amber-700/60">
                    Süre Sonu Bildirimi
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Ücretsiz deneme süreniz sona erdi.
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Durumu Ne? hesabınızı kullanmaya devam etmek için Pro pakete geçebilirsiniz. Servis süreçlerinizi kesintisiz yönetmek için hemen lisansınızı yenileyin.
                </p>
              </div>
            </div>

            {business && (
              <div className="pt-3 border-t border-amber-850 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">İşletme:</span>{' '}
                  <span className="font-bold text-slate-900">{business.name}</span>
                </div>
                <span className="text-rose-400 font-bold bg-rose-950/80 border border-rose-800 px-2 py-0.5 rounded">
                  Deneme Bitti
                </span>
              </div>
            )}
          </div>
        ) : null}

        {/* Standard view header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50/70 border border-teal-200/70 text-teal-600 text-xs font-bold mb-4 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-teal-600" />
            <span>7 Gün Boyunca Kredi Kartsız Ücretsiz Deneyin</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Paketler & Lisanslama
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Oto servisiniz için telefon trafiğini sıfırlayan, müşteri güvenini katlayan ve işlerinizi kolaylaştıran şeffaf çözüm.
          </p>
        </div>

        {/* Pro Package Features Card */}
        <div className="mt-8 w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

          <div className="flex items-center justify-between border-b border-slate-200 pb-5">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                Yıllık / Aylık Servis Lisansı
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Durumu Ne? PRO
              </h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-600 text-white shadow-md shadow-emerald-600/30">
              TAM ERİŞİM
            </span>
          </div>

          {/* Features Checklist */}
          <div className="py-6 space-y-3.5">
            <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
              <div className="w-5 h-5 rounded-md bg-teal-50/80 border border-teal-200 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-semibold text-slate-900">Sınırsız Araç ve Servis Kaydı:</span> İşletmenize gelen tüm araçları arşivleme sınırı olmaksızın kaydedin.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
              <div className="w-5 h-5 rounded-md bg-teal-50/80 border border-teal-200 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-semibold text-slate-900">WhatsApp Tek Tıkla Canlı Takip:</span> Müşterilerinize şifresiz, anında açılan canlı takip linki iletin.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
              <div className="w-5 h-5 rounded-md bg-teal-50/80 border border-teal-200 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                <QrCode className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-semibold text-slate-900">Yazdırılabilir QR Kod Kartları:</span> Araç kabul fişlerine QR kod basarak müşterilerinizin kolayca okutmasını sağlayın.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
              <div className="w-5 h-5 rounded-md bg-teal-50/80 border border-teal-200 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                <Car className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-semibold text-slate-900">6 Aşamalı Şeffaf Durum Çizelgesi:</span> Arıza tespiti, parça bekleme ve onarım aşamalarını tek dokunuşla güncelleyin.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
              <div className="w-5 h-5 rounded-md bg-teal-50/80 border border-teal-200 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                <Headphones className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-semibold text-slate-900">Öncelikli WhatsApp Destek:</span> Lisans süreniz boyunca doğrudan teknik yardım ve danışmanlık alın.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2.5">
            {isExpiredUserLoggedIn ? (
              <a
                href={upgradeWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-packages-whatsapp-upgrade"
                className="w-full py-3.5 px-6 text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-2xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2.5 text-center group cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                <span>Pro Paket İçin WhatsApp'tan İletişime Geç</span>
              </a>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Link
                  to="/hosgeldiniz"
                  id="btn-packages-start-trial"
                  className="py-3 px-4 text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-colors shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>7 Gün Ücretsiz Başla</span>
                </Link>
                <a
                  href={generalWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="btn-packages-whatsapp-info"
                  className="py-3 px-4 text-xs sm:text-sm font-bold text-teal-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-teal-600" />
                  <span>WhatsApp ile Bilgi Al</span>
                </a>
              </div>
            )}
            <p className="text-center text-[11px] text-slate-500 mt-2">
              WhatsApp destek numaramız: <span className="font-bold text-slate-600">{SUPPORT_PHONE_DISPLAY}</span>
            </p>
          </div>
        </div>

        {/* Direct WhatsApp Callout */}
        <div className="mt-8 text-center text-xs text-slate-500">
          Kurulum ve sorularınız için WhatsApp hattımız:{' '}
          <a
            href={generalWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-teal-600 hover:underline inline-flex items-center gap-1 ml-1"
          >
            <MessageCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>{SUPPORT_PHONE_DISPLAY}</span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-1.5 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>© 2026 Durumu Ne? Tüm hakları saklıdır.</span>
        </div>
      </footer>
    </div>
  );
};
