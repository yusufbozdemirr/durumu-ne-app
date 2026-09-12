import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../../components/common/BrandLogo';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
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
              Gizlilik ve Güvenlik
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Gizlilik Politikası
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Son Güncelleme: Mart 2026
            </p>
          </div>

          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
            <p>
              Durumu Ne? (“Platform”), kullanıcılarının ve platform üzerinden araç durumu takip eden müşterilerin gizliliğini en yüksek standartlarda korumayı taahhüt eder. İşbu Gizlilik Politikası, durumune.com web sitesini ve Durumu Ne? yazılımını kullandığınızda toplanan bilgilerin nasıl kullanıldığını ve korunduğunu açıklar.
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-2">
              1. Bilgi Toplama ve Kullanım
            </h2>
            <p>
              İşletme hesabı oluştururken ad, soyad, e-posta, telefon ve işletme adı gibi temel bilgiler talep edilir. Servise kabul edilen araçlar için plaka, model ve onarım notları gibi operasyonel kayıtlar işletme tarafından sisteme işlenir.
            </p>
            <p>
              Müşterilere sunulan canlı araç durumu bağlantısı, benzersiz ve tahmin edilemez rastgele bir güvenlik anahtarı (kriptografik token) ile korunur. Bu sayede yalnızca bağlantıya sahip araç sahibi durum bilgisini görüntüleyebilir.
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-2">
              2. Çoklu Kiracılık (Multi-Tenant) ve Veri İzolasyonu
            </h2>
            <p>
              Durumu Ne? altyapısında katı veri izolasyonu kuralları uygulanır. Hiçbir işletme veya yetkili, başka bir işletmenin müşteri kayıtlarına, araçlarına, fatura/fiyat bilgilerine veya servis detaylarına kesinlikle erişemez.
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-2">
              3. Veri Güvenliği
            </h2>
            <p>
              Verileriniz güvenli SSL/TLS şifreli bağlantılar üzerinden aktarılır ve kurumsal standartlara sahip Firebase / Google Cloud güvenli sunucularında saklanır. Şifreler tek yönlü kriptografik algoritmalarla korunur ve sistem personeli dahil kimse tarafından açık metin olarak okunamaz.
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-2">
              4. İletişim
            </h2>
            <p>
              Gizlilik Politikamıza dair sorularınız için <strong>[İşletme bilgileri daha sonra eklenecek]</strong> üzerinden bizimle iletişime geçebilirsiniz.
            </p>
          </div>
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
