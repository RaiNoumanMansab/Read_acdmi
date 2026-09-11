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
      {/* Main Navigation Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '3px solid #E62929',
          gap: '12px'
        }}
      >
        {/* School Logo Brand */}
        <div
          onClick={() => handleNavClick('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', minWidth: 0 }}
        >
          <img
            src="/logo.png"
            alt="Read Academy Sahiwal"
            style={{
              height: '40px',
              width: 'auto',
              objectFit: 'contain',
              flexShrink: 0,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))'
            }}
          />
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 'clamp(0.88rem, 3.5vw, 1.18rem)', fontWeight: 900, color: '#0B3974', letterSpacing: '-0.02em', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
              READ ACADEMY
            </div>
            <div style={{ fontSize: 'clamp(0.58rem, 1.8vw, 0.7rem)', fontWeight: 800, color: '#E62929', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
              SAHIWAL <span style={{ color: '#0B3974', fontWeight: 700 }}>• READ TO LEAD</span>
            </div>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex gap-1 items-center">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#0B3974' : '#334155',
                  backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  borderBottom: isActive ? '2px solid #E62929' : '2px solid transparent',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Portal Login Button */}
          <button
            onClick={() => handleNavClick('login')}
            className="bca-btn hidden md:inline-flex"
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 800,
              backgroundColor: activePage === 'login' ? '#feecec' : '#f8fafc',
              color: '#E62929',
              border: '1px solid #fecaca',
              borderRadius: '8px'
            }}
          >
            <LogIn size={13} color="#E62929" />
            <span>Portal Login</span>
          </button>

          {/* Register / Sign Up Button */}
          <button
            onClick={() => handleNavClick('signup')}
            className="bca-btn hidden xl:inline-flex"
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 800,
              backgroundColor: activePage === 'signup' ? '#0B3974' : '#eff6ff',
              color: activePage === 'signup' ? '#ffffff' : '#0B3974',
              border: '1px solid #bfdbfe',
              borderRadius: '8px'
            }}
          >
            <span>Register</span>
          </button>

          {/* Apply Now button */}
          <button
            onClick={onOpenApply}
            className="bca-btn bca-btn-gold hidden sm:inline-flex"
            style={{ padding: '7px 14px', fontSize: '0.8rem' }}
          >
            <span>Apply Now</span>
            <ArrowRight size={14} />
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="bca-btn bca-btn-secondary flex lg:hidden items-center p-2"
            style={{ padding: '6px 10px', width: '36px', height: '36px', justifyContent: 'center' }}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="animate-slide-down"
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '3px solid #E62929',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
          }}
        >
          <button
            onClick={() => { setMobileMenuOpen(false); onOpenApply(); }}
            className="bca-btn bca-btn-gold"
            style={{ width: '100%', justifyContent: 'center', margin: '0 0 10px 0', padding: '10px', fontSize: '0.9rem' }}
          >
            <span>Apply for Admission Now</span>
            <ArrowRight size={16} />
          </button>

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
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              {link.label}
            </button>
          ))}
          <div style={{ paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleNavClick('login')}
                className="bca-btn bca-btn-gold"
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.84rem' }}
              >
                <LogIn size={15} /> Portal Login
              </button>
              <button
                onClick={() => handleNavClick('signup')}
                className="bca-btn bca-btn-secondary"
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.84rem' }}
              >
                Sign Up
              </button>
            </div>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #fecaca',
                backgroundColor: '#feecec',
                color: '#E62929',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              🛡️ Enter Super Admin ERP Portal
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
