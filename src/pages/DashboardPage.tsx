import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/common/StatCard';
import { VehicleTable } from '../components/vehicles/VehicleTable';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { EmptyState } from '../components/common/EmptyState';
import { DashboardSkeleton } from '../components/common/LoadingSkeleton';
import { TrialReminderModal } from '../components/common/TrialReminderModal';
import { TrialWarningBanner } from '../components/common/TrialWarningBanner';
import { OnboardingCard } from '../components/dashboard/OnboardingCard';
import {
  Car,
  Package,
  Wrench,
  CheckCircle2,
  Plus,
  ArrowRight,
  Search,
} from 'lucide-react';
import { VehicleStatus } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { vehicles, isLoading, business } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | VehicleStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Live counts based on 6-status system
  const activeCount = vehicles.length;
  const waitingPartsCount = vehicles.filter(
    (v) => v.currentStatus === 'waiting_parts'
  ).length;
  const inProgressCount = vehicles.filter(
    (v) => v.currentStatus === 'repair' || v.currentStatus === 'diagnosis'
  ).length;
  const readyCount = vehicles.filter((v) => v.currentStatus === 'ready').length;

  // Filter vehicles
  const filteredVehicles = vehicles
    .filter((v) => {
      if (selectedFilter !== 'all' && v.currentStatus !== selectedFilter)
        return false;
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        v.plate.toLowerCase().includes(term) ||
        (v.customerName && v.customerName.toLowerCase().includes(term)) ||
        v.customerPhone.includes(term) ||
        v.brand.toLowerCase().includes(term) ||
        v.model.toLowerCase().includes(term)
      );
    })
    .slice(0, 8); // show recent 8 on dashboard

  return (
    <div className="space-y-6">
      {/* 7-Day Trial Reminder Modal Dialog (Pops up on dashboard entry) */}
      <TrialReminderModal />

      {/* Trial Expiration Warning Banner (For last 2 days) */}
      <TrialWarningBanner />

      {/* New User First-Time Onboarding Card */}
      <OnboardingCard />

      {/* Top Welcome / Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a1122] p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {business?.name || 'Servis Paneli'}
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              Canlı Servis Takibi
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            <span className="font-semibold text-slate-300">
              {business?.name || 'Oto Servis'}
            </span>{' '}
            servis atölyesindeki araçların güncel aşamaları.
          </p>
        </div>

        <button
          type="button"
          id="dashboard-btn-add-vehicle"
          onClick={() => navigate('/vehicles/new')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl transition-colors shadow-md shadow-emerald-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Araç Ekle</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-card-active"
          title="Toplam Araçlar"
          value={activeCount}
          subtitle="serviste kayıtlı"
          icon={Car}
          variant="default"
          isActive={selectedFilter === 'all'}
          onClick={() => setSelectedFilter('all')}
        />
        <StatCard
          id="stat-card-parts"
          title="Parça Bekleyen"
          value={waitingPartsCount}
          subtitle="tedarik aşamasında"
          icon={Package}
          variant="amber"
          isActive={selectedFilter === 'waiting_parts'}
          onClick={() =>
            setSelectedFilter(
              selectedFilter === 'waiting_parts' ? 'all' : 'waiting_parts'
            )
          }
        />
        <StatCard
          id="stat-card-progress"
          title="Tamir & İşlemde"
          value={inProgressCount}
          subtitle="usta tezgahında"
          icon={Wrench}
          variant="blue"
          isActive={selectedFilter === 'repair'}
          onClick={() =>
            setSelectedFilter(
              selectedFilter === 'repair' ? 'all' : 'repair'
            )
          }
        />
        <StatCard
          id="stat-card-ready"
          title="Teslime Hazır"
          value={readyCount}
          subtitle="teslim bekliyor"
          icon={CheckCircle2}
          variant="emerald"
          isActive={selectedFilter === 'ready'}
          onClick={() =>
            setSelectedFilter(
              selectedFilter === 'ready' ? 'all' : 'ready'
            )
          }
        />
      </div>

      {/* "Son Araçlar" Section */}
      <div className="bg-[#0c152a] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Son Araçlar</h3>
            <span className="text-xs text-slate-400 font-medium">
              ({filteredVehicles.length} kayıt)
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Plaka veya müşteri ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-[#070d19] border border-slate-700 rounded-xl w-44 sm:w-56 text-white placeholder:text-slate-500 transition-colors focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* View all link */}
            <button
              type="button"
              onClick={() => navigate('/vehicles')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline px-2 py-1 cursor-pointer"
            >
              <span>Tümünü Gör</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content list / Table */}
        {filteredVehicles.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <EmptyState
              icon={Car}
              title="Kayıtlı araç bulunamadı"
              description={
                searchTerm
                  ? 'Arama kriterlerinize uygun araç kaydı eşleşmedi.'
                  : 'Servisteki araç durumlarını takip etmek için ilk aracınızı ekleyin.'
              }
              actionText="Yeni Araç Ekle"
              onAction={() => navigate('/vehicles/new')}
            />
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block">
              <VehicleTable vehicles={filteredVehicles} />
            </div>

            {/* Mobile Card Grid */}
            <div className="sm:hidden p-4 space-y-3">
              {filteredVehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
