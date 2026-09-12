import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Vehicle } from '../../types';
import { PlateDisplay } from '../common/PlateDisplay';
import { StatusBadge } from '../common/StatusBadge';
import { formatTimeAgo } from '../../utils/statusConstants';
import { Eye, Edit2, QrCode, Clock } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { useApp } from '../../context/AppContext';

interface VehicleTableProps {
  vehicles: Vehicle[];
}

export const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles }) => {
  const navigate = useNavigate();
  const { openQRModal } = useApp();

  const handleWhatsAppNotify = (v: Vehicle, e: React.MouseEvent) => {
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
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-[#070d19] text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            <th className="py-3 px-4">Plaka</th>
            <th className="py-3 px-4">Araç</th>
            <th className="py-3 px-4">Müşteri</th>
            <th className="py-3 px-4">Durum</th>
            <th className="py-3 px-4">Tahmini Teslim</th>
            <th className="py-3 px-4 hidden md:table-cell">Son Güncelleme</th>
            <th className="py-3 px-4 text-right">İşlemler</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 font-normal text-slate-200">
          {vehicles.map((v) => (
            <tr
              key={v.id}
              onClick={() => navigate(`/vehicles/${v.id}`)}
              className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
            >
              {/* Plaka */}
              <td className="py-3.5 px-4 whitespace-nowrap">
                <PlateDisplay plate={v.plate} size="sm" />
              </td>

              {/* Araç */}
              <td className="py-3.5 px-4 whitespace-nowrap">
                <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {v.brand} {v.model}
                </div>
                {v.year && (
                  <div className="text-[11px] text-slate-500 font-mono">
                    {v.year}
                  </div>
                )}
              </td>

              {/* Müşteri */}
              <td className="py-3.5 px-4 whitespace-nowrap">
                <div className="font-medium text-slate-200">
                  {v.customerName || '-'}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {v.customerPhone}
                </div>
              </td>

              {/* Durum */}
              <td className="py-3.5 px-4 whitespace-nowrap">
                <StatusBadge status={v.currentStatus} size="sm" />
              </td>

              {/* Tahmini Teslim */}
              <td className="py-3.5 px-4 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{v.estimatedDelivery || 'Belirtilmedi'}</span>
                </div>
              </td>

              {/* Son Güncelleme */}
              <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-slate-400 hidden md:table-cell font-mono">
                {formatTimeAgo(v.updatedAt)}
              </td>

              {/* Actions */}
              <td className="py-3.5 px-4 whitespace-nowrap text-right">
                <div
                  className="flex items-center justify-end gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => openQRModal(v)}
                    className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="QR Kodu Göster"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleWhatsAppNotify(v, e)}
                    className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-950/60 rounded-lg transition-colors"
                    title="WhatsApp'tan Bildir"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/vehicles/${v.id}`)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Detay Görüntüle"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/vehicles/${v.id}/edit`)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Düzenle"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
