import React from 'react';

export const SkeletonBox: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-slate-200/70 rounded-md animate-pulse ${className}`} />
);

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Header skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <SkeletonBox className="h-7 w-48 mb-2" />
          <SkeletonBox className="h-4 w-72" />
        </div>
        <SkeletonBox className="h-10 w-36 rounded-lg" />
      </div>

      {/* 4 Stat cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex justify-between items-center">
              <SkeletonBox className="h-4 w-24" />
              <SkeletonBox className="h-8 w-8 rounded-lg" />
            </div>
            <SkeletonBox className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
        <div className="flex justify-between items-center">
          <SkeletonBox className="h-5 w-36" />
          <SkeletonBox className="h-8 w-48 rounded-lg" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-50 rounded-lg flex items-center px-4 gap-4">
              <SkeletonBox className="h-6 w-24" />
              <SkeletonBox className="h-4 w-32" />
              <SkeletonBox className="h-4 w-28" />
              <SkeletonBox className="h-6 w-24 rounded-full ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const VehicleListSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SkeletonBox className="h-7 w-40 mb-2" />
          <SkeletonBox className="h-4 w-64" />
        </div>
        <SkeletonBox className="h-10 w-36 rounded-lg" />
      </div>

      <div className="flex gap-3">
        <SkeletonBox className="h-10 flex-1 rounded-lg" />
        <SkeletonBox className="h-10 w-44 rounded-lg" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 p-4 space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-14 bg-slate-50 rounded-lg flex items-center px-4 gap-4">
            <SkeletonBox className="h-6 w-28" />
            <SkeletonBox className="h-4 w-36" />
            <SkeletonBox className="h-4 w-32 hidden md:block" />
            <SkeletonBox className="h-6 w-28 rounded-full ml-auto" />
            <SkeletonBox className="h-8 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const VehicleDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <SkeletonBox className="h-9 w-9 rounded-lg" />
        <SkeletonBox className="h-8 w-36" />
        <SkeletonBox className="h-8 w-48" />
        <SkeletonBox className="h-7 w-28 rounded-full ml-auto" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 space-y-4">
            <SkeletonBox className="h-5 w-40" />
            <div className="grid grid-cols-2 gap-4">
              <SkeletonBox className="h-16 rounded-lg" />
              <SkeletonBox className="h-16 rounded-lg" />
              <SkeletonBox className="h-16 rounded-lg" />
              <SkeletonBox className="h-16 rounded-lg" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 space-y-4">
            <SkeletonBox className="h-5 w-44" />
            <SkeletonBox className="h-48 rounded-lg" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 space-y-4">
            <SkeletonBox className="h-5 w-36" />
            <SkeletonBox className="h-10 rounded-lg" />
            <SkeletonBox className="h-24 rounded-lg" />
            <SkeletonBox className="h-10 rounded-lg" />
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 space-y-3">
            <SkeletonBox className="h-10 rounded-lg" />
            <SkeletonBox className="h-10 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};
