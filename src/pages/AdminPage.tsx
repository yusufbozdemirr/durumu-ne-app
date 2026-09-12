import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Business, Vehicle } from '../types';
import { vehicleService } from '../services/vehicleService';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import { PlateDisplay } from '../components/common/PlateDisplay';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Trash2,
  Edit2,
  Shield,
  Loader2,
  X,
  AlertTriangle,
  User,
  Lock,
  Car,
  Clock,
  Sparkles,
  Crown,
  Send,
  ExternalLink,
} from 'lucide-react';
import {
  getWhatsAppDirectUrl,
  SUPPORT_PHONE_DISPLAY,
} from '../utils/constants';

export const AdminPage: React.FC = () => {
  const {
    allBusinesses,
    loadAllBusinesses,
    adminCreateBusiness,
    adminUpdateBusiness,
    adminDeleteBusiness,
  } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<
    'all' | 'requests' | 'pro' | 'trial' | 'expired'
  >('all');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [deletingBusiness, setDeletingBusiness] = useState<Business | null>(null);
  const [vehiclesModalBusiness, setVehiclesModalBusiness] = useState<Business | null>(null);
  const [businessVehicles, setBusinessVehicles] = useState<Vehicle[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Create Form State
  const [createForm, setCreateForm] = useState({
    businessName: '',
    phone: '',
    address: '',
    ownerName: '',
    email: '',
    password: '',
    plan: 'trial' as 'pro' | 'trial',
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .substring(0, 10),
  });

  // Edit Form State
  const [editForm, setEditForm] = useState({
    name: '',
    ownerName: '',
    phone: '',
    address: '',
    plan: 'trial' as 'pro' | 'trial',
    accountStatus: 'active' as 'active' | 'trial_expired' | 'suspended',
    active: true,
    endDate: '',
  });

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      await loadAllBusinesses();
      if (isMounted) setIsLoading(false);
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [loadAllBusinesses]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Helper counts
  const pendingRequests = allBusinesses.filter(
    (b) =>
      b.onayDurumu === 'bekliyor' ||
      b.onayDurumu === 'onay_bekliyor' ||
      b.accountStatus === 'pending_approval'
  );
  const proBusinesses = allBusinesses.filter(
    (b) => (b.plan === 'pro' || b.paketTuru === 'pro') && b.accountStatus !== 'pending_approval'
  );
  const trialBusinesses = allBusinesses.filter(
    (b) =>
      b.plan !== 'pro' &&
      b.paketTuru !== 'pro' &&
      b.accountStatus !== 'pending_approval' &&
      b.accountStatus !== 'trial_expired' &&
      b.active !== false
  );
  const expiredBusinesses = allBusinesses.filter(
    (b) =>
      b.accountStatus === 'trial_expired' ||
      (b.plan !== 'pro' &&
        b.trialEndDate &&
        new Date(b.trialEndDate).getTime() <= Date.now())
  );

  // Filter businesses by search & active tab
  const filteredBusinesses = allBusinesses.filter((b) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      b.name.toLowerCase().includes(term) ||
      (b.ownerName && b.ownerName.toLowerCase().includes(term)) ||
      (b.ownerEmail && b.ownerEmail.toLowerCase().includes(term)) ||
      b.phone.includes(term);

    if (!matchesSearch) return false;

    if (activeTab === 'requests') {
      return (
        b.onayDurumu === 'bekliyor' ||
        b.onayDurumu === 'onay_bekliyor' ||
        b.accountStatus === 'pending_approval'
      );
    }
    if (activeTab === 'pro') {
      return (b.plan === 'pro' || b.paketTuru === 'pro') && b.accountStatus !== 'pending_approval';
    }
    if (activeTab === 'trial') {
      return (
        b.plan !== 'pro' &&
        b.paketTuru !== 'pro' &&
        b.accountStatus !== 'pending_approval' &&
        b.accountStatus !== 'trial_expired' &&
        b.active !== false
      );
    }
    if (activeTab === 'expired') {
      return (
        b.accountStatus === 'trial_expired' ||
        (b.plan !== 'pro' &&
          b.trialEndDate &&
          new Date(b.trialEndDate).getTime() <= Date.now())
      );
    }
    return true;
  });

  // Handle Approve Request
  const handleApproveRequest = async (business: Business) => {
    try {
      setIsSubmitting(true);
      const now = new Date();
      const trialEndDate = new Date(
        now.getTime() + 7 * 24 * 60 * 60 * 1000
      ).toISOString();

      await adminUpdateBusiness(business.id, {
        onayDurumu: 'onaylandi',
        accountStatus: 'active',
        active: true,
        plan: 'trial',
        paketTuru: 'deneme',
        trialStartDate: now.toISOString(),
        trialEndDate: trialEndDate,
        denemeBaslangicTarihi: now.toISOString(),
        denemeBitisTarihi: trialEndDate,
      });

      // Prepare mailto link
      const subject = encodeURIComponent(
        'Durumu Ne? - 7 Günlük Ücretsiz Deneme Süreniz Başladı'
      );
      const body = encodeURIComponent(
        `Sayın ${business.ownerName || 'İşletme Yetkilisi'},\n\n` +
          `Durumu Ne? Araç Takip Platformu'na hoş geldiniz!\n\n` +
          `7 günlük ücretsiz deneme süresi talebiniz onaylanmış ve başlatılmıştır.\n` +
          `Servisinizin canlı takip sistemini kullanmaya hemen başlayabilirsiniz.\n\n` +
          `Panel Giriş Adresi: https://durumune.com/login\n` +
          `Kullanıcı E-posta: ${business.ownerEmail || ''}\n\n` +
          `Her türlü sorunuzda WhatsApp destek hattımızdan (${SUPPORT_PHONE_DISPLAY}) bize dilediğiniz zaman ulaşabilirsiniz.\n\n` +
          `Saygılarımızla,\nDurumu Ne? Ekibi\nLogo: https://durumune.com/favicon.png`
      );

      // Trigger mailto client
      if (business.ownerEmail) {
        window.location.href = `mailto:${business.ownerEmail}?subject=${subject}&body=${body}`;
      }

      showToast(`${business.name} deneme süresi onaylandı ve e-posta hazırlandı!`);
      await loadAllBusinesses();
    } catch (err: any) {
      alert(err?.message || 'Talep onaylanırken hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Vehicles Modal
  const openVehiclesModal = async (business: Business) => {
    setVehiclesModalBusiness(business);
    setIsLoadingVehicles(true);
    try {
      const vList = await vehicleService.getVehiclesByBusiness(business.id);
      setBusinessVehicles(vList);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setBusinessVehicles([]);
    } finally {
      setIsLoadingVehicles(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (b: Business) => {
    setEditingBusiness(b);
    const rawEndDate = b.trialEndDate || b.denemeBitisTarihi || b.proEndDate || b.proBitisTarihi;
    setEditForm({
      name: b.name,
      ownerName: b.ownerName || '',
      phone: b.phone,
      address: b.address || '',
      plan: b.plan === 'pro' || b.paketTuru === 'pro' ? 'pro' : 'trial',
      accountStatus:
        b.accountStatus === 'trial_expired'
          ? 'trial_expired'
          : b.active === false || b.accountStatus === 'suspended'
          ? 'suspended'
          : 'active',
      active: b.active !== false,
      endDate: rawEndDate ? rawEndDate.substring(0, 10) : '',
    });
    setFormError('');
  };

  // Quick Action Buttons in Edit Modal
  const handleQuickExtendTrial = () => {
    const newEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    setEditForm((prev) => ({
      ...prev,
      plan: 'trial',
      accountStatus: 'active',
      active: true,
      endDate: newEnd.toISOString().substring(0, 10),
    }));
  };

  const handleQuickMakePro = () => {
    const newEnd = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    setEditForm((prev) => ({
      ...prev,
      plan: 'pro',
      accountStatus: 'active',
      active: true,
      endDate: newEnd.toISOString().substring(0, 10),
    }));
  };

  const handleQuickMakeTrial = () => {
    const newEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    setEditForm((prev) => ({
      ...prev,
      plan: 'trial',
      accountStatus: 'active',
      active: true,
      endDate: newEnd.toISOString().substring(0, 10),
    }));
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBusiness) return;
    setFormError('');

    if (!editForm.name.trim() || !editForm.phone.trim()) {
      setFormError('İşletme adı ve telefon zorunludur.');
      return;
    }

    try {
      setIsSubmitting(true);
      const isPro = editForm.plan === 'pro';
      const endDateIso = editForm.endDate
        ? new Date(editForm.endDate).toISOString()
        : isPro
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const updates: Record<string, any> = {
        name: editForm.name.trim(),
        ownerName: editForm.ownerName.trim(),
        phone: editForm.phone.trim(),
        address: editForm.address.trim(),
        plan: isPro ? 'pro' : 'trial',
        paketTuru: isPro ? 'pro' : 'deneme',
        accountStatus: editForm.accountStatus,
        active: editForm.accountStatus !== 'suspended' && editForm.active,
        ownerUid: editingBusiness.ownerUid,
      };

      if (isPro) {
        updates.proEndDate = endDateIso;
        updates.proBitisTarihi = endDateIso;
        if (!editingBusiness.proStartDate) {
          updates.proStartDate = new Date().toISOString();
          updates.proBaslangicTarihi = new Date().toISOString();
        }
      } else {
        updates.trialEndDate = endDateIso;
        updates.denemeBitisTarihi = endDateIso;
        if (!editingBusiness.trialStartDate) {
          updates.trialStartDate = new Date().toISOString();
          updates.denemeBaslangicTarihi = new Date().toISOString();
        }
      }

      await adminUpdateBusiness(editingBusiness.id, updates);
      setEditingBusiness(null);
      showToast('İşletme başarıyla güncellendi.');
      await loadAllBusinesses();
    } catch (err: any) {
      console.error('Update error:', err);
      setFormError(err?.message || 'Güncelleme sırasında hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Create Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (
      !createForm.businessName.trim() ||
      !createForm.phone.trim() ||
      !createForm.ownerName.trim() ||
      !createForm.email.trim() ||
      !createForm.password
    ) {
      setFormError('Lütfen tüm zorunlu alanları doldurunuz.');
      return;
    }

    if (!/^\d{6,}$/.test(createForm.password)) {
      setFormError('Şifre en az 6 haneli sadece rakamlardan oluşmalıdır (Örn: 123456).');
      return;
    }

    try {
      setIsSubmitting(true);
      const isPro = createForm.plan === 'pro';
      const endDateIso = createForm.endDate
        ? new Date(createForm.endDate).toISOString()
        : isPro
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      await adminCreateBusiness({
        businessName: createForm.businessName.trim(),
        phone: createForm.phone.trim(),
        address: createForm.address.trim(),
        ownerName: createForm.ownerName.trim(),
        email: createForm.email.trim(),
        password: createForm.password,
        plan: isPro ? 'pro' : 'trial',
        paketTuru: isPro ? 'pro' : 'deneme',
        endDate: endDateIso,
      });

      setShowCreateModal(false);
      setCreateForm({
        businessName: '',
        phone: '',
        address: '',
        ownerName: '',
        email: '',
        password: '',
        plan: 'trial',
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .substring(0, 10),
      });
      showToast('Yeni işletme ve bayi kullanıcısı başarıyla oluşturuldu.');
      await loadAllBusinesses();
    } catch (err: any) {
      setFormError(err?.message || 'İşletme oluşturulurken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deletingBusiness) return;
    try {
      setIsSubmitting(true);
      await adminDeleteBusiness(deletingBusiness.id);
      setDeletingBusiness(null);
      showToast('İşletme silindi.');
      await loadAllBusinesses();
    } catch (err: any) {
      alert(err?.message || 'İşletme silinirken hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a1122] p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/80 text-amber-400 border border-amber-800">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              Sistem Yöneticisi
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            İşletme Yönetim Paneli
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Müşteri servis taleplerini onaylayın, kayıtlı araçları inceleyin ve Pro / Deneme sürelerini yönetin.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            id="btn-admin-add-business"
            onClick={() => {
              setFormError('');
              setShowCreateModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-emerald-600/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni İşletme Ekle</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'all'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-[#0c152a] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>Tüm İşletmeler</span>
          <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[11px]">
            {allBusinesses.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-[#0c152a] text-slate-400 hover:text-amber-300 border border-slate-800'
          }`}
        >
          <span>Onay Bekleyen Talepler</span>
          {pendingRequests.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black font-extrabold text-[11px] animate-pulse">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pro')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'pro'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-[#0c152a] text-slate-400 hover:text-emerald-300 border border-slate-800'
          }`}
        >
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>Pro Müşteriler</span>
          <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[11px]">
            {proBusinesses.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('trial')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'trial'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-[#0c152a] text-slate-400 hover:text-blue-300 border border-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Deneme Sürümündekiler</span>
          <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[11px]">
            {trialBusinesses.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('expired')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'expired'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-[#0c152a] text-slate-400 hover:text-rose-300 border border-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Süresi Dolanlar</span>
          <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[11px]">
            {expiredBusinesses.length}
          </span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="İşletme adı, yetkili adı, e-posta veya telefon ile ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#0c152a] border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
        />
      </div>

      {/* Table of Businesses / Requests */}
      <div className="bg-[#0c152a] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-7 h-7 text-emerald-500 animate-spin" />
            <span className="text-xs font-semibold">İşletmeler yükleniyor...</span>
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-white">İşletme kaydı bulunamadı</p>
            <p className="text-xs text-slate-500 mt-1">
              Arama kriterlerinizi değiştirebilir veya yeni işletme ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#070d19] border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">İşletme & Yetkili</th>
                  <th className="py-3.5 px-4">İletişim</th>
                  <th className="py-3.5 px-4">Paket & Durum</th>
                  <th className="py-3.5 px-4">Bitiş Tarihi</th>
                  <th className="py-3.5 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredBusinesses.map((b) => {
                  const isPending =
                    b.onayDurumu === 'bekliyor' ||
                    b.onayDurumu === 'onay_bekliyor' ||
                    b.accountStatus === 'pending_approval';

                  const isPro = b.plan === 'pro' || b.paketTuru === 'pro';
                  const rawEndDate =
                    b.trialEndDate ||
                    b.denemeBitisTarihi ||
                    b.proEndDate ||
                    b.proBitisTarihi;

                  const isExpired =
                    !isPro &&
                    ((rawEndDate && new Date(rawEndDate).getTime() <= Date.now()) ||
                      b.accountStatus === 'trial_expired');

                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Business & Owner */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">
                          {b.name}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                          <User className="w-3 h-3 text-slate-500" />
                          <span>{b.ownerName || 'Yetkili Belirtilmemiş'}</span>
                        </div>
                        {b.ownerEmail && (
                          <div className="text-[11px] text-slate-500 font-mono">
                            {b.ownerEmail}
                          </div>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-200">{b.phone}</span>
                          <a
                            href={getWhatsAppDirectUrl(`Merhaba ${b.name}, Durumu Ne? ekibinden ulaşıyorum.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-md bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/60 transition-colors"
                            title="WhatsApp Mesajı Aç"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      {/* Package & Status */}
                      <td className="py-3.5 px-4">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-950/90 text-amber-400 border border-amber-800">
                            <Clock className="w-3 h-3" />
                            Onay Bekliyor
                          </span>
                        ) : isPro ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                            Pro Lisanslı
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800">
                            <AlertTriangle className="w-3 h-3" />
                            Deneme Süresi Doldu
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-950/80 text-blue-300 border border-blue-800">
                            <Clock className="w-3 h-3" />
                            7 Günlük Deneme
                          </span>
                        )}

                        {/* Suspension badge */}
                        {b.active === false || b.accountStatus === 'suspended' ? (
                          <span className="ml-2 inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-900 text-rose-200">
                            Askıda
                          </span>
                        ) : null}
                      </td>

                      {/* End Date */}
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                        {rawEndDate
                          ? new Date(rawEndDate).toLocaleDateString('tr-TR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => handleApproveRequest(b)}
                              disabled={isSubmitting}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                              title="Talebi Onayla ve Hoşgeldiniz E-postası Gönder"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Onayla</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => openVehiclesModal(b)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                            title="Kayıtlı Araçları Gör"
                          >
                            <Car className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(b)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                            title="İşletmeyi Düzenle / Süre Uzat"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingBusiness(b)}
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-400 hover:text-rose-200 border border-rose-900 transition-colors"
                            title="İşletmeyi Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: Registered Vehicles Modal */}
      {vehiclesModalBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0c152a] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Car className="w-5 h-5 text-emerald-400" />
                  <span>{vehiclesModalBusiness.name} - Kayıtlı Araçlar</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  İşletmeye ait servisteki aktif ve geçmiş araç listesi.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVehiclesModalBusiness(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoadingVehicles ? (
              <div className="py-12 text-center text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                <span className="text-xs">Araçlar yükleniyor...</span>
              </div>
            ) : businessVehicles.length === 0 ? (
              <div className="py-10 text-center text-slate-400">
                <Car className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p className="text-xs font-medium">Bu işletmeye henüz araç eklenmemiş.</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2.5">
                {businessVehicles.map((v) => (
                  <div
                    key={v.id}
                    className="p-3 bg-[#070d19] border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <PlateDisplay plate={v.plate} size="sm" />
                      <div>
                        <div className="font-bold text-white">
                          {v.brand} {v.model}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {v.customerName} • {v.customerPhone}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={v.currentStatus} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setVehiclesModalBusiness(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Business & Extend License Modal */}
      {editingBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0c152a] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-emerald-400" />
                  <span>İşletme ve Lisans Düzenle</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingBusiness.name} işletmesinin detaylarını ve lisans süresini güncelleyin.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingBusiness(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl">
                {formError}
              </div>
            )}

            {/* Quick Extension Buttons */}
            <div className="p-3 bg-[#070d19] rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Hızlı Lisans İşlemleri
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleQuickExtendTrial}
                  className="py-2 px-2 text-[11px] font-bold text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800 rounded-lg transition-colors text-center"
                >
                  +7 Gün Deneme
                </button>
                <button
                  type="button"
                  onClick={handleQuickMakePro}
                  className="py-2 px-2 text-[11px] font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800 rounded-lg transition-colors text-center"
                >
                  Pro Yap (+1 Yıl)
                </button>
                <button
                  type="button"
                  onClick={handleQuickMakeTrial}
                  className="py-2 px-2 text-[11px] font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800 rounded-lg transition-colors text-center"
                >
                  Deneme Yap
                </button>
              </div>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    İşletme Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#070d19] border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Yetkili Adı Soyadı
                  </label>
                  <input
                    type="text"
                    value={editForm.ownerName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, ownerName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#070d19] border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#070d19] border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Paket Türü * (Ücretsiz Kaldırıldı)
                  </label>
                  <select
                    value={editForm.plan}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        plan: e.target.value as 'pro' | 'trial',
                      })
                    }
                    className="w-full px-3 py-2 bg-[#070d19] border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="trial">7 Günlük Deneme Sürümü</option>
                    <option value="pro">Pro Paket (Tam Yetki)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Lisans / Deneme Bitiş Tarihi
                  </label>
                  <input
                    type="date"
                    value={editForm.endDate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, endDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#070d19] border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hesap Durumu
                  </label>
                  <select
                    value={editForm.accountStatus}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        accountStatus: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#070d19] border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="active">Aktif (Kullanabilir)</option>
                    <option value="trial_expired">Deneme Süresi Doldu</option>
                    <option value="suspended">Askıya Alındı</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Adres
                </label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, address: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#070d19] border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBusiness(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>Değişiklikleri Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Create Business Modal (No Free package, numeric password PIN) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0c152a] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>Yeni İşletme ve Bayi Tanımla</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pro veya 7 Günlük Deneme paketi ile yeni bir oto servis açın.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    İşletme Adı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Yıldız Oto Servis"
                    value={createForm.businessName}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        businessName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#070d19] border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Yetkili Adı Soyadı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Mehmet Yıldız"
                    value={createForm.ownerName}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        ownerName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#070d19] border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0555 555 55 55"
                    value={createForm.phone}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#070d19] border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="mehmet@yildizoto.com"
                    value={createForm.email}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#070d19] border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Numeric Password / PIN */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Şifre (Sayısal PIN) *
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    En az 6 haneli sadece rakam
                  </span>
                </div>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  placeholder="123456"
                  value={createForm.password}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, '');
                    setCreateForm({ ...createForm, password: digitsOnly });
                  }}
                  className="w-full px-3 py-2 bg-[#070d19] border border-slate-700 rounded-xl text-xs text-white font-mono tracking-widest focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              {/* Package selection: Strictly Pro or 7 Days (Free package removed) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Paket Türü *
                  </label>
                  <select
                    value={createForm.plan}
                    onChange={(e) => {
                      const newPlan = e.target.value as 'pro' | 'trial';
                      const defaultDays = newPlan === 'pro' ? 365 : 7;
                      setCreateForm({
                        ...createForm,
                        plan: newPlan,
                        endDate: new Date(Date.now() + defaultDays * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .substring(0, 10),
                      });
                    }}
                    className="w-full px-3 py-2 bg-[#070d19] border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="trial">7 Günlük Deneme Sürümü</option>
                    <option value="pro">Pro Paket (1 Yıl)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bitiş Zamanı
                  </label>
                  <input
                    type="date"
                    value={createForm.endDate}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, endDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#070d19] border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Adres (Opsiyonel)
                </label>
                <input
                  type="text"
                  placeholder="Sanayi Sitesi No: 42..."
                  value={createForm.address}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, address: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#070d19] border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>İşletmeyi Oluştur</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Delete Confirmation Modal */}
      {deletingBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0c152a] border border-rose-900/60 rounded-2xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-950/80 text-rose-400 border border-rose-800 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                İşletmeyi Silmek İstiyor Musunuz?
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                <strong className="text-white">{deletingBusiness.name}</strong>{' '}
                işletmesi ve veritabanı kaydı kalıcı olarak silinecektir. Bu işlem geri alınamaz.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDeletingBusiness(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 rounded-xl transition-colors flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Evet, Sil</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
