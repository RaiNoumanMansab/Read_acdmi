import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogIn,
  LogOut,
  ArrowRight,
  ChevronDown,
  Menu,
  X
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
  const [expandedMobileDropdown, setExpandedMobileDropdown] = useState<string | null>(null);

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
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubItemClick = (sub: SubItem) => {
    if (sub.action === 'apply') {
      onOpenApply();
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
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', backgroundColor: '#ffffff', borderBottom: '3px solid #E62929' }}>
      {/* Main Navigation Bar */}
      <div
        style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '8px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxSizing: 'border-box'
        }}
      >
        {/* Left: School Logo Brand (flex: 1 to balance right side) */}
        <div
          style={{
            flex: '1 1 0%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            minWidth: 'max-content'
          }}
        >
          <div
            onClick={() => handleNavClick('home')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <img
              src="/logo.png"
              alt="Read Academy Sahiwal"
              style={{
                height: '42px',
                width: 'auto',
                objectFit: 'contain',
                flexShrink: 0,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))'
              }}
            />
            <div style={{ flexShrink: 0, lineHeight: 1.15 }}>
              <div style={{ fontSize: 'clamp(0.92rem, 1.2vw, 1.15rem)', fontWeight: 700, color: '#0B3974', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                READ ACADEMY
              </div>
              <div style={{ fontSize: 'clamp(0.6rem, 0.72vw, 0.68rem)', fontWeight: 700, color: '#E62929', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                SAHIWAL <span style={{ color: '#0B3974', fontWeight: 700 }}>• READ TO LEAD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation in the Exact Middle */}
        <nav
          className="hidden lg:flex items-center justify-center gap-1"
          style={{
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}
        >
          {navLinks.map((link, idx) => {
            const isActive = activePage === link.id;
            return (
              <div key={link.id} className="nav-dropdown-wrapper">
                <button
                  onClick={(e) => {
                    handleNavClick(link.id);
                    (e.currentTarget as HTMLElement).blur();
                  }}
                  className="nav-animate-item nav-btn-animated nav-link-btn"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '7px 9px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: isActive ? '#0B3974' : '#334155',
                    backgroundColor: isActive ? '#eff6ff' : 'transparent',
                    borderBottom: isActive ? '3px solid #E62929' : '3px solid transparent',
                    cursor: 'pointer',
                    animationDelay: `${idx * 35}ms`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ whiteSpace: 'nowrap' }}>{link.label}</span>
                  {link.subItems && (
                    <ChevronDown size={13} className="nav-chevron-icon" style={{ opacity: 0.65, flexShrink: 0 }} />
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

        {/* Right: Actions (flex: 1 to balance left side) */}
        <div
          style={{
            flex: '1 1 0%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            minWidth: 'max-content',
            gap: '8px'
          }}
        >
          {/* Desktop Auth / Portal Actions */}
          {user ? (
            <div className="hidden lg:inline-flex items-center" style={{ gap: '6px' }}>
              <button
                onClick={handlePortalRedirect}
                className="bca-btn"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  backgroundColor: '#eff6ff',
                  color: '#0B3974',
                  border: '1.5px solid #bfdbfe',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
                title={`Logged in as ${user.fullName} (${user.role}) - Click to open ERP`}
              >
                <LogIn size={13} color="#0B3974" />
                <span>{user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? 'Admin ERP' : `${user.role} Portal`}</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="bca-btn"
                style={{
                  padding: '6px 10px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  backgroundColor: '#fff1f2',
                  color: '#e11d48',
                  border: '1.5px solid #fecdd3',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
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
              className="bca-btn hidden lg:inline-flex"
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                backgroundColor: activePage === 'login' ? '#feecec' : '#ffffff',
                color: '#E62929',
                border: '1.5px solid #fecaca',
                borderRadius: '8px',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              title="Institutional Login"
            >
              <LogIn size={13} color="#E62929" />
              <span>Login</span>
            </button>
          )}

          {/* Apply Now button */}
          <button
            onClick={onOpenApply}
            className="bca-btn bca-btn-gold"
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              borderRadius: '8px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <span>Apply Now</span>
            <ArrowRight size={12} />
          </button>

          {/* Mobile Hamburger Bars (☰) Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex lg:hidden items-center justify-center"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              border: '1.5px solid #bfdbfe',
              color: '#0B3974',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.15s ease'
            }}
            aria-label="Open Navigation Menu"
            title="Open Menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Slide-over Bars Menu) */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(4, 20, 42, 0.65)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '85%',
              maxWidth: '340px',
              height: '100%',
              backgroundColor: '#ffffff',
              boxShadow: '-8px 0 30px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Top Header */}
            <div
              style={{
                padding: '16px 18px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#04142a',
                color: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/logo.png" alt="Read Academy" style={{ height: '34px', width: 'auto' }} />
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                    READ ACADEMY
                  </div>
                  <div style={{ fontSize: '0.6rem', color: '#FFD700', fontWeight: 700, letterSpacing: '0.08em' }}>
                    SAHIWAL • READ TO LEAD
                  </div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: 'none',
                  borderRadius: '8px',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav Links Body */}
            <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {navLinks.map((link) => {
                  const isActive = activePage === link.id;
                  const isExpanded = expandedMobileDropdown === link.id;
                  return (
                    <div key={link.id} style={{ borderRadius: '10px', overflow: 'hidden' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: isActive ? '#eff6ff' : 'transparent',
                          borderRadius: '10px'
                        }}
                      >
                        <button
                          onClick={() => {
                            handleNavClick(link.id);
                            setMobileMenuOpen(false);
                          }}
                          style={{
                            flex: 1,
                            textAlign: 'left',
                            background: 'none',
                            border: 'none',
                            padding: '11px 12px',
                            fontSize: '0.92rem',
                            fontWeight: 700,
                            color: isActive ? '#0B3974' : '#1e293b',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isActive ? '#E62929' : 'transparent' }} />
                          <span>{link.label}</span>
                        </button>

                        {link.subItems && (
                          <button
                            onClick={() => setExpandedMobileDropdown(isExpanded ? null : link.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '11px 12px',
                              color: '#64748b',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            aria-label="Toggle sub-items"
                          >
                            <ChevronDown
                              size={16}
                              style={{
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease'
                              }}
                            />
                          </button>
                        )}
                      </div>

                      {/* Sub-items accordion */}
                      {link.subItems && isExpanded && (
                        <div style={{ paddingLeft: '20px', paddingRight: '8px', paddingBottom: '6px', paddingTop: '2px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          {link.subItems.map((sub, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => {
                                handleSubItemClick(sub);
                                setMobileMenuOpen(false);
                              }}
                              style={{
                                width: '100%',
                                textAlign: 'left',
                                background: 'none',
                                border: 'none',
                                padding: '8px 10px',
                                fontSize: '0.82rem',
                                fontWeight: 600,
                                color: '#475569',
                                cursor: 'pointer',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <span style={{ color: '#0B3974' }}>›</span>
                              <span>{sub.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div style={{ padding: '16px 18px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenApply();
                }}
                className="bca-btn bca-btn-gold"
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>Apply for Admission</span>
                <ArrowRight size={14} />
              </button>

              {user ? (
                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handlePortalRedirect();
                    }}
                    style={{
                      flex: 1,
                      padding: '9px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      backgroundColor: '#eff6ff',
                      color: '#0B3974',
                      border: '1.5px solid #bfdbfe',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px'
                    }}
                  >
                    <LogIn size={13} />
                    <span>{user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? 'Admin ERP' : 'Portal'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    style={{
                      padding: '9px 12px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      backgroundColor: '#fff1f2',
                      color: '#e11d48',
                      border: '1.5px solid #fecdd3',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <LogOut size={13} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleNavClick('login');
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    backgroundColor: '#ffffff',
                    color: '#E62929',
                    border: '1.5px solid #fecaca',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <LogIn size={14} />
                  <span>Portal Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
