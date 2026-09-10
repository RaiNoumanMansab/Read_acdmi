import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Users,
  Search,
  CheckCircle,
  Eye,
  GraduationCap,
  Layers,
  MapPin
} from 'lucide-react';
import { MOCK_CLASSES, MOCK_SUBJECTS } from '../../mockData';
import type { ClassEntity, SubjectEntity } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

export const ClassesSubjectsView: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'classes' | 'subjects'>('classes');
  const [classes, setClasses] = useState<ClassEntity[]>(MOCK_CLASSES);
  const [subjects, setSubjects] = useState<SubjectEntity[]>(MOCK_SUBJECTS);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);

  // New Class Form
  const [newClassName, setNewClassName] = useState('Grade 7');
  const [newSection, setNewSection] = useState('A');
  const [newClassTeacher, setNewClassTeacher] = useState('Mrs. Fatima Zahra');
  const [newRoom, setNewRoom] = useState('Room 204');
  const [newCapacity, setNewCapacity] = useState(40);

  // New Subject Form
  const [newSubCode, setNewSubCode] = useState('ISL-101');
  const [newSubName, setNewSubName] = useState('Islamic Studies');
  const [newSubDept, setNewSubDept] = useState('Social Sciences');
  const [newSubPeriods, setNewSubPeriods] = useState(4);
  const [newSubLead, setNewSubLead] = useState('Qari Abdul Rehman');

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    const newClass: ClassEntity = {
      id: `CLS-${Math.floor(100 + Math.random() * 900)}`,
      name: newClassName,
      section: newSection,
      classTeacher: newClassTeacher,
      totalStudents: 0,
      capacity: newCapacity,
      roomNumber: newRoom
    };
    setClasses([...classes, newClass]);
    setShowAddClassModal(false);
    showToast('New Class Section Created', `${newClass.name}-${newClass.section}`, 'success');
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const newSub: SubjectEntity = {
      id: `SUB-${Math.floor(100 + Math.random() * 900)}`,
      code: newSubCode,
      name: newSubName,
      department: newSubDept,
      totalPeriodsWeekly: newSubPeriods,
      leadTeacher: newSubLead
    };
    setSubjects([...subjects, newSub]);
    setShowAddSubjectModal(false);
    showToast('Subject Added to Curriculum', `${newSub.code} - ${newSub.name}`, 'success');
  };

  return (
    <div>
      {/* Title & Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Classes & Curriculum Subjects
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Academic sections, capacity limits, subject catalog, and syllabus workload
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {activeTab === 'classes' ? (
            <button
              onClick={() => setShowAddClassModal(true)}
              className="bca-btn bca-btn-primary"
            >
              <Plus size={16} />
              <span>Create New Class</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddSubjectModal(true)}
              className="bca-btn bca-btn-primary"
            >
              <Plus size={16} />
              <span>Add Subject</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('classes')}
          className="bca-btn"
          style={{
            backgroundColor: activeTab === 'classes' ? '#2563eb' : '#ffffff',
            color: activeTab === 'classes' ? '#ffffff' : '#475569',
            border: activeTab === 'classes' ? 'none' : '1px solid #cbd5e1'
          }}
        >
          <Layers size={16} />
          <span>School Classes & Sections ({classes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className="bca-btn"
          style={{
            backgroundColor: activeTab === 'subjects' ? '#2563eb' : '#ffffff',
            color: activeTab === 'subjects' ? '#ffffff' : '#475569',
            border: activeTab === 'subjects' ? 'none' : '1px solid #cbd5e1'
          }}
        >
          <BookOpen size={16} />
          <span>Curriculum Subject Catalog ({subjects.length})</span>
        </button>
      </div>

      {/* CLASSES TAB */}
      {activeTab === 'classes' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '18px'
          }}
        >
          {classes.map((c) => {
            const currentStudents = c.totalStudents ?? c.studentsCount ?? 0;
            const currentCap = c.capacity ?? 40;
            const fillPct = ((currentStudents / currentCap) * 100).toFixed(0);
            const displaySection = c.section || (c.sections ? c.sections.join(', ') : 'A');
            const displayRoom = c.roomNumber || c.room || 'Wing A';

            return (
              <div key={c.id} className="bca-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                      {c.name}
                    </h3>
                    <div style={{ fontSize: '0.84rem', color: '#2563eb', fontWeight: 700 }}>
                      Section {displaySection}
                    </div>
                  </div>
                  <span className="bca-badge bca-badge-primary">
                    <MapPin size={11} /> {displayRoom}
                  </span>
                </div>

                <div style={{ fontSize: '0.84rem', color: '#475569', marginBottom: '14px' }}>
                  Class Teacher: <strong>{c.classTeacher}</strong>
                </div>

                {/* Capacity Progress */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>Capacity Enrolled:</span>
                    <strong>{currentStudents} / {currentCap} Students ({fillPct}%)</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${fillPct}%`,
                        height: '100%',
                        backgroundColor: Number(fillPct) >= 90 ? '#059669' : '#2563eb'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                  <button
                    onClick={() => showToast(`Opening roster for ${c.name}-${displaySection}`, undefined, 'info')}
                    className="bca-btn bca-btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                  >
                    View Section Roster
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBJECTS TAB */}
      {activeTab === 'subjects' && (
        <div className="bca-table-wrapper">
          <table className="bca-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Academic Department</th>
                <th>Weekly Periods</th>
                <th>Curriculum Lead</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub) => (
                <tr key={sub.id || sub.code}>
                  <td><code>{sub.code}</code></td>
                  <td><strong style={{ color: '#0f172a' }}>{sub.name}</strong></td>
                  <td>
                    <span className="bca-badge bca-badge-primary">{sub.department || sub.dept || 'Academics'}</span>
                  </td>
                  <td>
                    <strong style={{ color: '#2563eb' }}>{sub.totalPeriodsWeekly ?? sub.weeklyPeriods ?? 4} Periods</strong> / week
                  </td>
                  <td>{sub.leadTeacher || sub.teachers || 'Assigned Faculty'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => showToast(`Syllabus outlines for ${sub.name} opened`, undefined, 'info')}
                      className="bca-btn bca-btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                    >
                      <Eye size={13} /> Syllabus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE CLASS MODAL */}
      <Modal
        isOpen={showAddClassModal}
        onClose={() => setShowAddClassModal(false)}
        title="Add Academic Class Section"
        subtitle="Define new classroom, capacity limit and designated class tutor"
        maxWidth="500px"
        footer={
          <>
            <button type="submit" form="addClassForm" className="bca-btn bca-btn-primary">
              Create Section
            </button>
            <button type="button" onClick={() => setShowAddClassModal(false)} className="bca-btn bca-btn-secondary">
              Cancel
            </button>
          </>
        }
      >
        <form id="addClassForm" onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Class</label>
              <input
                type="text"
                required
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Section</label>
              <input
                type="text"
                required
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Class Teacher</label>
            <input
              type="text"
              required
              value={newClassTeacher}
              onChange={(e) => setNewClassTeacher(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Room Number</label>
              <input
                type="text"
                required
                value={newRoom}
                onChange={(e) => setNewRoom(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Max Capacity</label>
              <input
                type="number"
                required
                value={newCapacity}
                onChange={(e) => setNewCapacity(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* CREATE SUBJECT MODAL */}
      <Modal
        isOpen={showAddSubjectModal}
        onClose={() => setShowAddSubjectModal(false)}
        title="Add Curriculum Subject"
        subtitle="Introduce an academic course into the institutional syllabus"
        maxWidth="500px"
        footer={
          <>
            <button type="submit" form="addSubForm" className="bca-btn bca-btn-primary">
              Add Subject
            </button>
            <button type="button" onClick={() => setShowAddSubjectModal(false)} className="bca-btn bca-btn-secondary">
              Cancel
            </button>
          </>
        }
      >
        <form id="addSubForm" onSubmit={handleCreateSubject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Subject Code</label>
              <input
                type="text"
                required
                value={newSubCode}
                onChange={(e) => setNewSubCode(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Subject Name</label>
              <input
                type="text"
                required
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Department</label>
              <select
                value={newSubDept}
                onChange={(e) => setNewSubDept(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              >
                <option value="Science">Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Languages">Languages</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Social Sciences">Social Sciences</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Weekly Periods</label>
              <input
                type="number"
                required
                value={newSubPeriods}
                onChange={(e) => setNewSubPeriods(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Curriculum Lead Teacher</label>
            <input
              type="text"
              required
              value={newSubLead}
              onChange={(e) => setNewSubLead(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
