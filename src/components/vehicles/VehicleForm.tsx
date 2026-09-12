import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vehicle, VehicleStatus } from '../../types';
import { STATUS_LIST } from '../../utils/statusConstants';
import {
  POPULAR_CAR_DATABASE,
  YEAR_OPTIONS,
  getModelsForBrand,
} from '../../data/carDatabase';
import {
  Car,
  User,
  Wrench,
  ArrowLeft,
  Loader2,
  Calendar,
  Clock,
  Edit3,
  ListFilter,
  CheckCircle2,
} from 'lucide-react';

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

  // Determine if initial brand is in our database
  const brandInDb = useMemo(() => {
    if (!initialData?.brand) return true;
    return POPULAR_CAR_DATABASE.some(
      (b) => b.brand.toLowerCase() === initialData.brand.toLowerCase()
    );
  }, [initialData?.brand]);

  // Toggle between registered preset dropdowns and manual free-text input
  const [isManualVehicle, setIsManualVehicle] = useState<boolean>(!brandInDb);

  const [plate, setPlate] = useState(initialData?.plate || '');
  const [brand, setBrand] = useState(initialData?.brand || 'Fiat');
  const [model, setModel] = useState(initialData?.model || '');
  const [year, setYear] = useState<number | string>(
    initialData?.year || (initialData as any)?.modelYear || new Date().getFullYear()
  );

  const [customerName, setCustomerName] = useState(initialData?.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(initialData?.customerPhone || '');
  const [serviceDescription, setServiceDescription] = useState(
    initialData?.serviceDescription || ''
  );

  // Delivery Date & Time Picker state
  const getInitialDateTimeLocal = () => {
    const now = new Date();
    // Default to today 18:00
    now.setHours(18, 0, 0, 0);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}`;
  };

  const [deliveryDateTime, setDeliveryDateTime] = useState<string>(getInitialDateTimeLocal());
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>(
    initialData?.estimatedDelivery || 'Bugün 18:00'
  );

  const [currentStatus, setCurrentStatus] = useState<VehicleStatus>(
    initialData?.currentStatus || 'received'
  );
  const [initialNote, setInitialNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper to format datetime-local string to readable Turkish date & time
  const formatDateTimeToTurkish = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      if (isNaN(date.getTime())) return isoStr;

      const now = new Date();
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const isTomorrow =
        date.getDate() === tomorrow.getDate() &&
        date.getMonth() === tomorrow.getMonth() &&
        date.getFullYear() === tomorrow.getFullYear();

      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;

      if (isToday) {
        return `Bugün ${timeStr}`;
      }
      if (isTomorrow) {
        return `Yarın ${timeStr}`;
      }

      const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
      ];
      return `${date.getDate()} ${months[date.getMonth()]} ${timeStr}`;
    } catch {
      return isoStr;
    }
  };

  // Get available models based on selected brand
  const availableModels = useMemo(() => {
    return getModelsForBrand(brand);
  }, [brand]);

  // Set default model when brand changes
  const handleBrandChange = (newBrand: string) => {
    setBrand(newBrand);
    const models = getModelsForBrand(newBrand);
    if (models.length > 0) {
      const first = models[0];
      const defaultModel =
        first.engines.length > 0 ? `${first.name} (${first.engines[0]})` : first.name;
      setModel(defaultModel);
    } else {
      setModel('');
    }
    if (errors.brand) setErrors((prev) => ({ ...prev, brand: '' }));
  };

  // Quick delivery helpers
  const setQuickDelivery = (type: 'plus2' | 'today18' | 'tomorrow12' | 'tomorrow18' | 'in2days') => {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');

    if (type === 'plus2') {
      d.setHours(d.getHours() + 2);
    } else if (type === 'today18') {
      d.setHours(18, 0, 0, 0);
    } else if (type === 'tomorrow12') {
      d.setDate(d.getDate() + 1);
      d.setHours(12, 0, 0, 0);
    } else if (type === 'tomorrow18') {
      d.setDate(d.getDate() + 1);
      d.setHours(18, 0, 0, 0);
    } else if (type === 'in2days') {
      d.setDate(d.getDate() + 2);
      d.setHours(17, 0, 0, 0);
    }

    const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
    setDeliveryDateTime(iso);
    setEstimatedDelivery(formatDateTimeToTurkish(iso));
  };

  const handleDateTimeChange = (val: string) => {
    setDeliveryDateTime(val);
    if (val) {
      setEstimatedDelivery(formatDateTimeToTurkish(val));
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!plate.trim()) errs.plate = 'Plaka alanı zorunludur.';
    if (!brand.trim()) errs.brand = 'Marka alanı zorunludur.';
    if (!model.trim()) errs.model = 'Model / Motor alanı zorunludur.';
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri Dön
        </button>
      </div>

      {/* 1. VEHICLE INFORMATION */}
      <div className="bg-[#0c152a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                Araç Bilgileri
              </h3>
              <p className="text-xs text-slate-400">
                Plaka, marka, model/motor ve model yılı.
              </p>
            </div>
          </div>

          {/* Toggle Button: Listeden Seç vs Elle Yaz */}
          <button
            type="button"
            onClick={() => {
              setIsManualVehicle(!isManualVehicle);
              if (isManualVehicle) {
                if (!brand || !POPULAR_CAR_DATABASE.some((b) => b.brand === brand)) {
                  handleBrandChange('Fiat');
                }
              }
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
              isManualVehicle
                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700 hover:bg-emerald-900/60'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {isManualVehicle ? (
              <>
                <ListFilter className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kayıtlı Listeden Seç</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                <span>Araç Listede Yok mu? (Elle Yaz)</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Plaka */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
              className={`w-full px-3.5 py-2.5 bg-[#070d19] border rounded-xl text-sm font-mono font-bold tracking-wider uppercase text-white placeholder:text-slate-500 transition-colors focus:outline-hidden ${
                errors.plate
                  ? 'border-rose-500'
                  : 'border-slate-700 focus:border-emerald-500'
              }`}
            />
            {errors.plate && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.plate}</p>
            )}
          </div>

          {/* Model Yılı */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Model Yılı
            </label>
            {isManualVehicle ? (
              <input
                type="number"
                id="input-model-year"
                min="1970"
                max={new Date().getFullYear() + 1}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Örn: 2022"
                className="w-full px-3.5 py-2.5 bg-[#070d19] border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 transition-colors focus:outline-hidden focus:border-emerald-500 font-mono"
              />
            ) : (
              <select
                id="select-model-year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#070d19] border border-slate-700 rounded-xl text-sm font-semibold text-white transition-colors focus:outline-hidden focus:border-emerald-500"
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y} className="bg-[#070d19] text-white">
                    {y}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Marka Selection */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Marka <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {isManualVehicle ? 'Manuel Giriş' : 'Kayıtlı Listeden'}
              </span>
            </div>

            {isManualVehicle ? (
              <input
                type="text"
                id="input-brand-manual"
                placeholder="Örn: Renault, Fiat, Honda..."
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  if (errors.brand) setErrors((prev) => ({ ...prev, brand: '' }));
                }}
                className={`w-full px-3.5 py-2.5 bg-[#070d19] border rounded-xl text-sm text-white placeholder:text-slate-500 transition-colors focus:outline-hidden ${
                  errors.brand
                    ? 'border-rose-500'
                    : 'border-slate-700 focus:border-emerald-500'
                }`}
              />
            ) : (
              <div>
                <select
                  id="select-brand"
                  value={brand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className={`w-full px-3.5 py-2.5 bg-[#070d19] border rounded-xl text-sm font-semibold text-white transition-colors focus:outline-hidden ${
                    errors.brand
                      ? 'border-rose-500'
                      : 'border-slate-700 focus:border-emerald-500'
                  }`}
                >
                  <option value="" disabled className="bg-[#070d19] text-white">
                    -- Marka Seçiniz --
                  </option>
                  {POPULAR_CAR_DATABASE.map((item) => (
                    <option key={item.brand} value={item.brand} className="bg-[#070d19] text-white">
                      {item.brand}
                    </option>
                  ))}
                </select>

                {/* Quick select popular brands */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {['Fiat', 'Renault', 'Volkswagen', 'Ford', 'Toyota', 'Hyundai', 'Peugeot', 'Honda'].map(
                    (b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => handleBrandChange(b)}
                        className={`text-[11px] px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                          brand === b
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        {b}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {errors.brand && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.brand}</p>
            )}
          </div>

          {/* Model / Motor Selection */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Model & Motor <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {isManualVehicle ? 'Manuel Giriş' : 'Kayıtlı Listeden'}
              </span>
            </div>

            {isManualVehicle ? (
              <input
                type="text"
                id="input-model-manual"
                placeholder="Örn: Egea 1.3 Multijet, Megane 1.5 dCi..."
                value={model}
                onChange={(e) => {
                  setModel(e.target.value);
                  if (errors.model) setErrors((prev) => ({ ...prev, model: '' }));
                }}
                className={`w-full px-3.5 py-2.5 bg-[#070d19] border rounded-xl text-sm text-white placeholder:text-slate-500 transition-colors focus:outline-hidden ${
                  errors.model
                    ? 'border-rose-500'
                    : 'border-slate-700 focus:border-emerald-500'
                }`}
              />
            ) : (
              <div>
                <select
                  id="select-model"
                  value={model}
                  onChange={(e) => {
                    setModel(e.target.value);
                    if (errors.model) setErrors((prev) => ({ ...prev, model: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 bg-[#070d19] border rounded-xl text-sm font-semibold text-white transition-colors focus:outline-hidden ${
                    errors.model
                      ? 'border-rose-500'
                      : 'border-slate-700 focus:border-emerald-500'
                  }`}
                >
                  <option value="" disabled className="bg-[#070d19] text-white">
                    -- Model ve Motor Seçiniz --
                  </option>
                  {availableModels.map((m) => (
                    <optgroup key={m.name} label={m.name} className="bg-[#0c152a] text-emerald-400">
                      {m.engines.length > 0 ? (
                        m.engines.map((eng) => {
                          const val = `${m.name} (${eng})`;
                          return (
                            <option key={val} value={val} className="bg-[#070d19] text-white">
                              {m.name} - {eng}
                            </option>
                          );
                        })
                      ) : (
                        <option value={m.name} className="bg-[#070d19] text-white">
                          {m.name}
                        </option>
                      )}
                    </optgroup>
                  ))}
                </select>

                <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{brand} markasına ait Türkiye modelleri ve motor seçenekleri listelenir.</span>
                </p>
              </div>
            )}

            {errors.model && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.model}</p>
            )}
          </div>
        </div>
      </div>

      {/* 2. CUSTOMER INFORMATION */}
      <div className="bg-[#0c152a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 mb-5">
          <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Müşteri İletişim Bilgileri
            </h3>
            <p className="text-xs text-slate-400">
              Telefon numarası WhatsApp bildirimleri ve takip linki paylaşımı için gereklidir.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Müşteri Adı (Opsiyonel) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Müşteri Adı Soyadı <span className="text-slate-500 font-normal">(Opsiyonel)</span>
            </label>
            <input
              type="text"
              id="input-customer-name"
              placeholder="Örn: Ahmet Yılmaz"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#070d19] border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 transition-colors focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Telefon (Zorunlu) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
              className={`w-full px-3.5 py-2.5 bg-[#070d19] border rounded-xl text-sm font-mono text-white placeholder:text-slate-500 transition-colors focus:outline-hidden ${
                errors.customerPhone
                  ? 'border-rose-500'
                  : 'border-slate-700 focus:border-emerald-500'
              }`}
            />
            {errors.customerPhone && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.customerPhone}</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. SERVICE INFORMATION & DELIVERY CALENDAR */}
      <div className="bg-[#0c152a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 mb-5">
          <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Servis & Teslimat Detayları
            </h3>
            <p className="text-xs text-slate-400">
              Yapılacak işlemler ve takvimden seçilecek tahmini teslim zamanı.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Açıklama */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Servis Açıklaması / Talep Edilen İşlemler
            </label>
            <textarea
              id="input-service-desc"
              rows={3}
              placeholder="Örn: 60.000 km periyodik bakım, ön fren balata değişimi ve klima gaz dolumu..."
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#070d19] border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 transition-colors focus:outline-hidden focus:border-emerald-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Tahmini Teslim - Takvim ve Saat Seçici */}
            <div className="bg-[#070d19] p-4 rounded-xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Tahmini Teslim Tarihi ve Saati</span>
                </label>
                <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                  {estimatedDelivery}
                </span>
              </div>

              {/* Native Calendar + Time Picker */}
              <div className="relative">
                <input
                  type="datetime-local"
                  id="input-delivery-datetime"
                  value={deliveryDateTime}
                  onChange={(e) => handleDateTimeChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0c152a] border border-slate-700 rounded-xl text-sm font-mono text-white transition-colors focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <p className="text-[11px] text-slate-400 font-medium mb-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Hızlı Seçenekler:</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setQuickDelivery('plus2')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#0c152a] hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    +2 Saat
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDelivery('today18')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#0c152a] hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors font-medium cursor-pointer"
                  >
                    Bugün 18:00
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDelivery('tomorrow12')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#0c152a] hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Yarın 12:00
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDelivery('tomorrow18')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#0c152a] hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Yarın 18:00
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDelivery('in2days')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#0c152a] hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    2 Gün Sonra
                  </button>
                </div>
              </div>
            </div>

            {/* Başlangıç Durumu */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isEditing ? 'Mevcut Durum' : 'Başlangıç Aşaması'}
                </label>
                <select
                  id="select-current-status"
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as VehicleStatus)}
                  className="w-full px-3.5 py-2.5 bg-[#070d19] border border-slate-700 rounded-xl text-sm font-semibold text-white transition-colors focus:outline-hidden focus:border-emerald-500"
                >
                  {STATUS_LIST.map((s) => (
                    <option key={s.key} value={s.key} className="bg-[#070d19] text-white">
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {!isEditing && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    İlk Durum Açıklama Notu{' '}
                    <span className="text-slate-500 font-normal">(Opsiyonel)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Araç servise kabul edildi ve kayıt açıldı."
                    value={initialNote}
                    onChange={(e) => setInitialNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070d19] border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 transition-colors focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
          className="px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
        >
          İptal
        </button>
        <button
          type="submit"
          id="btn-submit-vehicle"
          disabled={isSubmitting}
          className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 rounded-xl transition-colors shadow-md shadow-emerald-600/30 inline-flex items-center gap-2 cursor-pointer"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{isEditing ? 'Değişiklikleri Kaydet' : 'Aracı Kaydet ve QR Oluştur'}</span>
        </button>
      </div>
    </form>
  );
};
