import React, { useState, useEffect } from 'react';
import { Bell, BellRing, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { notificationService } from '../../services/notificationService';

interface NotificationSubscriptionCardProps {
  publicToken: string;
  plate: string;
  onSubscribed?: () => void;
}

export const NotificationSubscriptionCard: React.FC<NotificationSubscriptionCardProps> = ({
  publicToken,
  plate,
  onSubscribed,
}) => {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const checkSupport = async () => {
      const supported = await notificationService.isPushSupported();
      if (!isMounted) return;
      setIsSupported(supported);

      const perm = notificationService.getPermission();
      setPermission(perm);

      const subscribed = notificationService.isSubscribedForVehicle(publicToken);
      setIsSubscribed(subscribed);

      // Check if user dismissed it in this session
      const dismissed = sessionStorage.getItem(`fcm_dismissed_${publicToken}`) === 'true';
      setIsDismissed(dismissed);
    };

    checkSupport();

    return () => {
      isMounted = false;
    };
  }, [publicToken]);

  const handleSubscribe = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const result = await notificationService.requestPermission(publicToken);
    setIsLoading(false);

    if (result.success) {
      setIsSubscribed(true);
      setPermission('granted');
      setSuccessMsg('Bildirimler başarıyla açıldı! (Sekmeyi kapatmadığınız sürece arka planda çalışır)');
      onSubscribed?.();
    } else {
      if (result.permissionDenied) {
        setPermission('denied');
      }
      setErrorMsg(result.error || 'Bildirim izni alınamadı.');
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem(`fcm_dismissed_${publicToken}`, 'true');
  };

  // If push is not supported, show a warning instead of silently hiding
  if (isSupported === false) {
    const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent || '');
    
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-slate-600 shadow-xs">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-bold text-slate-800">
            {isIOS ? 'iPhone Bildirim Kısıtlaması' : 'Bildirimler Desteklenmiyor'}
          </p>
          <p className="text-[11px] sm:text-xs leading-relaxed">
            {isIOS 
              ? "Apple kuralları gereği iPhone'da Chrome üzerinden bildirim alınamaz. Bildirimleri açmak için bu linki Safari'de açıp paylaş ikonundan 'Ana Ekrana Ekle' demeniz gerekir." 
              : "Tarayıcınız veya mevcut gizli sekme/gömülü pencere bildirimleri desteklemiyor. Özelliği kullanmak için uygulamayı normal bir tarayıcı sekmesinde açmayı deneyin."
            }
          </p>
        </div>
      </div>
    );
  }

  // Already subscribed: show clean subtle active badge
  if (isSubscribed) {
    return (
      <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-emerald-900 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <BellRing className="w-3.5 h-3.5 animate-bounce" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-emerald-950 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Bildirimler Aktif</span>
            </p>
            <p className="text-[11px] text-emerald-800 truncate">
              {plate} için durum değiştikçe bildirim gönderilecek.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If dismissed or permanently denied (without error message being actively shown), hide cleanly
  if (isDismissed && !errorMsg && !successMsg) {
    return null;
  }

  // If permission was previously denied, display a helpful hint if user explicitly clicks
  if (permission === 'denied' && !errorMsg) {
    return (
      <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3.5 flex items-start justify-between gap-3 text-amber-950 shadow-2xs">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <p className="font-bold text-amber-950">Bildirim İzni Kapalı</p>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Tarayıcınızda bildirimler engellendi. Bildirim almak için adres çubuğundaki kilit (ayar) simgesine dokunarak bildirimlere izin verebilirsiniz.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-amber-500 hover:text-amber-700 p-1 -mr-1 rounded-md"
          aria-label="Kapat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 border border-emerald-200/90 rounded-2xl p-4 sm:p-4.5 shadow-xs relative overflow-hidden transition-all">
      {/* Decorative accent background subtle circle */}
      <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-emerald-500/5 rounded-full pointer-events-none" />

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        title="Daha Sonra"
        aria-label="Kapat"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3.5 pr-6">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
          <Bell className="w-4 h-4 text-emerald-700" />
        </div>

        <div className="flex-1 space-y-1">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>Araç durumunuz değiştiğinde bildirim alın</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
            Usta işlem yaptıkça telefonunuza veya bilgisayarınıza anlık bildirim gelsin. Servisi aramanıza gerek kalmaz.
          </p>

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-tight">{errorMsg}</div>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11px]">{successMsg}</span>
            </div>
          )}

          {/* Action Row */}
          {!successMsg && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                id="btn-enable-web-push"
                onClick={handleSubscribe}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>İzin İsteniyor...</span>
                  </>
                ) : (
                  <>
                    <BellRing className="w-3.5 h-3.5" />
                    <span>Bildirimleri Aç</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Şimdi Değil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
