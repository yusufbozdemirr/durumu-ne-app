import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BrandLogo } from '../common/BrandLogo';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Car,
  PlusCircle,
  Settings,
  LogOut,
  Building2,
  User as UserIcon,
  Shield,
  X,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { business, userProfile, isAdmin, logout } = useApp();
  const navigate = useNavigate();

  // Admin Navigation Items
  const adminNavItems = [
    {
      label: 'İşletme Yönetimi',
      path: '/admin',
      icon: Building2,
      id: 'nav-admin-businesses',
    },
  ];

  // Owner Navigation Items
  const ownerNavItems = [
    {
      label: 'Genel Bakış',
      path: '/dashboard',
      icon: LayoutDashboard,
      id: 'nav-dashboard',
    },
    {
      label: 'Araçlar',
      path: '/vehicles',
      icon: Car,
      id: 'nav-vehicles',
    },
    {
      label: 'Yeni Araç',
      path: '/vehicles/new',
      icon: PlusCircle,
      id: 'nav-new-vehicle',
    },
    {
      label: 'İşletme Ayarları',
      path: '/settings',
      icon: Settings,
      id: 'nav-settings',
    },
  ];

  const navItems = isAdmin ? adminNavItems : ownerNavItems;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 h-full bg-white border-r border-slate-200/80 flex flex-col justify-between select-none">
      {/* Top section: Logo & Mobile Close */}
      <div>
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <BrandLogo size="md" />
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                id={item.id}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: Business & User profile & Logout */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        {/* Profile Card */}
        {isAdmin ? (
          <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-amber-950 truncate">Sistem Yöneticisi</p>
              <p className="text-[11px] text-amber-700 truncate font-mono">
                {userProfile?.email || 'admin'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-xs font-bold text-slate-800 truncate"
                title={business?.name || 'İşletme'}
              >
                {business?.name || 'İşletme'}
              </p>
              <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                <UserIcon className="w-3 h-3 inline text-slate-400" />
                {userProfile?.name || 'Yetkili'}
              </p>
            </div>
          </div>
        )}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          id="btn-logout"
          type="button"
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50/70 rounded-lg transition-colors"
        >
          <span className="flex items-center gap-2">
            <LogOut className="w-3.5 h-3.5" />
            Çıkış Yap
          </span>
          <span className="text-[10px] text-slate-400">Oturumu Kapat</span>
        </button>
      </div>
    </aside>
  );
};
