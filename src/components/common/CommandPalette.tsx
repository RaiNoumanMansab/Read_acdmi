import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, LayoutDashboard, Users, UserPlus, CheckSquare, Receipt, GraduationCap, Briefcase, Calendar, BookOpen, Award, TrendingUp, FileText, Bell, PenTool, Image, CalendarCheck, DollarSign, PieChart, FileSpreadsheet, Settings } from 'lucide-react';
import type { AdminTab } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: AdminTab) => void;
  onSwitchToPublic: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onSwitchToPublic
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // toggle handled by parent or shortcut
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigationItems: { label: string; tab?: AdminTab; action?: () => void; icon: any; category: string }[] = [
    { label: 'Dashboard Overview', tab: 'dashboard', icon: LayoutDashboard, category: 'Administration' },
    { label: 'Student Directory', tab: 'students', icon: Users, category: 'Academics' },
    { label: 'Admissions & Applications', tab: 'admissions', icon: UserPlus, category: 'Administration' },
    { label: 'Attendance Management', tab: 'attendance', icon: CheckSquare, category: 'Academics' },
    { label: 'Fees & Voucher Billing', tab: 'fees', icon: Receipt, category: 'Finance' },
    { label: 'Teachers & Staff Directory', tab: 'teachers', icon: GraduationCap, category: 'Staff' },
    { label: 'Teacher Duties & Workload', tab: 'teacher-duties', icon: Briefcase, category: 'Staff' },
    { label: 'Weekly Timetable Schedules', tab: 'timetable', icon: Calendar, category: 'Academics' },
    { label: 'Classes & Subject Master', tab: 'classes-subjects', icon: BookOpen, category: 'Academics' },
    { label: 'Exams & Printable Report Cards', tab: 'exams-results', icon: Award, category: 'Examinations' },
    { label: 'Individual Student Progress Analytics', tab: 'student-progress', icon: TrendingUp, category: 'Analytics' },
    { label: 'Homework & Assignments', tab: 'homework', icon: FileText, category: 'Academics' },
    { label: 'Notices & Circulars', tab: 'notices', icon: Bell, category: 'Communication' },
    { label: 'School Blog & News CMS', tab: 'blogs', icon: PenTool, category: 'CMS' },
    { label: 'Photo Gallery & Albums', tab: 'gallery', icon: Image, category: 'CMS' },
    { label: 'Calendar Events Management', tab: 'events', icon: CalendarCheck, category: 'CMS' },
    { label: 'Staff Payroll & Payslips', tab: 'payroll', icon: DollarSign, category: 'Finance' },
    { label: 'Accounts & Profit & Loss Statement', tab: 'accounts', icon: PieChart, category: 'Finance' },
    { label: 'Executive Reports Center', tab: 'reports', icon: FileSpreadsheet, category: 'Analytics' },
    { label: 'System & School Settings', tab: 'settings', icon: Settings, category: 'Settings' }
  ];

  const filtered = navigationItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(5px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            background: '#ffffff'
          }}
        >
          <Search size={20} color="#94a3b8" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or jump to screen... (e.g. Fees, Report Card, Attendance)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: '#0f172a'
            }}
          />
          <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#64748b', padding: '3px 7px', borderRadius: '6px', fontWeight: 600 }}>
            ESC to close
          </span>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px' }}>
          <div style={{ padding: '6px 12px', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
            Navigation Destinations
          </div>
          {filtered.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => {
                  if (item.tab) onSelectTab(item.tab);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ color: '#2563eb', display: 'flex' }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {item.category}
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} color="#cbd5e1" />
              </div>
            );
          })}

          <div style={{ margin: '8px 0', borderTop: '1px solid #f1f5f9' }} />

          <div
            onClick={() => {
              onSwitchToPublic();
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '10px',
              cursor: 'pointer',
              background: '#eff6ff'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.2rem' }}>🌐</span>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1d4ed8' }}>
                  Switch to Public School Website
                </div>
                <div style={{ fontSize: '0.75rem', color: '#3b82f6' }}>
                  View the public-facing portal for parents & prospective students
                </div>
              </div>
            </div>
            <ChevronRight size={16} color="#3b82f6" />
          </div>
        </div>
      </div>
    </div>
  );
};
