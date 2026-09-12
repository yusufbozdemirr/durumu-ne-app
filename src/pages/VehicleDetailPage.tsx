import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PlateDisplay } from '../components/common/PlateDisplay';
import { StatusBadge } from '../components/common/StatusBadge';
import { StatusTimeline } from '../components/common/StatusTimeline';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { VehicleDetailSkeleton } from '../components/common/LoadingSkeleton';
import {
  STATUS_LIST,
  getStatusConfig,
  formatTimeAgo,
} from '../utils/statusConstants';
import { VehicleStatus, StatusHistoryEntry } from '../types';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import {
  ArrowLeft,
  QrCode,
  Clock,
  Car,
  User,
  Wrench,
  Edit2,
  Trash2,
  ExternalLink,
  Phone,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getVehicleById,
    getVehicleStatusHistory,
    updateVehicleStatus,
    deleteVehicle,
    openQRModal,
    isLoading: appLoading,
  } = useApp();

  const vehicle = id ? getVehicleById(id) : undefined;

  const [selectedStatus, setSelectedStatus] = useState<VehicleStatus>(
    vehicle?.currentStatus || 'received'
  );
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [historyList, setHistoryList] = useState<StatusHistoryEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Sync selected status if vehicle changes
  useEffect(() => {
    if (vehicle) {
      setSelectedStatus(vehicle.currentStatus);
    }
  }, [vehicle?.currentStatus]);

  // Load status history subcollection
  useEffect(() => {
    let isMounted = true;
    if (vehicle?.id) {
      setLoadingHistory(true);
      getVehicleStatusHistory(vehicle.id)
        .then((entries) => {
          if (isMounted) {
            setHistoryList(entries);
          }
        })
        .catch((err) => console.error('Failed to load status history:', err))
        .finally(() => {
          if (isMounted) setLoadingHistory(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [vehicle?.id, getVehicleStatusHistory]);

  if (appLoading) {
    return <VehicleDetailSkeleton />;
  }

  if (!vehicle) {
    return (
      <div className="bg-[#0c152a] rounded-2xl border border-slate-800 p-8 text-center max-w-md mx-auto my-12 shadow-xl">
        <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white">Araç Bulunamadı</h3>
        <p className="text-xs text-slate-400 mt-1 mb-5">
          Aradığınız araç kaydı silinmiş veya mevcut değil.
        </p>
        <button
          onClick={() => navigate('/vehicles')}
          className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors cursor-pointer"
        >
          Araç Listesine Dön
        </button>
      </div>
    );
  }

  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      const newEntry = await updateVehicleStatus(
        vehicle.id,
        selectedStatus,
        statusNote
      );
      if (newEntry) {
        setHistoryList((prev) => [newEntry, ...prev]);
      }
      setStatusNote('');
    } finally {
      setIsUpdating(false);
    }
  };

  const trackingToken = vehicle.publicToken || (vehicle as any).token;
  const origin = window.location.origin;
  const trackingUrl = `${origin}/takip/${trackingToken}`;

  const handleWhatsAppShare = () => {
    const cleanPhone = vehicle.customerPhone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('90')
      ? cleanPhone
      : cleanPhone.startsWith('0')
      ? `90${cleanPhone.substring(1)}`
      : `90${cleanPhone}`;

    const text = `Merhaba, aracınızın servis durumunu buradan anlık takip edebilirsiniz:\n${trackingUrl}`;
    window.open(
      `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  const handleDeleteConfirm = async () => {
    await deleteVehicle(vehicle.id, vehicle.publicToken);
    navigate('/vehicles');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#0c152a] rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/vehicles')}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Araçlar Listesine Dön"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <PlateDisplay plate={vehicle.plate} size="md" />
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {vehicle.brand} {vehicle.model}
                </h2>
                <StatusBadge status={vehicle.currentStatus} size="md" />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Kayıt Tarihi:{' '}
                {new Date(vehicle.createdAt).toLocaleDateString('tr-TR')} •{' '}
                {vehicle.customerName || 'Müşteri belirtilmedi'}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:justify-end">
            <button
              type="button"
              id="btn-show-qr"
              onClick={() => openQRModal(vehicle)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              QR Kod Oluştur
            </button>

            <button
              type="button"
              id="btn-whatsapp-notify"
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl transition-colors shadow-md shadow-emerald-600/30 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp Paylaş</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Düzenle"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
              title="Araç Kaydını Sil"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT / MAIN AREA */}
        <div className="lg:col-span-2 space-y-6">
          {/* AŞAMA DURUMUNU GÜNCELLE */}
          <div className="bg-[#0c152a] rounded-2xl border border-emerald-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="pb-4 border-b border-slate-800 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Aşama Durumunu Güncelle
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Yeni bir aşamaya geçin ve müşteriye anlık gösterilecek notu ekleyin.
                </p>
              </div>
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <span className="text-[11px] text-slate-400 font-medium">
                  Mevcut Durum:
                </span>
                <StatusBadge status={vehicle.currentStatus} size="sm" />
              </div>
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Dropdown with standardized statuses */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Yeni Aşama Seçin
                  </label>
                  <select
                    id="select-update-status"
                    value={selectedStatus}
                    onChange={(e) =>
                      setSelectedStatus(e.target.value as VehicleStatus)
                    }
                    className="w-full px-3.5 py-2.5 bg-[#070d19] border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                  >
                    {STATUS_LIST.map((s) => (
                      <option key={s.key} value={s.key} className="bg-[#070d19] text-white">
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Note input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Aşama Notu{' '}
                    <span className="text-slate-500 font-normal">
                      (Müşteri ekranında görünür)
                    </span>
                  </label>
                  <input
                    type="text"
                    id="input-status-note"
                    placeholder={`Örn: ${getStatusConfig(selectedStatus).description}`}
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070d19] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end pt-1">
                <button
                  type="submit"
                  id="btn-submit-status-update"
                  disabled={isUpdating}
                  className="w-full sm:w-auto py-2.5 px-6 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 rounded-xl transition-colors shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Aşamayı Kaydet ve Bildir</span>
                </button>
              </div>
            </form>
          </div>

          {/* ARAÇ VE MÜŞTERİ BİLGİLERİ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Vehicle Details Card */}
            <div className="bg-[#0c152a] rounded-2xl border border-slate-800 p-5 shadow-xl">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-bold text-white uppercase tracking-wider">
                <Car className="w-4 h-4 text-emerald-400" />
                Araç Bilgileri
              </div>
              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <dt className="text-slate-400">Plaka:</dt>
                  <dd className="font-mono font-bold text-white">{vehicle.plate}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <dt className="text-slate-400">Marka & Model:</dt>
                  <dd className="font-semibold text-slate-200">
                    {vehicle.brand} {vehicle.model}
                  </dd>
                </div>
                {vehicle.year && (
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <dt className="text-slate-400">Model Yılı:</dt>
                    <dd className="font-semibold text-slate-200">{vehicle.year}</dd>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <dt className="text-slate-400">Kayıt Tarihi:</dt>
                  <dd className="font-semibold text-slate-200">
                    {new Date(vehicle.createdAt).toLocaleDateString('tr-TR')}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Customer & Delivery Card */}
            <div className="bg-[#0c152a] rounded-2xl border border-slate-800 p-5 shadow-xl">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-bold text-white uppercase tracking-wider">
                <User className="w-4 h-4 text-emerald-400" />
                Müşteri & Teslimat
              </div>
              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <dt className="text-slate-400">Müşteri Adı:</dt>
                  <dd className="font-semibold text-slate-200">
                    {vehicle.customerName || 'Belirtilmedi'}
                  </dd>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <dt className="text-slate-400">Telefon:</dt>
                  <dd className="font-mono font-semibold text-slate-200 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {vehicle.customerPhone}
                  </dd>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <dt className="text-slate-400">Tahmini Teslim:</dt>
                  <dd className="font-semibold text-emerald-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    {vehicle.estimatedDelivery || 'Belirtilmedi'}
                  </dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-slate-400">Son Güncelleme:</dt>
                  <dd className="font-semibold text-slate-200">
                    {formatTimeAgo(vehicle.updatedAt)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Service Description Box */}
          {vehicle.serviceDescription && (
            <div className="bg-[#0c152a] rounded-2xl border border-slate-800 p-5 shadow-xl">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-bold text-white uppercase tracking-wider">
                <Wrench className="w-4 h-4 text-emerald-400" />
                Servis İşlem Açıklaması
              </div>
              <p className="mt-3 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {vehicle.serviceDescription}
              </p>
            </div>
          )}

          {/* Status Timeline Card */}
          <div className="bg-[#0c152a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Durum Zaman Çizelgesi
                </h3>
                <p className="text-xs text-slate-400">
                  Aracın başlangıç kabulünden teslime kadar olan süreç kaydı.
                </p>
              </div>
              {loadingHistory && (
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Yükleniyor...</span>
                </div>
              )}
            </div>

            <StatusTimeline
              currentStatus={vehicle.currentStatus}
              history={historyList}
            />
          </div>
        </div>

        {/* RIGHT / SECONDARY AREA */}
        <div className="space-y-6">
          {/* Customer Public Link Card */}
          <div className="bg-[#0c152a] rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Müşteri Takip Ekranı
              </h4>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
                Girişsiz Erişim
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Müşteriniz aşağıdaki bağlantı üzerinden şifresiz olarak aracın durumunu canlı izleyebilir.
            </p>

            <div className="p-2.5 bg-[#070d19] rounded-xl border border-slate-700 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-300 truncate mr-2">
                /takip/{trackingToken}
              </span>
              <a
                href={trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 p-1 font-semibold flex items-center gap-1 shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Aç
              </a>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => openQRModal(vehicle)}
                className="w-full py-2.5 px-3 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                QR Kod
              </button>

              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full py-2.5 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-600/30 cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Araç Kaydını Sil"
        message={`${vehicle.plate} plakalı aracı ve tüm durum geçmişini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};
