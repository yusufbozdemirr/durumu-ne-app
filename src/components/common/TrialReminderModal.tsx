import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WhatsAppIcon } from './WhatsAppIcon';
import {
  Clock,
  Sparkles,
  X,
  CheckCircle2,
  Crown,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { getWhatsAppDirectUrl } from '../../utils/constants';

export const TrialReminderModal: React.FC = () => {
  const { business, planStatus, isAdmin } = useApp();
  const [isOpen, setIsOpen] = useState(true);

  // Only show if user is a regular business on active trial
  if (isAdmin || !planStatus.isTrial || planStatus.isExpired || !isOpen) {
    return null;
  }

  const trialEndDateObj = planStatus.trialEndDate
    ? new Date(planStatus.trialEndDate)
    : null;

  const formattedEndDate = trialEndDateObj
    ? trialEndDateObj.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long',
      })
    : '7 gün sonra';

  const daysRemaining = Math.max(0, planStatus.daysRemaining);

  const whatsappUpgradeUrl = getWhatsAppDirectUrl(
    `Merhaba, ${business?.name || 'servisim'} için 7 günlük deneme sürümü kullanıyorum. Bitiş tarihim: ${formattedEndDate}. Kesintisiz devam etmek için Pro pakete geçmek istiyorum.`
  );

  return (
    <div
      id="dialog-trial-reminder"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white border border-teal-500/40 rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative space-y-5 text-center">
        {/* Top-Right Close Button (X) */}
        <button
          type="button"
          id="btn-close-trial-modal"
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-500 hover:text-slate-900 bg-slate-100/60 hover:bg-slate-100 transition-colors"
          title="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-teal-500/30 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
          <Sparkles className="w-7 h-7 text-teal-600" />
        </div>

        {/* Title & Info */}
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-teal-50/80 text-teal-600 border border-teal-200 mb-2">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>7 Günlük Ücretsiz Deneme</span>
          </span>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Deneme Sürümünüz Aktif
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Tüm özelliklere (canlı müşteri takip bağlantısı, WhatsApp durum
            mesajları, sınırsız araç) tam erişiminiz devam ediyor.
          </p>
        </div>

        {/* Trial Expiry Highlight Card */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-600" />
              Bitiş Tarihi:
            </span>
            <span className="font-bold text-slate-900 font-mono">
              {formattedEndDate}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              Kalan Süre:
            </span>
            <span className="font-extrabold text-teal-600 bg-teal-50/80 px-2 py-0.5 rounded-md border border-teal-200 text-[11px]">
              {daysRemaining === 0 ? 'Son Gün' : `${daysRemaining} Gün Kaldı`}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(10, ((7 - daysRemaining) / 7) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Benefits summary */}
        <div className="grid grid-cols-2 gap-2 text-left text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Sınırsız Araç Kabulü</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>WhatsApp Canlı Takip</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <a
            href={whatsappUpgradeUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-trial-modal-upgrade-whatsapp"
            className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 active:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>Şimdi Pro'ya Geç</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </a>

          <button
            type="button"
            id="btn-trial-modal-continue"
            onClick={() => setIsOpen(false)}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 bg-slate-100/60 hover:bg-slate-100 transition-colors"
          >
            Panele Devam Et
          </button>
        </div>
      </div>
    </div>
  );
};
