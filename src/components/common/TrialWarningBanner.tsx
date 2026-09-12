import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, AlertTriangle, MessageCircle, X } from 'lucide-react';
import { getTrialWarningWhatsAppUrl } from '../../utils/constants';

export const TrialWarningBanner: React.FC = () => {
  const { business, planStatus, isAdmin } = useApp();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const dismissedSession = sessionStorage.getItem('durumu_trial_banner_dismissed');
    if (dismissedSession === 'true') {
      setIsDismissed(true);
    }
  }, []);

  if (isAdmin || isDismissed) return null;
  if (!planStatus.isTrial || planStatus.isExpired || planStatus.warningState === 'none') {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('durumu_trial_banner_dismissed', 'true');
  };

  const whatsappUrl = getTrialWarningWhatsAppUrl(business?.name, planStatus.daysRemaining);

  const getNoticeDetails = () => {
    switch (planStatus.warningState) {
      case 'urgent_hours':
        return {
          title: 'Deneme sürenizin bitmesine 1 günden az kaldı.',
          badge: 'Son Saatler',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
          containerBg: 'bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border-rose-200/80',
          iconColor: 'text-rose-600',
        };
      case 'urgent_1_day':
        return {
          title: 'Deneme sürenizin bitmesine 1 gün kaldı.',
          badge: 'Yarın Bitiyor',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          containerBg: 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/80',
          iconColor: 'text-amber-600',
        };
      case 'urgent_2_days':
      default:
        return {
          title: 'Deneme sürenizin bitmesine 2 gün kaldı.',
          badge: 'Deneme Süresi',
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
          containerBg: 'bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 border-blue-200/80',
          iconColor: 'text-blue-600',
        };
    }
  };

  const notice = getNoticeDetails();

  return (
    <div
      id="trial-warning-banner"
      className={`mb-6 p-4 sm:p-5 rounded-2xl border shadow-xs transition-all relative overflow-hidden ${notice.containerBg}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Icon & Text */}
        <div className="flex items-start gap-3.5 pr-8 sm:pr-0">
          <div className="w-10 h-10 rounded-xl bg-white/80 border border-slate-200/60 shadow-xs flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            {planStatus.warningState === 'urgent_hours' ? (
              <AlertTriangle className={`w-5 h-5 ${notice.iconColor}`} />
            ) : (
              <Clock className={`w-5 h-5 ${notice.iconColor}`} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                {notice.title}
              </h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${notice.badgeColor}`}>
                {notice.badge}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Durumu Ne? deneyiminize kesintisiz devam etmek için Pro paket hakkında bilgi alın.
            </p>
          </div>
        </div>

        {/* Right: CTA & Dismiss */}
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-trial-whatsapp-upgrade"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-all shadow-xs shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
            <span>Pro Paket Hakkında Bilgi Al</span>
          </a>

          <button
            type="button"
            onClick={handleDismiss}
            id="btn-dismiss-trial-banner"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white/60 transition-colors absolute top-3 right-3 sm:static"
            title="Bildirimi Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
