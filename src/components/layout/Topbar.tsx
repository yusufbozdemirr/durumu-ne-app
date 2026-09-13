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
    <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Mobile hamburger & Titles */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
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
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-400 border border-amber-800">
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 active:bg-emerald-700 rounded-xl transition-colors shadow-md shadow-emerald-600/20"
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
