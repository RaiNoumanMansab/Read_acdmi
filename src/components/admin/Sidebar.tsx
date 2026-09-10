import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CheckSquare,
  Receipt,
  GraduationCap,
  Briefcase,
  Calendar,
  BookOpen,
  Award,
  TrendingUp,
  FileText,
  Bell,
  PenTool,
  Image,
  CalendarCheck,
  DollarSign,
  PieChart,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  School,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import type { AdminTab } from '../../types';
import { SCHOOL_INFO } from '../../mockData';

interface SidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onSwitchToPublic: () => void;
}

interface NavItemConfig {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  badgeType?: 'primary' | 'emerald' | 'amber' | 'rose';
  category: 'MAIN' | 'ACADEMIC' | 'STAFF' | 'FINANCE' | 'CMS & COMMS' | 'SYSTEM';
}

const NAV_ITEMS: NavItemConfig[] = [
  // MAIN
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'MAIN' },
  { id: 'admissions', label: 'Admissions', icon: UserPlus, badge: '18 New', badgeType: 'rose', category: 'MAIN' },
  { id: 'students', label: 'Students', icon: Users, badge: '1,248', category: 'MAIN' },

  // ACADEMIC
  { id: 'attendance', label: 'Attendance', icon: CheckSquare, category: 'ACADEMIC' },
  { id: 'classes-subjects', label: 'Classes & Subjects', icon: BookOpen, category: 'ACADEMIC' },
  { id: 'timetable', label: 'Timetable', icon: Calendar, category: 'ACADEMIC' },
  { id: 'homework', label: 'Homework', icon: FileText, category: 'ACADEMIC' },
  { id: 'exams-results', label: 'Exams & Results', icon: Award, category: 'ACADEMIC' },
  { id: 'student-progress', label: 'Student Progress', icon: TrendingUp, category: 'ACADEMIC' },

  // STAFF
  { id: 'teachers', label: 'Teachers & Staff', icon: GraduationCap, category: 'STAFF' },
  { id: 'teacher-duties', label: 'Teacher Duties', icon: Briefcase, category: 'STAFF' },

  // FINANCE
  { id: 'fees', label: 'Fees & Vouchers', icon: Receipt, badge: 'Due', badgeType: 'rose', category: 'FINANCE' },
  { id: 'payroll', label: 'Payroll', icon: DollarSign, category: 'FINANCE' },
  { id: 'accounts', label: 'Accounts (P&L)', icon: PieChart, category: 'FINANCE' },
  { id: 'reports', label: 'Reports', icon: FileSpreadsheet, category: 'FINANCE' },

  // CMS & COMMS
  { id: 'notices', label: 'Notices', icon: Bell, badge: '4 New', badgeType: 'rose', category: 'CMS & COMMS' },
  { id: 'blogs', label: 'Blogs CMS', icon: PenTool, category: 'CMS & COMMS' },
  { id: 'gallery', label: 'Gallery CMS', icon: Image, category: 'CMS & COMMS' },
  { id: 'events', label: 'Events CMS', icon: CalendarCheck, category: 'CMS & COMMS' },

  // SYSTEM
  { id: 'settings', label: 'Settings', icon: Settings, category: 'SYSTEM' }
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  onSwitchToPublic
}) => {
  const categories = ['MAIN', 'ACADEMIC', 'STAFF', 'FINANCE', 'CMS & COMMS', 'SYSTEM'] as const;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(3px)',
            zIndex: 45
          }}
        />
      )}

      <aside
        className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}
      >
        {/* Header Branding */}
        <div className="admin-sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: '#ffffff',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
              }}
            >
              <img src="/logo.png" alt="Read Academy Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            {!collapsed && (
              <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <h2
                  style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    lineHeight: 1.2,
                    letterSpacing: '-0.02em',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}
                >
                  Read Academy
                </h2>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={11} color="#4CAF50" />
                  <span>Sahiwal • Admin ERP</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '6px',
              width: '26px',
              height: '26px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="admin-sidebar-nav">
          {categories.map((cat) => {
            const items = NAV_ITEMS.filter((i) => i.category === cat);
            if (!items.length) return null;

            return (
              <div key={cat} style={{ marginBottom: '14px' }}>
                {!collapsed && (
                  <div className="admin-nav-section-title">
                    {cat}
                  </div>
                )}
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`admin-nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        onSelectTab(item.id);
                        if (isMobileOpen) onCloseMobile();
                      }}
                      title={collapsed ? item.label : undefined}
                    >
                      <div className="admin-nav-icon">
                        <Icon size={19} />
                      </div>
                      {!collapsed && (
                        <div
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            minWidth: 0
                          }}
                        >
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.label}
                          </span>
                          {item.badge && (
                            <span
                              style={{
                                fontSize: '0.68rem',
                                padding: '1px 6px',
                                borderRadius: '10px',
                                fontWeight: 800,
                                background:
                                  item.badgeType === 'emerald'
                                    ? '#4CAF50'
                                    : item.badgeType === 'amber'
                                    ? '#FFD700'
                                    : item.badgeType === 'rose'
                                    ? '#E62929'
                                    : '#0B3974',
                                color: item.badgeType === 'amber' ? '#061d3d' : '#ffffff'
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer / Switcher Button */}
        <div
          style={{
            padding: collapsed ? '12px 6px' : '14px 16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(0, 0, 0, 0.25)'
          }}
        >
          <button
            onClick={onSwitchToPublic}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: '10px',
              padding: '9px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 215, 0, 0.12)',
              border: '1px solid rgba(255, 215, 0, 0.35)',
              color: '#FFD700',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#FFD700';
              e.currentTarget.style.color = '#061d3d';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 215, 0, 0.12)';
              e.currentTarget.style.color = '#FFD700';
            }}
            title="Switch to Public School Website"
          >
            <ExternalLink size={16} />
            {!collapsed && <span>Public Website</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
