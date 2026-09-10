import React from 'react';
import {
  Compass,
  Target,
  Eye
} from 'lucide-react';
import { SCHOOL_INFO } from '../../../mockData';

export const AboutPage: React.FC = () => {
  return (
    <div>
      {/* Hero Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #04142a 0%, #0B3974 55%, #0e458e 100%)',
          color: '#ffffff',
          padding: '70px 24px',
          textAlign: 'center',
          borderBottom: '4px solid #FFD700'
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <img
            src="/logo.png"
            alt="Read Academy Sahiwal Logo"
            style={{
              height: '84px',
              margin: '0 auto 18px',
              display: 'block',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))'
            }}
          />
          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Read To Lead • Since 2018
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, margin: '8px 0 16px 0', letterSpacing: '-0.02em' }}>
            Read Academy Sahiwal
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            Founded in 2018 in Sahiwal under the timeless philosophy "Read To Lead", Read Academy is committed to academic mastery, ethical discipline, and empowering students to excel in modern academia.
          </p>
        </div>
      </section>

      {/* Mission, Vision & Core Pillars */}
      <section style={{ padding: '80px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            <div className="bca-card" style={{ padding: '36px', borderTop: '4px solid #0B3974' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#0B3974', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Target size={24} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0' }}>
                Our Mission
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.7, margin: 0 }}>
                To cultivate intellectually curious, resilient, and socially responsible scholars by integrating rigorous academic inquiry with technological innovation, compassionate character mentorship, and global citizenship.
              </p>
            </div>

            <div className="bca-card" style={{ padding: '36px', borderTop: '4px solid #4CAF50' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e8f5e9', color: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Eye size={24} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0' }}>
                Our Vision
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.7, margin: 0 }}>
                To be South Asia's preeminent preparatory academy, where graduates emerge not merely as academic high-achievers, but as visionary innovators and ethical pioneers who transform their societies.
              </p>
            </div>

            <div className="bca-card" style={{ padding: '36px', borderTop: '4px solid #FFD700' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff9c4', color: '#8c6800', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Compass size={24} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0' }}>
                Our Motto
              </h2>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0B3974', margin: '0 0 8px 0', fontStyle: 'italic' }}>
                "{SCHOOL_INFO.motto}"
              </p>
              <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.7, margin: 0 }}>
                Every lesson, sports competition, and community initiative at Read Academy Sahiwal is anchored in the pursuit of truth and the defense of moral integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Historical Milestones Timeline */}
      <section style={{ padding: '80px 24px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0B3974', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Historical Journey
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '6px 0 0 0' }}>
              Milestones of Growth & Excellence
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
            {[
              { year: '2018', title: 'Establishment of Read Academy Sahiwal', desc: 'Inaugurated with modern primary and elementary wings under the motto "Read To Lead".' },
              { year: '2020', title: 'Advanced Science & Digital Labs', desc: 'Constructed state-of-the-art physics, chemistry, and multimedia computer laboratories.' },
              { year: '2022', title: 'Secondary Wing Expansion & BISE Affiliation', desc: 'Extended secondary classes for Matriculation, producing top grades and academic achievements across Sahiwal district.' },
              { year: '2024', title: 'Activity Center & Sports Facilities', desc: 'Inaugurated dedicated sports grounds, library reading lounges, and co-curricular debate societies.' },
              { year: '2026', title: 'Digital Campus ERP & Smart Management Portal', desc: 'Launched comprehensive Cloud ERP portal for unified attendance, fee tracking, and academic reporting.' }
            ].map((m, idx) => (
              <div
                key={idx}
                className="bca-card"
                style={{
                  padding: '24px',
                  borderRadius: '14px',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'flex-start'
                }}
              >
                <div
                  style={{
                    backgroundColor: '#eff6ff',
                    color: '#0B3974',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontWeight: 900,
                    fontSize: '1.25rem',
                    minWidth: '90px',
                    textAlign: 'center',
                    border: '1px solid #bfdbfe'
                  }}
                >
                  {m.year}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                    {m.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Facilities Showcase */}
      <section style={{ padding: '80px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 50px auto' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0B3974', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              World-Class Infrastructure
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '6px 0 0 0' }}>
              Purpose-Built Campus Facilities
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              {
                title: 'Smart Interactive Classrooms',
                desc: 'Equipped with 4K interactive touch boards, ergonomic furniture, and climate-controlled air purification.',
                image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80'
              },
              {
                title: 'Specialized STEM & Robotics Hub',
                desc: 'Hands-on prototyping with 3D printers, laser cutters, programmable micro-controllers, and AI workstations.',
                image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80'
              },
              {
                title: 'Olympic Swimming & Sports Complex',
                desc: 'Semi-Olympic swimming pool, synthetic turf football stadium, indoor badminton courts, and gymnastic halls.',
                image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=600&auto=format&fit=crop&q=80'
              },
              {
                title: 'Central Academic Library',
                desc: 'Housing over 25,000 volumes, peer-reviewed digital journal subscriptions, and silent research cubicles.',
                image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80'
              }
            ].map((fac, i) => (
              <div key={i} className="bca-card" style={{ overflow: 'hidden', borderRadius: '14px' }}>
                <img src={fac.image} alt={fac.title} style={{ width: '100%', height: '190px', objectFit: 'cover' }} />
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1.08rem', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>
                    {fac.title}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    {fac.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Official Accreditations */}
      <section style={{ padding: '50px 24px', backgroundColor: '#f1f5f9', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '20px' }}>
            Accredited & Affiliated With Prestigious Educational Bodies
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e293b' }}>🏛️ Cambridge Assessment International</div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e293b' }}>🎓 Federal Board of Intermediate & Secondary Education (FBISE)</div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e293b' }}>🌍 British Council Partner School</div>
          </div>
        </div>
      </section>
    </div>
  );
};
