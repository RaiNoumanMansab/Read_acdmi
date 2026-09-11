import React, { useState } from 'react';
import {
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  BookOpen,
  CheckCircle,
  ShieldCheck,
  Award,
  ArrowRight,
  School
} from 'lucide-react';
import { SCHOOL_INFO } from '../../../mockData';
import { useToast } from '../../common/Toast';

interface SignUpPageProps {
  onNavigate: (page: string) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [accountType, setAccountType] = useState<'parent' | 'student' | 'faculty'>('parent');
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rollOrClass, setRollOrClass] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !password) {
      showToast('Please complete all required fields', undefined, 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'Please verify your password entries.', 'error');
      return;
    }

    if (!agreeTerms) {
      showToast('Agreement Required', 'Please accept the Read Academy portal terms to proceed.', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      showToast(
        'Registration Application Submitted!',
        `Welcome ${fullName}! Your ${accountType} portal account is pending administrative verification.`,
        'success'
      );
      onNavigate('login');
    }, 700);
  };

  return (
    <div style={{ minHeight: '85vh', backgroundColor: '#f8fafc', padding: '60px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1020px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '36px', alignItems: 'center' }}>
        
        {/* Left Information Panel */}
        <div style={{ padding: '10px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#feecec', color: '#E62929', padding: '6px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800, marginBottom: '20px', border: '1px solid #fecaca' }}>
            <Award size={14} />
            <span>Official Student & Parent Portal Signup</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', fontWeight: 900, color: '#0f172a', lineHeight: 1.15, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
            Join the <span style={{ color: '#0B3974' }}>Read Academy</span> Community
          </h1>

          <p style={{ fontSize: '0.96rem', color: '#475569', lineHeight: 1.65, margin: '0 0 28px 0' }}>
            Create an official account to access child performance tracking, fee statements, BISE matriculation updates, and digital learning modules.
          </p>

          {/* Benefits Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#0B3974', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                <School size={18} />
              </div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>Unified Portal</h4>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>Link multiple siblings under one parent account.</p>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#feecec', color: '#E62929', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                <ShieldCheck size={18} />
              </div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>Verified Access</h4>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>Authorized by Read Academy Sahiwal IT administration.</p>
            </div>
          </div>

          <div style={{ backgroundColor: '#04142a', color: '#ffffff', padding: '20px', borderRadius: '14px', borderLeft: '4px solid #E62929' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              Admission Assistance Desk
            </div>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
              Need help registering your child? Visit our admissions office on College Road, Sahiwal or call <strong style={{ color: '#ffffff' }}>+92 40 4461001</strong>.
            </p>
          </div>
        </div>

        {/* Right Registration Form */}
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
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img
              src="/logo.png"
              alt="Read Academy Sahiwal"
              style={{ height: '56px', margin: '0 auto 10px', display: 'block', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }}
            />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0B3974', margin: '0 0 4px 0' }}>
              CREATE PORTAL ACCOUNT
            </h2>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#E62929', letterSpacing: '0.08em' }}>
              READ ACADEMY SAHIWAL • READ TO LEAD
            </div>
          </div>

          {/* Account Type Selector */}
          <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '10px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => setAccountType('parent')}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                backgroundColor: accountType === 'parent' ? '#ffffff' : 'transparent',
                color: accountType === 'parent' ? '#0B3974' : '#64748b',
                boxShadow: accountType === 'parent' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              👨‍👩‍👧 Parent
            </button>
            <button
              type="button"
              onClick={() => setAccountType('student')}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                backgroundColor: accountType === 'student' ? '#ffffff' : 'transparent',
                color: accountType === 'student' ? '#0B3974' : '#64748b',
                boxShadow: accountType === 'student' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              🎒 Student
            </button>
            <button
              type="button"
              onClick={() => setAccountType('faculty')}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                backgroundColor: accountType === 'faculty' ? '#ffffff' : 'transparent',
                color: accountType === 'faculty' ? '#E62929' : '#64748b',
                boxShadow: accountType === 'faculty' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              💼 Faculty Applicant
            </button>
          </div>

          <form onSubmit={handleSignUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <User size={16} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Ali Khan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.86rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Grid Row: Email & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Email Address *
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 10px 10px 34px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.84rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  WhatsApp / Phone *
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                    <Phone size={16} />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="0300-1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 10px 10px 34px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.84rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Roll No or Grade Level */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                {accountType === 'student' ? 'Roll No / Registration No' : accountType === 'parent' ? "Child's Admission Roll No or Grade" : 'Specialization / Subject'}
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <BookOpen size={16} />
                </div>
                <input
                  type="text"
                  placeholder={accountType === 'student' ? 'e.g. RAS-2026-89' : accountType === 'parent' ? 'e.g. Grade 9 / RAS-2026-89' : 'e.g. Mathematics / Physics'}
                  value={rollOrClass}
                  onChange={(e) => setRollOrClass(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.86rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Grid Row: Password & Confirm Password */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 30px 10px 34px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.84rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Confirm Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 10px 10px 34px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.84rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '2px' }}>
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#E62929', cursor: 'pointer', marginTop: '2px' }}
              />
              <label htmlFor="agreeTerms" style={{ fontSize: '0.78rem', color: '#475569', cursor: 'pointer', lineHeight: 1.4 }}>
                I agree to the Read Academy <strong style={{ color: '#0B3974' }}>Terms of Service</strong> and <strong style={{ color: '#0B3974' }}>Privacy Guidelines</strong>.
              </label>
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
                justifyContent: 'center',
                backgroundColor: '#0B3974',
                color: '#ffffff',
                border: 'none',
                marginTop: '6px'
              }}
            >
              <UserPlus size={18} />
              <span>{isSubmitting ? 'Registering Account...' : 'Complete Portal Registration'}</span>
            </button>

            {/* Toggle to Login */}
            <div style={{ textAlign: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '0.84rem', color: '#64748b' }}>Already have a registered account? </span>
              <button
                type="button"
                onClick={() => onNavigate('login')}
                style={{ background: 'none', border: 'none', color: '#E62929', fontWeight: 800, fontSize: '0.84rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Log In Here
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
