import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Globe,
  Calendar,
  ChevronDown,
  Check,
  User,
  LogOut,
  Shield
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenCommandPalette: () => void;
  onSwitchToPublic: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMobileSidebar,
  onOpenCommandPalette,
  onSwitchToPublic
}) => {
  const { showToast } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'New Admission Application', text: 'Shahmeer Khan applied for Grade 9', time: '10m ago', unread: true },
    { id: 2, title: 'Fee Payment Received', text: 'Hamza Farooq paid Rs. 32,000 online', time: '45m ago', unread: true },
    { id: 3, title: 'Attendance Alert', text: 'Today attendance reached 94.7%', time: '2h ago', unread: false },
    { id: 4, title: 'Exam Date Sheet Published', text: 'Term 1 Assessment schedule notified', time: '4h ago', unread: false }
  ];

  return (
    <header className="admin-topbar">
      {/* Left: Mobile hamburger & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={onOpenMobileSidebar}
          className="bca-btn-icon"
          style={{ display: 'none' }}
          id="mobile-menu-btn"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Bar (opens Ctrl+K) */}
        <div
          onClick={onOpenCommandPalette}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '7px 14px',
            cursor: 'pointer',
            width: '280px',
            transition: 'border-color 0.15s, background-color 0.15s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.backgroundColor = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.backgroundColor = '#f1f5f9';
          }}
        >
          <Search size={16} color="#94a3b8" />
          <span style={{ fontSize: '0.84rem', color: '#64748b', flex: 1 }}>
            Search anything...
          </span>
          <kbd
            style={{
              fontSize: '0.7rem',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              padding: '1px 5px',
              color: '#64748b',
              boxShadow: '0 1px 1px rgba(0,0,0,0.05)'
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Academic Session, Switcher, Notifications, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Academic Session Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            backgroundColor: '#eff6ff',
            borderRadius: '8px',
            border: '1px solid #bfdbfe',
            fontSize: '0.8rem',
            color: '#1e40af',
            fontWeight: 600
          }}
        >
          <Calendar size={14} color="#2563eb" />
          <span>Session 2026–2027 • Term 1</span>
        </div>

        {/* View Public Website */}
        <button
          onClick={onSwitchToPublic}
          className="bca-btn bca-btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.82rem' }}
          title="Open Public School Website"
        >
          <Globe size={15} color="#2563eb" />
          <span>Public Website</span>
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="bca-btn-icon"
            style={{ position: 'relative' }}
          >
            <Bell size={19} />
            <span
              style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '8px',
                height: '8px',
                backgroundColor: '#f43f5e',
                borderRadius: '50%',
                border: '2px solid #ffffff'
              }}
            />
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '320px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                border: '1px solid #e2e8f0',
                zIndex: 100,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                  Notifications
                </span>
                <span
                  onClick={() => {
                    showToast('All notifications marked as read', undefined, 'info');
                    setShowNotifications(false);
                  }}
                  style={{ fontSize: '0.75rem', color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}
                >
                  Mark all read
                </span>
              </div>
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '10px 16px',
                      borderBottom: '1px solid #f8fafc',
                      backgroundColor: n.unread ? '#f8fafc' : '#ffffff',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      showToast(n.title, n.text, 'info');
                      setShowNotifications(false);
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b' }}>
                        {n.title}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{n.time}</span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '3px 0 0' }}>
                      {n.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 8px',
              borderRadius: '10px',
              cursor: 'pointer',
              border: '1px solid transparent'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Admin"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #2563eb'
              }}
            />
            <div style={{ textAlign: 'left', display: 'none' }} className="user-text">
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                Dr. Shahbaz Alam
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Executive Principal
              </div>
            </div>
            <ChevronDown size={14} color="#64748b" />
          </div>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '48px',
                width: '220px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                border: '1px solid #e2e8f0',
                zIndex: 100,
                padding: '8px'
              }}
            >
              <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                  Dr. Shahbaz Alam
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  principal@beaconcrest.edu.pk
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.7rem', color: '#059669', background: '#ecfdf5', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                  <Shield size={11} /> Super Admin
                </div>
              </div>

              <div
                onClick={() => {
                  showToast('Opened profile settings', undefined, 'info');
                  setShowProfileMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  fontSize: '0.84rem',
                  color: '#334155',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <User size={15} /> My Profile
              </div>

              <div
                onClick={() => {
                  showToast('Simulation: Admin logged out', 'Switched to public demo view', 'warning');
                  setShowProfileMenu(false);
                  onSwitchToPublic();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  fontSize: '0.84rem',
                  color: '#e11d48',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fff1f2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LogOut size={15} /> Log Out (Demo)
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
