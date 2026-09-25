import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast';
import { AuthProvider } from './context/AuthContext';
import { CommandPalette } from './components/common/CommandPalette';
import { Sidebar } from './components/admin/Sidebar';
import { AdminHeader } from './components/admin/AdminHeader';
import { PublicWebsite } from './components/public/PublicWebsite';
import { TeacherPortal } from './components/portal/TeacherPortal';
import { StudentParentPortal } from './components/portal/StudentParentPortal';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Admin View Components
import { DashboardHome } from './components/admin/DashboardHome';
import { StudentsView } from './components/admin/StudentsView';
import { AdmissionsView } from './components/admin/AdmissionsView';
import { AttendanceView } from './components/admin/AttendanceView';
import { FeesView } from './components/admin/FeesView';
import { TeachersView } from './components/admin/TeachersView';
import { TeacherDutiesView } from './components/admin/TeacherDutiesView';
import { TimetableView } from './components/admin/TimetableView';
import { ClassesSubjectsView } from './components/admin/ClassesSubjectsView';
import { ExamsResultsView } from './components/admin/ExamsResultsView';
import { StudentProgressView } from './components/admin/StudentProgressView';
import { HomeworkView } from './components/admin/HomeworkView';
import { NoticesView } from './components/admin/NoticesView';
import { BlogsCmsView } from './components/admin/BlogsCmsView';
import { GalleryCmsView } from './components/admin/GalleryCmsView';
import { EventsCmsView } from './components/admin/EventsCmsView';
import { PayrollView } from './components/admin/PayrollView';
import { AccountsView } from './components/admin/AccountsView';
import { ReportsView } from './components/admin/ReportsView';
import { SettingsView } from './components/admin/SettingsView';
import { RolesView } from './components/admin/RolesView';
import { CareersView } from './components/admin/CareersView';

import type { AdminTab } from './types';

const AdminLayout: React.FC = () => {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const adminTab: AdminTab = (tab as AdminTab) || 'dashboard';

  const handleSelectTab = (newTab: AdminTab) => {
    navigate(`/admin/${newTab}`);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchToPublic = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ProtectedRoute
      allowedRoles={['SUPER_ADMIN', 'ADMIN']}
      portalName="Campus Admin ERP Portal"
      onRedirectToLogin={() => navigate('/login')}
    >
      <div className="admin-container">
        {/* GLOBAL COMMAND PALETTE (CTRL + K) */}
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          onSelectTab={(selectedTab) => {
            handleSelectTab(selectedTab);
            setCommandPaletteOpen(false);
          }}
          onSwitchToPublic={() => {
            handleSwitchToPublic();
            setCommandPaletteOpen(false);
          }}
        />

        {/* Admin Left Sidebar */}
        <Sidebar
          currentTab={adminTab}
          onSelectTab={handleSelectTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          onSwitchToPublic={handleSwitchToPublic}
        />

        {/* Admin Main Body */}
        <div className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <AdminHeader
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            onSwitchToPublic={handleSwitchToPublic}
          />

          <main className="admin-content">
            {adminTab === 'dashboard' && <DashboardHome onNavigate={handleSelectTab} />}
            {adminTab === 'students' && <StudentsView />}
            {adminTab === 'admissions' && <AdmissionsView />}
            {adminTab === 'attendance' && <AttendanceView />}
            {adminTab === 'fees' && <FeesView />}
            {adminTab === 'teachers' && <TeachersView />}
            {adminTab === 'teacher-duties' && <TeacherDutiesView />}
            {adminTab === 'timetable' && <TimetableView />}
            {adminTab === 'classes-subjects' && <ClassesSubjectsView />}
            {adminTab === 'exams-results' && <ExamsResultsView />}
            {adminTab === 'student-progress' && <StudentProgressView />}
            {adminTab === 'homework' && <HomeworkView />}
            {adminTab === 'notices' && <NoticesView />}
            {adminTab === 'blogs' && <BlogsCmsView />}
            {adminTab === 'gallery' && <GalleryCmsView />}
            {adminTab === 'events' && <EventsCmsView />}
            {adminTab === 'payroll' && <PayrollView />}
            {adminTab === 'accounts' && <AccountsView />}
            {adminTab === 'reports' && <ReportsView />}
            {adminTab === 'roles' && <RolesView />}
            {adminTab === 'careers' && <CareersView />}
            {adminTab === 'settings' && <SettingsView />}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const AppContent: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="app-root">
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<PublicWebsite onOpenAdmin={() => navigate('/admin/dashboard')} />} />
        <Route path="/about" element={<PublicWebsite onOpenAdmin={() => navigate('/admin/dashboard')} />} />
        <Route path="/academics" element={<PublicWebsite onOpenAdmin={() => navigate('/admin/dashboard')} />} />
        <Route path="/admissions" element={<PublicWebsite onOpenAdmin={() => navigate('/admin/dashboard')} />} />
        <Route path="/teachers" element={<PublicWebsite onOpenAdmin={() => navigate('/admin/dashboard')} />} />
        <Route path="/faculty" element={<PublicWebsite onOpenAdmin={() => navigate('/admin/dashboard')} />} />
        <Route path="/careers" element={<PublicWebsite onOpenAdmin={() => navigate('/admin/dashboard')} />} />
        <Route path="/jobs" element={<PublicWebsite onOpenAdmin={() => navigate('/admin/dashboard')} />} />
        <Route path="/gallery" element={<PublicWebsite onOpenAdmin={() => navigate('/admin/dashboard')} />} />
        <Route path="/events" element={<PublicWebsite onOpenAdmin={() => navigate('/admin/dashboard')} />} />
        <Route path="/blog" element={<PublicWebsite onOpenAdmin={() => navigate('/admin/dashboard')} />} />
        <Route path="/news" element={<PublicWebsite onOpenAdmin={() => navigate('/admin/dashboard')} />} />
        <Route path="/contact" element={<PublicWebsite onOpenAdmin={() => navigate('/admin/dashboard')} />} />
        <Route path="/login" element={<PublicWebsite onOpenAdmin={() => navigate('/admin/dashboard')} />} />
        <Route path="/signup" element={<PublicWebsite onOpenAdmin={() => navigate('/admin/dashboard')} />} />

        {/* Admin ERP Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/:tab" element={<AdminLayout />} />

        {/* Teacher / Faculty Portal */}
        <Route
          path="/portal/teacher"
          element={
            <ProtectedRoute
              allowedRoles={['TEACHER', 'SUPER_ADMIN']}
              portalName="Faculty Workspace"
              onRedirectToLogin={() => navigate('/login')}
            >
              <TeacherPortal />
            </ProtectedRoute>
          }
        />

        {/* Student & Parent Dossier Portal */}
        <Route
          path="/portal/student"
          element={
            <ProtectedRoute
              allowedRoles={['STUDENT', 'PARENT', 'SUPER_ADMIN']}
              portalName="Student & Parent Dossier"
              onRedirectToLogin={() => navigate('/login')}
            >
              <StudentParentPortal />
            </ProtectedRoute>
          }
        />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
