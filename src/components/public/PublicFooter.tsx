import React, { useState } from 'react';
import {
  School,
  Mail,
  Phone,
  MapPin,
  Send,
  ShieldCheck
} from 'lucide-react';
import { SCHOOL_INFO } from '../../constants/schoolConfig';
import { useToast } from '../common/Toast';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { SCHOOL_WHATSAPP_NUMBER } from '../../utils/whatsapp';

const FacebookIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

interface PublicFooterProps {
  setActivePage: (page: string) => void;
  onOpenAdmin: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ setActivePage, onOpenAdmin }) => {
  const { showToast } = useToast();
  const [emailInput, setEmailInput] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    showToast('Subscribed to Newsletter', `Quarterly updates will be sent to ${emailInput}`, 'success');
    setEmailInput('');
  };

  const nav = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ backgroundColor: '#04142a', color: '#cbd5e1', paddingTop: '64px', paddingBottom: '32px', borderTop: '4px solid #E62929', position: 'relative' }}>
      <div className="brand-top-bar-gradient" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        {/* Top 4-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '48px'
          }}
        >
          {/* Col 1: About School */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src="/logo.png"
                alt="Read Academy Sahiwal Logo"
                style={{
                  height: '46px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff', fontWeight: 800 }}>
                  READ ACADEMY
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#FFD700', letterSpacing: '0.12em', fontWeight: 700 }}>
                  SAHIWAL • READ TO LEAD
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 16px 0' }}>
              Nursery to Matriculation, FA, FSC, ICS, I.Com & D.Com. Empowering visionary thinkers and ethical leaders through quality curriculum, disciplined character development, and interactive learning in Sahiwal.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#4CAF50', fontWeight: 600, marginBottom: '18px' }}>
              <ShieldCheck size={16} color="#4CAF50" />
              <span>Registered Institution • Since 2018</span>
            </div>

            {/* Social Media Channels */}
            <div>
              <div style={{ fontSize: '0.76rem', color: '#FFD700', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Follow Our Official Channels:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <a
                  href="https://www.facebook.com/share/1Bmqu8tzhU/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Follow Read Academy Sahiwal on Facebook"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(24, 119, 242, 0.15)',
                    color: '#ffffff',
                    border: '1px solid rgba(24, 119, 242, 0.45)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1877F2';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(24, 119, 242, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(24, 119, 242, 0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <FacebookIcon size={16} color="#ffffff" />
                  <span>Facebook</span>
                </a>

                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Follow Read Academy Sahiwal on Instagram"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'linear-gradient(45deg, rgba(240, 148, 51, 0.2), rgba(220, 39, 67, 0.2), rgba(188, 24, 136, 0.2))',
                    color: '#ffffff',
                    border: '1px solid rgba(225, 48, 108, 0.45)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(220, 39, 67, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(45deg, rgba(240, 148, 51, 0.2), rgba(220, 39, 67, 0.2), rgba(188, 24, 136, 0.2))';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <InstagramIcon size={16} color="#ffffff" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, margin: '0 0 16px 0' }}>
              Academic Exploration
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
              <li>
                <button onClick={() => nav('about')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0 }}>
                  About Our Institution
                </button>
              </li>
              <li>
                <button onClick={() => nav('academics')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0 }}>
                  Curriculum & Departments
                </button>
              </li>
              <li>
                <button onClick={() => nav('admissions')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0 }}>
                  Admissions Criteria & Forms
                </button>
              </li>
              <li>
                <button onClick={() => nav('teachers')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0 }}>
                  Faculty Directory
                </button>
              </li>
              <li>
                <button onClick={() => nav('careers')} style={{ background: 'none', border: 'none', color: '#FFD700', cursor: 'pointer', padding: 0, fontWeight: 700 }}>
                  Careers & Faculty Vacancies
                </button>
              </li>
              <li>
                <button onClick={() => nav('events')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0 }}>
                  Campus Events & Calendar
                </button>
              </li>
              <li>
                <button onClick={() => nav('login')} style={{ background: 'none', border: 'none', color: '#E62929', cursor: 'pointer', padding: 0, fontWeight: 800 }}>
                  Portal Login (Student / Teacher / Admin)
                </button>
              </li>
              <li>
                <button onClick={() => nav('signup')} style={{ background: 'none', border: 'none', color: '#FFD700', cursor: 'pointer', padding: 0, fontWeight: 700 }}>
                  Register New Account
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Campus Contact */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, margin: '0 0 16px 0' }}>
              Connect With Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <MapPin size={16} color="#FFD700" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{SCHOOL_INFO.address}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Phone size={16} color="#FFD700" style={{ flexShrink: 0 }} />
                <span>{SCHOOL_INFO.phone}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Mail size={16} color="#FFD700" style={{ flexShrink: 0 }} />
                <span>{SCHOOL_INFO.email}</span>
              </div>
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <WhatsAppButton
                  phone={SCHOOL_WHATSAPP_NUMBER}
                  label="Chat on WhatsApp"
                  message="Assalam-o-Alaikum! I want to inquire about Read Academy Sahiwal."
                  size="sm"
                  style={{ width: 'fit-content' }}
                />
                <button
                  onClick={() => nav('contact')}
                  className="bca-btn bca-btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.78rem', borderColor: 'rgba(255,255,255,0.2)', color: '#ffffff', width: 'fit-content' }}
                >
                  Schedule a Campus Tour
                </button>
              </div>
            </div>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, margin: '0 0 16px 0' }}>
              Institutional Gazette
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 14px 0', lineHeight: 1.5 }}>
              Receive quarterly newsletters, academic scholarship announcements, and campus event schedules.
            </p>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="email"
                required
                placeholder="Enter parent email..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  backgroundColor: '#0e2343',
                  color: '#ffffff',
                  fontSize: '0.82rem'
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#0B3974',
                  color: '#FFD700',
                  border: '1px solid #FFD700',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright & Affiliation Bar */}
        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.78rem',
            color: '#64748b'
          }}
        >
          <div>
            © {new Date().getFullYear()} Read Academy Sahiwal. All rights reserved. Registered Institution • Read To Lead (Since 2018).
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://www.facebook.com/share/1Bmqu8tzhU/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '5px', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#1877F2')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              <FacebookIcon size={14} color="currentColor" /> Facebook
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '5px', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#E1306C')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              <InstagramIcon size={14} color="currentColor" /> Instagram
            </a>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>Parent Code of Conduct</span>
            <span>Disciplinary Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
