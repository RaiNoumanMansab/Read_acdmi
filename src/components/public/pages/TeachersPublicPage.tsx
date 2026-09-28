import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Mail,
  Award,
  Search
} from 'lucide-react';
import { useToast } from '../../common/Toast';
import { ScrollReveal } from '../../common/ScrollReveal';
import { teachersApi } from '../../../services/api';

export const TeachersPublicPage: React.FC = () => {
  const { showToast } = useToast();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    teachersApi.getTeachers().then((res) => {
      if (res?.data) setTeachers(res.data);
    }).catch(() => {});
  }, []);

  const departments = ['All', 'Science', 'Mathematics', 'Computer Science', 'Languages', 'Social Sciences'];

  const filtered = teachers.filter((t) => {
    const tName = t.fullName || t.name || '';
    const tSub = t.specialization || t.subject || '';
    const matchesDept = selectedDept === 'All' || t.department === selectedDept;
    const matchesQuery =
      tName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tSub.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.department && t.department.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesQuery;
  });

  return (
    <div>
      {/* Hero Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #04142a 0%, #0B3974 55%, #0e458e 100%)',
          color: '#ffffff',
          padding: 'clamp(48px, 6vw, 84px) clamp(16px, 4vw, 24px)',
          textAlign: 'center',
          borderBottom: '4px solid #E62929'
        }}
      >
        <ScrollReveal animation="up">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Academic Faculty • Read To Lead
            </span>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', fontWeight: 500, lineHeight: 1.25, margin: '8px 0 14px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
              Distinguished Educators & Dedicated Mentors
            </h1>
            <p style={{ fontSize: 'clamp(0.88rem, 2vw, 1.05rem)', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
              Our faculty members hold advanced degrees from leading national and global universities, combining deep subject-matter mastery with compassionate pastoral care.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Filter & Search Controls */}
      <section style={{ padding: 'clamp(24px, 4vw, 36px) clamp(16px, 4vw, 24px) 14px', backgroundColor: '#f8fafc' }}>
        <ScrollReveal animation="up">
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                alignItems: 'center',
                maxWidth: '100%'
              }}
            >
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
                    padding: '7px 14px',
                    fontSize: '0.82rem',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {dept}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '100%', maxWidth: '320px', flex: '1 1 240px' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Search faculty or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Faculty Cards Grid */}
      <section style={{ padding: '10px clamp(16px, 4vw, 24px) clamp(48px, 6vw, 80px)', backgroundColor: '#f8fafc' }}>
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            gap: '20px'
          }}
        >
          {filtered.map((t, idx) => (
            <ScrollReveal key={t.id} animation="up" delay={idx * 60}>
              <div
                className="bca-card card-interactive-lift"
                style={{
                  padding: 'clamp(18px, 4vw, 24px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '14px',
                  borderTop: '3px solid #E62929',
                  height: '100%',
                  boxSizing: 'border-box'
                }}
              >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <img
                    src={t.avatarUrl || t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={t.fullName || t.name}
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #fecaca', flexShrink: 0 }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 500, margin: '0 0 3px 0', color: '#0f172a', wordBreak: 'break-word' }}>
                      {t.fullName || t.name}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#E62929', fontWeight: 600 }}>
                      Faculty Specialist • {t.department}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GraduationCap size={15} color="#64748b" style={{ flexShrink: 0 }} />
                    <span>{t.qualification}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={15} color="#64748b" style={{ flexShrink: 0 }} />
                    <span>{t.experienceYears} Years Academic Experience</span>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Primary Subject / Specialization:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    <span className="bca-badge bca-badge-primary">
                      {t.specialization || t.subject || 'All Sciences'}
                    </span>
                    {(t.classes || ['Grade 9', 'Grade 10']).slice(0, 2).map((cls: string, i: number) => (
                      <span key={i} className="bca-badge bca-badge-neutral">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span className="bca-badge bca-badge-active">{t.department}</span>
                <button
                  onClick={() => showToast(`Message request queued to ${t.name}`, undefined, 'info')}
                  className="bca-btn bca-btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                >
                  <Mail size={13} /> Message Tutor
                </button>
              </div>
            </div>
            </ScrollReveal>
          ))}

          {filtered.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 16px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <GraduationCap size={40} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 500, color: '#0f172a', margin: '0 0 6px 0' }}>
                No Faculty Members Found
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                Try searching with another subject or selecting 'All' departments.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
