import React, { useState, useEffect, useMemo } from 'react';
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

      const tomorrow = new Date();
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

      const formattedDate = date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      return `${formattedDate} ${timeStr}`;
    } catch {
      return isoStr;
    }
  };

  // When brand changes in list mode, update available models
  const availableModels = useMemo(() => {
    return getModelsForBrand(brand);
  }, [brand]);

  // Set a default model when brand changes in dropdown mode if model doesn't belong to this brand
  useEffect(() => {
    if (!isManualVehicle && availableModels.length > 0) {
      const currentModelBelongsToBrand = availableModels.some((m) =>
        model.startsWith(m.name)
      );
      if (!currentModelBelongsToBrand && !initialData) {
        const firstModel = availableModels[0];
        const defaultFull = firstModel.engines.length > 0
          ? `${firstModel.name} (${firstModel.engines[0]})`
          : firstModel.name;
        setModel(defaultFull);
      }
    }
  }, [brand, isManualVehicle, availableModels, initialData, model]);

  // Quick Preset Handlers for Delivery
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri Dön
        </button>
      </div>

      {/* 1. VEHICLE INFORMATION */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Araç Bilgileri
              </h3>
              <p className="text-xs text-slate-500">
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
                // Return to first brand
                if (!brand || !POPULAR_CAR_DATABASE.some((b) => b.brand === brand)) {
                  setBrand('Fiat');
                }
              }
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
              isManualVehicle
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {isManualVehicle ? (
              <>
                <ListFilter className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kayıtlı Listeden Seç</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Araç Listede Yok mu? (Elle Yaz)</span>
              </>
            )}
          </button>
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
            {isManualVehicle ? (
              <input
                type="number"
                id="input-model-year"
                min="1970"
                max={new Date().getFullYear() + 1}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Örn: 2022"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm transition-colors focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 font-mono"
              />
            ) : (
              <select
                id="select-model-year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 transition-colors focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Marka Selection */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Marka <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500">
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
                className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm transition-colors focus:outline-hidden focus:ring-2 ${
                  errors.brand
                    ? 'border-rose-300 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
                }`}
              />
            ) : (
              <div>
                <select
                  id="select-brand"
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    if (errors.brand) setErrors((prev) => ({ ...prev, brand: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm font-semibold text-slate-800 transition-colors focus:outline-hidden focus:ring-2 ${
                    errors.brand
                      ? 'border-rose-300 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
                  }`}
                >
                  <option value="" disabled>
                    -- Marka Seçiniz --
                  </option>
                  {POPULAR_CAR_DATABASE.map((item) => (
                    <option key={item.brand} value={item.brand}>
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
                        onClick={() => {
                          setBrand(b);
                          if (errors.brand) setErrors((prev) => ({ ...prev, brand: '' }));
                        }}
                        className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                          brand === b
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
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
              <label className="block text-xs font-semibold text-slate-700">
                Model & Motor <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500">
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
                className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm transition-colors focus:outline-hidden focus:ring-2 ${
                  errors.model
                    ? 'border-rose-300 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
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
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm font-semibold text-slate-800 transition-colors focus:outline-hidden focus:ring-2 ${
                    errors.model
                      ? 'border-rose-300 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
                  }`}
                >
                  <option value="" disabled>
                    -- Model ve Motor Seçiniz --
                  </option>
                  {availableModels.map((m) => (
                    <optgroup key={m.name} label={m.name}>
                      {m.engines.length > 0 ? (
                        m.engines.map((eng) => {
                          const val = `${m.name} (${eng})`;
                          return (
                            <option key={val} value={val}>
                              {m.name} - {eng}
                            </option>
                          );
                        })
                      ) : (
                        <option value={m.name}>{m.name}</option>
                      )}
                    </optgroup>
                  ))}
                </select>

                <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
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

      {/* 3. SERVICE INFORMATION & DELIVERY CALENDAR */}
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
              Yapılacak işlemler ve takvimden seçilecek tahmini teslim zamanı.
            </p>
          </div>
        </div>

        <div className="space-y-5">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Tahmini Teslim - Takvim ve Saat Seçici */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Tahmini Teslim Tarihi ve Saati</span>
                </label>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
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
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-800 transition-colors focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 cursor-pointer shadow-2xs"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <p className="text-[11px] text-slate-500 font-medium mb-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Hızlı Seçenekler:</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setQuickDelivery('plus2')}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                  >
                    +2 Saat
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDelivery('today18')}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors font-medium"
                  >
                    Bugün 18:00
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDelivery('tomorrow12')}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                  >
                    Yarın 12:00
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDelivery('tomorrow18')}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                  >
                    Yarın 18:00
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDelivery('in2days')}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                  >
                    2 Gün Sonra
                  </button>
                </div>
              </div>
            </div>

            {/* Başlangıç Durumu */}
            <div className="space-y-3">
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
