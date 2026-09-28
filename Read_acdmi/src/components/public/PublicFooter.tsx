import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send
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

export const PublicFooter: React.FC<PublicFooterProps> = ({ setActivePage: _setActivePage, onOpenAdmin: _onOpenAdmin }) => {
  const { showToast } = useToast();
  const [emailInput, setEmailInput] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    showToast('Subscribed to Newsletter', `Quarterly updates will be sent to ${emailInput}`, 'success');
    setEmailInput('');
  };

  return (
    <footer style={{ backgroundColor: '#04142a', color: '#cbd5e1', paddingTop: 'clamp(44px, 6vw, 64px)', paddingBottom: 'clamp(48px, 6vw, 64px)', borderTop: '4px solid #E62929', position: 'relative', width: '100%', boxSizing: 'border-box' }}>
      <div className="brand-top-bar-gradient" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 24px)', boxSizing: 'border-box' }}>
        {/* Top 4-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
            gap: 'clamp(28px, 4vw, 40px)',
            marginBottom: 'clamp(32px, 5vw, 48px)'
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

            {/* Social Media Channels (Icon-only) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '18px' }}>
              <a
                href="https://www.facebook.com/share/1Bmqu8tzhU/"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow Read Academy Sahiwal on Facebook"
                aria-label="Facebook"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.25s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1877F2';
                  e.currentTarget.style.borderColor = '#1877F2';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(24, 119, 242, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <FacebookIcon size={18} color="#ffffff" />
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow Read Academy Sahiwal on Instagram"
                aria-label="Instagram"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.25s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(220, 39, 67, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <InstagramIcon size={18} color="#ffffff" />
              </a>
            </div>
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
              <div style={{ marginTop: '8px' }}>
                <WhatsAppButton
                  phone={SCHOOL_WHATSAPP_NUMBER}
                  label="Chat on WhatsApp"
                  message="Assalam-o-Alaikum! I want to inquire about Read Academy Sahiwal."
                  size="sm"
                  style={{ width: 'fit-content' }}
                />
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

            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="email"
                required
                placeholder="Enter parent email..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                style={{
                  flex: '1 1 180px',
                  minWidth: 0,
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  backgroundColor: '#0e2343',
                  color: '#ffffff',
                  fontSize: '0.84rem'
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#0B3974',
                  color: '#FFD700',
                  border: '1px solid #FFD700',
                  borderRadius: '8px',
                  padding: '9px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
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
            paddingTop: '20px',
            paddingBottom: '8px',
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
            © {new Date().getFullYear()} Read Academy Sahiwal. All rights reserved. Read To Lead.
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
