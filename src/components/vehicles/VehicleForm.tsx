import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vehicle, VehicleStatus } from '../../types';
import { STATUS_LIST } from '../../utils/statusConstants';
import { Car, User, Wrench, ArrowLeft, Loader2 } from 'lucide-react';

interface VehicleFormData {
  plate: string;
  brand: string;
  model: string;
  year?: number | string;
  customerName?: string;
  customerPhone: string;
  estimatedDelivery?: string;
  serviceDescription?: string;
  initialNote?: string;
  currentStatus?: VehicleStatus;
}

interface VehicleFormProps {
  initialData?: Vehicle;
  onSubmit: (data: VehicleFormData) => Promise<void> | void;
  isEditing?: boolean;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false,
}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [plate, setPlate] = useState(initialData?.plate || '');
  const [brand, setBrand] = useState(initialData?.brand || '');
  const [model, setModel] = useState(initialData?.model || '');
  const [year, setYear] = useState<number | string>(
    initialData?.year || (initialData as any)?.modelYear || new Date().getFullYear()
  );

  const [customerName, setCustomerName] = useState(initialData?.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(initialData?.customerPhone || '');

  const [serviceDescription, setServiceDescription] = useState(
    initialData?.serviceDescription || ''
  );
  const [estimatedDelivery, setEstimatedDelivery] = useState(
    initialData?.estimatedDelivery ||
      ((initialData as any)?.estimatedDeliveryDate
        ? `${(initialData as any).estimatedDeliveryDate} ${(initialData as any).estimatedDeliveryTime || ''}`
        : 'Bugün 18:00')
  );
  const [currentStatus, setCurrentStatus] = useState<VehicleStatus>(
    initialData?.currentStatus || 'received'
  );
  const [initialNote, setInitialNote] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!plate.trim()) errs.plate = 'Plaka alanı zorunludur.';
    if (!brand.trim()) errs.brand = 'Marka alanı zorunludur.';
    if (!model.trim()) errs.model = 'Model alanı zorunludur.';
    if (!customerPhone.trim()) errs.customerPhone = 'Müşteri telefon numarası zorunludur.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        plate: plate.trim().toUpperCase(),
        brand: brand.trim(),
        model: model.trim(),
        year: year ? String(year).trim() : undefined,
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim(),
        estimatedDelivery: estimatedDelivery.trim() || undefined,
        serviceDescription: serviceDescription.trim() || undefined,
        initialNote: initialNote.trim() || undefined,
        currentStatus,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common car brand suggestions for quick click
  const quickBrands = ['Renault', 'Fiat', 'Ford', 'Volkswagen', 'Toyota', 'Hyundai', 'Peugeot', 'BMW'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri Dön
        </button>
      </div>

      {/* 1. VEHICLE INFORMATION */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Araç Bilgileri
            </h3>
            <p className="text-xs text-slate-500">
              Servise kabul edilen aracın plaka ve model özellikleri.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Plaka */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Plaka <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="input-plate"
              placeholder="Örn: 34 ABC 123 veya 06 XYZ 78"
              value={plate}
              onChange={(e) => {
                setPlate(e.target.value.toUpperCase());
                if (errors.plate) setErrors((prev) => ({ ...prev, plate: '' }));
              }}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm font-mono font-bold tracking-wider uppercase transition-colors focus:outline-hidden focus:ring-2 ${
                errors.plate
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
              }`}
            />
            {errors.plate && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.plate}</p>
            )}
          </div>

          {/* Model Yılı */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Model Yılı
            </label>
            <input
              type="number"
              id="input-model-year"
              min="1980"
              max={new Date().getFullYear() + 1}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm transition-colors focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Marka */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Marka <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="input-brand"
              placeholder="Örn: Renault, Fiat, Ford"
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                if (errors.brand) setErrors((prev) => ({ ...prev, brand: '' }));
              }}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm transition-colors focus:outline-hidden focus:ring-2 ${
                errors.brand
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
              }`}
            />
            {/* Quick click suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickBrands.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setBrand(b);
                    if (errors.brand) setErrors((prev) => ({ ...prev, brand: '' }));
                  }}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  {b}
                </button>
              ))}
            </div>
            {errors.brand && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.brand}</p>
            )}
          </div>

          {/* Model */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Model / Motor <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="input-model"
              placeholder="Örn: Megane 1.5 dCi, Egea 1.3 MJet, Focus"
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
                if (errors.model) setErrors((prev) => ({ ...prev, model: '' }));
              }}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm transition-colors focus:outline-hidden focus:ring-2 ${
                errors.model
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
              }`}
            />
            {errors.model && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.model}</p>
            )}
          </div>
        </div>
      </div>

      {/* 2. CUSTOMER INFORMATION */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Müşteri İletişim Bilgileri
            </h3>
            <p className="text-xs text-slate-500">
              Telefon numarası WhatsApp bildirimleri ve takip linki paylaşımı için gereklidir.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Müşteri Adı (Opsiyonel) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Müşteri Adı Soyadı <span className="text-slate-400 font-normal">(Opsiyonel)</span>
            </label>
            <input
              type="text"
              id="input-customer-name"
              placeholder="Örn: Ahmet Yılmaz"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm transition-colors focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Telefon (Zorunlu) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Telefon Numarası <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              id="input-customer-phone"
              placeholder="0532 123 45 67"
              value={customerPhone}
              onChange={(e) => {
                setCustomerPhone(e.target.value);
                if (errors.customerPhone) setErrors((prev) => ({ ...prev, customerPhone: '' }));
              }}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm font-mono transition-colors focus:outline-hidden focus:ring-2 ${
                errors.customerPhone
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
              }`}
            />
            {errors.customerPhone && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.customerPhone}</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. SERVICE INFORMATION */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Servis & Teslimat Detayları
            </h3>
            <p className="text-xs text-slate-500">
              Müşteri şikayeti, yapılacak işlemler ve tahmini teslim zamanı.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Açıklama */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Servis Açıklaması / Talep Edilen İşlemler
            </label>
            <textarea
              id="input-service-desc"
              rows={3}
              placeholder="Örn: 60.000 km periyodik bakım, ön fren balata değişimi ve klima gaz dolumu..."
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm transition-colors focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tahmini Teslim */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tahmini Teslim Tarihi / Saati <span className="text-slate-400 font-normal">(Opsiyonel)</span>
              </label>
              <input
                type="text"
                id="input-delivery-date"
                placeholder="Bugün 18:00 veya Yarın 12:00"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm transition-colors focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Başlangıç Durumu */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isEditing ? 'Mevcut Durum' : 'Başlangıç Aşaması'}
              </label>
              <select
                id="select-current-status"
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as VehicleStatus)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 transition-colors focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                {STATUS_LIST.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!isEditing && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                İlk Durum Açıklama Notu <span className="text-slate-400 font-normal">(Opsiyonel)</span>
              </label>
              <input
                type="text"
                placeholder="Örn: Araç servise kabul edildi ve kayıt açıldı."
                value={initialNote}
                onChange={(e) => setInitialNote(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm transition-colors focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
          className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          İptal
        </button>
        <button
          type="submit"
          id="btn-submit-vehicle"
          disabled={isSubmitting}
          className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 rounded-xl transition-colors shadow-xs inline-flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{isEditing ? 'Değişiklikleri Kaydet' : 'Aracı Kaydet ve QR Oluştur'}</span>
        </button>
      </div>
    </form>
  );
};
