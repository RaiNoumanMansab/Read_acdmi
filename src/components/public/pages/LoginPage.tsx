import React, { useState } from 'react';
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  GraduationCap,
  Shield,
  User,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  KeyRound
} from 'lucide-react';
import { SCHOOL_INFO } from '../../../mockData';
import { useToast } from '../../common/Toast';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onOpenAdmin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onOpenAdmin }) => {
  const { showToast } = useToast();
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both Email/Username and Password', undefined, 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (role === 'admin') {
        onOpenAdmin();
        showToast('Admin Login Successful', 'Welcome to Campus Super Administrator ERP Portal', 'success');
      } else {
        showToast(
          `Logged in as ${role === 'student' ? 'Student / Parent' : 'Teacher / Faculty'}`,
          `Welcome back to Read Academy Sahiwal Portal!`,
          'success'
        );
        onNavigate('home');
      }
    }, 600);
  };

  const handleQuickDemo = (selectedRole: 'student' | 'teacher' | 'admin') => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      setEmail('admin@readacademy.edu.pk');
      setPassword('admin1234');
      showToast('Demo Credentials Filled', 'Role set to Administrator. Click "Log In to Portal" to enter Admin ERP.', 'info');
    } else if (selectedRole === 'teacher') {
      setEmail('teacher@readacademy.edu.pk');
      setPassword('teacher1234');
      showToast('Demo Credentials Filled', 'Role set to Faculty Member.', 'info');
    } else {
      setEmail('student@readacademy.edu.pk');
      setPassword('student1234');
      showToast('Demo Credentials Filled', 'Role set to Student / Parent.', 'info');
    }
  };

  return (
    <div style={{ minHeight: '85vh', backgroundColor: '#f8fafc', padding: '60px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1000px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '32px', alignItems: 'center' }}>
        
        {/* Left Info Column */}
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#feecec', color: '#E62929', padding: '6px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800, marginBottom: '20px', border: '1px solid #fecaca' }}>
            <Shield size={14} />
            <span>Secure Campus ERP Login</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', fontWeight: 900, color: '#0f172a', lineHeight: 1.15, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
            Welcome Back to <span style={{ color: '#0B3974' }}>Read Academy</span>
          </h1>

          <p style={{ fontSize: '0.96rem', color: '#475569', lineHeight: 1.65, margin: '0 0 28px 0' }}>
            Access academic progress reports, daily attendance tracking, fee vouchers, assignment submissions, and staff tools.
          </p>

          {/* Key Portal Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
            {[
              { icon: GraduationCap, title: 'Real-time Progress & Marks', desc: 'Track exam scores, report cards & BISE results.' },
              { icon: CheckCircle, title: 'Smart Attendance & Notices', desc: 'Instant WhatsApp SMS notifications for parents.' },
              { icon: Shield, title: '256-Bit SSL Encrypted', desc: 'Protected student records and financial ledgers.' }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#0B3974', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon size={18} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 2px 0', fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{item.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Demo Login Quick Switch Bar */}
          <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0B3974', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              ⚡ 1-Click Demo Login Shortcuts:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleQuickDemo('admin')}
                style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #fecaca', backgroundColor: '#feecec', color: '#E62929', fontSize: '0.76rem', fontWeight: 800, cursor: 'pointer' }}
              >
                🛡️ Super Admin
              </button>
              <button
                onClick={() => handleQuickDemo('teacher')}
                style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', color: '#0B3974', fontSize: '0.76rem', fontWeight: 800, cursor: 'pointer' }}
              >
                👨‍🏫 Teacher
              </button>
              <button
                onClick={() => handleQuickDemo('student')}
                style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f1f5f9', color: '#334155', fontSize: '0.76rem', fontWeight: 800, cursor: 'pointer' }}
              >
                🎒 Student / Parent
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div
          className="bca-card"
          style={{
            backgroundColor: '#ffffff',
            padding: '36px 30px',
            borderRadius: '18px',
            borderTop: '4px solid #E62929',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
          }}
        >
          {/* Logo Brand Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <img
              src="/logo.png"
              alt="Read Academy Sahiwal"
              style={{ height: '60px', margin: '0 auto 12px', display: 'block', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }}
            />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0B3974', margin: '0 0 4px 0' }}>
              READ ACADEMY SAHIWAL
            </h2>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#E62929', letterSpacing: '0.08em' }}>
              PORTAL LOGIN • READ TO LEAD
            </div>
          </div>

          {/* Role Tabs */}
          <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '10px', marginBottom: '24px' }}>
            <button
              type="button"
              onClick={() => setRole('student')}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                backgroundColor: role === 'student' ? '#ffffff' : 'transparent',
                color: role === 'student' ? '#0B3974' : '#64748b',
                boxShadow: role === 'student' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              🎓 Student/Parent
            </button>
            <button
              type="button"
              onClick={() => setRole('teacher')}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                backgroundColor: role === 'teacher' ? '#ffffff' : 'transparent',
                color: role === 'teacher' ? '#0B3974' : '#64748b',
                boxShadow: role === 'teacher' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              👨‍🏫 Faculty
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                backgroundColor: role === 'admin' ? '#ffffff' : 'transparent',
                color: role === 'admin' ? '#E62929' : '#64748b',
                boxShadow: role === 'admin' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              🛡️ Admin
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Username / Email Field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {role === 'student' ? 'Roll No / Registration Email' : 'Institutional Email Address'}
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  {role === 'student' ? <User size={18} /> : <Mail size={18} />}
                </div>
                <input
                  type={role === 'student' && !email.includes('@') ? 'text' : 'email'}
                  required
                  placeholder={role === 'student' ? 'e.g. RAS-2026-89 or email@domain.com' : 'e.g. name@readacademy.edu.pk'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#0B3974')}
                  onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Password Reset Request Sent', 'Contact campus IT desk or call +92 40 4461001 to reset.', 'info');
                  }}
                  style={{ fontSize: '0.78rem', color: '#E62929', fontWeight: 700, textDecoration: 'none' }}
                >
                  Forgot password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 40px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
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
                    padding: '2px'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#E62929', cursor: 'pointer' }}
              />
              <label htmlFor="rememberMe" style={{ fontSize: '0.82rem', color: '#475569', cursor: 'pointer', fontWeight: 600 }}>
                Remember my login session on this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bca-btn bca-btn-gold"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '0.95rem',
                justifyContent: 'center',
                backgroundColor: role === 'admin' ? '#E62929' : '#0B3974',
                color: '#ffffff',
                border: 'none',
                marginTop: '4px'
              }}
            >
              <LogIn size={18} />
              <span>{isSubmitting ? 'Authenticating...' : `Log In as ${role === 'admin' ? 'Administrator' : role === 'teacher' ? 'Faculty Member' : 'Student / Parent'}`}</span>
            </button>

            {/* Toggle to Sign Up */}
            <div style={{ textAlign: 'center', paddingTop: '14px', borderTop: '1px solid #f1f5f9', marginTop: '6px' }}>
              <span style={{ fontSize: '0.84rem', color: '#64748b' }}>Don't have a portal account yet? </span>
              <button
                type="button"
                onClick={() => onNavigate('signup')}
                style={{ background: 'none', border: 'none', color: '#E62929', fontWeight: 800, fontSize: '0.84rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Register Account
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
