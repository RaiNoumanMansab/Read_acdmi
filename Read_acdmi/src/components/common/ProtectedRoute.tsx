import React from 'react';
import { useAuth, type UserRole } from '../../context/AuthContext';
import { ShieldAlert, Lock, ArrowRight, LogOut, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  portalName?: string;
  onRedirectToLogin: () => void;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  portalName = 'Portal Area',
  onRedirectToLogin,
  children
}) => {
  const { user, isAuthenticated, setActivePortal, logout } = useAuth();

  // Case 1: Not logged in
  if (!isAuthenticated || !user) {
    return (
      <div
        style={{
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 16px',
          backgroundColor: '#f8fafc'
        }}
      >
        <div
          style={{
            maxWidth: '440px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px 24px',
            textAlign: 'center',
            boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.12)',
            border: '1px solid #e2e8f0',
            borderTop: '5px solid #0B3974'
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              margin: '0 auto 16px',
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              color: '#0B3974',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Lock size={26} />
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
            Protected Access Required
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 24px 0' }}>
            The <strong>{portalName}</strong> is restricted to authorized campus members. Please log in with your institutional credentials to proceed.
          </p>

          <button
            onClick={onRedirectToLogin}
            className="bca-btn bca-btn-gold"
            style={{
              width: '100%',
              padding: '11px',
              justifyContent: 'center',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.9rem',
              gap: '8px'
            }}
          >
            <span>Proceed to Login</span>
            <ArrowRight size={16} />
          </button>

          <div style={{ marginTop: '16px' }}>
            <button
              onClick={() => setActivePortal('public')}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ArrowLeft size={14} /> Back to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Logged in, but unauthorized role
  const isAuthorized = allowedRoles.includes(user.role);
  if (!isAuthorized) {
    const userRoleFormatted = user.role.replace('_', ' ');

    return (
      <div
        style={{
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 16px',
          backgroundColor: '#f8fafc'
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px 24px',
            textAlign: 'center',
            boxShadow: '0 20px 35px -10px rgba(225, 29, 72, 0.12)',
            border: '1px solid #fecdd3',
            borderTop: '5px solid #e11d48'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 16px',
              borderRadius: '50%',
              backgroundColor: '#fff1f2',
              color: '#e11d48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ShieldAlert size={28} />
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
            Access Restricted: Role Mismatch
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 16px 0' }}>
            Your account is authenticated as <strong style={{ color: '#0B3974' }}>{userRoleFormatted}</strong> ({user.email}). This section ({portalName}) requires one of the following roles:
          </p>

          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
            {allowedRoles.map((r) => (
              <span
                key={r}
                style={{
                  background: '#f1f5f9',
                  color: '#334155',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  border: '1px solid #cbd5e1'
                }}
              >
                {r.replace('_', ' ')}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => {
                if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
                  setActivePortal('admin');
                } else if (user.role === 'TEACHER') {
                  setActivePortal('teacher');
                } else {
                  setActivePortal('student');
                }
              }}
              className="bca-btn bca-btn-gold"
              style={{ width: '100%', justifyContent: 'center', borderRadius: '8px', padding: '10px' }}
            >
              Go to Your Authorized Portal
            </button>

            <button
              onClick={logout}
              className="bca-btn bca-btn-secondary"
              style={{ width: '100%', justifyContent: 'center', borderRadius: '8px', padding: '10px', color: '#e11d48' }}
            >
              <LogOut size={14} /> Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Authorized
  return <>{children}</>;
};
