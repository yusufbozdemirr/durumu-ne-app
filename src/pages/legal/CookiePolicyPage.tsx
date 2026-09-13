import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../../components/common/BrandLogo';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const CookiePolicyPage: React.FC = () => {
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
              Çerez Bilgilendirmesi
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Çerez (Cookie) Politikası
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Son Güncelleme: Mart 2026
            </p>
          </div>

          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
            <p>
              Durumu Ne? olarak, kullanıcılarımızın gizliliğine ve şeffaflığa büyük önem vermekteyiz. Platformumuzda üçüncü taraf reklam veya hedefleme çerezleri (Google Ads, Facebook Pixel vb.) <strong>kullanılmamaktadır</strong>. Yalnızca uygulamanın temel işlevlerini yerine getirebilmesi için zorunlu olan teknik depolama mekanizmaları kullanılmaktadır.
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-2">
              1. Platformumuzda Kullanılan Teknik Depolama ve Çerezler
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-200 rounded-xl overflow-hidden text-xs">
                <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Anahtar / Çerez</th>
                    <th className="p-3">Tür</th>
                    <th className="p-3">Kullanım Amacı</th>
                    <th className="p-3">Süre</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-800">Firebase Auth Token</td>
                    <td className="p-3">Zorunlu / Teknik</td>
                    <td className="p-3">Kullanıcı oturumunun güvenli bir şekilde sürdürülmesi ve kimlik doğrulama.</td>
                    <td className="p-3">Oturum süresince</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-800">durumu_remembered_email</td>
                    <td className="p-3">İşlevsel (LocalStorage)</td>
                    <td className="p-3">Kullanıcının "Beni Hatırla" seçeneğini işaretlemesi durumunda e-posta adresini hatırlama.</td>
                    <td className="p-3">Kullanıcı silene kadar</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-800">durumu_trial_banner_dismissed</td>
                    <td className="p-3">İşlevsel (SessionStorage)</td>
                    <td className="p-3">Deneme süresi uyarı banner'ı kapatıldığında aynı oturumda tekrar gösterilmesini önleme.</td>
                    <td className="p-3">Sekme kapatılana kadar</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-800">durumu_onboarding_dismissed</td>
                    <td className="p-3">İşlevsel (LocalStorage)</td>
                    <td className="p-3">İlk kayıt karşılama kartının kapatılma tercihini kaydetme.</td>
                    <td className="p-3">Kullanıcı silene kadar</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-base font-bold text-slate-900 pt-2">
              2. Çerezlerin Yönetimi
            </h2>
            <p>
              Tarayıcınızın ayarlarından dilediğiniz zaman yerel depolama ve çerezleri temizleyebilirsiniz. Ancak oturum çerezlerinin engellenmesi durumunda platforma giriş yapılamayacaktır.
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
