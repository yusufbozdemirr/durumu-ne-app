import { VehicleStatus, StatusConfig } from '../types';

export const STATUS_LIST: StatusConfig[] = [
  {
    key: 'received',
    label: 'Araç Kabul Edildi',
    shortLabel: 'Kabul Edildi',
    stepNumber: 1,
    description: 'Araç servise giriş yaptı ve ön kayıt oluşturuldu.',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-800',
    badgeBorder: 'border-slate-200',
    dotColor: 'bg-slate-500',
  },
  {
    key: 'diagnosis',
    label: 'Arıza Tespiti',
    shortLabel: 'Arıza Tespiti',
    stepNumber: 2,
    description: 'Teknisyenlerimiz detaylı ekspertiz ve arıza tespitini gerçekleştiriyor.',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    dotColor: 'bg-blue-500',
  },
  {
    key: 'waiting_parts',
    label: 'Parça Bekleniyor',
    shortLabel: 'Parça Bekleniyor',
    stepNumber: 3,
    description: 'Gerekli orijinal/yedek parçaların tedarik süreci devam ediyor.',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    dotColor: 'bg-amber-500',
  },
  {
    key: 'repair',
    label: 'İşlem Yapılıyor',
    shortLabel: 'İşlemde',
    stepNumber: 4,
    description: 'Aracınızın tamir, bakım ve montaj işlemleri usta tezgahında devam ediyor.',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
    dotColor: 'bg-emerald-600',
  },
  {
    key: 'testing',
    label: 'Test Aşamasında',
    shortLabel: 'Test',
    stepNumber: 5,
    description: 'Tamir sonrası yol ve elektronik sistem testleri yapılıyor.',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-800',
    badgeBorder: 'border-indigo-200',
    dotColor: 'bg-indigo-500',
  },
  {
    key: 'ready',
    label: 'Araç Hazır',
    shortLabel: 'Hazır',
    stepNumber: 6,
    description: 'Tüm işlemler ve son kontroller tamamlandı, aracınızı teslim alabilirsiniz.',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900',
    badgeBorder: 'border-emerald-300',
    dotColor: 'bg-emerald-600',
  },
];

export const STATUS_MAP: Record<VehicleStatus, StatusConfig> = STATUS_LIST.reduce(
  (acc, item) => {
    acc[item.key] = item;
    return acc;
  },
  {} as Record<VehicleStatus, StatusConfig>
);

export function getStatusConfig(status: VehicleStatus): StatusConfig {
  return (
    STATUS_MAP[status] || {
      key: status,
      label: status,
      shortLabel: status,
      stepNumber: 0,
      description: '',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-700',
      badgeBorder: 'border-slate-200',
      dotColor: 'bg-slate-400',
    }
  );
}

export function formatTimeAgo(dateString?: string): string {
  if (!dateString) return 'Bilinmiyor';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMin < 1) return 'Az önce';
    if (diffMin < 60) return `${diffMin} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays === 1) return 'Dün';
    return `${diffDays} gün önce`;
  } catch {
    return dateString;
  }
}
