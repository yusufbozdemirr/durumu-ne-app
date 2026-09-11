import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showBadge = false,
  className = '',
}) => {
  const heightClasses = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-10 sm:h-12',
  };

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <img
        src="/logo.png"
        alt="Logo"
        id="app-brand-logo-img"
        className={`${heightClasses[size]} w-auto object-contain shrink-0`}
      />
      {showBadge && (
        <span className="font-mono text-[9px] px-1.5 py-0.5 font-bold rounded bg-emerald-50 text-emerald-800 border border-emerald-200/60 shrink-0">
          PRO
        </span>
      )}
    </div>
  );
};
