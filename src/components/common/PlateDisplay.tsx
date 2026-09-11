import React from 'react';

interface PlateDisplayProps {
  plate: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PlateDisplay: React.FC<PlateDisplayProps> = ({
  plate,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-xs h-6 px-1.5 gap-1',
    md: 'text-sm h-8 px-2 gap-1.5',
    lg: 'text-base h-10 px-2.5 gap-2 font-bold',
  };

  const trBadgeSizes = {
    sm: 'text-[9px] px-1 py-0.5',
    md: 'text-[10px] px-1.5 py-0.5',
    lg: 'text-xs px-2 py-1',
  };

  return (
    <span
      className={`inline-flex items-center bg-white border-2 border-slate-900 rounded font-mono font-bold tracking-wider text-slate-900 shadow-xs select-none ${sizeClasses[size]} ${className}`}
      title={`Plaka: ${plate}`}
    >
      <span
        className={`bg-blue-700 text-white font-sans font-black flex items-center justify-center rounded-xs leading-none ${trBadgeSizes[size]}`}
      >
        TR
      </span>
      <span className="uppercase whitespace-nowrap">{plate}</span>
    </span>
  );
};
