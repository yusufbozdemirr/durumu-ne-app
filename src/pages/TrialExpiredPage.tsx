import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandLogo } from '../components/common/BrandLogo';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import {
  Clock,
  ShieldAlert,
  ArrowRight,
  LogOut,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { getWhatsAppDirectUrl } from '../utils/constants';

export const TrialExpiredPage: React.FC = () => {
  const navigate = useNavigate();
  const { business, userProfile, logout } = useApp();

  const businessName = business?.name || 'İşletmeniz';
  const whatsappUrl = getWhatsAppDirectUrl(
    `Merhaba, ${businessName} adına 7 günlük deneme süremiz sona erdi. Pro pakete geçiş yapmak ve araç takibine kesintisiz devam etmek istiyoruz.`
  );

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#070d19] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-4 border-b border-slate-800">
        <BrandLogo size="md" />
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Çıkış Yap</span>
        </button>
      </header>

      {/* Main Content Box */}
      <main className="max-w-lg w-full mx-auto my-8 sm:my-12">
        <div className="bg-[#0c152a] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
          {/* Warning Icon */}
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Clock className="w-8 h-8" />
          </div>

          {/* Heading */}
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-amber-950/80 text-amber-400 border border-amber-800 mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              Süre Doldu
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Deneme Süreniz Doldu
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              <strong className="text-slate-200">{businessName}</strong> için
              tanımlanan 7 günlük ücretsiz deneme süresi sona ermiştir.
            </p>
          </div>

          {/* Safe Data Guarantee Box */}
          <div className="bg-[#070d19] border border-slate-800 rounded-xl p-4 text-left space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Verileriniz Güvende!
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kayıtlı tüm araçlarınız, servis notlarınız ve müşteri geçmişiniz
              silinmemiştir. Pro pakete geçiş yaptığınız anda sisteminiz kaldığı
              yerden anında aktif olacaktır.
            </p>
            <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Canlı WhatsApp Takip Bağlantıları</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sınırsız Araç ve Servis Kaydı</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>7/24 Teknik Destek & İşletme Kurulumu</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="btn-expired-whatsapp-upgrade"
              className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp ile Şimdi Pro'ya Geç</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>

            <button
              type="button"
              onClick={() => navigate('/paketler')}
              id="btn-expired-view-packages"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
            >
              Paket Detaylarını İncele
            </button>
          </div>

          <div className="pt-2 text-[11px] text-slate-500">
            Sorularınız için WhatsApp destek hattımız:{' '}
            <a
              href="https://wa.me/905415266022"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline font-mono"
            >
              0541 526 60 22
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-slate-500 border-t border-slate-800">
        © {new Date().getFullYear()} DURUMU NE? - Tüm hakları saklıdır.
      </footer>
    </div>
  );
};
