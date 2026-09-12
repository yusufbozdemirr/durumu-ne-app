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
} from 'lucide-react';
import {
  getProUpgradeWhatsAppUrl,
  getWhatsAppDirectUrl,
  SUPPORT_PHONE_DISPLAY,
} from '../utils/constants';

export const PackagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { business, planStatus, logout, userProfile, isAdmin, isAuthenticated } = useApp();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isUserExpired = isAuthenticated && !isAdmin && planStatus.isExpired;
  const canReturnToDashboard = isAuthenticated && (isAdmin || planStatus.canAccessDashboard);
  const upgradeWhatsAppUrl = getProUpgradeWhatsAppUrl(business?.name);
  const generalWhatsAppUrl = getWhatsAppDirectUrl('Merhaba, Durumu Ne? paketleri ve fiyatlandırma hakkında bilgi almak istiyorum.');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between">
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
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Panele Dön</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={handleLogout}
                id="btn-packages-logout"
                className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-flex items-center gap-1.5"
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
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Bayi Girişi
              </Link>
              <Link
                to="/hosgeldiniz"
                id="btn-packages-try-free"
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
              >
                7 Gün Ücretsiz Dene
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col items-center">
        {/* Scenario 1: Only for authenticated users whose trial is ACTUALLY EXPIRED */}
        {isUserExpired ? (
          <div className="text-center max-w-2xl mx-auto">
            <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-amber-100/70 animate-ping opacity-25" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 mb-3">
              <span>Deneme Süresi Durumu</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Ücretsiz deneme süreniz sona erdi.
            </h1>

            <p className="mt-2 text-sm sm:text-base font-medium text-slate-700">
              Durumu Ne? hesabınızı kullanmaya devam etmek için Pro pakete geçebilirsiniz.
            </p>

            <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
              İşletmenizdeki servis süreçlerini kesintisiz yönetmeye ve müşterilerinize canlı durum bilgisi sunmaya devam etmek için Pro lisans hakkında bilgi alabilirsiniz.
            </p>

            {business && (
              <div className="mt-8 w-full max-w-lg mx-auto bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-4 text-left">
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Kayıtlı İşletmeniz
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {business.name}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">
                    {userProfile?.email || business.ownerEmail || ''}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    Süresi Doldu
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Scenario 2: Standard public view or active trial user */
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold mb-4">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>7 Gün Boyunca Kredi Kartsız Ücretsiz Deneyin</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Paketler & Lisanslama
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Oto servisiniz için telefon trafiğini sıfırlayan, müşteri güvenini katlayan ve işlerinizi kolaylaştıran şeffaf çözüm.
            </p>
          </div>
        )}

        {/* Pro Package Features Card */}
        <div className="mt-8 w-full max-w-xl bg-white border border-emerald-200/80 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Yıllık / Aylık Servis Lisansı
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Durumu Ne? PRO
              </h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white shadow-xs">
              TAM ERİŞİM
            </span>
          </div>

          {/* Features Checklist */}
          <div className="py-6 space-y-3.5">
            <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
              <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-semibold text-slate-900">Sınırsız Araç ve Servis Kaydı:</span> İşletmenize gelen tüm araçları arşivleme sınırı olmaksızın kaydedin.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
              <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-semibold text-slate-900">WhatsApp Tek Tıkla Canlı Takip:</span> Müşterilerinize şifresiz, anında açılan canlı takip linki iletin.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
              <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <QrCode className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-semibold text-slate-900">Yazdırılabilir QR Kod Kartları:</span> Araç kabul fişlerine QR kod basarak müşterilerinizin kolayca okutmasını sağlayın.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
              <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Car className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-semibold text-slate-900">6 Aşamalı Şeffaf Durum Çizelgesi:</span> Arıza tespiti, parça bekleme ve onarım aşamalarını tek dokunuşla güncelleyin.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
              <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Headphones className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-semibold text-slate-900">Öncelikli WhatsApp Destek:</span> Lisans süreniz boyunca doğrudan teknik yardım ve danışmanlık alın.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2.5">
            {isUserExpired ? (
              <a
                href={upgradeWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-packages-whatsapp-upgrade"
                className="w-full py-3.5 px-6 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2.5 text-center group"
              >
                <MessageCircle className="w-5 h-5 fill-white/20 group-hover:scale-110 transition-transform" />
                <span>Pro Paket İçin WhatsApp'tan İletişime Geç</span>
              </a>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Link
                  to="/hosgeldiniz"
                  id="btn-packages-start-trial"
                  className="py-3 px-4 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>7 Gün Ücretsiz Başla</span>
                </Link>
                <a
                  href={generalWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="btn-packages-whatsapp-info"
                  className="py-3 px-4 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp ile Bilgi Al</span>
                </a>
              </div>
            )}
            <p className="text-center text-[11px] text-slate-400 mt-2">
              WhatsApp destek numaramız: <span className="font-bold text-slate-700">{SUPPORT_PHONE_DISPLAY}</span>
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
            className="font-bold text-emerald-700 hover:underline inline-flex items-center gap-1 ml-1"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{SUPPORT_PHONE_DISPLAY}</span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400">
        <div className="flex items-center justify-center gap-1.5 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>© 2026 Durumu Ne? Tüm hakları saklıdır.</span>
        </div>
      </footer>
    </div>
  );
};
