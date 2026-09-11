import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Plus, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TopbarProps {
  onToggleMobileSidebar: () => void;
  title?: string;
  subtitle?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleMobileSidebar,
  title,
  subtitle,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useApp();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Mobile hamburger & Titles */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Menüyü Aç"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
              {isAdmin ? 'Yönetici Paneli' : title || 'DURUMU NE?'}
            </h1>
            {isAdmin && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                <Shield className="w-3 h-3" />
                ADMIN
              </span>
            )}
          </div>
          {subtitle && !isAdmin && (
            <p className="text-xs text-slate-500 hidden sm:block truncate -mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* For Owner: "Yeni Araç" button */}
        {!isAdmin && location.pathname !== '/vehicles/new' && (
          <button
            type="button"
            id="topbar-btn-add-vehicle"
            onClick={() => navigate('/vehicles/new')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Yeni Araç Ekle</span>
            <span className="sm:hidden">Yeni</span>
          </button>
        )}
      </div>
    </header>
  );
};
