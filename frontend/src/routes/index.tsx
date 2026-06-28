import { Navigate, Route, Routes } from 'react-router-dom';

import AssessmentPage from '../pages/Assessment/AssessmentPage';
import BootPage from '../pages/Boot/BootPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import IdentityPage from '../pages/Identity/IdentityPage';
import LandingPage from '../pages/Landing/LandingPage';
import NotFoundPage from '../pages/NotFound/NotFoundPage';
import PermissionPage from '../pages/Permission/PermissionPage';
import ReportPage from '../pages/Report/ReportPage';
import SettingsPage from '../pages/Settings/SettingsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/boot" element={<BootPage />} />
      <Route path="/identity" element={<IdentityPage />} />
      <Route path="/permission" element={<PermissionPage />} />
      <Route path="/assessment" element={<AssessmentPage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
}
