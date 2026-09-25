import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Users,
  Search,
  CheckCircle,
  Eye,
  Edit2,
  Trash2,
  GraduationCap,
  Layers,
  MapPin
} from 'lucide-react';
import type { ClassEntity, SubjectEntity } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';
import { academicsApi } from '../../services/api';

const mapBackendClass = (cls: any): ClassEntity => ({
  id: cls.id,
  name: cls.name,
  section: cls.sections?.[0]?.name ? cls.sections[0].name.replace('Section ', '') : 'A',
  classTeacher: cls.sections?.[0]?.classTeacher?.fullName || 'Assigned Faculty',
  totalStudents: cls._count?.students ?? (cls.students?.length ?? 0),
  capacity: cls.capacity || 45,
  roomNumber: cls.sections?.[0]?.roomNumber || 'Room 201'
});

const mapBackendSubject = (sub: any): SubjectEntity => ({
  id: sub.id,
  code: sub.code,
  name: sub.name,
  department: sub.department || 'Science',
  totalPeriodsWeekly: sub.weeklyPeriods || 5,
  leadTeacher: sub.classSubjects?.[0]?.teacher?.fullName || 'Lead Faculty'
});

export const ClassesSubjectsView: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'classes' | 'subjects'>('classes');
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [subjects, setSubjects] = useState<SubjectEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);

  // Fetch live classes and subjects from academicsApi
  useEffect(() => {
    let isMounted = true;
    Promise.all([academicsApi.getClasses(), academicsApi.getSubjects()])
      .then(([clsRes, subRes]) => {
        if (!isMounted) return;
        if (clsRes?.data && Array.isArray(clsRes.data)) {
          setClasses(clsRes.data.map(mapBackendClass));
        } else {
          setClasses([]);
        }
        if (subRes?.data && Array.isArray(subRes.data)) {
          setSubjects(subRes.data.map(mapBackendSubject));
        } else {
          setSubjects([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Academics fetch failed:', err);
        if (isMounted) {
          setClasses([]);
          setSubjects([]);
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

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

  // Edit Class State
  const [editingClass, setEditingClass] = useState<ClassEntity | null>(null);
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [editClassName, setEditClassName] = useState('');
  const [editClassCap, setEditClassCap] = useState(40);
  const [editClassRoom, setEditClassRoom] = useState('Room 201');

  const handleOpenEditClass = (c: ClassEntity) => {
    setEditingClass(c);
    setEditClassName(c.name);
    setEditClassCap(c.capacity || 40);
    setEditClassRoom(c.roomNumber || 'Room 201');
    setShowEditClassModal(true);
  };

  const handleSaveClassEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;
    setClasses((prev) =>
      prev.map((c) =>
        c.id === editingClass.id
          ? { ...c, name: editClassName, capacity: editClassCap, roomNumber: editClassRoom }
          : c
      )
    );
    showToast('Class Updated', `${editClassName} details updated`, 'success');
    setShowEditClassModal(false);
  };

  const handleDeleteClass = (c: ClassEntity) => {
    if (!window.confirm(`Are you sure you want to delete class "${c.name}"?`)) return;
    setClasses((prev) => prev.filter((item) => item.id !== c.id));
    showToast('Class Removed', `${c.name} was removed from academic list`, 'success');
  };

  // Edit Subject State
  const [editingSubject, setEditingSubject] = useState<SubjectEntity | null>(null);
  const [showEditSubModal, setShowEditSubModal] = useState(false);
  const [editSubName, setEditSubName] = useState('');
  const [editSubCode, setEditSubCode] = useState('');
  const [editSubDept, setEditSubDept] = useState('');
  const [editSubPeriods, setEditSubPeriods] = useState(5);

  const handleOpenEditSubject = (sub: SubjectEntity) => {
    setEditingSubject(sub);
    setEditSubName(sub.name);
    setEditSubCode(sub.code);
    setEditSubDept(sub.department || 'Science');
    setEditSubPeriods(sub.totalPeriodsWeekly || 5);
    setShowEditSubModal(true);
  };

  const handleSaveSubEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === editingSubject.id
          ? {
              ...s,
              name: editSubName,
              code: editSubCode,
              department: editSubDept,
              totalPeriodsWeekly: editSubPeriods
            }
          : s
      )
    );
    showToast('Subject Updated', `${editSubName} curriculum details updated`, 'success');
    setShowEditSubModal(false);
  };

  const handleDeleteSubject = (sub: SubjectEntity) => {
    if (!window.confirm(`Are you sure you want to delete subject "${sub.name}" (${sub.code})?`)) return;
    setSubjects((prev) => prev.filter((item) => item.id !== sub.id));
    showToast('Subject Removed', `${sub.name} was removed from curriculum catalog`, 'success');
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericLvl = parseInt(newClassName.replace(/\D/g, '')) || 9;
    try {
      const res = await academicsApi.createClass({
        name: newClassName,
        numericLevel: numericLvl,
        capacity: newCapacity
      });
      if (res?.data) {
        setClasses((prev) => [...prev, mapBackendClass(res.data)]);
      } else {
        const newClass: ClassEntity = {
          id: `CLS-${Math.floor(100 + Math.random() * 900)}`,
          name: newClassName,
          section: newSection,
          classTeacher: newClassTeacher,
          totalStudents: 0,
          capacity: newCapacity,
          roomNumber: newRoom
        };
        setClasses((prev) => [...prev, newClass]);
      }
    } catch {
      const newClass: ClassEntity = {
        id: `CLS-${Math.floor(100 + Math.random() * 900)}`,
        name: newClassName,
        section: newSection,
        classTeacher: newClassTeacher,
        totalStudents: 0,
        capacity: newCapacity,
        roomNumber: newRoom
      };
      setClasses((prev) => [...prev, newClass]);
    }
    setShowAddClassModal(false);
    showToast('New Class Section Created', `${newClassName}-${newSection}`, 'success');
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await academicsApi.createSubject({
        code: newSubCode,
        name: newSubName,
        department: newSubDept,
        weeklyPeriods: newSubPeriods
      });
      if (res?.data) {
        setSubjects((prev) => [...prev, mapBackendSubject(res.data)]);
      } else {
        const newSub: SubjectEntity = {
          id: `SUB-${Math.floor(100 + Math.random() * 900)}`,
          code: newSubCode,
          name: newSubName,
          department: newSubDept,
          totalPeriodsWeekly: newSubPeriods,
          leadTeacher: newSubLead
        };
        setSubjects((prev) => [...prev, newSub]);
      }
    } catch {
      const newSub: SubjectEntity = {
        id: `SUB-${Math.floor(100 + Math.random() * 900)}`,
        code: newSubCode,
        name: newSubName,
        department: newSubDept,
        totalPeriodsWeekly: newSubPeriods,
        leadTeacher: newSubLead
      };
      setSubjects((prev) => [...prev, newSub]);
    }
    setShowAddSubjectModal(false);
    showToast('Academic Subject Registered', `${newSubName} (${newSubCode})`, 'success');
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
        classes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            {loading ? 'Loading classes from database...' : 'No classes registered.'}
          </div>
        ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                  <button
                    onClick={() => showToast(`Opening roster for ${c.name}-${displaySection}`, undefined, 'info')}
                    className="bca-btn bca-btn-secondary"
                    style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                  >
                    Roster
                  </button>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      onClick={() => handleOpenEditClass(c)}
                      className="bca-btn bca-btn-secondary"
                      style={{ padding: '4px 7px', color: '#2563eb' }}
                      title="Edit Class"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteClass(c)}
                      className="bca-btn bca-btn-secondary"
                      style={{ padding: '4px 7px', color: '#e11d48' }}
                      title="Delete Class"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )
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
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                    {loading ? 'Loading subjects from database...' : 'No curriculum subjects registered.'}
                  </td>
                </tr>
              ) : (
                subjects.map((sub) => (
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
                    <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                      <button
                        onClick={() => showToast(`Syllabus outlines for ${sub.name} opened`, undefined, 'info')}
                        className="bca-btn bca-btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                        title="View Syllabus"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => handleOpenEditSubject(sub)}
                        className="bca-btn bca-btn-secondary"
                        style={{ padding: '4px 8px', color: '#2563eb' }}
                        title="Edit Subject"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(sub)}
                        className="bca-btn bca-btn-secondary"
                        style={{ padding: '4px 8px', color: '#e11d48' }}
                        title="Delete Subject"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
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
          <div className="bca-form-row">
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

          <div className="bca-form-row">
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
          <div className="bca-form-row">
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

          <div className="bca-form-row">
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

      {/* EDIT CLASS MODAL */}
      {showEditClassModal && editingClass && (
        <Modal
          isOpen={showEditClassModal}
          onClose={() => setShowEditClassModal(false)}
          title={`Edit Class — ${editingClass.name}`}
          subtitle={`Class ID: ${editingClass.id}`}
          maxWidth="480px"
          footer={
            <>
              <button onClick={() => setShowEditClassModal(false)} className="bca-btn bca-btn-secondary">
                Cancel
              </button>
              <button onClick={handleSaveClassEdit} className="bca-btn bca-btn-primary">
                Save Changes
              </button>
            </>
          }
        >
          <form onSubmit={handleSaveClassEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Class / Grade Name *
              </label>
              <input
                type="text"
                required
                value={editClassName}
                onChange={(e) => setEditClassName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div className="bca-form-row">
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Student Capacity Limit
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={editClassCap}
                  onChange={(e) => setEditClassCap(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Assigned Lecture Room
                </label>
                <input
                  type="text"
                  value={editClassRoom}
                  onChange={(e) => setEditClassRoom(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* EDIT SUBJECT MODAL */}
      {showEditSubModal && editingSubject && (
        <Modal
          isOpen={showEditSubModal}
          onClose={() => setShowEditSubModal(false)}
          title={`Edit Subject — ${editingSubject.name}`}
          subtitle={`Code: ${editingSubject.code}`}
          maxWidth="480px"
          footer={
            <>
              <button onClick={() => setShowEditSubModal(false)} className="bca-btn bca-btn-secondary">
                Cancel
              </button>
              <button onClick={handleSaveSubEdit} className="bca-btn bca-btn-primary">
                Save Changes
              </button>
            </>
          }
        >
          <form onSubmit={handleSaveSubEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="bca-form-row">
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Subject Code
                </label>
                <input
                  type="text"
                  required
                  value={editSubCode}
                  onChange={(e) => setEditSubCode(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  value={editSubName}
                  onChange={(e) => setEditSubName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
            <div className="bca-form-row">
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Department
                </label>
                <input
                  type="text"
                  value={editSubDept}
                  onChange={(e) => setEditSubDept(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Weekly Periods
                </label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={editSubPeriods}
                  onChange={(e) => setEditSubPeriods(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
