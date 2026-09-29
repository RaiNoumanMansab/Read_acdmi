import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useAuth } from '../../context/AuthContext';

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
      {/* Left: Empty placeholder */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      </div>

      {/* Right: Academic Session, Switcher, Notifications, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Academic Session Pill (Hidden on smaller screens) */}
        <div
          className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 font-semibold"
        >
          <Calendar size={14} color="#2563eb" />
          <span>Session 2026–2027 • Term 1</span>
        </div>




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
                top: '6px',
                right: '6px',
                width: '9px',
                height: '9px',
                backgroundColor: '#E62929',
                borderRadius: '50%',
                border: '2px solid #ffffff',
                boxShadow: '0 0 0 2px rgba(230, 41, 41, 0.3)'
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
                maxWidth: 'calc(100vw - 24px)',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                border: '1px solid #e2e8f0',
                borderTop: '3px solid #E62929',
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
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={user?.fullName || "Admin"}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #2563eb'
              }}
            />
            <div className="text-left hidden md:block">
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                {user?.fullName || 'Dr. Muhammad Tariq Khan'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                {user?.admin?.designation || (user?.role === 'SUPER_ADMIN' ? 'Executive Director' : 'Administrator')}
              </div>
            </div>
            <ChevronDown size={14} color="#64748b" className="hidden sm:block" />
          </div>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '48px',
                width: '230px',
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
                  {user?.fullName || 'Dr. Muhammad Tariq Khan'}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', wordBreak: 'break-all' }}>
                  {user?.email || 'admin@readacademy.edu.pk'}
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.7rem', color: '#059669', background: '#ecfdf5', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                  <Shield size={11} /> {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : (user?.role || 'Admin')}
                </div>
              </div>

              <div
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/admin/my-profile');
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
                  logout();
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
                <LogOut size={15} /> Sign Out
              </div>
            </div>
          )}
        </div>
      </div>

    </header>
  );
};
