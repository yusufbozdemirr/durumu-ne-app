import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, User, Save, Loader2, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { business, userProfile, updateBusiness } = useApp();

  // Business state
  const [bizName, setBizName] = useState(business?.name || '');
  const [bizPhone, setBizPhone] = useState(business?.phone || '');
  const [bizAddress, setBizAddress] = useState(business?.address || '');

  // User state
  const [userName, setUserName] = useState(userProfile?.name || '');
  const [userEmail] = useState(userProfile?.email || '');
  const [userRole] = useState(
    userProfile?.role === 'owner' ? 'İşletme Sahibi' : 'Usta / Personel'
  );

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (business) {
      setBizName(business.name || '');
      setBizPhone(business.phone || '');
      setBizAddress(business.address || '');
    }
  }, [business]);

  useEffect(() => {
    if (userProfile) {
      setUserName(userProfile.name || '');
    }
  }, [userProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    try {
      setIsSaving(true);
      setSavedSuccess(false);
      await updateBusiness({
        name: bizName.trim(),
        phone: bizPhone.trim(),
        address: bizAddress.trim(),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update business settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            İşletme Ayarları
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            İşletme bilgileri ve kullanıcı profil detayları.
          </p>
        </div>

        <button
          type="submit"
          id="btn-save-settings-top"
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 rounded-xl transition-colors shadow-md shadow-emerald-600/30 cursor-pointer"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : savedSuccess ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{savedSuccess ? 'Kaydedildi' : 'Değişiklikleri Kaydet'}</span>
        </button>
      </div>

      {/* 1. BUSINESS INFORMATION */}
      <div className="bg-[#0c152a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 mb-5">
          <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              İşletme Bilgileri
            </h3>
            <p className="text-xs text-slate-400">
              Müşteri takip sayfasında ve bildirim mesajlarında görünen servis bilgileri.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              İşletme / Servis Adı
            </label>
            <input
              type="text"
              id="input-biz-name"
              value={bizName}
              onChange={(e) => setBizName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#070d19] border border-slate-700 rounded-xl text-sm text-white transition-colors focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              İşletme Telefonu / WhatsApp
            </label>
            <input
              type="text"
              id="input-biz-phone"
              placeholder="0212 123 45 67 veya 0532 ..."
              value={bizPhone}
              onChange={(e) => setBizPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#070d19] border border-slate-700 rounded-xl text-sm font-mono text-white transition-colors focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              İşletme Kimliği (ID)
            </label>
            <input
              type="text"
              disabled
              value={business?.id || '-'}
              className="w-full px-3.5 py-2.5 bg-[#070d19] border border-slate-800 rounded-xl text-xs font-mono text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Servis Adresi
            </label>
            <input
              type="text"
              id="input-biz-address"
              placeholder="Sanayi Sitesi No: 123..."
              value={bizAddress}
              onChange={(e) => setBizAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#070d19] border border-slate-700 rounded-xl text-sm text-white transition-colors focus:outline-hidden focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* 2. ACCOUNT */}
      <div className="bg-[#0c152a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 mb-5">
          <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Hesap Bilgileri
            </h3>
            <p className="text-xs text-slate-400">
              Yönetici profil ve Firebase Auth erişim bilgileri.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Ad Soyad
            </label>
            <input
              type="text"
              id="input-user-name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#070d19] border border-slate-700 rounded-xl text-sm text-white transition-colors focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              E-posta
            </label>
            <input
              type="email"
              disabled
              id="input-user-email"
              value={userEmail}
              className="w-full px-3.5 py-2.5 bg-[#070d19] border border-slate-800 rounded-xl text-sm font-mono text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Rol
            </label>
            <input
              type="text"
              disabled
              id="input-user-role"
              value={userRole}
              className="w-full px-3.5 py-2.5 bg-[#070d19] border border-slate-800 rounded-xl text-sm text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
