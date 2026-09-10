import React, { useState } from 'react';
import {
  School,
  Phone,
  Mail,
  LogIn,
  Menu,
  X,
  ArrowRight,
  Clock
} from 'lucide-react';
import { SCHOOL_INFO } from '../../mockData';

interface PublicHeaderProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onOpenAdmin: () => void;
  onOpenApply: () => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  activePage,
  setActivePage,
  onOpenAdmin,
  onOpenApply
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'academics', label: 'Academics' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'teachers', label: 'Faculty' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'events', label: 'Events' },
    { id: 'blog', label: 'Insights & News' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
      {/* Top Notification Bar */}
      <div
        style={{
          backgroundColor: '#061d3d',
          color: '#e2e8f0',
          padding: '8px 24px',
          fontSize: '0.78rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          borderBottom: '2px solid #FFD700'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Phone size={13} color="#FFD700" />
            <span>{SCHOOL_INFO.phone}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Mail size={13} color="#FFD700" />
            <span>{SCHOOL_INFO.email}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={13} color="#FFD700" />
            <span>Mon - Sat: 07:30 AM - 03:00 PM</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ color: '#FFD700', fontWeight: 700 }}>Admissions Open for Fall 2026</span>
          <button
            onClick={onOpenAdmin}
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              color: '#ffffff',
              border: '1px solid rgba(255,215,0,0.3)',
              borderRadius: '6px',
              padding: '3px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0B3974')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
          >
            <LogIn size={12} color="#FFD700" />
            <span>Portal Login</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f1f5f9'
        }}
      >
        {/* School Logo Brand */}
        <div
          onClick={() => handleNavClick('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <img
            src="/logo.png"
            alt="Read Academy Sahiwal"
            style={{
              height: '48px',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.15))'
            }}
          />
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0B3974', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              READ ACADEMY
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#E62929', letterSpacing: '0.12em' }}>
              SAHIWAL <span style={{ color: '#0B3974', fontWeight: 700 }}>• READ TO LEAD</span>
            </div>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav style={{ display: 'none', gap: '6px', alignItems: 'center' }} className="public-desktop-nav">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#0B3974' : '#334155',
                  backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  borderBottom: isActive ? '2px solid #FFD700' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onOpenApply}
            className="bca-btn bca-btn-gold"
            style={{ padding: '8px 18px', fontSize: '0.84rem' }}
          >
            <span>Apply Now</span>
            <ArrowRight size={15} />
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="bca-btn bca-btn-secondary"
            style={{ padding: '8px', display: 'flex', alignItems: 'center' }}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '3px solid #FFD700',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              style={{
                textAlign: 'left',
                padding: '10px 14px',
                borderRadius: '8px',
                background: activePage === link.id ? '#eff6ff' : 'none',
                color: activePage === link.id ? '#0B3974' : '#1e293b',
                fontWeight: activePage === link.id ? 800 : 600,
                border: 'none',
                fontSize: '0.92rem',
                cursor: 'pointer'
              }}
            >
              {link.label}
            </button>
          ))}
          <div style={{ paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px' }}>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
              className="bca-btn bca-btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <LogIn size={15} /> Admin Portal
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 992px) {
          .public-desktop-nav {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};
