import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { SetupPage } from './pages/SetupPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ContractorsPage } from './pages/ContractorsPage';
import { DashboardPage } from './pages/DashboardPage';
import { CaseInboxPage } from './pages/CaseInboxPage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { TasksPage } from './pages/TasksPage';
import { LegalWorkspacePage } from './pages/LegalWorkspacePage';
import { LegalLibraryPage } from './pages/LegalLibraryPage';
import { LegalImportPage } from './pages/LegalImportPage';
import { LegalDocDetailPage } from './pages/LegalDocDetailPage';
import { InspectionListPage } from './pages/InspectionListPage';
import { InspectionPlanPage } from './pages/InspectionPlanPage';
import { FieldInspectionPage } from './pages/FieldInspectionPage';
import { InspectionResultPage } from './pages/InspectionResultPage';
import { ActionsListPage } from './pages/ActionsListPage';
import { RemediationReviewPage } from './pages/RemediationReviewPage';
import { IotDevicesPage } from './pages/IotDevicesPage';
import { IotDeviceDetailPage } from './pages/IotDeviceDetailPage';
import { AutomationsPage } from './pages/AutomationsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SupervisorWorkloadPage } from './pages/SupervisorWorkloadPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminAuditPage } from './pages/AdminAuditPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';
import { EvidencePage } from './pages/EvidencePage';
import { ReportsPage } from './pages/ReportsPage';

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
            <Route path="/setup" element={<SetupPage />} />

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
              
              {/* Projects & Contractors */}
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="contractors" element={<ContractorsPage />} />

              {/* Tasks */}
              <Route path="tasks" element={<TasksPage />} />

              {/* Cases */}
              <Route path="cases" element={<CaseInboxPage />} />
              <Route path="cases/:id" element={<CaseDetailPage />} />
              <Route path="cases/:id/evidence" element={<CaseDetailPage />} />
              <Route path="cases/:id/iot" element={<CaseDetailPage />} />
              <Route path="cases/:id/inspection" element={<CaseDetailPage />} />
              <Route path="cases/:id/actions" element={<CaseDetailPage />} />
              <Route path="cases/:id/timeline" element={<CaseDetailPage />} />
              <Route path="cases/:id/legal" element={<LegalWorkspacePage />} />
              <Route path="cases/:id/inspection/new" element={<InspectionPlanPage />} />
              
              {/* Legal */}
              <Route path="legal" element={<Navigate to="/legal/library" replace />} />
              <Route path="legal/library" element={<LegalLibraryPage />} />
              <Route path="legal/documents" element={<LegalLibraryPage />} />
              <Route path="legal/import" element={<LegalImportPage />} />
              <Route path="legal/documents/:id" element={<LegalDocDetailPage />} />

              {/* Inspections */}
              <Route path="inspections" element={<InspectionListPage />} />
              <Route path="inspections/new" element={<InspectionPlanPage />} />
              <Route path="inspections/:id" element={<FieldInspectionPage />} />
              <Route path="inspections/:id/result" element={<InspectionResultPage />} />

              {/* Corrective Actions */}
              <Route path="actions" element={<ActionsListPage />} />
              <Route path="actions/:id/remediation" element={<RemediationReviewPage />} />

              {/* IoT Telemetry */}
              <Route path="iot" element={<IotDevicesPage />} />
              <Route path="iot/devices" element={<IotDevicesPage />} />
              <Route path="iot/devices/:id" element={<IotDeviceDetailPage />} />

              {/* Automations */}
              <Route path="automations" element={<AutomationsPage />} />

              {/* Evidence Management */}
              <Route path="evidence" element={<EvidencePage />} />

              {/* Operational Reports */}
              <Route path="reports" element={<ReportsPage />} />

              {/* Staff & Admin */}
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="supervisor/workload" element={<SupervisorWorkloadPage />} />
              <Route path="admin/users" element={<AdminUsersPage />} />
              <Route path="admin/audit" element={<AdminAuditPage />} />
              <Route path="admin/settings" element={<AdminSettingsPage />} />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
