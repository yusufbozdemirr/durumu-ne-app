import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Vehicle } from '../../types';
import { PlateDisplay } from '../common/PlateDisplay';
import { StatusBadge } from '../common/StatusBadge';
import { Clock, QrCode, ChevronRight } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { useApp } from '../../context/AppContext';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle: v }) => {
  const navigate = useNavigate();
  const { openQRModal } = useApp();

  const handleWhatsAppNotify = (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = v.publicToken || (v as any).token;
    const origin = window.location.origin;
    const trackingUrl = `${origin}/takip/${token}`;
    const cleanPhone = v.customerPhone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('90')
      ? cleanPhone
      : cleanPhone.startsWith('0')
      ? `90${cleanPhone.substring(1)}`
      : `90${cleanPhone}`;

    const text = `Merhaba, aracınızın servis durumunu buradan takip edebilirsiniz: ${trackingUrl}`;
    window.open(
      `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  return (
    <div
      onClick={() => navigate(`/vehicles/${v.id}`)}
      className="bg-[#0c152a] rounded-xl border border-slate-800 p-4 shadow-md active:bg-[#0e1832] transition-colors cursor-pointer space-y-3"
    >
      {/* Top row: Plate and Status */}
      <div className="flex items-center justify-between gap-2">
        <PlateDisplay plate={v.plate} size="sm" />
        <StatusBadge status={v.currentStatus} size="sm" />
      </div>

      {/* Middle row: Vehicle brand/model and customer */}
      <div>
        <h4 className="text-sm font-bold text-white">
          {v.brand} {v.model}
        </h4>
        <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
          <span>{v.customerName || 'Müşteri belirtilmedi'}</span>
          <span className="font-mono text-slate-300">{v.customerPhone}</span>
        </div>
      </div>

      {/* Description preview */}
      {v.serviceDescription && (
        <p className="text-xs text-slate-300 line-clamp-1 bg-[#070d19] rounded-lg p-2 border border-slate-800">
          {v.serviceDescription}
        </p>
      )}

      {/* Bottom info & actions */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-slate-400 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{v.estimatedDelivery || 'Teslim tarihi belirtilmedi'}</span>
        </div>

        <div
          className="flex items-center gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => openQRModal(v)}
            className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="QR Kod"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleWhatsAppNotify}
            className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-950/60 rounded-lg transition-colors"
            title="WhatsApp Bildir"
          >
            <WhatsAppIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate(`/vehicles/${v.id}`)}
            className="p-2 text-slate-400 hover:text-white rounded-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
