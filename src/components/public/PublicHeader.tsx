import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  School,
  Phone,
  Mail,
  LogIn,
  LogOut,
  Menu,
  X,
  ArrowRight,
  Clock,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SubItem {
  label: string;
  targetPage: string;
  sectionId?: string;
  action?: 'apply' | 'navigate';
}

interface NavLink {
  id: string;
  label: string;
  subItems?: SubItem[];
}

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
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePortalRedirect = () => {
    if (!user) {
      handleNavClick('login');
      return;
    }
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (user.role === 'TEACHER') {
      navigate('/portal/teacher');
    } else {
      navigate('/portal/student');
    }
  };

  const navLinks: NavLink[] = [
    {
      id: 'home',
      label: 'Home',
      subItems: [
        { label: 'Welcome Messages', targetPage: 'home', sectionId: 'welcome-messages' },
        { label: 'Academic Wings', targetPage: 'home', sectionId: 'academic-wings' },
        { label: 'Campus Statistics', targetPage: 'home', sectionId: 'campus-stats' },
        { label: 'Campus Announcements', targetPage: 'home', sectionId: 'notices-events' },
        { label: 'Parent Testimonials', targetPage: 'home', sectionId: 'parent-testimonials' }
      ]
    },
    {
      id: 'about',
      label: 'About Us',
      subItems: [
        { label: 'Overview & Mission', targetPage: 'about' },
        { label: 'Principal Spotlight', targetPage: 'home', sectionId: 'welcome-messages' },
        { label: 'Core Philosophy', targetPage: 'about' }
      ]
    },
    {
      id: 'academics',
      label: 'Academics',
      subItems: [
        { label: 'Early Years (Nursery & KG)', targetPage: 'academics' },
        { label: 'Primary Wing (Grade 1 - 5)', targetPage: 'academics' },
        { label: 'Middle School (Grade 6 - 8)', targetPage: 'academics' },
        { label: 'Senior School (Matric)', targetPage: 'academics' },
        { label: 'College (FA, FSC, ICS, I.Com)', targetPage: 'academics' }
      ]
    },
    {
      id: 'admissions',
      label: 'Admissions',
      subItems: [
        { label: 'Admission Criteria & Policy', targetPage: 'admissions' },
        { label: 'Fee Structure', targetPage: 'admissions' },
        { label: 'Apply Online Now', targetPage: 'admissions', action: 'apply' }
      ]
    },
    {
      id: 'teachers',
      label: 'Faculty',
      subItems: [
        { label: 'Academic Mentors', targetPage: 'teachers' },
        { label: 'Department Leadership', targetPage: 'teachers' }
      ]
    },
    { id: 'careers', label: 'Careers' },
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

  const handleSubItemClick = (sub: SubItem) => {
    if (sub.action === 'apply') {
      onOpenApply();
      setMobileMenuOpen(false);
      return;
    }
    if (activePage !== sub.targetPage) {
      setActivePage(sub.targetPage);
      if (sub.sectionId) {
        setTimeout(() => {
          const el = document.getElementById(sub.sectionId!);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (sub.sectionId) {
      const el = document.getElementById(sub.sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
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
          {navLinks.map((link, idx) => {
            const isActive = activePage === link.id;
            return (
              <div key={link.id} className="nav-dropdown-wrapper">
                <button
                  onClick={(e) => {
                    handleNavClick(link.id);
                    (e.currentTarget as HTMLElement).blur();
                  }}
                  className="nav-animate-item nav-btn-animated"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '7px 11px',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? '#0B3974' : '#334155',
                    backgroundColor: 'transparent',
                    borderBottom: isActive ? '3px solid #E62929' : '3px solid transparent',
                    cursor: 'pointer',
                    animationDelay: `${idx * 45}ms`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{link.label}</span>
                  {link.subItems && (
                    <ChevronDown size={13} className="nav-chevron-icon" style={{ opacity: 0.65 }} />
                  )}
                </button>

                {link.subItems && (
                  <div className="nav-dropdown-box">
                    {link.subItems.map((sub, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          (e.currentTarget as HTMLElement).blur();
                          handleSubItemClick(sub);
                        }}
                        className="nav-dropdown-item"
                      >
                        <span>{sub.label}</span>
                        <span className="nav-dropdown-arrow">›</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Action Buttons: Only Login and Apply Now */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* Login or Active Portal Button */}
          {user ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handlePortalRedirect}
                className="bca-btn"
                style={{
                  padding: '7px 16px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  backgroundColor: '#eff6ff',
                  color: '#0B3974',
                  border: '1.5px solid #bfdbfe',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
                title={`Logged in as ${user.fullName} (${user.role}) - Click to open ERP`}
              >
                <LogIn size={14} color="#0B3974" />
                <span>{user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? 'Admin ERP' : `${user.role} Portal`}</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="bca-btn"
                style={{
                  padding: '7px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  backgroundColor: '#fff1f2',
                  color: '#e11d48',
                  border: '1.5px solid #fecdd3',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer'
                }}
                title="Logout from session"
              >
                <LogOut size={13} color="#e11d48" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('login')}
              className="bca-btn"
              style={{
                padding: '7px 16px',
                fontSize: '0.82rem',
                fontWeight: 800,
                backgroundColor: activePage === 'login' ? '#feecec' : '#ffffff',
                color: '#E62929',
                border: '1.5px solid #fecaca',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Institutional Login"
            >
              <LogIn size={14} color="#E62929" />
              <span>Login</span>
            </button>
          )}

          {/* Apply Now button */}
          <button
            onClick={onOpenApply}
            className="bca-btn bca-btn-gold"
            style={{
              padding: '7px 16px',
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '8px',
              fontWeight: 800
            }}
          >
            <span>Apply Now</span>
            <ArrowRight size={14} />
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
            <div key={link.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <button
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
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>{link.label}</span>
                {link.subItems && <ChevronDown size={14} style={{ opacity: 0.5 }} />}
              </button>

              {link.subItems && (
                <div style={{ paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '3px', borderLeft: '2px solid #E62929', marginLeft: '16px', margin: '4px 0 6px 16px' }}>
                  {link.subItems.map((sub, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSubItemClick(sub)}
                      style={{
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        padding: '6px 10px',
                        color: '#475569',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      • {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div style={{ paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {user ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handlePortalRedirect();
                  }}
                  className="bca-btn bca-btn-primary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.86rem', padding: '10px' }}
                >
                  <LogIn size={15} /> Open {user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? 'Admin ERP' : `${user.role} Portal`}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="bca-btn"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    fontSize: '0.84rem',
                    padding: '8px',
                    color: '#e11d48',
                    backgroundColor: '#fff1f2',
                    border: '1px solid #fecdd3',
                    borderRadius: '8px'
                  }}
                >
                  <LogOut size={14} /> Logout ({user.fullName})
                </button>
              </>
            ) : (
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
            )}
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
