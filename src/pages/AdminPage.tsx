import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Business } from '../types';
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
} from 'lucide-react';


export const AdminPage: React.FC = () => {
  const {
    allBusinesses,
    loadAllBusinesses,
    adminCreateBusiness,
    adminUpdateBusiness,
    adminDeleteBusiness,
    currentUser,
  } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [deletingBusiness, setDeletingBusiness] = useState<Business | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Create Form State
  const [createForm, setCreateForm] = useState({
    businessName: '',
    phone: '',
    address: '',
    ownerName: '',
    email: '',
    password: '',
  });

  // Edit Form State
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: '',
    plan: 'trial' as 'free' | 'pro' | 'trial',
    accountStatus: 'active' as 'active' | 'trial_expired' | 'suspended',
    active: true,
    trialEndDate: '',
    proEndDate: '',
  });

  const [planFilter, setPlanFilter] = useState<'all' | 'trial' | 'pro' | 'trial_expired' | 'suspended'>('all');

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

  // Filter businesses
  const filteredBusinesses = allBusinesses.filter((b) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      b.name.toLowerCase().includes(term) ||
      (b.ownerName && b.ownerName.toLowerCase().includes(term)) ||
      (b.ownerEmail && b.ownerEmail.toLowerCase().includes(term)) ||
      b.phone.includes(term);

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? b.active !== false
        : b.active === false;

    const matchesPlan =
      planFilter === 'all'
        ? true
        : planFilter === 'pro'
        ? b.plan === 'pro'
        : planFilter === 'trial'
        ? b.plan === 'trial' || !b.plan
        : planFilter === 'trial_expired'
        ? b.accountStatus === 'trial_expired'
        : planFilter === 'suspended'
        ? b.accountStatus === 'suspended' || b.active === false
        : true;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const totalCount = allBusinesses.length;
  const activeCount = allBusinesses.filter((b) => b.active !== false).length;
  const inactiveCount = totalCount - activeCount;

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

    if (!/^\d{6}$/.test(createForm.password)) {
      setFormError('Şifre tam 6 haneli bir rakam (PIN) olmalıdır (Örn: 123456).');
      return;
    }

    try {
      setIsSubmitting(true);
      await adminCreateBusiness({
        businessName: createForm.businessName.trim(),
        phone: createForm.phone.trim(),
        address: createForm.address.trim(),
        ownerName: createForm.ownerName.trim(),
        email: createForm.email.trim(),
        password: createForm.password,
      });

      setShowCreateModal(false);
      setCreateForm({
        businessName: '',
        phone: '',
        address: '',
        ownerName: '',
        email: '',
        password: '',
      });
    } catch (err: any) {
      setFormError(err?.message || 'İşletme oluşturulurken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit
  const openEditModal = (b: Business) => {
    setEditingBusiness(b);
    setEditForm({
      name: b.name,
      phone: b.phone,
      address: b.address,
      plan: b.plan || 'trial',
      accountStatus: b.accountStatus || (b.active === false ? 'suspended' : 'active'),
      active: b.active !== false,
      trialEndDate: b.trialEndDate ? b.trialEndDate.substring(0, 10) : '',
      proEndDate: b.proEndDate ? b.proEndDate.substring(0, 10) : '',
    });
    setFormError('');
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
      await adminUpdateBusiness(editingBusiness.id, {
        name: editForm.name.trim(),
        phone: editForm.phone.trim(),
        address: editForm.address.trim(),
        plan: editForm.plan,
        accountStatus: editForm.accountStatus,
        active: editForm.accountStatus !== 'suspended' && editForm.active,
        trialEndDate: editForm.trialEndDate ? new Date(editForm.trialEndDate).toISOString() : undefined,
        proEndDate: editForm.proEndDate ? new Date(editForm.proEndDate).toISOString() : undefined,
      });
      setEditingBusiness(null);
    } catch (err: any) {
      setFormError(err?.message || 'Güncelleme sırasında hata oluştu.');
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
    } catch (err: any) {
      alert(err?.message || 'İşletme silinirken hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              <Shield className="w-3 h-3 text-amber-700" />
              Sistem Yöneticisi
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            İşletme Yönetim Paneli
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Sisteme kayıtlı müşteri oto servislerini oluşturun, düzenleyin ve hesaplarını yönetin.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            id="btn-admin-add-business"
            onClick={() => {
              setFormError('');
              setShowCreateModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni İşletme Ekle</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Toplam İşletme</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Aktif Müşteriler</p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Pasif / Askıda</p>
            <p className="text-2xl font-extrabold text-rose-600 mt-1">{inactiveCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="İşletme adı, e-posta veya telefon ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Paket / Durum:</span>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => {
                setPlanFilter('all');
                setStatusFilter('all');
              }}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                planFilter === 'all' && statusFilter === 'all'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tümü ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setPlanFilter('pro')}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                planFilter === 'pro'
                  ? 'bg-white text-emerald-800 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              PRO
            </button>
            <button
              type="button"
              onClick={() => setPlanFilter('trial')}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                planFilter === 'trial'
                  ? 'bg-white text-blue-800 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Deneme (Trial)
            </button>
            <button
              type="button"
              onClick={() => setPlanFilter('trial_expired')}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                planFilter === 'trial_expired'
                  ? 'bg-white text-amber-800 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Süresi Doldu
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('inactive')}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === 'inactive'
                  ? 'bg-white text-rose-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Askıda ({inactiveCount})
            </button>
          </div>
        </div>
      </div>

      {/* Businesses Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium mt-3">İşletmeler yükleniyor...</p>
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="py-16 text-center px-4">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">İşletme Bulunamadı</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'all'
                ? 'Arama kriterlerinize uygun işletme bulunamadı.'
                : 'Henüz sisteme eklenmiş bir müşteri işletmesi bulunmuyor. Yukarıdaki butonu kullanarak ilk işletmeyi ekleyebilirsiniz.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">İşletme Adı</th>
                  <th className="py-3.5 px-4">Yetkili / Müşteri</th>
                  <th className="py-3.5 px-4">İletişim</th>
                  <th className="py-3.5 px-4">Paket & Durum</th>
                  <th className="py-3.5 px-4">Kayıt Tarihi</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredBusinesses.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Business Name */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{b.name}</p>
                          {b.address && (
                            <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span className="truncate">{b.address}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {b.ownerName || 'Yetkili'}
                        </p>
                        {b.ownerEmail && (
                          <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {b.ownerEmail}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <p className="font-mono text-slate-700 flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {b.phone || '-'}
                      </p>
                    </td>

                    {/* Plan & Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {b.plan === 'pro' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              PRO
                            </span>
                          ) : b.plan === 'trial' || !b.plan ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                              7G Deneme
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              Ücretsiz
                            </span>
                          )}

                          {b.accountStatus === 'trial_expired' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                              Deneme Bitti
                            </span>
                          ) : b.accountStatus === 'suspended' || b.active === false ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              Askıda
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Aktif
                            </span>
                          )}
                        </div>

                        {b.plan === 'trial' && b.trialEndDate && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            Deneme Bitiş: {new Date(b.trialEndDate).toLocaleDateString('tr-TR')}
                          </span>
                        )}
                        {b.plan === 'pro' && b.proEndDate && (
                          <span className="text-[10px] text-emerald-600 font-mono">
                            Pro Bitiş: {new Date(b.proEndDate).toLocaleDateString('tr-TR')}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(b.createdAt).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(b)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="İşletmeyi Düzenle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingBusiness(b)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="İşletmeyi Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE BUSINESS MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Yeni İşletme ve Hesap Oluştur</h3>
                  <p className="text-[11px] text-slate-500">
                    Müşteri işletmesini ve giriş hesabını oluşturun.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto space-y-4">
              {formError && (
                <div className="space-y-2">
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold">{formError}</span>
                      {formError.includes('yetkiniz') && (
                        <p className="mt-1 text-[11px] text-rose-600 font-normal leading-relaxed">
                          İşlemi gerçekleştirmek için sistem yöneticisi yetkisine sahip olmanız gerekmektedir.
                        </p>
                      )}
                      {formError.includes('zaten kayıtlı') && (
                        <p className="mt-1 text-[11px] text-rose-600 font-normal leading-relaxed">
                          Önceki denemeniz sırasında şifreniz oluşturulmuş olabilir. Aynı şifreyi girdiğiniz takdirde sistem işletme ve veritabanı kaydınızı otomatik tamamlayacaktır.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Section 1: Business Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  İşletme Bilgileri
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    İşletme / Servis Adı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Yıldız Oto Mekanik & Servis"
                    value={createForm.businessName}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, businessName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telefon Numarası *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 0532 123 45 67"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Adres / Konum
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Yeni Sanayi Sitesi 4. Blok No: 12"
                    value={createForm.address}
                    onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* Section 2: Owner Login Account */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Müşteri Giriş Hesabı
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Yetkili Adı Soyadı *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Örn: Ahmet Usta"
                      value={createForm.ownerName}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, ownerName: e.target.value })
                      }
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Müşteri E-posta Adresi (Giriş için) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="musteri@ornek.com"
                      value={createForm.email}
                      onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Müşteri Giriş Şifresi (6 Haneli Rakam) *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
                        setCreateForm((prev) => ({ ...prev, password: randomPin }));
                      }}
                      className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold underline underline-offset-2"
                    >
                      Rastgele 6 Haneli Şifre Üret
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      maxLength={6}
                      pattern="[0-9]*"
                      placeholder="Örn: 123456"
                      value={createForm.password}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setCreateForm({ ...createForm, password: val });
                      }}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono tracking-wider focus:outline-hidden focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Müşteri işletmesi bu 6 haneli rakamla sisteme giriş yapacaktır.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Oluşturuluyor...</span>
                    </>
                  ) : (
                    <span>İşletmeyi Kaydet</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT BUSINESS MODAL */}
      {editingBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">İşletmeyi Düzenle</h3>
              <button
                onClick={() => setEditingBusiness(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                  {formError}
                </div>
              )}

              {/* Quick Actions */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Hızlı Lisans ve Süre İşlemleri
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const nextYear = new Date();
                      nextYear.setFullYear(nextYear.getFullYear() + 1);
                      setEditForm({
                        ...editForm,
                        plan: 'pro',
                        accountStatus: 'active',
                        active: true,
                        proEndDate: nextYear.toISOString().substring(0, 10),
                      });
                    }}
                    className="p-2 text-left bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <span>⭐ 1 Yıl PRO Tanımla</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const nextMonth = new Date();
                      nextMonth.setDate(nextMonth.getDate() + 30);
                      setEditForm({
                        ...editForm,
                        plan: 'pro',
                        accountStatus: 'active',
                        active: true,
                        proEndDate: nextMonth.toISOString().substring(0, 10),
                      });
                    }}
                    className="p-2 text-left bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <span>⭐ 1 Ay PRO Tanımla</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const sevenDays = new Date();
                      sevenDays.setDate(sevenDays.getDate() + 7);
                      setEditForm({
                        ...editForm,
                        plan: 'trial',
                        accountStatus: 'active',
                        active: true,
                        trialEndDate: sevenDays.toISOString().substring(0, 10),
                      });
                    }}
                    className="p-2 text-left bg-white border border-blue-200 text-blue-800 hover:bg-blue-50 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <span>⏱ 7 Gün Deneme Ver</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditForm({
                        ...editForm,
                        accountStatus: 'trial_expired',
                      });
                    }}
                    className="p-2 text-left bg-white border border-amber-200 text-amber-900 hover:bg-amber-50 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <span>🚫 Denemeyi Bitir</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  İşletme Adı *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Telefon Numarası *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Adres
                </label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hesap Durumu
                  </label>
                  <select
                    value={editForm.accountStatus}
                    onChange={(e) => {
                      const val = e.target.value as 'active' | 'trial_expired' | 'suspended';
                      setEditForm({
                        ...editForm,
                        accountStatus: val,
                        active: val !== 'suspended',
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-emerald-600"
                  >
                    <option value="active">Aktif</option>
                    <option value="trial_expired">Deneme Süresi Doldu</option>
                    <option value="suspended">Askıda / Pasif</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Paket Türü
                  </label>
                  <select
                    value={editForm.plan}
                    onChange={(e) =>
                      setEditForm({ ...editForm, plan: e.target.value as 'free' | 'pro' | 'trial' })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-emerald-600"
                  >
                    <option value="trial">7 Günlük Deneme (trial)</option>
                    <option value="pro">PRO (pro)</option>
                    <option value="free">Ücretsiz (free)</option>
                  </select>
                </div>
              </div>

              {/* Date pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Deneme Bitiş Tarihi
                  </label>
                  <input
                    type="date"
                    value={editForm.trialEndDate}
                    onChange={(e) => setEditForm({ ...editForm, trialEndDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PRO Bitiş Tarihi
                  </label>
                  <input
                    type="date"
                    value={editForm.proEndDate}
                    onChange={(e) => setEditForm({ ...editForm, proEndDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-emerald-600 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBusiness(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Kaydediliyor...</span>
                    </>
                  ) : (
                    <span>Değişiklikleri Kaydet</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deletingBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-slate-200 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">İşletmeyi Sil</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              <strong>{deletingBusiness.name}</strong> işletmesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDeletingBusiness(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Siliniyor...</span>
                  </>
                ) : (
                  <span>Evet, Sil</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
