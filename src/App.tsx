import React, { useState } from 'react';
import { ToastProvider, useToast } from './components/common/Toast';
import { CommandPalette } from './components/common/CommandPalette';
import { Sidebar } from './components/admin/Sidebar';
import { AdminHeader } from './components/admin/AdminHeader';
import { PublicWebsite } from './components/public/PublicWebsite';

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

import type { AppMode, AdminTab } from './types';
import { Globe, LayoutDashboard, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { showToast } = useToast();
  const [appMode, setAppMode] = useState<AppMode>('public');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const handleSwitchToAdmin = (tab: AdminTab = 'dashboard') => {
    setAppMode('admin');
    setAdminTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Switched to Admin ERP Portal', 'Logged in as Campus Super Administrator', 'info');
  };

  const handleSwitchToPublic = () => {
    setAppMode('public');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Switched to Public School Website', 'Viewing as prospective parent / visitor', 'info');
  };

  return (
    <div className="app-root">
      {/* GLOBAL COMMAND PALETTE (CTRL + K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectTab={(tab) => {
          setAdminTab(tab);
          setAppMode('admin');
          setCommandPaletteOpen(false);
        }}
        onSwitchToPublic={() => {
          handleSwitchToPublic();
          setCommandPaletteOpen(false);
        }}
      />

      {/* FLOATING QUICK-SWITCH DOCK */}
      <div
        className="global-mode-switcher no-print"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#0f172a',
          padding: '6px 8px',
          borderRadius: '50px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.15)'
        }}
      >
        <button
          onClick={handleSwitchToPublic}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '30px',
            border: 'none',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: appMode === 'public' ? '#2563eb' : 'transparent',
            color: appMode === 'public' ? '#ffffff' : '#94a3b8',
            transition: 'all 0.2s ease'
          }}
        >
          <Globe size={14} />
          <span>Public Website</span>
        </button>

        <button
          onClick={() => handleSwitchToAdmin('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '30px',
            border: 'none',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: appMode === 'admin' ? '#2563eb' : 'transparent',
            color: appMode === 'admin' ? '#ffffff' : '#94a3b8',
            transition: 'all 0.2s ease'
          }}
        >
          <LayoutDashboard size={14} />
          <span>Admin Portal</span>
        </button>
      </div>

      {/* RENDER PUBLIC OR ADMIN */}
      {appMode === 'public' ? (
        <PublicWebsite onOpenAdmin={() => handleSwitchToAdmin('dashboard')} />
      ) : (
        <div className="admin-container">
          {/* Admin Left Sidebar */}
          <Sidebar
            currentTab={adminTab}
            onSelectTab={(tab) => {
              setAdminTab(tab);
              setMobileSidebarOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
              {adminTab === 'dashboard' && <DashboardHome onNavigate={(tab) => setAdminTab(tab)} />}
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
              {adminTab === 'settings' && <SettingsView />}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
