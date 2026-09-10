import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  Eye,
  Filter,
  Download,
  BookOpen
} from 'lucide-react';
import { MOCK_HOMEWORK, MOCK_STUDENTS } from '../../mockData';
import type { Homework } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

export const HomeworkView: React.FC = () => {
  const { showToast } = useToast();
  const [homeworkList, setHomeworkList] = useState<Homework[]>(MOCK_HOMEWORK);
  const [selectedClass, setSelectedClass] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeHomeworkSubmissions, setActiveHomeworkSubmissions] = useState<Homework | null>(null);

  // New Homework state
  const [newTitle, setNewTitle] = useState('');
  const [newClass, setNewClass] = useState('Grade 10');
  const [newSubject, setNewSubject] = useState('Physics');
  const [newTeacher, setNewTeacher] = useState('Dr. Junaid Iqbal');
  const [newDueDate, setNewDueDate] = useState('2026-09-15');
  const [newInstructions, setNewInstructions] = useState('');

  const filtered = homeworkList.filter((h) => {
    if (selectedClass === 'All') return true;
    return h.class === selectedClass;
  });

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) {
      showToast('Please enter homework assignment title', undefined, 'error');
      return;
    }
    const newHw: Homework = {
      id: `HW-${Date.now()}`,
      title: newTitle,
      class: newClass,
      section: 'A',
      subject: newSubject,
      teacherName: newTeacher,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: newDueDate,
      totalSubmissions: 0,
      totalStudents: 38,
      instructions: newInstructions || 'Complete exercises at the end of the chapter in notebook.',
      description: newInstructions || 'Complete exercises at the end of the chapter in notebook.',
      status: 'Active'
    };
    setHomeworkList([newHw, ...homeworkList]);
    setShowAddModal(false);
    showToast('Homework Assignment Dispatched', `${newHw.title} assigned to ${newHw.class}`, 'success');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Homework & Daily Assignments
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Broadcast daily coursework, review student submissions, track compliance, and provide feedback
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bca-btn bca-btn-primary"
        >
          <Plus size={16} />
          <span>Post New Homework</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div
        className="bca-card"
        style={{
          padding: '12px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}
      >
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Filter by Class:</span>
        {['All', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'].map((c) => (
          <button
            key={c}
            onClick={() => setSelectedClass(c)}
            className="bca-btn"
            style={{
              backgroundColor: selectedClass === c ? '#2563eb' : '#ffffff',
              color: selectedClass === c ? '#ffffff' : '#475569',
              border: selectedClass === c ? 'none' : '1px solid #cbd5e1',
              padding: '5px 12px',
              fontSize: '0.8rem'
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Homework Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '18px'
        }}
      >
        {filtered.map((hw) => {
          const subCount = hw.totalSubmissions ?? hw.submissionCount ?? 0;
          const submissionPct = hw.totalStudents ? ((subCount / hw.totalStudents) * 100).toFixed(0) : '0';

          return (
            <div key={hw.id} className="bca-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span className="bca-badge bca-badge-primary">
                    {hw.class} • {hw.subject}
                  </span>
                  <span className={`bca-badge bca-badge-${hw.status === 'Active' ? 'present' : 'pending'}`}>
                    {hw.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.08rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                  {hw.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 12px 0' }}>
                  By {hw.teacherName} • Assigned on {hw.assignedDate}
                </p>

                <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.78rem', color: '#334155', marginBottom: '14px', border: '1px solid #f1f5f9' }}>
                  {hw.instructions || hw.description}
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>Submissions:</span>
                    <strong>{subCount} / {hw.totalStudents} ({submissionPct}%)</strong>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${submissionPct}%`,
                        height: '100%',
                        backgroundColor: Number(submissionPct) >= 80 ? '#10b981' : '#f59e0b'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: '#e11d48', fontWeight: 600 }}>
                  <Clock size={13} />
                  <span>Due: {hw.dueDate}</span>
                </div>

                <button
                  onClick={() => setActiveHomeworkSubmissions(hw)}
                  className="bca-btn bca-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                >
                  <Eye size={13} /> Review Submissions
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SUBMISSIONS MODAL */}
      {activeHomeworkSubmissions && (
        <Modal
          isOpen={!!activeHomeworkSubmissions}
          onClose={() => setActiveHomeworkSubmissions(null)}
          title={`Student Submissions — ${activeHomeworkSubmissions.title}`}
          subtitle={`${activeHomeworkSubmissions.class} • ${activeHomeworkSubmissions.subject} (Due: ${activeHomeworkSubmissions.dueDate})`}
          maxWidth="700px"
          footer={
            <button onClick={() => setActiveHomeworkSubmissions(null)} className="bca-btn bca-btn-secondary">
              Close
            </button>
          }
        >
          <div className="bca-table-wrapper">
            <table className="bca-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Submitted At</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th style={{ textAlign: 'right' }}>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_STUDENTS.slice(0, 5).map((student, idx) => (
                  <tr key={student.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={student.avatar} alt={student.name} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                        <strong style={{ color: '#0f172a' }}>{student.name}</strong>
                      </div>
                    </td>
                    <td>{idx < 4 ? 'Yesterday, 08:30 PM' : 'Pending'}</td>
                    <td>
                      <span className={`bca-badge bca-badge-${idx < 4 ? 'present' : 'pending'}`}>
                        {idx < 4 ? 'Submitted' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <strong>{idx < 4 ? `${10 - idx}/10` : '-'}</strong>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => showToast(`Feedback sent to ${student.name}`, undefined, 'success')}
                        className="bca-btn bca-btn-secondary"
                        style={{ padding: '3px 8px', fontSize: '0.74rem' }}
                      >
                        Grade Work
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}

      {/* ADD HOMEWORK MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Post New Homework Assignment"
        subtitle="Broadcast assignment instructions to class portals"
        maxWidth="540px"
        footer={
          <>
            <button type="submit" form="homeworkForm" className="bca-btn bca-btn-primary">
              Publish Assignment
            </button>
            <button type="button" onClick={() => setShowAddModal(false)} className="bca-btn bca-btn-secondary">
              Cancel
            </button>
          </>
        }
      >
        <form id="homeworkForm" onSubmit={handleCreateHomework} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
              Assignment Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chapter 4 Numerical Problems"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Target Class *</label>
              <select
                value={newClass}
                onChange={(e) => setNewClass(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              >
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9 (SSC-I)</option>
                <option value="Grade 10">Grade 10 (SSC-II)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Subject *</label>
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
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Assigned Faculty *</label>
              <input
                type="text"
                required
                value={newTeacher}
                onChange={(e) => setNewTeacher(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Submission Due Date *</label>
              <input
                type="date"
                required
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Detailed Instructions</label>
            <textarea
              rows={3}
              placeholder="Specify questions, notebook formatting, or reference reading..."
              value={newInstructions}
              onChange={(e) => setNewInstructions(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
