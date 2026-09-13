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
      border: isActive
        ? 'border-slate-500 ring-1 ring-slate-500'
        : 'border-slate-200',
      iconBg: 'bg-slate-100 text-slate-600 border border-slate-200',
      numberColor: 'text-slate-900',
    },
    emerald: {
      border: isActive
        ? 'border-teal-500 ring-1 ring-emerald-500'
        : 'border-slate-200',
      iconBg: 'bg-teal-50/80 text-teal-600 border border-teal-200/60',
      numberColor: 'text-slate-900',
    },
    amber: {
      border: isActive
        ? 'border-amber-500 ring-1 ring-amber-500'
        : 'border-slate-200',
      iconBg: 'bg-amber-950/80 text-amber-400 border border-amber-800/60',
      numberColor: 'text-slate-900',
    },
    blue: {
      border: isActive
        ? 'border-blue-500 ring-1 ring-blue-500'
        : 'border-slate-200',
      iconBg: 'bg-blue-950/80 text-blue-400 border border-blue-800/60',
      numberColor: 'text-slate-900',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-xl border ${style.border} p-4 sm:p-5 shadow-lg transition-all duration-150 ${
        onClick
          ? 'cursor-pointer hover:border-slate-200 hover:bg-[#0e1832]'
          : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${style.iconBg}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${style.numberColor}`}
        >
          {value}
        </span>
        {subtitle && (
          <span className="text-xs text-slate-500">{subtitle}</span>
        )}
      </div>
    </div>
  );
};
