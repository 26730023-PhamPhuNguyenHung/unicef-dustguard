import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { ToastProvider } from './context/ToastContext.js';
import { AppShell } from './components/layout/AppShell.js';
import { ProtectedRoute } from './components/auth/ProtectedRoute.js';
import { ErrorBoundary } from './components/common/ErrorBoundary.js';

// Import các trang chính
import { LandingPage } from './pages/LandingPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { MapPage } from './pages/MapPage.js';
import { ReportsListPage } from './pages/ReportsListPage.js';
import { CreateReportPage } from './pages/CreateReportPage.js';
import { ReportDetailPage } from './pages/ReportDetailPage.js';
import { CaseDetailPage } from './pages/CaseDetailPage.js';
import { SubmitObservationPage } from './pages/SubmitObservationPage.js';
import { MyTrackingPage } from './pages/MyTrackingPage.js';
import { CommunitiesPage } from './pages/CommunitiesPage.js';
import { CommunityDetailPage } from './pages/CommunityDetailPage.js';
import { TasksPage } from './pages/TasksPage.js';
import { NotificationsPage } from './pages/NotificationsPage.js';
import { ContributionsPage } from './pages/ContributionsPage.js';
import { YouthCreditsPage } from './pages/YouthCreditsPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { ForbiddenPage } from './pages/ForbiddenPage.js';

// Moderator
import { VerificationInboxPage } from './pages/VerificationInboxPage.js';
import { VerificationDetailPage } from './pages/VerificationDetailPage.js';
import { CaseCoordinationPage } from './pages/CaseCoordinationPage.js';
import { ModerationQueuePage } from './pages/ModerationQueuePage.js';
import { ModeratorDashboardPage } from './pages/ModeratorDashboardPage.js';

// Admin
import { AdminOverviewPage } from './pages/AdminOverviewPage.js';
import { AdminUsersPage } from './pages/AdminUsersPage.js';
import { AdminAuditPage } from './pages/AdminAuditPage.js';

// Auth
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.js';

// Contractor (Đơn vị thi công)
import { ContractorPortalPage } from './pages/contractor/ContractorPortalPage.js';
import { ContractorRemediationPage } from './pages/contractor/ContractorRemediationPage.js';
import { OPERATIONS_APP_URL } from './config/constants.js';

const OperationsRedirect: React.FC = () => {
  React.useEffect(() => {
    window.location.href = OPERATIONS_APP_URL;
  }, []);
  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ErrorBoundary>
            <Routes>
              {/* Landing Page công chúng độc lập */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/landing" element={<LandingPage />} />

              {/* Auth Routes không dùng AppShell */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Tất cả các route nghiệp vụ nằm trong AppShell */}
              <Route
                path="/*"
                element={
                  <AppShell>
                    <Routes>
                      {/* Trang tổng quan cộng đồng */}
                      <Route path="/dashboard" element={<DashboardPage />} />

                      {/* Bản đồ */}
                      <Route path="/map" element={<MapPage />} />

                      {/* Phản ánh (Reports) - Cho phép công dân vãng lai gửi nhanh không bắt buộc đăng nhập */}
                      <Route path="/reports" element={<ReportsListPage />} />
                      <Route path="/reports/new" element={<CreateReportPage />} />
                      <Route path="/reports/:id" element={<ReportDetailPage />} />

                      {/* Vụ việc (Cases) */}
                      <Route path="/cases" element={<Navigate to="/reports" replace />} />
                      <Route path="/cases/:id" element={<CaseDetailPage />} />
                      <Route
                        path="/cases/:id/observe"
                        element={
                          <ProtectedRoute permission="observation:create">
                            <SubmitObservationPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Theo dõi của tôi */}
                      <Route
                        path="/following"
                        element={
                          <ProtectedRoute permission="case:follow">
                            <MyTrackingPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Cộng đồng */}
                      <Route path="/communities" element={<CommunitiesPage />} />
                      <Route path="/communities/:slug" element={<CommunityDetailPage />} />

                      {/* Nhiệm vụ (Member trở lên) */}
                      <Route
                        path="/tasks"
                        element={
                          <ProtectedRoute permission="task:view">
                            <TasksPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Thông báo */}
                      <Route
                        path="/notifications"
                        element={
                          <ProtectedRoute permission="notification:view">
                            <NotificationsPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Dấu ấn đóng góp (YouthCreditsPage) */}
                      <Route
                        path="/contributions"
                        element={
                          <ProtectedRoute permission="contribution:view">
                            <YouthCreditsPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Chuyển hướng chuẩn hóa cho Tín chỉ thanh niên -> Dấu ấn đóng góp */}
                      <Route path="/credits" element={<Navigate to="/contributions" replace />} />
                      <Route path="/youth/credits" element={<Navigate to="/contributions" replace />} />

                      {/* Hồ sơ cá nhân */}
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute permission="profile:manage">
                            <ProfilePage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Trang thông báo không đủ quyền hạn (403 Forbidden) */}
                      <Route path="/forbidden" element={<ForbiddenPage />} />

                      {/* Citizen Legacy Route Aliases (Hỗ trợ URL cũ liền mạch) */}
                      <Route path="/citizen" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/citizen/portal" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/citizen/report/new" element={<Navigate to="/reports/new" replace />} />
                      <Route path="/citizen/report" element={<Navigate to="/reports/new" replace />} />
                      <Route path="/citizen/reports" element={<Navigate to="/reports" replace />} />
                      <Route path="/citizen/reports/:id" element={<ReportDetailPage />} />
                      <Route path="/citizen/map" element={<Navigate to="/map" replace />} />
                      <Route path="/citizen/nearby" element={<Navigate to="/map" replace />} />
                      <Route path="/citizen/track" element={<Navigate to="/following" replace />} />
                      <Route path="/citizen/profile" element={<Navigate to="/profile" replace />} />
                      <Route path="/citizen/*" element={<Navigate to="/dashboard" replace />} />

                      {/* Moderator Routes (Bảo vệ nghiêm ngặt) */}
                      <Route path="/moderator" element={<Navigate to="/moderator/dashboard" replace />} />
                      <Route
                        path="/moderator/inbox"
                        element={
                          <ProtectedRoute permission="moderator:inbox">
                            <VerificationInboxPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/moderator/verification"
                        element={
                          <ProtectedRoute permission="moderator:inbox">
                            <VerificationInboxPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/moderator/verification/:id"
                        element={
                          <ProtectedRoute permission="moderator:verify">
                            <VerificationDetailPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/moderator/cases"
                        element={
                          <ProtectedRoute permission="moderator:coordinate_cases">
                            <CaseCoordinationPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/moderator/content"
                        element={
                          <ProtectedRoute permission="moderator:moderate_content">
                            <ModerationQueuePage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/moderator/dashboard"
                        element={
                          <ProtectedRoute permission="moderator:stats">
                            <ModeratorDashboardPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Admin Routes (Bảo vệ nghiêm ngặt) */}
                      <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
                      <Route
                        path="/admin/overview"
                        element={
                          <ProtectedRoute permission="admin:stats">
                            <AdminOverviewPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/users"
                        element={
                          <ProtectedRoute permission="admin:users">
                            <AdminUsersPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/audit"
                        element={
                          <ProtectedRoute permission="admin:audit">
                            <AdminAuditPage />
                          </ProtectedRoute>
                        }
                      />



                      <Route path="/community/tasks" element={<Navigate to="/tasks" replace />} />
                      <Route path="/community/contributions" element={<Navigate to="/contributions" replace />} />
                      <Route path="/community/clubs" element={<Navigate to="/communities" replace />} />
                      <Route path="/community/*" element={<Navigate to="/communities" replace />} />

                      {/* Cross-App Side B Redirects (Đơn vị Xử lý & Điều hành) */}
                      <Route path="/operations" element={<OperationsRedirect />} />
                      <Route path="/operations/*" element={<OperationsRedirect />} />
                      <Route path="/staff/*" element={<OperationsRedirect />} />
                      <Route path="/executive/*" element={<OperationsRedirect />} />
                      
                      {/* Cổng Đơn vị thi công (Contractor Portal) */}
                      <Route path="/contractor" element={<ContractorPortalPage />} />
                      <Route path="/contractor/portal" element={<ContractorPortalPage />} />
                      <Route path="/contractor/actions" element={<ContractorPortalPage />} />
                      <Route path="/contractor/actions/:id" element={<ContractorRemediationPage />} />
                      <Route path="/contractor/remediation/:id" element={<ContractorRemediationPage />} />
                      <Route path="/contractor/access/:token" element={<ContractorPortalPage />} />

                      {/* Fallback */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </AppShell>
                }
              />
            </Routes>
          </ErrorBoundary>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};
export default App;
