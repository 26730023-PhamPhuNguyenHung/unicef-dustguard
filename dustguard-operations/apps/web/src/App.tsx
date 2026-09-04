import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CaseInboxPage } from './pages/CaseInboxPage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { LegalWorkspacePage } from './pages/LegalWorkspacePage';
import { LegalLibraryPage } from './pages/LegalLibraryPage';
import { LegalDocDetailPage } from './pages/LegalDocDetailPage';
import { InspectionListPage } from './pages/InspectionListPage';
import { InspectionPlanPage } from './pages/InspectionPlanPage';
import { FieldInspectionPage } from './pages/FieldInspectionPage';
import { InspectionResultPage } from './pages/InspectionResultPage';
import { ActionsListPage } from './pages/ActionsListPage';
import { RemediationReviewPage } from './pages/RemediationReviewPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SupervisorWorkloadPage } from './pages/SupervisorWorkloadPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminAuditPage } from './pages/AdminAuditPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream text-slate-500 text-sm">
        Đang xác thực phiên làm việc...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="cases" element={<CaseInboxPage />} />
              <Route path="cases/:id" element={<CaseDetailPage />} />
              <Route path="cases/:id/legal" element={<LegalWorkspacePage />} />
              <Route path="cases/:id/inspection/new" element={<InspectionPlanPage />} />
              
              <Route path="legal/library" element={<LegalLibraryPage />} />
              <Route path="legal/documents/:id" element={<LegalDocDetailPage />} />

              <Route path="inspections" element={<InspectionListPage />} />
              <Route path="inspections/new" element={<InspectionPlanPage />} />
              <Route path="inspections/:id" element={<FieldInspectionPage />} />
              <Route path="inspections/:id/result" element={<InspectionResultPage />} />

              <Route path="actions" element={<ActionsListPage />} />
              <Route path="actions/:id/remediation" element={<RemediationReviewPage />} />

              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="supervisor/workload" element={<SupervisorWorkloadPage />} />
              <Route path="admin/users" element={<AdminUsersPage />} />
              <Route path="admin/audit" element={<AdminAuditPage />} />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
