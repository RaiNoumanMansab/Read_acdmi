import React, { useState } from 'react';
import {
  School,
  Mail,
  Phone,
  MapPin,
  Send,
  ShieldCheck
} from 'lucide-react';
import { SCHOOL_INFO } from '../../mockData';
import { useToast } from '../common/Toast';

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
    <footer style={{ backgroundColor: '#04142a', color: '#cbd5e1', paddingTop: '64px', paddingBottom: '32px', borderTop: '4px solid #FFD700' }}>
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
              Empowering visionary thinkers and ethical leaders through quality curriculum, disciplined character development, and interactive learning in Sahiwal.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#4CAF50', fontWeight: 600 }}>
              <ShieldCheck size={16} color="#4CAF50" />
              <span>Registered Institution • Since 2018</span>
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
                <button onClick={() => nav('events')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0 }}>
                  Campus Events & Calendar
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} style={{ background: 'none', border: 'none', color: '#FFD700', cursor: 'pointer', padding: 0, fontWeight: 700 }}>
                  Faculty / Admin Portal Login
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
              <div style={{ marginTop: '8px' }}>
                <button
                  onClick={() => nav('contact')}
                  className="bca-btn bca-btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.78rem', borderColor: 'rgba(255,255,255,0.2)', color: '#ffffff' }}
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

          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy Policy</span>
            <span>Parent Code of Conduct</span>
            <span>Disciplinary Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
