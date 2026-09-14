import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Award,
  Search
} from 'lucide-react';
import { MOCK_TEACHERS } from '../../../mockData';
import { useToast } from '../../common/Toast';

export const TeachersPublicPage: React.FC = () => {
  const { showToast } = useToast();
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const departments = ['All', 'Science', 'Mathematics', 'Computer Science', 'Languages', 'Social Sciences'];

  const filtered = MOCK_TEACHERS.filter((t) => {
    const matchesDept = selectedDept === 'All' || t.department === selectedDept;
    const matchesQuery =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesQuery;
  });

  return (
    <div>
      {/* Hero Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #04142a 0%, #0B3974 55%, #0e458e 100%)',
          color: '#ffffff',
          padding: '70px 24px',
          textAlign: 'center',
          borderBottom: '4px solid #E62929'
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Academic Faculty • Read To Lead
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, margin: '8px 0 16px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Distinguished Educators & Dedicated Mentors
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            Our faculty members hold advanced degrees from leading national and global universities, combining deep subject-matter mastery with compassionate pastoral care.
          </p>
        </div>
      </section>

      {/* Filter & Search Controls */}
      <section style={{ padding: '40px 24px 20px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className="bca-btn"
                style={{
                  backgroundColor: selectedDept === dept ? '#0B3974' : '#ffffff',
                  color: selectedDept === dept ? '#ffffff' : '#475569',
                  border: '1px solid',
                  borderColor: selectedDept === dept ? '#0B3974' : '#cbd5e1',
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  whiteSpace: 'nowrap'
                }}
              >
                {dept}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search faculty or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px 7px 32px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.84rem'
              }}
            />
          </div>
        </div>
      </section>

      {/* Faculty Cards Grid */}
      <section style={{ padding: '20px 24px 80px', backgroundColor: '#f8fafc' }}>
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '24px'
          }}
        >
          {filtered.map((t) => (
            <div
              key={t.id}
              className="bca-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '14px',
                borderTop: '3px solid #E62929'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #fecaca' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.08rem', fontWeight: 800, margin: '0 0 4px 0', color: '#0f172a' }}>
                      {t.name}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#E62929', fontWeight: 800 }}>
                      Faculty Specialist • {t.department}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GraduationCap size={15} color="#64748b" />
                    <span>{t.qualification}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={15} color="#64748b" />
                    <span>{t.experienceYears} Years Academic Experience</span>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Primary Subject:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    <span className="bca-badge bca-badge-primary">
                      {t.subject}
                    </span>
                    {t.classes.slice(0, 2).map((cls: string, i: number) => (
                      <span key={i} className="bca-badge bca-badge-neutral">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="bca-badge bca-badge-active">{t.department}</span>
                <button
                  onClick={() => showToast(`Message request queued to ${t.name}`, undefined, 'info')}
                  className="bca-btn bca-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                >
                  <Mail size={13} /> Message Tutor
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
