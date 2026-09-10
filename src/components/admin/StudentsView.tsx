import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  FileText,
  UserCheck,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Printer,
  Download,
  Award,
  BookOpen
} from 'lucide-react';
import { MOCK_STUDENTS } from '../../mockData';
import type { Student } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

export const StudentsView: React.FC = () => {
  const { showToast } = useToast();
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedFeeStatus, setSelectedFeeStatus] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [profileActiveTab, setProfileActiveTab] = useState<
    'Overview' | 'Personal Information' | 'Parent Information' | 'Attendance' | 'Fees' | 'Results' | 'Progress' | 'Documents'
  >('Overview');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for Add Student Mock
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('Grade 10');
  const [newStudentSection, setNewStudentSection] = useState('A');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'All' || s.class === selectedClass;
    const matchesSection = selectedSection === 'All' || s.section === selectedSection;
    const matchesFee = selectedFeeStatus === 'All' || s.feeStatus === selectedFeeStatus;
    return matchesSearch && matchesClass && matchesSection && matchesFee;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newParentName) {
      showToast('Please fill in required fields', undefined, 'error');
      return;
    }
    const newStudent: Student = {
      id: `STU-2026-${Math.floor(100 + Math.random() * 900)}`,
      name: newStudentName,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      rollNo: `${newStudentClass.replace('Grade ', '')}-${newStudentSection}-99`,
      class: newStudentClass,
      section: newStudentSection,
      parentName: newParentName,
      parentPhone: newParentPhone || '+92 300 1234567',
      parentEmail: 'parent@beaconcrest.edu.pk',
      attendancePct: 98.0,
      feeStatus: 'Paid',
      status: 'Active',
      dob: '2011-05-12',
      gender: 'Male',
      bloodGroup: 'O+',
      address: 'Sector F-8, Islamabad',
      admissionDate: '2026-09-07',
      emergencyContact: '+92 300 7654321',
      recentMarks: [
        { subject: 'Mathematics', marks: 88, total: 100, grade: 'A' },
        { subject: 'Science', marks: 91, total: 100, grade: 'A+' }
      ],
      attendanceHistory: [{ month: 'Sep', present: 6, absent: 0, late: 0 }],
      feeRecords: [
        { voucherNo: 'V-2026-NEW', month: 'September 2026', amount: 32000, status: 'Paid', date: '2026-09-07' }
      ]
    };

    setStudents([newStudent, ...students]);
    setShowAddModal(false);
    setNewStudentName('');
    setNewParentName('');
    setNewParentPhone('');
    showToast('Student Enrolled Successfully', `${newStudent.name} added to ${newStudent.class}`, 'success');
  };

  return (
    <div>
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Student Management
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Manage enrollment, view profiles, fee statuses, and academic records ({filteredStudents.length} students)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => showToast('Exporting student roster (CSV)', undefined, 'info')}
            className="bca-btn bca-btn-secondary"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bca-btn bca-btn-primary"
          >
            <Plus size={16} />
            <span>Enroll New Student</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div
        className="bca-card"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          flexWrap: 'wrap',
          background: '#ffffff'
        }}
      >
        {/* Search */}
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            placeholder="Search by student name, roll no, ID, parent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              outline: 'none',
              fontSize: '0.86rem'
            }}
          />
        </div>

        {/* Class Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Class:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
          >
            <option value="All">All Classes</option>
            <option value="Playgroup">Playgroup</option>
            <option value="Nursery">Nursery</option>
            <option value="Prep / KG">Prep / KG</option>
            <option value="Grade 1">Grade 1</option>
            <option value="Grade 2">Grade 2</option>
            <option value="Grade 3">Grade 3</option>
            <option value="Grade 4">Grade 4</option>
            <option value="Grade 5">Grade 5</option>
            <option value="Grade 6">Grade 6</option>
            <option value="Grade 7">Grade 7</option>
            <option value="Grade 8">Grade 8</option>
            <option value="Grade 9">Grade 9 (SSC-I)</option>
            <option value="Grade 10">Grade 10 (SSC-II)</option>
          </select>
        </div>

        {/* Section Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Section:</span>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
          >
            <option value="All">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>
        </div>

        {/* Fee Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Fee:</span>
          <select
            value={selectedFeeStatus}
            onChange={(e) => setSelectedFeeStatus(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Modern Data Table */}
      <div className="bca-table-wrapper">
        <table className="bca-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student</th>
              <th>Class & Section</th>
              <th>Parent / Guardian</th>
              <th>Phone</th>
              <th>Attendance</th>
              <th>Fee Status</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  No students found matching current filters.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1e40af', fontSize: '0.82rem' }}>
                      {student.id}
                    </span>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Roll: {student.rollNo}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={student.avatar}
                        alt={student.name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{student.name}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{student.gender} • {student.bloodGroup}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong style={{ color: '#1e293b' }}>{student.class}</strong>
                    <span style={{ color: '#64748b' }}> - {student.section}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#334155' }}>{student.parentName}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={13} color="#94a3b8" />
                      <span>{student.parentPhone}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          flex: 1,
                          height: '6px',
                          backgroundColor: '#e2e8f0',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          width: '60px'
                        }}
                      >
                        <div
                          style={{
                            width: `${student.attendancePct}%`,
                            height: '100%',
                            backgroundColor: student.attendancePct >= 90 ? '#10b981' : student.attendancePct >= 75 ? '#f59e0b' : '#f43f5e'
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{student.attendancePct}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`bca-badge bca-badge-${student.feeStatus.toLowerCase()}`}>
                      {student.feeStatus}
                    </span>
                  </td>
                  <td>
                    <span className="bca-badge bca-badge-active">
                      {student.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="bca-btn bca-btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                        title="View Full Profile"
                      >
                        <Eye size={14} /> Profile
                      </button>
                      <button
                        onClick={() => showToast(`Printing ID Card for ${student.name}`, undefined, 'info')}
                        className="bca-btn bca-btn-secondary"
                        style={{ padding: '6px 8px' }}
                        title="Print ID Card"
                      >
                        <Printer size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DETAILED STUDENT PROFILE MODAL WITH 8 TABS */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`Student Profile — ${selectedStudent.name}`}
          subtitle={`${selectedStudent.id} • ${selectedStudent.class}-${selectedStudent.section} (Roll: ${selectedStudent.rollNo})`}
          maxWidth="900px"
          footer={
            <>
              <button
                onClick={() => showToast(`Student record for ${selectedStudent.name} saved`, undefined, 'success')}
                className="bca-btn bca-btn-primary"
              >
                Save Record
              </button>
              <button
                onClick={() => setSelectedStudent(null)}
                className="bca-btn bca-btn-secondary"
              >
                Close
              </button>
            </>
          }
        >
          <div>
            {/* Top Student Header Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                marginBottom: '20px'
              }}
            >
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ffffff', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{selectedStudent.name}</h3>
                  <span className={`bca-badge bca-badge-${selectedStudent.feeStatus.toLowerCase()}`}>
                    Fee: {selectedStudent.feeStatus}
                  </span>
                  <span className="bca-badge bca-badge-active">
                    {selectedStudent.status}
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.84rem' }}>
                  Enrolled: {selectedStudent.admissionDate} • Class: <strong>{selectedStudent.class}-{selectedStudent.section}</strong> • Emergency: {selectedStudent.emergencyContact}
                </p>
              </div>
            </div>

            {/* 8 Tabs Bar */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid #e2e8f0',
                gap: '8px',
                overflowX: 'auto',
                marginBottom: '20px',
                paddingBottom: '2px'
              }}
            >
              {[
                'Overview',
                'Personal Information',
                'Parent Information',
                'Attendance',
                'Fees',
                'Results',
                'Progress',
                'Documents'
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setProfileActiveTab(tab as any)}
                  style={{
                    padding: '8px 14px',
                    border: 'none',
                    background: 'transparent',
                    borderBottom: profileActiveTab === tab ? '2.5px solid #2563eb' : '2.5px solid transparent',
                    color: profileActiveTab === tab ? '#2563eb' : '#64748b',
                    fontWeight: profileActiveTab === tab ? 700 : 500,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab 1: Overview */}
            {profileActiveTab === 'Overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div className="bca-card" style={{ padding: '16px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Academic Standing</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', margin: '6px 0' }}>Grade A+ (94%)</div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Top 5% in {selectedStudent.class}</p>
                </div>

                <div className="bca-card" style={{ padding: '16px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Cumulative Attendance</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563eb', margin: '6px 0' }}>{selectedStudent.attendancePct}%</div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>96 days present out of 100</p>
                </div>

                <div className="bca-card" style={{ padding: '16px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Fee Clearance</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: selectedStudent.feeStatus === 'Paid' ? '#059669' : '#d97706', margin: '6px 0' }}>
                    {selectedStudent.feeStatus}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Term 1 vouchers reconciled</p>
                </div>
              </div>
            )}

            {/* Tab 2: Personal Information */}
            {profileActiveTab === 'Personal Information' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.88rem' }}>
                <div><strong>Full Name:</strong> {selectedStudent.name}</div>
                <div><strong>Date of Birth:</strong> {selectedStudent.dob}</div>
                <div><strong>Gender:</strong> {selectedStudent.gender}</div>
                <div><strong>Blood Group:</strong> {selectedStudent.bloodGroup}</div>
                <div><strong>Admission Date:</strong> {selectedStudent.admissionDate}</div>
                <div><strong>Emergency Contact:</strong> {selectedStudent.emergencyContact}</div>
                <div style={{ gridColumn: 'span 2' }}><strong>Residential Address:</strong> {selectedStudent.address}</div>
                <div style={{ gridColumn: 'span 2' }}><strong>Previous School:</strong> {selectedStudent.previousSchool || 'N/A'}</div>
              </div>
            )}

            {/* Tab 3: Parent Information */}
            {profileActiveTab === 'Parent Information' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.88rem' }}>
                <div><strong>Father / Guardian Name:</strong> {selectedStudent.parentName}</div>
                <div><strong>Relationship:</strong> Father</div>
                <div><strong>Primary Phone:</strong> {selectedStudent.parentPhone}</div>
                <div><strong>Email Address:</strong> {selectedStudent.parentEmail}</div>
                <div><strong>CNIC / Identity:</strong> 61101-9482710-3</div>
                <div><strong>Occupation:</strong> Corporate Professional / Business</div>
              </div>
            )}

            {/* Tab 4: Attendance */}
            {profileActiveTab === 'Attendance' && (
              <div>
                <h4 style={{ margin: '0 0 12px 0' }}>Monthly Attendance Breakdown (2026)</h4>
                <div className="bca-table-wrapper">
                  <table className="bca-table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Present Days</th>
                        <th>Absences</th>
                        <th>Late Marks</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.attendanceHistory.map((item, idx) => (
                        <tr key={idx}>
                          <td><strong>{item.month} 2026</strong></td>
                          <td><span style={{ color: '#059669', fontWeight: 700 }}>{item.present} Days</span></td>
                          <td><span style={{ color: item.absent > 0 ? '#e11d48' : '#64748b' }}>{item.absent}</span></td>
                          <td><span style={{ color: item.late > 0 ? '#d97706' : '#64748b' }}>{item.late}</span></td>
                          <td><span className="bca-badge bca-badge-present">Excellent</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 5: Fees */}
            {profileActiveTab === 'Fees' && (
              <div>
                <h4 style={{ margin: '0 0 12px 0' }}>Recent Fee Vouchers & Payments</h4>
                <div className="bca-table-wrapper">
                  <table className="bca-table">
                    <thead>
                      <tr>
                        <th>Voucher #</th>
                        <th>Billing Month</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Reconciled Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.feeRecords.map((fee, idx) => (
                        <tr key={idx}>
                          <td><code>{fee.voucherNo}</code></td>
                          <td>{fee.month}</td>
                          <td><strong>Rs. {fee.amount.toLocaleString()}</strong></td>
                          <td><span className="bca-badge bca-badge-paid">{fee.status}</span></td>
                          <td>{fee.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 6: Results */}
            {profileActiveTab === 'Results' && (
              <div>
                <h4 style={{ margin: '0 0 12px 0' }}>Term Examination Assessment</h4>
                <div className="bca-table-wrapper">
                  <table className="bca-table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Total Marks</th>
                        <th>Obtained Marks</th>
                        <th>Percentage</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.recentMarks.map((m, idx) => (
                        <tr key={idx}>
                          <td><strong>{m.subject}</strong></td>
                          <td>{m.total}</td>
                          <td><strong style={{ color: '#2563eb' }}>{m.marks}</strong></td>
                          <td>{((m.marks / m.total) * 100).toFixed(0)}%</td>
                          <td><span className="bca-badge bca-badge-active">{m.grade}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 7: Progress */}
            {profileActiveTab === 'Progress' && (
              <div>
                <h4 style={{ margin: '0 0 12px 0' }}>Teacher Remarks & Growth Index</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Prof. Junaid Iqbal (Physics) • Term Mid-Review</div>
                    <p style={{ margin: '4px 0 0', fontSize: '0.86rem', color: '#1e293b' }}>
                      "Demonstrates rare analytical rigor in mechanics. Participated actively in STEM robotics projects and mentored junior cohort."
                    </p>
                  </div>
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Ms. Ayesha Siddiqui (English) • Essay Assessment</div>
                    <p style={{ margin: '4px 0 0', fontSize: '0.86rem', color: '#1e293b' }}>
                      "Expressive writing with strong lexical variety. Recommending for inter-school parliamentary debate council."
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 8: Documents */}
            {profileActiveTab === 'Documents' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {['Birth Certificate (NADRA B-Form).pdf', 'Past School Leaving Certificate.pdf', 'Vaccination Immunization Record.pdf', 'Passport Sized Photo (White BG).jpg'].map((doc, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: '#ffffff'
                    }}
                  >
                    <FileText size={20} color="#2563eb" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {doc}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#059669' }}>Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ADD STUDENT MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Enroll New Student"
        subtitle="Create an active student profile in the school registry"
        maxWidth="620px"
        footer={
          <>
            <button type="submit" form="addStudentForm" className="bca-btn bca-btn-primary">
              Complete Enrollment
            </button>
            <button type="button" onClick={() => setShowAddModal(false)} className="bca-btn bca-btn-secondary">
              Cancel
            </button>
          </>
        }
      >
        <form id="addStudentForm" onSubmit={handleCreateStudent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
              Student Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Muhammad Rayyan"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Class *
              </label>
              <select
                value={newStudentClass}
                onChange={(e) => setNewStudentClass(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              >
                <option value="Playgroup">Playgroup</option>
                <option value="Nursery">Nursery</option>
                <option value="Prep / KG">Prep / KG</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9 (SSC-I)</option>
                <option value="Grade 10">Grade 10 (SSC-II)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Section *
              </label>
              <select
                value={newStudentSection}
                onChange={(e) => setNewStudentSection(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Parent / Guardian Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tariq Mehmood"
                value={newParentName}
                onChange={(e) => setNewParentName(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Contact Phone *
              </label>
              <input
                type="text"
                required
                placeholder="+92 300 1234567"
                value={newParentPhone}
                onChange={(e) => setNewParentPhone(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
