import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { VehicleTable } from '../components/vehicles/VehicleTable';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { EmptyState } from '../components/common/EmptyState';
import { VehicleListSkeleton } from '../components/common/LoadingSkeleton';
import { STATUS_LIST } from '../utils/statusConstants';
import { VehicleStatus } from '../types';
import { Search, Plus, Filter, Car, X } from 'lucide-react';

export const VehiclesPage: React.FC = () => {
  const navigate = useNavigate();
  const { vehicles, isLoading } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | VehicleStatus>('all');

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchStatus =
        statusFilter === 'all' || v.currentStatus === statusFilter;
      if (!matchStatus) return false;

      if (!search.trim()) return true;
      const term = search.toLowerCase().trim();
      return (
        v.plate.toLowerCase().includes(term) ||
        v.customerName.toLowerCase().includes(term) ||
        v.customerPhone.includes(term) ||
        v.brand.toLowerCase().includes(term) ||
        v.model.toLowerCase().includes(term)
      );
    });
  }, [vehicles, search, statusFilter]);

  if (isLoading) {
    return <VehicleListSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Araçlar</h2>
          <p className="text-xs text-slate-500 mt-1">
            Servisteki araçları yönetin ve durumlarını takip edin.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/vehicles/new')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 active:bg-emerald-700 rounded-xl transition-colors shadow-md shadow-emerald-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Yeni Araç Ekle
        </button>
      </div>

      {/* Filter and Search Controls Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="search-vehicles-input"
              placeholder="Plaka veya müşteri ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-500 transition-colors focus:outline-hidden focus:border-teal-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Dropdown (on smaller viewports) */}
          <div className="md:hidden flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'all' | VehicleStatus)
              }
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2 px-3 focus:outline-hidden focus:border-teal-500"
            >
              <option value="all">Tüm Durumlar ({vehicles.length})</option>
              {STATUS_LIST.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label} (
                  {vehicles.filter((v) => v.currentStatus === s.key).length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Pills (Desktop) */}
        <div className="hidden md:flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-teal-600 text-slate-900 shadow-md shadow-emerald-600/30'
                : 'bg-slate-100 text-slate-500 hover:text-white hover:bg-slate-200'
            }`}
          >
            Tümü ({vehicles.length})
          </button>

          {STATUS_LIST.map((status) => {
            const count = vehicles.filter(
              (v) => v.currentStatus === status.key
            ).length;
            const isSelected = statusFilter === status.key;
            return (
              <button
                key={status.key}
                type="button"
                onClick={() => setStatusFilter(isSelected ? 'all' : status.key)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-teal-600 text-slate-900 shadow-md shadow-emerald-600/30'
                    : 'bg-slate-100 text-slate-500 hover:text-white hover:bg-slate-200'
                }`}
              >
                <span>{status.shortLabel}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? 'bg-teal-100 text-emerald-200'
                      : 'bg-slate-50 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results presentation */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {filteredVehicles.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <EmptyState
              icon={Car}
              title="Araç bulunamadı"
              description={
                search || statusFilter !== 'all'
                  ? 'Filtreleme kriterlerine uygun araç kaydı bulunamadı. Filtreleri temizleyebilirsiniz.'
                  : 'Servisteki durumunu takip etmek için ilk aracınızı ekleyin.'
              }
              actionText={
                search || statusFilter !== 'all'
                  ? 'Filtreleri Temizle'
                  : 'Yeni Araç Ekle'
              }
              onAction={
                search || statusFilter !== 'all'
                  ? () => {
                      setSearch('');
                      setStatusFilter('all');
                    }
                  : () => navigate('/vehicles/new')
              }
            />
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block">
              <VehicleTable vehicles={filteredVehicles} />
            </div>

            {/* Mobile Cards */}
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
