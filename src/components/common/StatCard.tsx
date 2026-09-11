import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id?: string;
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'emerald' | 'amber' | 'blue';
  onClick?: () => void;
  isActive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  onClick,
  isActive = false,
}) => {
  const variantStyles = {
    default: {
      border: isActive ? 'border-slate-400 ring-1 ring-slate-400' : 'border-slate-200/80',
      iconBg: 'bg-slate-100 text-slate-700',
      numberColor: 'text-slate-900',
    },
    emerald: {
      border: isActive ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200/80',
      iconBg: 'bg-emerald-50 text-emerald-700',
      numberColor: 'text-slate-900',
    },
    amber: {
      border: isActive ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-200/80',
      iconBg: 'bg-amber-50 text-amber-700',
      numberColor: 'text-slate-900',
    },
    blue: {
      border: isActive ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200/80',
      iconBg: 'bg-blue-50 text-blue-700',
      numberColor: 'text-slate-900',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-xl border ${style.border} p-4 sm:p-5 shadow-xs transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-sm' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${style.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${style.numberColor}`}>
          {value}
        </span>
        {subtitle && <span className="text-xs text-slate-400">{subtitle}</span>}
      </div>
    </div>
  );
};
