import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly = false }) => {
  const { isAuthenticated, isAdmin, isLoading, planStatus } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium mt-3">Oturum kontrol ediliyor...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only route guard
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Owner-only routes guard: if admin visits regular owner pages, redirect to /admin
  if (!adminOnly && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Subscription / Plan trial guard for owner routes: redirect to /paketler if trial expired or suspended
  if (!adminOnly && !isAdmin && !planStatus.canAccessDashboard) {
    return <Navigate to="/paketler" replace />;
  }

  return <Outlet />;
};
