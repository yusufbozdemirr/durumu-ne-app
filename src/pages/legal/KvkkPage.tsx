import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../../components/common/BrandLogo';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const KvkkPage: React.FC = () => {
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
              Aydınlatma Metni
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              6698 Sayılı KVKK Kapsamında Aydınlatma Metni
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Son Güncelleme: Mart 2026
            </p>
          </div>

          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
            <p>
              İşbu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, veri sorumlusu sıfatıyla hareket eden <strong>[İşletme bilgileri daha sonra eklenecek]</strong> (“Durumu Ne?”) tarafından, durumune.com platformu ve Durumu Ne? servis takip yazılımı kullanıcılarının kişisel verilerinin işlenmesine ilişkin usul ve esasları açıklamaktadır.
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-2">
              1. İşlenen Kişisel Veriler
            </h2>
            <p>
              Durumu Ne? hizmetlerinin yürütülmesi kapsamında aşağıdaki kişisel veriler işlenebilmektedir:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Kimlik Bilgileri:</strong> İsim, soyisim, işletme yetkilisi adı ve müşteri ad-soyad bilgisi.</li>
              <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası.</li>
              <li><strong>Araç Bilgileri:</strong> Plaka, marka, model, üretim yılı, servis arıza ve onarım durum notları.</li>
              <li><strong>İşlem Güvenliği Verileri:</strong> Giriş IP adresi, oturum zaman damgası, erişim log kayıtları.</li>
            </ul>

            <h2 className="text-base font-bold text-slate-900 pt-2">
              2. Kişisel Verilerin İşlenme Amaçları
            </h2>
            <p>
              Kişisel verileriniz aşağıdaki amaçlarla sınırlı ve ölçülü olarak işlenmektedir:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Oto servis ve tamir atölyesi süreçlerinin dijital ortamda yönetilmesi,</li>
              <li>Müşterilere özel oluşturulan güvenli bağlantı üzerinden araç canlı durumunun şeffaf biçimde paylaşılması,</li>
              <li>WhatsApp üzerinden servis durum bilgilendirme mesajlarının iletilmesi,</li>
              <li>Kullanıcı hesaplarının güvenliğinin sağlanması ve yasal yükümlülüklerin yerine getirilmesi.</li>
            </ul>

            <h2 className="text-base font-bold text-slate-900 pt-2">
              3. Kişisel Verilerin Aktarımı
            </h2>
            <p>
              Toplanan kişisel veriler, üçüncü taraflara ticari veya pazarlama amacıyla satılmaz ya da devredilmez. Yalnızca bulut altyapısı ve veri tabanı barındırma (Google Cloud / Firebase) hizmeti sağlayıcıları ile teknik zorunluluk çerçevesinde ve yetkili kamu kurum ve kuruluşlarının hukuki talepleri halinde kanunen yetkili mercilerle paylaşılabilir.
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-2">
              4. İlgili Kişinin Hakları (KVKK Madde 11)
            </h2>
            <p>
              KVKK’nın 11. maddesi uyarınca veri sahipleri; kişisel verilerinin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme, verilerin düzeltilmesini veya silinmesini isteme haklarına sahiptir.
            </p>
            <p>
              Haklarınıza ilişkin taleplerinizi <strong>[İşletme bilgileri daha sonra eklenecek]</strong> adresine yazılı olarak iletebilirsiniz.
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
