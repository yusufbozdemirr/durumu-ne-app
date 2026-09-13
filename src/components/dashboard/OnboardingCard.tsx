import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Sparkles, PlusCircle, X, CheckCircle2 } from 'lucide-react';

export const OnboardingCard: React.FC = () => {
  const navigate = useNavigate();
  const { vehicles, userProfile, planStatus, isAdmin } = useApp();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('durumu_onboarding_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  // Only show if user has 0 vehicles, is not admin, trial is active, and not dismissed
  if (isAdmin || isDismissed || vehicles.length > 0 || !planStatus.canAccessDashboard) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('durumu_onboarding_dismissed', 'true');
  };

  const displayName =
    userProfile?.firstName ||
    userProfile?.name?.split(' ')[0] ||
    'Değerli İşletmecimiz';

  return (
    <div
      id="onboarding-welcome-card"
      className="mb-6 p-5 sm:p-6 bg-gradient-to-r from-[#0c152a] via-[#0e1b36] to-[#0c152a] border border-teal-500/40 rounded-2xl shadow-xl relative overflow-hidden text-slate-900"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Hoş geldiniz {displayName} 👋
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 border border-teal-200">
                7 Gün Ücretsiz Deneme
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
              7 günlük ücretsiz denemeniz başladı! Servisteki ilk aracınızı ve
              müşterinizi sisteme ekleyerek canlı durum takip bağlantısını
              WhatsApp üzerinden hemen paylaşabilirsiniz.
            </p>
            <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-500 font-medium">
              <span className="inline-flex items-center gap-1.5 text-teal-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Kolay araç kaydı
              </span>
              <span className="inline-flex items-center gap-1.5 text-teal-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                WhatsApp tek tıkla paylaşım
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
          <button
            type="button"
            id="btn-onboarding-add-first-vehicle"
            onClick={() => navigate('/vehicles/new')}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 active:bg-emerald-700 rounded-xl transition-colors shadow-md shadow-emerald-600/30 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>İlk Aracımı Ekle</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            id="btn-dismiss-onboarding"
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors absolute top-3 right-4 sm:static"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
