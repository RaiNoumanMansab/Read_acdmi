import React, { useState } from 'react';
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../common/Toast';
import { useAuth } from '../../../context/AuthContext';
import { getCurrentUser } from '../../../services/api';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onOpenAdmin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Missing Credentials', 'Please enter your email and password', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await login(email, password);
      if (success) {
        const currentUser = getCurrentUser();
        if (currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (currentUser?.role === 'TEACHER') {
          navigate('/portal/teacher');
        } else if (currentUser?.role === 'STUDENT' || currentUser?.role === 'PARENT') {
          navigate('/portal/student');
        } else {
          navigate('/admin/dashboard');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '85vh', backgroundColor: '#f8fafc', padding: '48px 16px 72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        
        {/* Main Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '38px 32px',
            borderRadius: '20px',
            borderTop: '5px solid #0B3974',
            boxShadow: '0 20px 40px -15px rgba(11, 57, 116, 0.12), 0 1px 3px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}
        >
          {/* Logo & Header */}
          <div style={{ marginBottom: '26px' }}>
            <img
              src="/logo.png"
              alt="Read Academy Sahiwal"
              style={{ height: '64px', width: 'auto', margin: '0 auto 14px', display: 'block', objectFit: 'contain' }}
            />
            <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0B3974', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
              READ ACADEMY SAHIWAL
            </h1>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#eff6ff', color: '#0B3974', padding: '4px 14px', borderRadius: '20px', fontSize: '0.76rem', fontWeight: 700, marginTop: '4px' }}>
              <Shield size={13} color="#0B3974" />
              <span>Institutional Portal Sign In</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'left' }}>
            {/* Email Field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                Email Address or Username
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                  <Mail size={16} />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter institutional email or roll no"
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 38px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    outline: 'none',
                    transition: 'all 0.15s ease'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#0B3974')}
                  onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '11px 40px 11px 38px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    outline: 'none',
                    transition: 'all 0.15s ease'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#0B3974')}
                  onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bca-btn bca-btn-gold"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.92rem',
                fontWeight: 800,
                borderRadius: '10px',
                justifyContent: 'center',
                gap: '8px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.8 : 1,
                marginTop: '6px'
              }}
            >
              {isSubmitting ? (
                <span>Authenticating with Backend...</span>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Back to Public Website link */}
          <div style={{ marginTop: '24px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <button
              onClick={() => onNavigate('home')}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0B3974')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              ← Back to School Public Website
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
