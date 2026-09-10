import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Search,
  User,
  Activity,
  Download
} from 'lucide-react';
import { MOCK_STUDENTS } from '../../mockData';
import type { Student } from '../../types';
import { Line, Radar, Bar } from 'react-chartjs-2';
import { useToast } from '../common/Toast';

export const StudentProgressView: React.FC = () => {
  const { showToast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<Student>(MOCK_STUDENTS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // Performance progression chart
  const progressChartData = {
    labels: ['Grade 8 Final', 'Grade 9 Term 1', 'Grade 9 Term 2', 'Grade 9 Final', 'Grade 10 Term 1'],
    datasets: [
      {
        label: 'Overall Grade Point %',
        data: [88, 90.5, 92, 93.4, 94.8],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#2563eb',
        pointRadius: 5
      }
    ]
  };

  // Subject proficiency radar chart
  const radarChartData = {
    labels: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Sci', 'Urdu'],
    datasets: [
      {
        label: 'Current Score %',
        data: [96, 94, 90, 92, 98, 88],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10b981',
        pointBackgroundColor: '#10b981'
      },
      {
        label: 'Class Average %',
        data: [82, 79, 81, 84, 85, 80],
        backgroundColor: 'rgba(148, 163, 184, 0.15)',
        borderColor: '#94a3b8',
        borderDash: [4, 4]
      }
    ]
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Student Academic Progress & Growth Index
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Multi-term grade trends, competency analytics, attendance impact, and faculty reviews
          </p>
        </div>

        <button
          onClick={() => showToast(`Progress dossier downloaded for ${selectedStudent.name}`, undefined, 'info')}
          className="bca-btn bca-btn-secondary"
        >
          <Download size={16} />
          <span>Export Analytics PDF</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '22px' }}>
        {/* Left: Student Selector List */}
        <div className="bca-card" style={{ padding: '18px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 12px 0' }}>Select Student</h3>
          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '7px 10px 7px 32px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '520px', overflowY: 'auto' }}>
            {MOCK_STUDENTS.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((student) => {
              const isSelected = selectedStudent.id === student.id;
              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: isSelected ? '#2563eb' : '#f1f5f9',
                    backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.15s'
                  }}
                >
                  <img
                    src={student.avatar}
                    alt={student.name}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: isSelected ? '#1d4ed8' : '#0f172a' }}>
                      {student.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      {student.class}-{student.section} • Roll: {student.rollNo}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Analytics for Selected Student */}
        <div>
          {/* Top Banner for Active Student */}
          <div
            className="bca-card"
            style={{
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              backgroundColor: '#ffffff'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #eff6ff' }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{selectedStudent.name}</h3>
                <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '3px' }}>
                  {selectedStudent.class} Section {selectedStudent.section} • Roll: <strong>{selectedStudent.rollNo}</strong> • ID: <code>{selectedStudent.id}</code>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', textAlign: 'right' }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>ATTENDANCE</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669' }}>{selectedStudent.attendancePct}%</div>
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>STANDING</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2563eb' }}>Top 5%</div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="bca-grid-2" style={{ marginBottom: '20px' }}>
            {/* Multi-Term Trend */}
            <div className="bca-card" style={{ padding: '20px' }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '0.98rem' }}>Multi-Term Grade Trajectory</h4>
              <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '0 0 16px 0' }}>
                Cumulative percentile trend over 5 consecutive evaluations
              </p>
              <div style={{ height: '220px' }}>
                <Line
                  data={progressChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { min: 80, max: 100 } }
                  }}
                />
              </div>
            </div>

            {/* Subject Mastery Radar */}
            <div className="bca-card" style={{ padding: '20px' }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '0.98rem' }}>Subject Mastery vs Class Benchmark</h4>
              <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '0 0 16px 0' }}>
                Student proficiency compared against Grade 10 batch average
              </p>
              <div style={{ height: '220px' }}>
                <Radar
                  data={radarChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      r: {
                        angleLines: { color: '#f1f5f9' },
                        grid: { color: '#e2e8f0' },
                        pointLabels: { font: { size: 10, family: 'Plus Jakarta Sans' } }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Behavioral & Co-Curricular Badges */}
          <div className="bca-card" style={{ padding: '20px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.98rem' }}>Faculty Endorsements & Badges</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.86rem', color: '#1e40af' }}>
                  <Award size={18} /> STEM Excellence Honor
                </div>
                <p style={{ margin: '6px 0 0', fontSize: '0.78rem', color: '#3b82f6' }}>
                  Awarded 1st prize in National Inter-School Science Fair 2026 for Solar Cell Model.
                </p>
              </div>

              <div style={{ padding: '12px', borderRadius: '8px', background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.86rem', color: '#065f46' }}>
                  <CheckCircle size={18} /> 100% Punctuality Citation
                </div>
                <p style={{ margin: '6px 0 0', fontSize: '0.78rem', color: '#059669' }}>
                  Zero late arrivals or unexcused absences recorded across Term 1.
                </p>
              </div>

              <div style={{ padding: '12px', borderRadius: '8px', background: '#fef3c7', border: '1px solid #fde68a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.86rem', color: '#92400e' }}>
                  <Activity size={18} /> Leadership & Debates
                </div>
                <p style={{ margin: '6px 0 0', fontSize: '0.78rem', color: '#b45309' }}>
                  Serving as Vice Captain of Beacon Crest Model United Nations team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
