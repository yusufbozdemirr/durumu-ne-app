import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { AddVehiclePage } from './pages/AddVehiclePage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { EditVehiclePage } from './pages/EditVehiclePage';
import { TrackVehiclePage } from './pages/TrackVehiclePage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminPage } from './pages/AdminPage';
import { LandingPage } from './pages/LandingPage';
import { PackagesPage } from './pages/PackagesPage';
import { WelcomeRegisterPage } from './pages/WelcomeRegisterPage';
import { TrialExpiredPage } from './pages/TrialExpiredPage';
import { KvkkPage } from './pages/legal/KvkkPage';
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicyPage';
import { CookiePolicyPage } from './pages/legal/CookiePolicyPage';
import { TermsPage } from './pages/legal/TermsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Product Showcase at Root Domain */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/tanitim" element={<LandingPage />} />

          {/* Public customer tracking routes (NO authentication required) */}
          <Route path="/takip/:publicToken" element={<TrackVehiclePage />} />
          <Route path="/takip/:token" element={<TrackVehiclePage />} />
          <Route path="/track/:token" element={<TrackVehiclePage />} />

          {/* Public SaaS & Pricing pages */}
          <Route path="/paketler" element={<PackagesPage />} />
          <Route path="/hosgeldiniz" element={<WelcomeRegisterPage />} />
          <Route path="/kayit" element={<WelcomeRegisterPage />} />
          <Route path="/register" element={<WelcomeRegisterPage />} />

          {/* Legal / Policy pages */}
          <Route path="/kvkk" element={<KvkkPage />} />
          <Route path="/gizlilik-politikasi" element={<PrivacyPolicyPage />} />
          <Route path="/cerez-politikasi" element={<CookiePolicyPage />} />
          <Route path="/kullanim-kosullari" element={<TermsPage />} />
          <Route path="/kullanim-sartlari" element={<TermsPage />} />

          {/* Authentication screens */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/deneme-suresi-doldu" element={<TrialExpiredPage />} />
          <Route path="/deneme-doldu" element={<TrialExpiredPage />} />

          {/* Protected Admin Routes (Only Admin UID) */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route element={<AppLayout />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>

          {/* Protected Business Owner SaaS routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/vehicles/new" element={<AddVehiclePage />} />
              <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
              <Route path="/vehicles/:id/edit" element={<EditVehiclePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
