import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Vehicle } from '../../types';
import { PlateDisplay } from './PlateDisplay';
import { X, Copy, Check, Download, ExternalLink } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { useApp } from '../../context/AppContext';

interface QRModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ vehicle, onClose }) => {
  const { business, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  if (!vehicle) return null;

  const token = vehicle.publicToken || (vehicle as any).token;
  const origin = window.location.origin;
  const trackingPath = `/takip/${token}`;
  const fullTrackingUrl = `${origin}${trackingPath}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullTrackingUrl);
      setCopied(true);
      showToast('Takip bağlantısı panoya kopyalandı.', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Kopyalama başarısız oldu.', 'error');
    }
  };

  const handleDownloadQR = () => {
    try {
      const svg = qrRef.current?.querySelector('svg');
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      canvas.width = 600;
      canvas.height = 600;

      img.onload = () => {
        if (!ctx) return;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 50, 50, 500, 500);

        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `DURUMU_NE_${vehicle.plate.replace(/\s+/g, '_')}_QR.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
        showToast('QR kod görseli indirildi.', 'success');
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (e) {
      console.error('Download error', e);
      showToast('QR kod indirilirken hata oluştu.', 'error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
    >
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 id="qr-modal-title" className="text-base font-bold text-slate-900">
              Müşteri QR Takip Kodu
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Müşteriniz bu kodu tarayarak anlık durumu görebilir.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center">
          {/* Vehicle Info */}
          <div className="flex flex-col items-center justify-center mb-4">
            <PlateDisplay plate={vehicle.plate} size="lg" />
            <div className="mt-2 text-sm font-semibold text-slate-900">
              {vehicle.brand} {vehicle.model}
            </div>
            {vehicle.customerName && (
              <div className="text-xs text-slate-500">{vehicle.customerName}</div>
            )}
          </div>

          {/* QR Code Container */}
          <div
            ref={qrRef}
            className="inline-flex p-4 bg-white rounded-2xl border-2 border-emerald-100 shadow-xs mb-4"
          >
            <QRCodeSVG
              value={fullTrackingUrl}
              size={200}
              level="H"
              includeMargin={false}
              fgColor="#0f172a"
            />
          </div>

          <div className="text-[11px] text-slate-500 font-medium mb-4">
            {business?.name || 'DURUMU NE?'} • Giriş Yapılması Gerekmez
          </div>

          {/* Tracking URL Input & Copy */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center gap-2 text-left mb-6">
            <span className="text-xs font-mono text-slate-600 truncate flex-1 select-all pl-1">
              {fullTrackingUrl}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Kopyalandı
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Kopyala
                </>
              )}
            </button>
          </div>

          {/* WhatsApp Share Button */}
          <button
            type="button"
            onClick={() => {
              const text = encodeURIComponent(
                `Merhaba Sayın ${vehicle.customerName || 'Müşterimiz'},\n${vehicle.plate} plakalı ${vehicle.brand} ${vehicle.model} aracınızın servis durumunu aşağıdaki bağlantıdan anlık olarak takip edebilirsiniz:\n${fullTrackingUrl}`
              );
              let phone = vehicle.customerPhone?.replace(/\D/g, '') || '';
              if (phone.startsWith('0')) phone = phone.slice(1);
              if (phone && !phone.startsWith('90')) phone = `90${phone}`;
              const waUrl = phone
                ? `https://wa.me/${phone}?text=${text}`
                : `https://wa.me/?text=${text}`;
              window.open(waUrl, '_blank');
            }}
            className="w-full mb-3 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-[#25D366] text-white hover:bg-[#20bd5a] active:bg-[#1da850] transition-colors shadow-xs"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>Müşteriye WhatsApp ile Gönder</span>
          </button>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleDownloadQR}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
              QR Kodunu İndir
            </button>
            <a
              href={trackingPath}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Sayfayı Aç
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
