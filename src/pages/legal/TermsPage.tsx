import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../../components/common/BrandLogo';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <BrandLogo size="md" />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ana Sayfaya Dön</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Kullanıcı Sözleşmesi
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Kullanım Koşulları
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Son Güncelleme: Mart 2026
            </p>
          </div>

          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
            <p>
              İşbu Kullanım Koşulları, durumune.com web sitesi ve Durumu Ne? bulut tabanlı servis takip yazılımına erişim ve kullanım koşullarını belirler. Platforma kayıt olan veya platformu kullanan tüm kullanıcılar bu koşulları peşinen kabul etmiş sayılır.
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-2">
              1. 7 Günlük Ücretsiz Deneme Esasları
            </h2>
            <p>
              Yeni kayıt olan işletmeler 7 gün boyunca sistemin tüm temel özelliklerinden ücretsiz ve taahhütsüz faydalanır. Deneme süresi sona erdiğinde hizmet kesintiye uğramaz; kullanıcı paneline erişim kısıtlanır ve Pro pakete geçiş seçeneği sunulur. Kullanıcı istemezse herhangi bir otomatik ücret tahsilatı yapılmaz.
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-2">
              2. Pro Lisans ve Aktivasyon
            </h2>
            <p>
              Pro paket lisansı manuel fatura / anlaşma esasına dayanır ve WhatsApp destek hattımız üzerinden doğrudan etkinleştirilir. Lisansı onaylanan işletmeler sınırsız araç kaydı ve canlı durum bildirim özelliklerini belirlenen süre boyunca kullanmaya devam eder.
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-2">
              3. Kullanıcı Yükümlülükleri
            </h2>
            <p>
              İşletmeler, sisteme girdikleri müşteri adı, telefon numarası ve araç bilgilerinin doğruluğundan ve müşterilerinden bu bilgilerin sisteme girilmesine dair gerekli rızaları almış olmaktan bizzat sorumludur.
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-2">
              4. İletişim Bilgileri
            </h2>
            <p>
              Hizmet sağlayıcı: <strong>[İşletme bilgileri daha sonra eklenecek]</strong>
              <br />
              Destek ve İletişim: durumune.com iletişim kanalları
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-1.5 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>© 2026 Durumu Ne? Tüm hakları saklıdır.</span>
        </div>
      </footer>
    </div>
  );
};
