import React, { useState } from 'react';
import {
  Plus,
  Search,
  Eye,
  Mail,
  BookOpen,
  Grid,
  List,
  Award
} from 'lucide-react';
import { MOCK_TEACHERS } from '../../mockData';
import type { Teacher } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

export const TeachersView: React.FC = () => {
  const { showToast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Teacher form states
  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState('Science & STEM');
  const [newSubject, setNewSubject] = useState('Physics & Applied Mechanics');
  const [newQualification, setNewQualification] = useState('M.Sc Physics (QAU), B.Ed');
  const [newPhone, setNewPhone] = useState('');
  const [newExpYears, setNewExpYears] = useState(5);

  const departments = ['All', 'Science & STEM', 'Mathematics', 'Languages', 'Computer Science', 'Sports & Co-Curricular'];

  const filtered = teachers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || t.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) {
      showToast('Please enter faculty name', undefined, 'error');
      return;
    }
    const newFaculty: Teacher = {
      id: `TCH-${Math.floor(100 + Math.random() * 900)}`,
      empId: `EMP-2026-${Math.floor(10 + Math.random() * 80)}`,
      name: newName,
      department: newDept,
      subject: newSubject,
      qualification: newQualification,
      experienceYears: newExpYears,
      email: `${newName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@beaconcrest.edu.pk`,
      phone: newPhone || '+92 300 8765432',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      joiningDate: '2026-09-01',
      status: 'Active',
      salary: 140000,
      attendancePct: 98.0,
      classes: ['Grade 9-A', 'Grade 10-A'],
      assignedDuties: ['Academic Tutoring', 'Assembly Supervisor']
    };

    setTeachers([newFaculty, ...teachers]);
    setShowAddModal(false);
    showToast('Faculty Member Appointed', `${newName} has been enrolled in the faculty directory.`, 'success');
    setNewName('');
    setNewPhone('');
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Faculty & Teaching Staff
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Academic credentials, department rosters, workload distribution, and dossiers
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? '#2563eb' : '#ffffff',
                color: viewMode === 'grid' ? '#ffffff' : '#64748b',
                border: 'none',
                padding: '8px 12px',
                cursor: 'pointer'
              }}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                background: viewMode === 'table' ? '#2563eb' : '#ffffff',
                color: viewMode === 'table' ? '#ffffff' : '#64748b',
                border: 'none',
                padding: '8px 12px',
                cursor: 'pointer'
              }}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bca-btn bca-btn-primary"
          >
            <Plus size={16} />
            <span>Appoint Faculty</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div
        className="bca-card"
        style={{
          padding: '14px 18px',
          marginBottom: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '240px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <Search
              size={15}
              color="#94a3b8"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search faculty name, subject, or ID..."
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

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.84rem',
              color: '#334155',
              fontWeight: 600
            }}
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Departments' : d}
              </option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
          Showing <strong>{filtered.length}</strong> of {teachers.length} faculty members
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '20px' }}>
          {filtered.map((t) => (
            <div
              key={t.id}
              className="bca-card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>{t.name}</h3>
                    <div style={{ fontSize: '0.76rem', color: '#2563eb', fontWeight: 600 }}>{t.department}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{t.empId}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: '#475569', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={14} color="#64748b" />
                    <span>{t.qualification} ({t.experienceYears} Yrs)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BookOpen size={14} color="#64748b" />
                    <span>{t.subject}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} color="#64748b" />
                    <span>{t.email}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
                  {t.classes.map((c, i) => (
                    <span key={i} className="bca-badge bca-badge-primary">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>
                  Attendance: {t.attendancePct}%
                </span>
                <button
                  onClick={() => setSelectedTeacher(t)}
                  className="bca-btn bca-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                >
                  <Eye size={13} /> View Dossier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bca-table-wrapper">
          <table className="bca-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Faculty Name</th>
                <th>Department</th>
                <th>Primary Subject</th>
                <th>Qualification</th>
                <th>Contact</th>
                <th>Classes</th>
                <th>Attendance</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td><code>{t.empId}</code></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={t.avatar}
                        alt={t.name}
                        style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <strong style={{ color: '#0f172a' }}>{t.name}</strong>
                    </div>
                  </td>
                  <td>{t.department}</td>
                  <td>{t.subject}</td>
                  <td>{t.qualification}</td>
                  <td>{t.phone}</td>
                  <td>{t.classes.join(', ')}</td>
                  <td><strong style={{ color: '#059669' }}>{t.attendancePct}%</strong></td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedTeacher(t)}
                      className="bca-btn bca-btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                    >
                      <Eye size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TEACHER PROFILE DOSSIER MODAL */}
      {selectedTeacher && (
        <Modal
          isOpen={!!selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
          title={`Faculty Dossier — ${selectedTeacher.name}`}
          subtitle={`${selectedTeacher.empId} • ${selectedTeacher.department}`}
          maxWidth="640px"
          footer={
            <button onClick={() => setSelectedTeacher(null)} className="bca-btn bca-btn-secondary">
              Close
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
              <img
                src={selectedTeacher.avatar}
                alt={selectedTeacher.name}
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{selectedTeacher.name}</h3>
                <div style={{ fontSize: '0.84rem', color: '#2563eb', fontWeight: 600 }}>
                  Faculty Specialist • {selectedTeacher.department}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                  Joined: {selectedTeacher.joiningDate} • Status: <span className="bca-badge bca-badge-active">{selectedTeacher.status}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.86rem' }}>
              <div><strong>Highest Degree:</strong> {selectedTeacher.qualification}</div>
              <div><strong>Experience:</strong> {selectedTeacher.experienceYears} Years</div>
              <div><strong>Email:</strong> {selectedTeacher.email}</div>
              <div><strong>Contact Phone:</strong> {selectedTeacher.phone}</div>
              <div><strong>Monthly Base Salary:</strong> Rs. {selectedTeacher.salary.toLocaleString()}</div>
              <div><strong>Attendance Record:</strong> {selectedTeacher.attendancePct}%</div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem' }}>Primary Subject Specialization</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="bca-badge bca-badge-primary">{selectedTeacher.subject}</span>
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem' }}>Weekly Assigned Classes</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedTeacher.classes.map((c, i) => (
                  <span key={i} className="bca-badge bca-badge-active">{c}</span>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem' }}>Campus Responsibilities & Duties</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedTeacher.assignedDuties.map((d, i) => (
                  <span key={i} className="bca-badge bca-badge-neutral">{d}</span>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ADD TEACHER MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Appoint New Faculty Member"
        subtitle="Register teacher credentials and initial workload assignment"
        maxWidth="580px"
        footer={
          <>
            <button type="submit" form="addTeacherForm" className="bca-btn bca-btn-primary">
              Confirm Appointment
            </button>
            <button type="button" onClick={() => setShowAddModal(false)} className="bca-btn bca-btn-secondary">
              Cancel
            </button>
          </>
        }
      >
        <form id="addTeacherForm" onSubmit={handleAddTeacher} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
              Teacher Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Asad Mahmood"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Department *
              </label>
              <select
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              >
                <option value="Science & STEM">Science & STEM</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Languages">Languages</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Sports & Co-Curricular">Sports & Co-Curricular</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Primary Subject *
              </label>
              <input
                type="text"
                required
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Qualification *
              </label>
              <input
                type="text"
                required
                value={newQualification}
                onChange={(e) => setNewQualification(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Experience (Years) *
              </label>
              <input
                type="number"
                min="0"
                max="50"
                required
                value={newExpYears}
                onChange={(e) => setNewExpYears(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
              Contact Phone *
            </label>
            <input
              type="text"
              required
              placeholder="+92 300 1234567"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
