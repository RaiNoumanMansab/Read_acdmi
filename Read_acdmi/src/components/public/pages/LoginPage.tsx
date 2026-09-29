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
import { ButtonSpinner } from '../../common/Spinner';
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
            <h1 style={{ fontSize: '1.45rem', fontWeight: 700, lineHeight: 1.25, color: '#0B3974', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
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
                <ButtonSpinner color="#0B3974" />
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div style={{ marginTop: '22px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '14px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0B3974', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>🔐 DEFAULT / DEMO CREDENTIALS:</span>
              <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>Click to Fill ⤵</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@readacademy.edu.pk');
                  setPassword('admin1234');
                }}
                style={{
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '6px',
                  padding: '6px 4px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#1e40af',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('teacher@readacademy.edu.pk');
                  setPassword('teacher1234');
                }}
                style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '6px',
                  padding: '6px 4px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#166534',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                👨‍🏫 Teacher
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('student@readacademy.edu.pk');
                  setPassword('student1234');
                }}
                style={{
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  borderRadius: '6px',
                  padding: '6px 4px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#92400e',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                🎓 Student
              </button>
            </div>

            <div style={{ fontSize: '0.73rem', color: '#64748b', lineHeight: 1.45 }}>
              <div>• <strong>Admin:</strong> <code style={{ color: '#0B3974' }}>admin@readacademy.edu.pk</code> | <code style={{ color: '#0B3974' }}>admin1234</code></div>
              <div>• <strong>Teacher:</strong> <code style={{ color: '#0B3974' }}>teacher@readacademy.edu.pk</code> | <code style={{ color: '#0B3974' }}>teacher1234</code></div>
              <div>• <strong>Student:</strong> <code style={{ color: '#0B3974' }}>student@readacademy.edu.pk</code> | <code style={{ color: '#0B3974' }}>student1234</code></div>
            </div>
          </div>

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
