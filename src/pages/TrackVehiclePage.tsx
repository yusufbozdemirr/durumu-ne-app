import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BrandLogo } from '../components/common/BrandLogo';
import { PlateDisplay } from '../components/common/PlateDisplay';
import { StatusTimeline } from '../components/common/StatusTimeline';
import { NotificationSubscriptionCard } from '../components/common/NotificationSubscriptionCard';
import { publicTrackingService } from '../services/publicTrackingService';
import { notificationService } from '../services/notificationService';
import { getStatusConfig, formatTimeAgo } from '../utils/statusConstants';
import { PublicVehicle } from '../types';
import {
  Clock,
  Calendar,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  BellRing,
  X,
} from 'lucide-react';

export const TrackVehiclePage: React.FC = () => {
  const { publicToken, token } = useParams<{ publicToken?: string; token?: string }>();
  const activeToken = publicToken || token;

  const [vehicle, setVehicle] = useState<PublicVehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [foregroundToast, setForegroundToast] = useState<{ title: string; body: string } | null>(null);

  // Keep track of previous status to detect changes for notifications
  const previousStatusRef = React.useRef<string | null>(null);

  useEffect(() => {
    if (!activeToken) {
      setError('Geçersiz takip bağlantısı.');
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const unsubscribe = publicTrackingService.subscribeToPublicVehicle(
      activeToken,
      (data) => {
        if (data) {
          setVehicle(data);
          setError(null);

          // Check for status change and trigger local notification if subscribed
          const newStatus = data.currentStatus;
          const oldStatus = previousStatusRef.current;
          
          if (oldStatus !== null && oldStatus !== newStatus) {
            if (notificationService.isSubscribedForVehicle(activeToken)) {
              const statusCfg = getStatusConfig(newStatus);
              const title = 'Durumu Ne?';
              let body = '';
              if (newStatus === 'ready') {
                body = `${data.plate} plakalı aracınız hazır. Teslim alabilirsiniz.`;
              } else {
                body = `${data.plate} plakalı aracınızın durumu '${statusCfg.label}' olarak güncellendi.`;
              }
              
              // Trigger native browser notification
              notificationService.sendLocalNotification(title, body);
              
              // Show in-app toast as well
              setForegroundToast({ title, body });
            }
          }
          
          previousStatusRef.current = newStatus;
        } else {
          setError('Araç takip kaydı bulunamadı.');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Subscription error:', err);
        setError('Araç bilgileri alınırken bir bağlantı sorunu oluştu.');
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [activeToken]);

  const handleRefresh = () => {
    // With real-time updates, manual refresh is mostly aesthetic,
    // but we can force a re-fetch of the public vehicle if we really wanted to.
    // Given we are onSnapshot, we can just let it be.
  };

  const statusCfg = vehicle ? getStatusConfig(vehicle.currentStatus) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium mt-3">Durum bilgisi yükleniyor...</p>
      </div>
    );
  }

  if (error || !vehicle || !statusCfg) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Araç Takip Kaydı Bulunamadı</h2>
        <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
          Girdiğiniz bağlantı veya QR kod geçersiz olabilir ya da servis kaydı sonlandırılmış olabilir.
        </p>
        <Link
          to="/login"
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          İşletme / Servis Girişi
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col justify-between selection:bg-emerald-100">
      {/* Top Header - Simple & Clean */}
      <header className="bg-white border-b border-slate-200/80 px-4 py-3 sticky top-0 z-30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <BrandLogo size="sm" />
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            title="Durum Canlı Takip Ediliyor"
          >
            <RefreshCw className="w-4 h-4 text-emerald-600 animate-pulse" />
          </button>
        </div>
      </header>

      {/* Foreground Real-time Push Alert Toast */}
      {foregroundToast && (
        <div className="max-w-md mx-auto px-4 pt-3 w-full">
          <div className="bg-emerald-600 text-white p-3.5 rounded-2xl shadow-lg flex items-start justify-between gap-3 animate-slide-in">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                <BellRing className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold">{foregroundToast.title}</p>
                <p className="text-[11px] text-emerald-100 mt-0.5">{foregroundToast.body}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setForegroundToast(null)}
              className="text-white/80 hover:text-white p-1 rounded-md"
              aria-label="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Card Container */}
      <main className="flex-1 w-full max-w-md mx-auto p-4 sm:p-5 space-y-4">
        {/* Service Title */}
        <div className="text-center py-1">
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 uppercase tracking-wider">
            Canlı Araç Durumu
          </span>
          <p className="text-xs text-slate-500 mt-1">Servisteki aracınızın anlık aşamaları</p>
        </div>

        {/* Vehicle Identity Box */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs text-center space-y-3">
          <div className="flex justify-center">
            <PlateDisplay plate={vehicle.plate} size="lg" />
          </div>

          <div>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
              {vehicle.brand} {vehicle.model}
            </h1>
            {vehicle.year && (
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Model Yılı: {vehicle.year}
              </p>
            )}
          </div>

          {/* Current Status Banner - Large but tasteful */}
          <div
            className={`p-4 rounded-xl border ${statusCfg.badgeBg} ${statusCfg.badgeBorder} flex flex-col items-center justify-center gap-1.5`}
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              Mevcut Aşama
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${statusCfg.dotColor} ${
                  vehicle.currentStatus === 'repair' ? 'animate-ping' : ''
                }`}
              />
              <span className={`text-base sm:text-lg font-black ${statusCfg.badgeText}`}>
                {statusCfg.label}
              </span>
            </div>
            <p className="text-xs text-slate-600 text-center mt-1 leading-normal max-w-xs">
              {statusCfg.description}
            </p>
          </div>

          {/* Estimated Delivery & Last Update Row */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-left border-t border-slate-100">
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                <Clock className="w-3 h-3 text-emerald-600" />
                Tahmini Teslim
              </div>
              <div className="mt-1 text-xs font-bold text-slate-800">
                {vehicle.estimatedDelivery || 'Belirtilmedi'}
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                <Calendar className="w-3 h-3 text-slate-500" />
                Son Güncelleme
              </div>
              <div className="mt-1 text-xs font-bold text-slate-800 truncate">
                {formatTimeAgo(vehicle.updatedAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Web Push Notification Subscription Card */}
        {activeToken && (
          <NotificationSubscriptionCard
            publicToken={activeToken}
            plate={vehicle.plate}
          />
        )}

        {/* Process Timeline Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="pb-3 border-b border-slate-100 mb-4 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Aşama İlerlemesi
            </h2>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
              Canlı Takip
            </span>
          </div>

          <StatusTimeline
            currentStatus={vehicle.currentStatus}
            history={vehicle.statusHistory}
            isCustomerView={true}
          />
        </div>

        {/* Trust badge */}
        <div className="text-center py-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Giriş yapmanız gerekmez • Güvenli Araç Takip Sayfası</span>
          </div>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="py-4 text-center text-[11px] text-slate-400 border-t border-slate-200/60 bg-white">
        <div className="max-w-md mx-auto px-4 flex items-center justify-between">
          <span>DURUMU NE? © {new Date().getFullYear()}</span>
          <Link to="/login" className="hover:text-slate-600 hover:underline">
            İşletme Girişi
          </Link>
        </div>
      </footer>
    </div>
  );
};
