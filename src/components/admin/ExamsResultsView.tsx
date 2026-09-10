import React, { useState } from 'react';
import {
  Award,
  Calendar,
  Plus,
  Printer,
  Eye,
  FileCheck,
  Search,
  Filter,
  CheckCircle,
  FileText,
  School,
  Download
} from 'lucide-react';
import { MOCK_EXAMS, MOCK_DATE_SHEET, MOCK_STUDENTS, SCHOOL_INFO } from '../../mockData';
import type { Exam, DateSheetItem, Student } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

export const ExamsResultsView: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'exams' | 'datesheet' | 'results'>('exams');
  const [exams, setExams] = useState<Exam[]>(MOCK_EXAMS);
  const [dateSheet, setDateSheet] = useState<DateSheetItem[]>(MOCK_DATE_SHEET);
  const [students] = useState<Student[]>(MOCK_STUDENTS);

  const [selectedStudentForCard, setSelectedStudentForCard] = useState<Student | null>(null);
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [newExamTitle, setNewExamTitle] = useState('Second Term Comprehensive');
  const [newStartDate, setNewStartDate] = useState('2026-11-10');
  const [newEndDate, setNewEndDate] = useState('2026-11-25');

  const [selectedClass, setSelectedClass] = useState('Grade 10');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Examinations, Date Sheets & Grading
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Academic term assessments, hall invigilation date sheets, and computerized printable report cards
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowAddExamModal(true)} className="bca-btn bca-btn-primary">
            <Plus size={16} />
            <span>Schedule Exam Term</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('exams')}
          className={`bca-btn ${activeTab === 'exams' ? 'bca-btn-primary' : 'bca-btn-secondary'}`}
          style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
        >
          <Award size={16} /> Examination Terms
        </button>
        <button
          onClick={() => setActiveTab('datesheet')}
          className={`bca-btn ${activeTab === 'datesheet' ? 'bca-btn-primary' : 'bca-btn-secondary'}`}
          style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
        >
          <Calendar size={16} /> Official Date Sheet
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`bca-btn ${activeTab === 'results' ? 'bca-btn-primary' : 'bca-btn-secondary'}`}
          style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
        >
          <FileCheck size={16} /> Student Report Cards
        </button>
      </div>

      {/* EXAMS TAB */}
      {activeTab === 'exams' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {exams.map((exam) => (
            <div key={exam.id} className="bca-card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className={`bca-badge bca-badge-${exam.status === 'Completed' ? 'present' : exam.status === 'Ongoing' ? 'pending' : 'primary'}`}>
                  {exam.status}
                </span>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{exam.academicYear || exam.term}</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 6px 0', color: '#0f172a' }}>
                {exam.name}
              </h3>
              <div style={{ fontSize: '0.84rem', color: '#475569', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="#64748b" />
                <span>{exam.startDate} — {exam.endDate}</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
                {(exam.classesIncluded || exam.classes || []).map((c: string, i: number) => (
                  <span key={i} className="bca-badge bca-badge-primary">
                    {c}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Weightage: 30%</span>
                <button
                  onClick={() => setActiveTab('datesheet')}
                  className="bca-btn bca-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                >
                  View Schedule
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: DATE SHEET */}
      {activeTab === 'datesheet' && (
        <div className="bca-table-wrapper">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Term 1 Comprehensive Date Sheet (September 2026)</h3>
            <button onClick={handlePrint} className="bca-btn bca-btn-secondary" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>
              <Printer size={14} /> Print Date Sheet
            </button>
          </div>
          <table className="bca-table">
            <thead>
              <tr>
                <th>Date & Day</th>
                <th>Subject</th>
                <th>Target Class</th>
                <th>Time Window</th>
                <th>Assigned Hall</th>
                <th>Chief Invigilator</th>
              </tr>
            </thead>
            <tbody>
              {dateSheet.map((d) => (
                <tr key={d.id}>
                  <td>
                    <strong>{d.date}</strong>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{d.day}</div>
                  </td>
                  <td>
                    <strong style={{ color: '#0f172a' }}>{d.subject}</strong>
                  </td>
                  <td>
                    <span className="bca-badge bca-badge-primary">{d.class}</span>
                  </td>
                  <td>{d.time}</td>
                  <td>{d.room}</td>
                  <td>{d.invigilator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: GRADEBOOK & REPORT CARDS */}
      {activeTab === 'results' && (
        <div>
          <div
            className="bca-card"
            style={{
              padding: '14px 20px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>Select Class:</span>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                >
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 8">Grade 8</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>Assessment:</span>
                <select style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}>
                  <option>Term 1 Mid-Term Assessments</option>
                  <option>Term 1 Final Examination</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => showToast('Class Ledger Exported (PDF)', undefined, 'info')}
              className="bca-btn bca-btn-secondary"
            >
              <Download size={15} /> Export Class Ledger
            </button>
          </div>

          <div className="bca-table-wrapper">
            <table className="bca-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Total Marks</th>
                  <th>Obtained Marks</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                  <th>Standing</th>
                  <th style={{ textAlign: 'right' }}>Official Report Card</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_STUDENTS.map((student, idx) => {
                  const total = 500;
                  const obtained = 440 + (idx === 0 ? 35 : idx === 1 ? 25 : 10 - idx * 8);
                  const pct = ((obtained / total) * 100).toFixed(1);
                  const grade = Number(pct) >= 90 ? 'A+' : Number(pct) >= 80 ? 'A' : 'B';

                  return (
                    <tr key={student.id}>
                      <td><strong>{student.rollNo}</strong></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img
                            src={student.avatar}
                            alt={student.name}
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>{student.name}</span>
                        </div>
                      </td>
                      <td>{total}</td>
                      <td><strong style={{ color: '#2563eb' }}>{obtained}</strong></td>
                      <td><strong>{pct}%</strong></td>
                      <td><span className="bca-badge bca-badge-present">{grade}</span></td>
                      <td>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {idx === 0 ? '🏆 1st Position' : idx === 1 ? '🥈 2nd Position' : idx === 2 ? '🥉 3rd Position' : `Rank ${idx + 1}`}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedStudentForCard(student)}
                          className="bca-btn bca-btn-secondary"
                          style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                        >
                          <Eye size={13} /> View Report Card
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* OFFICIAL PRINTABLE REPORT CARD MODAL */}
      {selectedStudentForCard && (
        <Modal
          isOpen={!!selectedStudentForCard}
          onClose={() => setSelectedStudentForCard(null)}
          title="Official Academic Achievement Report Card"
          subtitle={`Beacon Crest Academy — Comprehensive Term 1 Progress Report`}
          maxWidth="840px"
          footer={
            <>
              <button onClick={handlePrint} className="bca-btn bca-btn-primary">
                <Printer size={16} /> Print Report Card
              </button>
              <button onClick={() => setSelectedStudentForCard(null)} className="bca-btn bca-btn-secondary">
                Close
              </button>
            </>
          }
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '2px solid #0f172a',
              borderRadius: '12px',
              padding: '28px',
              position: 'relative'
            }}
          >
            {/* Header with School Crest */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #0B3974', paddingBottom: '16px', marginBottom: '20px' }}>
              <img src="/logo.png" alt="Read Academy Sahiwal" style={{ height: '64px', marginBottom: '8px' }} />
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#0B3974' }}>
                READ ACADEMY SAHIWAL
              </h2>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#E62929', letterSpacing: '0.1em', marginTop: '2px' }}>
                READ TO LEAD • SINCE 2018
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#475569' }}>
                Main Campus, Sahiwal, Punjab • Tel: +92 (40) 446-2810 • Affiliated with BISE Sahiwal
              </p>
              <div style={{ marginTop: '10px', display: 'inline-block', background: '#eff6ff', padding: '4px 16px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, color: '#0B3974', border: '1px solid #bfdbfe' }}>
                OFFICIAL ACADEMIC REPORT CARD — SESSION 2026-2027
              </div>
            </div>

            {/* Student Details Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                background: '#f8fafc',
                padding: '14px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '0.82rem',
                marginBottom: '20px'
              }}
            >
              <div><strong>Student Name:</strong> {selectedStudentForCard.name}</div>
              <div><strong>Roll No:</strong> {selectedStudentForCard.rollNo}</div>
              <div><strong>Class & Section:</strong> {selectedStudentForCard.class}-{selectedStudentForCard.section}</div>
              <div><strong>Student ID:</strong> {selectedStudentForCard.id}</div>
              <div><strong>Father Name:</strong> {selectedStudentForCard.parentName}</div>
              <div><strong>Attendance Rate:</strong> {selectedStudentForCard.attendancePct}%</div>
              <div><strong>Academic Term:</strong> Term 1 Assessment</div>
              <div><strong>Class Position:</strong> Top 3% Rank</div>
            </div>

            {/* Subject Marks Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginBottom: '20px' }}>
              <thead>
                <tr style={{ background: '#0B3974', color: '#ffffff' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left' }}>Subject</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Total Marks</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Passing Marks</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Marks Obtained</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Percentage</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Grade</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left' }}>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { sub: 'English Language & Comp', total: 100, pass: 40, obt: 92, grade: 'A+', rem: 'Exceptional creative writing' },
                  { sub: 'Urdu Literature', total: 100, pass: 40, obt: 88, grade: 'A', rem: 'Strong grammatical foundation' },
                  { sub: 'Mathematics (Calculus/Alg)', total: 100, pass: 40, obt: 96, grade: 'A+', rem: 'Distinction level problem solving' },
                  { sub: 'Physics', total: 100, pass: 40, obt: 94, grade: 'A+', rem: 'Accurate practical lab reports' },
                  { sub: 'Chemistry', total: 100, pass: 40, obt: 90, grade: 'A+', rem: 'Excellent theoretical knowledge' },
                  { sub: 'Computer Science', total: 100, pass: 40, obt: 98, grade: 'A+', rem: 'Flawless algorithmic logic' }
                ].map((row, rIdx) => (
                  <tr key={rIdx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 700 }}>{row.sub}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>{row.total}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>{row.pass}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 800, color: '#0B3974' }}>{row.obt}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>{row.obt}%</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <span className="bca-badge bca-badge-present">{row.grade}</span>
                    </td>
                    <td style={{ padding: '8px 10px', color: '#475569', fontSize: '0.78rem' }}>{row.rem}</td>
                  </tr>
                ))}
                <tr style={{ background: '#f8fafc', fontWeight: 800, borderTop: '2px solid #0B3974' }}>
                  <td style={{ padding: '10px' }}>GRAND TOTAL</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>600</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>240</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: '#4CAF50', fontSize: '1rem' }}>558</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>93.0%</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}><span className="bca-badge bca-badge-present">A+</span></td>
                  <td style={{ padding: '10px', color: '#4CAF50' }}>PROMOTED WITH HONORS</td>
                </tr>
              </tbody>
            </table>

            {/* Teacher Remarks Box */}
            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px 16px', background: '#f8fafc', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Class Teacher Comprehensive Remarks
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#1e293b', fontStyle: 'italic' }}>
                "{selectedStudentForCard.name} has maintained an exemplary academic standard throughout the term. Active contributor in debate societies and scientific workshops. Highly recommended for academic scholarship."
              </p>
            </div>

            {/* Signature & Seal Lines */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', paddingTop: '10px' }}>
              <div style={{ textAlign: 'center', width: '180px', borderTop: '1px solid #0B3974', paddingTop: '6px', fontSize: '0.76rem', fontWeight: 700 }}>
                Class Tutor
              </div>
              <div style={{ textAlign: 'center', width: '180px', borderTop: '1px solid #0B3974', paddingTop: '6px', fontSize: '0.76rem', fontWeight: 700 }}>
                Exam Controller
              </div>
              <div style={{ textAlign: 'center', width: '180px', borderTop: '1px solid #0B3974', paddingTop: '6px', fontSize: '0.76rem', fontWeight: 700 }}>
                Executive Principal / Seal
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* CREATE EXAM MODAL */}
      <Modal
        isOpen={showAddExamModal}
        onClose={() => setShowAddExamModal(false)}
        title="Schedule Assessment Term"
        subtitle="Establish an official examination session and date parameters"
        maxWidth="500px"
        footer={
          <>
            <button
              onClick={() => {
                const newEx: Exam = {
                  id: `EX-${Date.now()}`,
                  name: newExamTitle,
                  term: 'Term 2',
                  startDate: newStartDate,
                  endDate: newEndDate,
                  status: 'Upcoming',
                  academicYear: '2026-2027',
                  classes: ['Grade 6', 'Grade 8', 'Grade 9', 'Grade 10'],
                  classesIncluded: ['Grade 6', 'Grade 8', 'Grade 9', 'Grade 10'],
                  totalStudents: 360
                };
                setExams([...exams, newEx]);
                setShowAddExamModal(false);
                showToast('Examination Session Created', newExamTitle, 'success');
              }}
              className="bca-btn bca-btn-primary"
            >
              Confirm Schedule
            </button>
            <button onClick={() => setShowAddExamModal(false)} className="bca-btn bca-btn-secondary">
              Cancel
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
              Examination Title *
            </label>
            <input
              type="text"
              value={newExamTitle}
              onChange={(e) => setNewExamTitle(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Commencement Date *
              </label>
              <input
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Concluding Date *
              </label>
              <input
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
