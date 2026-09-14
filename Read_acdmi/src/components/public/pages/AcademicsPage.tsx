import React, { useState } from 'react';
import {
  CheckCircle,
  Download,
  ArrowRight,
  Cpu,
  Globe,
  Palette,
  Mic
} from 'lucide-react';
import { useToast } from '../../common/Toast';

interface AcademicsPageProps {
  onOpenApply: () => void;
}

export const AcademicsPage: React.FC<AcademicsPageProps> = ({ onOpenApply }) => {
  const { showToast } = useToast();
  const [activeWing, setActiveWing] = useState<'early' | 'primary' | 'middle' | 'senior'>('senior');

  const wingDetails = {
    early: {
      title: 'Early Childhood Foundation Stage (EYFS)',
      grades: 'Nursery to Kindergarten (Ages 3 - 5)',
      description: 'A nurturing, exploratory environment blending Reggio Emilia and Montessori principles to foster social confidence, verbal articulation, phonetics, and motor development.',
      coreSubjects: ['Phonics & Pre-Reading', 'Early Numeracy & Shapes', 'Sensory Nature Exploration', 'Creative Expression & Music', 'Physical Movement & Coordination'],
      hours: '08:00 AM – 12:30 PM (Mon - Fri)'
    },
    primary: {
      title: 'Primary Academic Wing',
      grades: 'Grades 1 to 5 (Ages 6 - 10)',
      description: 'Building deep conceptual literacy, arithmetic problem-solving, and scientific curiosity with thematic integration across English, Urdu, Science, and Social Studies.',
      coreSubjects: ['English Literature & Grammar', 'Urdu Language & Composition', 'Conceptual Mathematics', 'Integrated General Science', 'Islamic Studies / Ethics', 'Social Studies & World Geography', 'Visual Arts & Physical Education'],
      hours: '07:45 AM – 01:45 PM (Mon - Fri)'
    },
    middle: {
      title: 'Middle School Division',
      grades: 'Grades 6 to 8 (Ages 11 - 13)',
      description: 'Transitioning into departmentalized disciplines. Students develop formal laboratory skills, algorithmic logic in Python coding, historical analysis, and public speaking.',
      coreSubjects: ['Physics Fundamentals', 'Chemistry & Lab Safety', 'Biology & Ecology', 'Pre-Algebra & Geometry', 'English Literature & Debate', 'Urdu Literature', 'Computer Science & Python', 'Pakistan Studies & Global Affairs'],
      hours: '07:45 AM – 02:15 PM (Mon - Fri)'
    },
    senior: {
      title: 'Senior School (Grades 9 & 10 - Matriculation / SSC)',
      grades: 'Grades 9 & 10 (Ages 14 - 16)',
      description: 'Rigorous preparation for Matriculation / SSC (Part I & II) under BISE Sahiwal benchmarks, integrated with dedicated physics, chemistry, biology, and computer science laboratories.',
      coreSubjects: ['Physics (Theory & Practical)', 'Chemistry (Theory & Practical)', 'Biology / Computer Science', 'Mathematics (Science Group)', 'English Language & Composition', 'Urdu Compulsory', 'Pakistan Studies', 'Islamic Studies / Ethics'],
      hours: '07:45 AM – 02:15 PM (Mon - Fri)'
    }
  };

  const current = wingDetails[activeWing];

  return (
    <div>
      {/* Banner */}
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
            Academic Framework • Read To Lead
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, margin: '8px 0 16px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Curriculum Engineered for Intellectual Distinction
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            Integrating modern STEM, inquiry-based learning, and BISE Sahiwal Matriculation standards (Grades Playgroup to 10th), enriched by cutting-edge science laboratories and character mentorship.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={() => showToast('Academic Calendar 2026-2027 Downloaded (PDF)', undefined, 'success')}
              className="bca-btn bca-btn-secondary"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)', padding: '10px 20px' }}
            >
              <Download size={16} /> Download 2026-2027 Calendar (PDF)
            </button>
            <button
              onClick={onOpenApply}
              className="bca-btn bca-btn-primary"
              style={{ padding: '10px 20px' }}
            >
              <span>Apply for Admission</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Wings Switcher */}
      <section style={{ padding: '70px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
            {[
              { id: 'early', label: 'Early Years (Playgroup - KG)' },
              { id: 'primary', label: 'Primary Wing (Grades 1 - 5)' },
              { id: 'middle', label: 'Middle Wing (Grades 6 - 8)' },
              { id: 'senior', label: 'Senior Matriculation (Grades 9 & 10)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveWing(tab.id as any)}
                className="bca-btn"
                style={{
                  backgroundColor: activeWing === tab.id ? '#0B3974' : '#f8fafc',
                  color: activeWing === tab.id ? '#ffffff' : '#334155',
                  border: '1px solid',
                  borderColor: activeWing === tab.id ? '#0B3974' : '#cbd5e1',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.92rem'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bca-card" style={{ padding: '40px', borderTop: '4px solid #E62929', borderLeft: '4px solid #E62929' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.12em', textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                  {current.grades}
                </span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 0 0' }}>
                  {current.title}
                </h2>
              </div>
              <span className="bca-badge bca-badge-primary" style={{ padding: '6px 14px', fontSize: '0.84rem' }}>
                Campus Hours: {current.hours}
              </span>
            </div>

            <p style={{ fontSize: '1.02rem', color: '#475569', lineHeight: 1.7, marginBottom: '28px', maxWidth: '900px' }}>
              {current.description}
            </p>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 16px 0', color: '#0f172a' }}>
              Core Academic Disciplines & Syllabus Scope:
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
              {current.coreSubjects.map((sub, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#1e293b'
                  }}
                >
                  <CheckCircle size={16} color="#4CAF50" />
                  <span>{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Teaching Methodologies */}
      <section style={{ padding: '80px 24px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 50px auto' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.12em', textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
              Pedagogical Methodology
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '6px 0 0 0' }}>
              How We Teach: Inquiry, Rigor & Application
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {[
              {
                title: 'Inquiry-Based Discovery',
                desc: 'Students do not memorize outcomes; they form hypotheses, conduct experiments, and deduce laws from direct observations.'
              },
              {
                title: 'Socratic Seminars & Debate',
                desc: 'Weekly guided discussions encouraging students to articulate persuasive arguments, question assumptions, and respect diverse perspectives.'
              },
              {
                title: 'Experiential STEM Labs',
                desc: 'Every theoretical concept in physics, chemistry, and computing is reinforced through lab prototyping and software simulations.'
              },
              {
                title: 'Diagnostic Continuous Feedback',
                desc: 'Rather than high-stakes surprises, weekly formative mini-assessments ensure learning gaps are remediated immediately.'
              }
            ].map((m, i) => (
              <div key={i} className="bca-card" style={{ padding: '28px', borderRadius: '14px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 10px 0', color: '#0f172a' }}>
                  {m.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Co-Curricular Societies & Student Clubs */}
      <section style={{ padding: '80px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 50px auto' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.12em', textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
              Beyond the Classroom
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '6px 0 0 0' }}>
              Co-Curricular Societies & Guilds
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {[
              { icon: Cpu, name: 'Robotics & AI Guild', desc: 'Designs autonomous rovers and competes in national Olympiads.' },
              { icon: Mic, name: 'Model United Nations & Debating', desc: 'Hones diplomatic negotiation and parliamentary debate.' },
              { icon: Globe, name: 'Eco-Guardians Environmental Club', desc: 'Drives solar projects, campus tree plantation, and waste sorting.' },
              { icon: Palette, name: 'Visual Arts & Photography', desc: 'Explores oil painting, digital illustration, and film editing.' }
            ].map((club, idx) => {
              const Icon = club.icon;
              return (
                <div key={idx} className="bca-card" style={{ padding: '24px', borderRadius: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#feecec', color: '#E62929', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    <Icon size={20} color="#E62929" />
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                    {club.name}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                    {club.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
