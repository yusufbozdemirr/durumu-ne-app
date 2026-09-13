import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BrandLogo } from '../components/common/BrandLogo';
import { PlateDisplay } from '../components/common/PlateDisplay';
import { StatusTimeline } from '../components/common/StatusTimeline';
import { publicTrackingService } from '../services/publicTrackingService';
import { getStatusConfig, formatTimeAgo } from '../utils/statusConstants';
import { PublicVehicle } from '../types';
import {
  Clock,
  Calendar,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const TrackVehiclePage: React.FC = () => {
  const { publicToken, token } = useParams<{ publicToken?: string; token?: string }>();
  const activeToken = publicToken || token;

  const [vehicle, setVehicle] = useState<PublicVehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicle = async () => {
    if (!activeToken) {
      setError('Geçersiz takip bağlantısı.');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await publicTrackingService.getPublicVehicle(activeToken);
      if (data) {
        setVehicle(data);
      } else {
        setError('Araç takip kaydı bulunamadı.');
      }
    } catch (err) {
      console.error('Error fetching public vehicle:', err);
      setError('Araç bilgileri alınırken bir bağlantı sorunu oluştu.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, [activeToken]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchVehicle();
  };

  const statusCfg = vehicle ? getStatusConfig(vehicle.currentStatus) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium mt-3">Durum bilgisi yükleniyor...</p>
      </div>
    );
  }

  if (error || !vehicle || !statusCfg) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-950/70 border border-amber-800/80 text-amber-400 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Araç Takip Kaydı Bulunamadı</h2>
        <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
          Girdiğiniz bağlantı veya QR kod geçersiz olabilir ya da servis kaydı sonlandırılmış olabilir.
        </p>
        <Link
          to="/login"
          className="text-xs font-semibold text-teal-600 hover:text-teal-600 hover:underline"
        >
          İşletme / Servis Girişi
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-teal-500/30 selection:text-white">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3.5 sticky top-0 z-30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <BrandLogo size="sm" />
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            title="Durumu Yenile"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Card Container */}
      <main className="flex-1 w-full max-w-md mx-auto p-4 sm:p-5 space-y-4">
        {/* Service Title */}
        <div className="text-center py-1">
          <span className="text-[11px] font-bold text-teal-600 bg-teal-50/80 px-3 py-1 rounded-full border border-teal-200 uppercase tracking-wider shadow-sm">
            Canlı Araç Durumu
          </span>
          <p className="text-xs text-slate-500 mt-1.5">Servisteki aracınızın anlık aşamaları</p>
        </div>

        {/* Vehicle Identity Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-lg text-center space-y-3">
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

          {/* Current Status Banner */}
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
          <div className="grid grid-cols-2 gap-2 pt-2 text-left border-t border-slate-200">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
                <Clock className="w-3 h-3 text-teal-600" />
                Tahmini Teslim
              </div>
              <div className="mt-1 text-xs font-bold text-slate-900">
                {vehicle.estimatedDelivery || 'Belirtilmedi'}
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
                <Calendar className="w-3 h-3 text-slate-500" />
                Son Güncelleme
              </div>
              <div className="mt-1 text-xs font-bold text-slate-900 truncate">
                {formatTimeAgo(vehicle.updatedAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Process Timeline Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-lg">
          <div className="pb-3 border-b border-slate-200 mb-4 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Aşama İlerlemesi
            </h2>
            <span className="text-[10px] text-teal-600 bg-teal-50/80 px-2 py-0.5 rounded-full font-semibold border border-teal-200">
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
          <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Giriş yapmanız gerekmez • Güvenli Araç Takip Sayfası</span>
          </div>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="py-4 text-center text-[11px] text-slate-500 border-t border-slate-200 bg-white">
        <div className="max-w-md mx-auto px-4 flex items-center justify-between">
          <span>DURUMU NE? © {new Date().getFullYear()}</span>
          <Link to="/login" className="hover:text-teal-600 hover:underline">
            Bayi Girişi
          </Link>
        </div>
      </footer>
    </div>
  );
};
