import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { QRModal } from '../common/QRModal';
import { ToastContainer } from '../common/ToastContainer';
import { useApp } from '../../context/AppContext';

export const AppLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { qrModalVehicle, closeQRModal, business } = useApp();
  const location = useLocation();

  // Determine topbar titles based on path
  const getHeaderInfo = () => {
    const path = location.pathname;
    if (path === '/admin') {
      return {
        title: 'İşletme Yönetimi',
        subtitle: 'Müşteri işletmelerini ve yetkili hesaplarını yönetin.',
      };
    }
    if (path === '/dashboard') {
      return {
        title: business?.name || 'Genel Bakış',
        subtitle: business?.address || 'Servis ve araç durum özeti',
      };
    }
    if (path === '/vehicles') {
      return {
        title: 'Araçlar',
        subtitle: 'Servisteki araçları yönetin ve durumlarını takip edin.',
      };
    }
    if (path === '/vehicles/new') {
      return {
        title: 'Yeni Araç Kabul',
        subtitle: 'Yeni araç servis kaydı ve müşteri takip formu oluşturun.',
      };
    }
    if (path.startsWith('/vehicles/') && path.endsWith('/edit')) {
      return {
        title: 'Aracı Düzenle',
        subtitle: 'Araç ve müşteri kayıt bilgilerini güncelleyin.',
      };
    }
    if (path.startsWith('/vehicles/')) {
      return {
        title: 'Araç Detayı',
        subtitle: 'Canlı durum takibi ve aşama güncelleme paneli.',
      };
    }
    if (path === '/settings') {
      return {
        title: 'Ayarlar',
        subtitle: 'İşletme, hesap ve bildirim tercihleri.',
      };
    }
    return { title: 'DURUMU NE?', subtitle: 'Araç Takip Sistemi' };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen bg-[#070d19] flex text-slate-100">
      {/* Desktop Sidebar (Fixed Left) */}
      <div className="hidden lg:block w-64 h-screen sticky top-0 shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden animate-in fade-in duration-150"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="w-64 h-full bg-[#0c152a] animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global QR Code Modal */}
      <QRModal vehicle={qrModalVehicle} onClose={closeQRModal} />

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};
