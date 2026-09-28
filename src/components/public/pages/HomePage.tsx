import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Clock,
  Compass,
  MapPin,
  Shield,
  Sparkles,
  Star,
  Users,
  Quote
} from 'lucide-react';
import { SCHOOL_INFO } from '../../../constants/schoolConfig';
import type { Testimonial } from '../../../constants/schoolConfig';
import { cmsApi, settingsApi } from '../../../services/api';

interface CounterItemProps {
  target: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sub: string;
  duration?: number;
}

const CounterItem: React.FC<CounterItemProps> = ({
  target,
  prefix = '',
  suffix = '',
  label,
  sub,
  duration = 1800
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Ease-out cubic formula
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * target));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(target);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.15 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, target, duration]);

  return (
    <div ref={elementRef} style={{ padding: '6px' }}>
      <div
        style={{
          fontSize: 'clamp(1.5rem, 3.8vw, 2.2rem)',
          fontWeight: 700,
          color: '#0B3974',
          letterSpacing: '-0.02em',
          lineHeight: 1.1
        }}
      >
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      <div style={{ fontSize: 'clamp(0.78rem, 2.2vw, 0.86rem)', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
        {label}
      </div>
      <div style={{ fontSize: 'clamp(0.68rem, 1.8vw, 0.74rem)', color: '#64748b', marginTop: '2px', lineHeight: 1.3 }}>
        {sub}
      </div>
    </div>
  );
};

interface RevealProps {
  children: React.ReactNode;
  animation?: 'up' | 'down' | 'left' | 'right' | 'zoom';
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  once?: boolean;
}

const Reveal: React.FC<RevealProps> = ({
  children,
  animation = 'up',
  delay = 0,
  duration = 750,
  className = '',
  style = {},
  once = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={`scroll-reveal scroll-reveal-${animation} ${isVisible ? 'is-in-view' : ''} ${className}`}
      style={{
        ...style,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

interface HomePageProps {
  onNavigate: (page: string) => void;
  onOpenApply: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenApply }) => {
  const [notices, setNotices] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    cmsApi.getNotices().then((res) => {
      if (res?.data) setNotices(res.data);
    }).catch((err) => {
      console.error('Error fetching notices:', err);
    });

    cmsApi.getEvents().then((res) => {
      if (res?.data) setEvents(res.data);
    }).catch((err) => {
      console.error('Error fetching events:', err);
    });

    settingsApi.getTestimonials().then((res) => {
      if (res?.data && res.data.length > 0) setTestimonials(res.data);
    }).catch(() => {});
  }, []);
  return (
    <div>
      {/* 1. HERO SECTION */}
      <section
        style={{
          position: 'relative',
          minHeight: 'auto',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #04142a 0%, #0B3974 55%, #0e458e 100%)',
          color: '#ffffff',
          overflow: 'hidden',
          padding: 'clamp(45px, 6vw, 95px) 16px'
        }}
      >
        {/* Background decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.18) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: 'clamp(28px, 4vw, 40px)',
              alignItems: 'center'
            }}
          >
            {/* Left Column: Text & Actions */}
            <div style={{ maxWidth: '620px' }}>
              <div className="hero-animate-1" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div
                  className="animate-float"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px',
                    borderRadius: '30px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 215, 0, 0.35)',
                    fontSize: 'clamp(0.68rem, 2.5vw, 0.78rem)',
                    fontWeight: 700,
                    color: '#FFD700',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    lineHeight: 1.35
                  }}
                >
                  <Sparkles size={13} color="#FFD700" style={{ flexShrink: 0 }} />
                  <span>Nursery to Matriculation, FA, FSC, ICS, I.Com & D.Com</span>
                </div>
              </div>

              <h1
                className="hero-animate-2"
                style={{
                  fontSize: 'clamp(1.75rem, 4.5vw, 2.75rem)',
                  fontWeight: 500,
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                  marginBottom: '16px',
                  color: '#ffffff',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  maxWidth: '100%'
                }}
              >
                <span className="text-gold-gradient">
                  Read To Lead:
                </span>{' '}
                <span style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
                  Empowering Future Leaders in Sahiwal
                </span>
              </h1>

              {/* Golden Decorative Divider */}
              <div
                className="hero-animate-2"
                style={{
                  width: '90px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #FFD700 0%, #E6C200 60%, transparent 100%)',
                  borderRadius: '2px',
                  marginBottom: '18px'
                }}
              />

              <p
                className="hero-animate-3"
                style={{
                  fontSize: 'clamp(0.88rem, 2.2vw, 1.05rem)',
                  color: '#e2e8f0',
                  lineHeight: 1.6,
                  marginBottom: '26px'
                }}
              >
                At Read Academy Sahiwal, established in 2018 with the motto "Read To Lead", we provide disciplined academic excellence from Nursery to Matriculation, FA, FSC, ICS, I.Com & D.Com, modern science labs, and transformative student character development.
              </p>

              <div className="hero-animate-4" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', width: '100%' }}>
                <button
                  onClick={onOpenApply}
                  className="bca-btn bca-btn-gold"
                  style={{ padding: '12px 20px', fontSize: '0.9rem', borderRadius: '10px' }}
                >
                  <span>Apply for Admission</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => onNavigate('academics')}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)')}
                >
                  Explore Curriculum
                </button>

                <button
                  onClick={() => onNavigate('contact')}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    background: 'none',
                    color: '#FFD700',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Schedule Campus Tour →
                </button>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase (Enhanced Landscape & Right-Aligned) */}
            <div className="hero-animate-3" style={{ position: 'relative', width: '100%', maxWidth: '720px', marginLeft: 'auto', marginRight: '0', justifySelf: 'end' }}>
              {/* Main Panoramic Image Frame */}
              <div
                style={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  background: '#0B3974',
                  zIndex: 1,
                  width: '100%',
                  height: 'clamp(220px, 35vw, 375px)'
                }}
              >
                <img
                  src="/read-academy-campus.jpg"
                  alt="Read Academy Sahiwal - The Royal Campus"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 35%',
                    display: 'block'
                  }}
                />

                {/* Subtle gradient overlay at the bottom of the photo */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(4, 20, 42, 0.92) 0%, rgba(4, 20, 42, 0.2) 55%, transparent 100%)',
                    pointerEvents: 'none'
                  }}
                />

                {/* Campus Tag inside bottom of image */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    right: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#FFD700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#04142a',
                        fontWeight: 700,
                        flexShrink: 0
                      }}
                    >
                      <Sparkles size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: 'clamp(0.76rem, 2.2vw, 0.84rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.15 }}>
                        The Royal Campus Sahiwal
                      </div>
                      <div style={{ fontSize: 'clamp(0.64rem, 1.8vw, 0.7rem)', color: '#cbd5e1' }}>
                        PRK Avenue Colony, Main Campus
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      background: 'rgba(22, 163, 74, 0.95)',
                      color: '#ffffff',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: 'clamp(0.65rem, 1.8vw, 0.72rem)',
                      fontWeight: 700,
                      backdropFilter: 'blur(4px)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Admissions Open 2026-27
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK STATS BANNER */}
      <section id="campus-stats" className="section-entrance-1" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: 'clamp(20px, 4vw, 32px) 16px', scrollMarginTop: '80px' }}>
        <Reveal>
          <div
            className="home-stats-grid"
            style={{
              maxWidth: '1280px',
              margin: '0 auto'
            }}
          >
            <CounterItem
              target={1248}
              suffix="+"
              label="Enrolled Scholars"
              sub="Nursery to Matric, FA, FSC, ICS, I.Com & D.Com"
            />
            <CounterItem
              target={86}
              label="Faculty Mentors"
              sub="100% Certified & Vetted"
            />
            <CounterItem
              target={24}
              suffix=":1"
              label="Student-Teacher Ratio"
              sub="Individualized Attention"
            />
            <CounterItem
              target={18}
              label="Advanced Laboratories"
              sub="Robotics, AI, Physics & Bio"
            />
          </div>
        </Reveal>
      </section>

      {/* 3. CORE VALUES / WHY CHOOSE US (Commented out)
      <section style={{ padding: 'clamp(40px, 7vw, 80px) 20px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px auto' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.12em', textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
              Institutional Distinction
            </span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', fontWeight: 700, lineHeight: 1.3, color: '#0f172a', margin: '8px 0 12px 0', letterSpacing: '-0.02em' }}>
              Why Read Academy Sahiwal Leads in Modern Education
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.6 }}>
              We balance rigorous academic foundations with experiential learning, technological fluency, and enduring ethical character.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}
          >
            {[
              {
                icon: BookOpen,
                title: 'Matriculation & SSC Science Track',
                desc: 'Comprehensive preparation for BISE Sahiwal Board Matriculation (Grades 9 & 10) with fully equipped modern science and IT laboratories.'
              },
              {
                icon: Sparkles,
                title: 'Robotics & STEM Innovation Lab',
                desc: 'Dedicated state-of-the-art incubation spaces equipped with 3D printers, IoT kits, coding workshops, and AI curriculum.'
              },
              {
                icon: Compass,
                title: 'Holistic Character Mentorship',
                desc: 'Our bespoke pastoral mentorship program pairs every student with an academic tutor focusing on integrity, empathy, and resilience.'
              },
              {
                icon: Award,
                title: 'Olympic-Standard Sports Complex',
                desc: 'Semi-Olympic swimming pool, all-weather synthetic football pitch, tennis courts, and certified physical coaches.'
              },
              {
                icon: Users,
                title: 'Active Parent-Teacher Alliance',
                desc: 'Real-time parent portal with instant attendance alerts, weekly grades, homework trackers, and bi-monthly symposiums.'
              },
              {
                icon: Shield,
                title: 'Zero-Tolerance Safety Protocol',
                desc: '24/7 CCTV-monitored campus, strict biometric gate access, trained on-site medical staff, and comprehensive child-safeguarding policies.'
              }
            ].map((v, idx) => {
              const Icon = v.icon;
              return (
                <div
                  key={idx}
                  className="bca-card"
                  style={{
                    padding: '28px',
                    borderRadius: '16px',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'default',
                    borderTop: '3px solid #E62929'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 16px 30px rgba(230, 41, 41, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--bca-shadow-sm)';
                  }}
                >
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      backgroundColor: '#feecec',
                      color: '#E62929',
                      border: '1px solid #fecaca',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '18px'
                    }}
                  >
                    <Icon size={24} color="#E62929" />
                  </div>
                  <h3 style={{ fontSize: '1.18rem', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>
                    {v.title}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      */}

      {/* 4. FEATURED ACADEMIC DIVISIONS */}
      <section id="academic-wings" className="section-entrance-2" style={{ padding: 'clamp(48px, 6vw, 80px) 16px', backgroundColor: '#ffffff', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto clamp(32px, 5vw, 52px) auto' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.12em', textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                Educational Continuum
              </span>
              <h2 style={{ fontSize: 'clamp(1.4rem, 3.2vw, 2.1rem)', fontWeight: 500, lineHeight: 1.3, color: '#0f172a', margin: '8px 0 14px 0', letterSpacing: '-0.02em' }}>
                Academic Wings — Nursery to Matriculation, FA, FSC, ICS, I.Com & D.Com
              </h2>
              <p style={{ fontSize: 'clamp(0.86rem, 2vw, 0.94rem)', color: '#64748b', lineHeight: 1.6 }}>
                From playful foundational inquiry to high-stakes pre-university and college board distinction.
              </p>
            </div>
          </Reveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: '20px'
            }}
          >
            {[
              {
                title: 'Early Years (Nursery & KG)',
                age: 'Ages 3 – 5 Years',
                desc: 'Montessori-inspired active exploration nurturing motor coordination, linguistic fluency, and emotional empathy.',
                image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
                badge: 'Play-Based Inquiry'
              },
              {
                title: 'Primary School (Grades 1 – 5)',
                age: 'Ages 6 – 10 Years',
                desc: 'Foundational literacy, conceptual mathematics, nature science, and artistic expression through thematic learning.',
                image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
                badge: 'Foundational Mastery'
              },
              {
                title: 'Middle School (Grades 6 – 8)',
                age: 'Ages 11 – 13 Years',
                desc: 'Transitional phase emphasizing scientific inquiry, analytical debate, coding fundamentals, and inter-school sports.',
                image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
                badge: 'Analytical Discovery'
              },
              {
                title: 'Senior School (Matriculation - Grades 9 & 10)',
                age: 'Ages 14 – 16 Years',
                desc: 'Specialized Matriculation (SSC-I & SSC-II) Science pathways preparing scholars for board distinctions and high academic achievement.',
                image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=600&auto=format&fit=crop&q=80',
                badge: 'Matric Excellence'
              },
              {
                title: 'College (FA, FSC, ICS, I.Com & D.Com)',
                age: 'Ages 16 – 18+ Years',
                desc: 'FSc Pre-Medical, FSc Pre-Engineering, ICS, I.Com, FA, and D.Com professional programs for higher board success.',
                image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80',
                badge: 'College Programs'
              }
            ].map((prog, idx) => (
              <Reveal key={idx} delay={idx * 100}>
                <div
                  className="bca-card card-interactive-lift"
                  style={{
                    overflow: 'hidden',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%'
                  }}
                >
                  <div>
                    <div style={{ height: 'clamp(150px, 35vw, 180px)', overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={prog.image}
                        alt={prog.title}
                        className="scale-hover-img"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          backgroundColor: '#0B3974',
                          color: '#ffffff',
                          border: '1px solid #FFD700',
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}
                      >
                        {prog.badge}
                      </span>
                    </div>

                    <div style={{ padding: 'clamp(16px, 3.5vw, 22px)' }}>
                      <span style={{ fontSize: '0.76rem', color: '#0B3974', fontWeight: 800 }}>{prog.age}</span>
                      <h3 style={{ fontSize: 'clamp(1.05rem, 2.5vw, 1.15rem)', fontWeight: 500, margin: '4px 0 10px 0', color: '#0f172a' }}>
                        {prog.title}
                      </h3>
                      <p style={{ fontSize: 'clamp(0.82rem, 2vw, 0.86rem)', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                        {prog.desc}
                      </p>
                    </div>
                  </div>

                  <div style={{ padding: '12px clamp(16px, 3.5vw, 22px)', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => onNavigate('academics')}
                      style={{ background: 'none', border: 'none', color: '#0B3974', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      Curriculum Details <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRINCIPAL'S MESSAGE SPOTLIGHT */}
      <section id="welcome-messages" className="section-entrance-3" style={{ padding: 'clamp(48px, 6vw, 80px) 16px', backgroundColor: '#04142a', color: '#ffffff', position: 'relative', scrollMarginTop: '80px' }}>
        <div className="brand-top-bar-gradient" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(28px, 4vw, 48px)',
            alignItems: 'center'
          }}
        >
          <Reveal animation="left" duration={800}>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                  border: '3px solid #E62929'
                }}
              >
                <img
                  src="/principal.jpg"
                  alt="Principal - Read Academy Sahiwal"
                  className="scale-hover-img"
                  style={{ width: '100%', height: 'clamp(260px, 45vw, 440px)', objectFit: 'cover', objectPosition: 'center 15%' }}
                />
              </div>
              <div
                className="animate-float"
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  backgroundColor: '#E62929',
                  color: '#ffffff',
                  border: '2px solid #FFD700',
                  padding: 'clamp(6px, 2vw, 10px) clamp(10px, 2.5vw, 16px)',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: 'clamp(0.72rem, 2vw, 0.82rem)',
                  boxShadow: '0 10px 20px rgba(230,41,41,0.5)',
                  maxWidth: 'calc(100% - 24px)',
                  whiteSpace: 'nowrap'
                }}
              >
                25+ Years in Academic Leadership
              </div>
            </div>
          </Reveal>

          <Reveal animation="right" duration={800} delay={150}>
            <div>
              <Quote size={36} color="#E62929" style={{ marginBottom: '14px', filter: 'drop-shadow(0 2px 8px rgba(230,41,41,0.4))' }} />
              <h2 style={{ fontSize: 'clamp(1.25rem, 3.2vw, 2rem)', fontWeight: 500, lineHeight: 1.3, margin: '0 0 16px 0', letterSpacing: '-0.015em' }}>
                "We prepare our students not merely for exams, but for the moral and intellectual leadership of tomorrow."
              </h2>
              <p style={{ fontSize: 'clamp(0.86rem, 2.2vw, 0.94rem)', color: '#cbd5e1', lineHeight: 1.7, margin: '0 0 20px 0' }}>
                True education transcends textbook memorization. At Read Academy Sahiwal, our teachers awaken curiosity, instill rigorous habits of critical inquiry, and cultivate students who take pride in community service and intellectual independence.
              </p>
              <div>
                <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', fontWeight: 800, color: '#ffffff' }}>
                  {SCHOOL_INFO.principal}
                </div>
                <div style={{ fontSize: 'clamp(0.76rem, 2vw, 0.84rem)', color: '#FFD700', fontWeight: 700 }}>
                  Executive Principal & Academic Director (Ph.D. Oxford)
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. LATEST NOTICES & UPCOMING EVENTS SPLIT */}
      <section id="notices-events" className="section-entrance-4" style={{ padding: 'clamp(48px, 6vw, 80px) 16px', backgroundColor: '#f8fafc', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))', gap: 'clamp(24px, 4vw, 32px)' }}>
            {/* Notices List */}
            <Reveal animation="left" delay={80}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.4rem)', fontWeight: 500, color: '#0f172a', margin: 0 }}>
                    Campus Announcements
                  </h3>
                  <button
                    onClick={() => onNavigate('events')}
                    style={{ background: 'none', border: 'none', color: '#E62929', fontWeight: 800, fontSize: '0.84rem', cursor: 'pointer' }}
                  >
                    View All →
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {notices.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.86rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                      No announcements currently published in database.
                    </div>
                  ) : notices.slice(0, 3).map((notice) => (
                    <div
                      key={notice.id}
                      className="bca-card card-interactive-lift"
                      style={{
                        padding: 'clamp(14px, 3vw, 18px)',
                        borderRadius: '12px',
                        borderLeft: notice.priority === 'URGENT' || notice.priority === 'Urgent' ? '4px solid #E62929' : '4px solid #0B3974'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span className={`bca-badge ${notice.priority === 'URGENT' || notice.priority === 'Urgent' ? 'bca-badge-red' : 'bca-badge-primary'}`}>{notice.category}</span>
                        <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{notice.publishedDate ? new Date(notice.publishedDate).toLocaleDateString() : notice.date}</span>
                      </div>
                      <h4 style={{ fontSize: '0.96rem', fontWeight: 500, margin: '0 0 6px 0', color: '#0f172a' }}>
                        {notice.title}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                        {notice.content ? notice.content.slice(0, 110) : ''}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Events List */}
            <Reveal animation="right" delay={180}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.4rem)', fontWeight: 500, color: '#0f172a', margin: 0 }}>
                    Upcoming Events
                  </h3>
                  <button
                    onClick={() => onNavigate('events')}
                    style={{ background: 'none', border: 'none', color: '#0B3974', fontWeight: 800, fontSize: '0.84rem', cursor: 'pointer' }}
                  >
                    Full Calendar →
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {events.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.86rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                      No upcoming events scheduled in database.
                    </div>
                  ) : events.slice(0, 3).map((evt) => (
                    <div
                      key={evt.id}
                      className="bca-card card-interactive-lift"
                      style={{
                        padding: 'clamp(12px, 3vw, 18px)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'clamp(10px, 2.5vw, 16px)'
                      }}
                    >
                      <div
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#eff6ff',
                          color: '#0B3974',
                          borderRadius: '10px',
                          textAlign: 'center',
                          fontWeight: 700,
                          border: '1px solid #bfdbfe',
                          minWidth: '52px',
                          flexShrink: 0
                        }}
                      >
                        <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {evt.eventDate ? new Date(evt.eventDate).toLocaleString('default', { month: 'short' }) : 'EVENT'}
                        </div>
                        <div style={{ fontSize: '1.25rem', lineHeight: 1.1 }}>
                          {evt.eventDate ? new Date(evt.eventDate).getDate() : ''}
                        </div>
                      </div>
                      <div>
                        <span className="bca-badge bca-badge-blue" style={{ marginBottom: '4px' }}>{evt.category}</span>
                        <h4 style={{ fontSize: '0.94rem', fontWeight: 500, margin: '2px 0 4px 0', color: '#0f172a' }}>
                          {evt.title}
                        </h4>
                        <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                          {evt.location} • {evt.eventTime || 'TBA'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 7. PARENT & ALUMNI TESTIMONIALS */}
      <section id="parent-testimonials" className="section-entrance-5" style={{ padding: 'clamp(48px, 6vw, 80px) 16px', backgroundColor: '#ffffff', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto clamp(28px, 4vw, 48px)' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.12em', textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                PARENT TESTIMONIALS & TRUST
              </span>
              <h2 style={{ fontSize: 'clamp(1.4rem, 3.2vw, 2.1rem)', fontWeight: 500, lineHeight: 1.3, color: '#0f172a', margin: '8px 0 12px' }}>
                What Our Community Says
              </h2>
              <p style={{ fontSize: 'clamp(0.86rem, 2vw, 0.94rem)', color: '#64748b', margin: 0 }}>
                Hear reflections from parents and alumni on how Read Academy Sahiwal shaped their developmental journey.
              </p>
            </div>
          </Reveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '20px'
            }}
          >
            {testimonials.map((test: Testimonial, idx: number) => (
              <Reveal key={test.id} delay={idx * 120}>
                <div
                  className="bca-card card-interactive-lift"
                  style={{
                    padding: 'clamp(18px, 4vw, 28px)',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} size={15} fill="#FFD700" color="#FFD700" />
                      ))}
                    </div>

                    <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.65, fontStyle: 'italic', margin: '0 0 18px 0' }}>
                      "{test.content}"
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                    <img
                      src={test.avatar}
                      alt={test.name}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>{test.name}</div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{test.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section
        style={{
          background: 'linear-gradient(135deg, #04142a 0%, #0B3974 60%, #082a57 100%)',
          color: '#ffffff',
          padding: 'clamp(48px, 6vw, 80px) 16px',
          textAlign: 'center',
          borderTop: '4px solid #E62929',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.45rem, 3.8vw, 2.4rem)', fontWeight: 500, lineHeight: 1.25, letterSpacing: '-0.02em', margin: '0 0 16px 0' }}>
            Empower Your Child With Exceptional Foundations
          </h2>
          <p style={{ fontSize: 'clamp(0.88rem, 2.2vw, 1.05rem)', color: '#dbeafe', lineHeight: 1.65, margin: '0 0 clamp(20px, 4vw, 32px) 0' }}>
            Cohort seats for the upcoming academic session are allocated on merit and assessment evaluation. Schedule a campus tour or begin your online application today.
          </p>

          <div className="home-cta-buttons" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onOpenApply}
              className="bca-btn bca-btn-gold"
              style={{
                padding: '12px 24px',
                fontSize: '0.94rem',
                borderRadius: '10px'
              }}
            >
              Start Admission Application
            </button>
            <button
              onClick={() => onNavigate('contact')}
              style={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.35)',
                borderRadius: '10px',
                padding: '12px 22px',
                fontSize: '0.94rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Book a Guided Campus Tour
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
