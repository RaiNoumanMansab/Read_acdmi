import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  FileText,
  UserCheck,
  CheckCircle,
  CheckCircle2,
  Phone,
  PhoneCall,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Printer,
  Download,
  Award,
  BookOpen,
  AlertTriangle,
  Send,
  Droplet,
  RotateCcw,
  Users,
  LayoutGrid,
  Table as TableIcon,
  Bell
} from 'lucide-react';
import type { Student } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';
import { studentsApi, academicsApi } from '../../services/api';
import './StudentsView.css';

export const ALL_CLASSES = [
  'Playgroup',
  'Nursery',
  'Prep / KG',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'FSC Pre-Medical',
  'FSC Pre-Engineering',
  'ICS (Computer Science)',
  'I.Com (Commerce)',
  'FA (Arts/Humanities)',
  'D.Com'
];

const mapBackendStudent = (s: any): Student => ({
  id: s.id || s.rollNo,
  name: s.fullName || s.name || 'Unnamed Student',
  avatar: s.avatarUrl || s.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  rollNo: s.rollNo || s.id,
  class: s.class?.name || (typeof s.class === 'string' ? s.class : '—'),
  section: s.section?.name ? s.section.name.replace('Section ', '') : (s.section || '—'),
  parentName: s.parentName || 'Not Provided',
  parentPhone: s.parentPhone || 'Not Provided',
  parentEmail: s.parentEmail || 'Not Provided',
  attendancePct: s.attendancePct ?? null,
  feeStatus: (s.feeStatus === 'PAID' ? 'Paid' : s.feeStatus === 'OVERDUE' ? 'Overdue' : 'Pending'),
  status: s.status || 'Active',
  dob: s.dob ? (typeof s.dob === 'string' ? s.dob.split('T')[0] : null) : null,
  gender: s.gender === 'FEMALE' ? 'Female' : 'Male',
  bloodGroup: s.bloodGroup || null,
  address: s.homeAddress || s.address || null,
  admissionDate: s.admissionDate ? (typeof s.admissionDate === 'string' ? s.admissionDate.split('T')[0] : null) : null,
  emergencyContact: s.emergencyContact || null,
  previousSchool: s.previousSchool || null,
  recentMarks: s.marksEntries?.map((m: any) => ({
    subject: m.subject?.name || 'Subject',
    marks: Number(m.obtainedMarks) || 0,
    total: Number(m.totalMarks) || 100,
    grade: m.grade || 'A'
  })) || [],
  attendanceHistory: s.attendance && s.attendance.length > 0 ? [
    {
      month: 'Recent',
      present: s.attendance.filter((a: any) => a.status === 'PRESENT').length,
      absent: s.attendance.filter((a: any) => a.status === 'ABSENT').length,
      late: s.attendance.filter((a: any) => a.status === 'LATE').length
    }
  ] : [],
  feeRecords: (s.feeVouchers && s.feeVouchers.length > 0)
    ? s.feeVouchers.map((v: any) => {
        const isPaid = v.status === 'PAID';
        const isOverdue = v.status === 'OVERDUE' || (!isPaid && v.dueDate && new Date(v.dueDate).getTime() < Date.now());
        const statusStr = isPaid ? 'Paid' : (isOverdue ? 'Overdue' : 'Pending');
        const displayDate = isPaid
          ? (v.paidDate ? v.paidDate.split('T')[0] : 'Paid')
          : (v.dueDate ? `Due: ${v.dueDate.split('T')[0]}` : 'Pending');

        return {
          voucherNo: v.voucherNo || 'VCH-001',
          month: v.billingMonth || 'September 2026',
          amount: Number(v.totalAmount) || 0,
          status: statusStr,
          date: displayDate,
        };
      })
    : []
});

export const StudentsView: React.FC = () => {
  const { showToast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedFeeStatus, setSelectedFeeStatus] = useState('All');
  const [quickFilter, setQuickFilter] = useState<'all' | 'overdue' | 'low-attendance' | 'paid'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [profileActiveTab, setProfileActiveTab] = useState<
    'Overview' | 'Personal Information' | 'Parent Information' | 'Attendance' | 'Fees' | 'Results' | 'Progress' | 'Documents'
  >('Overview');
  const [classesList, setClassesList] = useState<string[]>(ALL_CLASSES);
  const [showAddModal, setShowAddModal] = useState(false);

  // Load students and classes from REST API
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    studentsApi.getStudents().then((res) => {
      if (isMounted) {
        if (res?.data && Array.isArray(res.data)) {
          setStudents(res.data.map(mapBackendStudent));
        } else {
          setStudents([]);
        }
      }
    }).catch((err) => {
      console.warn('Backend students fetch failed:', err);
      if (isMounted) {
        setStudents([]);
      }
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    academicsApi.getClasses().then((res) => {
      if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
        const names = res.data.map((c: any) => c.name);
        setClassesList(Array.from(new Set([...ALL_CLASSES, ...names])));
      }
    }).catch((err) => {
      console.warn('Academics getClasses error in StudentsView:', err);
    });

    return () => { isMounted = false; };
  }, []);

  // Responsive view detection
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('cards');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Form states for Add Student Mock
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('Grade 10');
  const [newStudentSection, setNewStudentSection] = useState('A');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');

  // Key KPI metrics calculations
  const totalStudents = students.length;
  const overdueStudents = students.filter((s) => s.feeStatus === 'Overdue');
  const overdueCount = overdueStudents.length;
  const lowAttendanceStudents = students.filter((s) => s.attendancePct < 85);
  const lowAttendanceCount = lowAttendanceStudents.length;
  const paidCount = students.filter((s) => s.feeStatus === 'Paid').length;

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'All' || s.class === selectedClass;
    const matchesSection = selectedSection === 'All' || s.section === selectedSection;
    const matchesFee = selectedFeeStatus === 'All' || s.feeStatus === selectedFeeStatus;

    let matchesQuick = true;
    if (quickFilter === 'overdue') matchesQuick = s.feeStatus === 'Overdue';
    else if (quickFilter === 'low-attendance') matchesQuick = s.attendancePct < 85;
    else if (quickFilter === 'paid') matchesQuick = s.feeStatus === 'Paid';

    return matchesSearch && matchesClass && matchesSection && matchesFee && matchesQuick;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedClass('All');
    setSelectedSection('All');
    setSelectedFeeStatus('All');
    setQuickFilter('all');
  };

  const handleSendDefaulterNotices = () => {
    showToast(
      'Fee Defaulter Alerts Dispatched',
      `Urgent SMS & WhatsApp notifications dispatched to ${overdueCount} parents.`,
      'error'
    );
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newParentName) {
      showToast('Please fill in required fields', undefined, 'error');
      return;
    }
    try {
      const res = await studentsApi.createStudent({
        fullName: newStudentName,
        classId: newStudentClass,
        sectionId: newStudentSection,
        parentName: newParentName,
        parentPhone: newParentPhone || '+92 300 1234567',
        parentEmail: 'parent@readacademy.edu.pk',
        gender: 'MALE',
        dob: '2011-05-12',
        bloodGroup: 'O+',
        homeAddress: 'Main Campus Area, Sahiwal, Punjab',
        emergencyContact: '+92 300 7982018'
      });
      if (res?.data) {
        setStudents((prev) => [mapBackendStudent(res.data), ...prev]);
        setShowAddModal(false);
        setNewStudentName('');
        setNewParentName('');
        setNewParentPhone('');
        showToast('Student Enrolled Successfully', `${newStudentName} added into database`, 'success');
      }
    } catch (err: any) {
      showToast('Enrollment Error', err.message || 'Failed to enroll student', 'error');
    }
  };

  return (
    <div>
      {/* Top Header & Actions */}
      <div className="students-header-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0B3974', margin: 0 }}>
              Student Management
            </h2>
            <span
              style={{
                backgroundColor: '#eff6ff',
                color: '#0B3974',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid #bfdbfe'
              }}
            >
              {filteredStudents.length} Active
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Manage enrollment profiles, fee statuses, attendance records, and academic dossiers.
          </p>
        </div>

        <div className="students-header-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => showToast('Exporting student roster (CSV)', undefined, 'info')}
            className="bca-btn bca-btn-secondary"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          {/* Prominent Brand Red Action for Fee Defaulters */}
          {overdueCount > 0 && (
            <button
              onClick={handleSendDefaulterNotices}
              className="bca-btn bca-btn-red"
              title="Broadcast SMS fee alert to all overdue parents"
            >
              <Send size={15} />
              <span>Fee Notice ({overdueCount})</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="bca-btn bca-btn-primary"
          >
            <Plus size={16} />
            <span>Enroll New Student</span>
          </button>
        </div>
      </div>

      {/* Top KPI Alert Strip with Brand Red Emphasis */}
      <div className="students-kpi-grid">
        {/* Total Students */}
        <div className="students-kpi-card kpi-blue">
          <div className="kpi-icon-box blue">
            <Users size={22} />
          </div>
          <div>
            <div className="kpi-title">Total Enrolled</div>
            <div className="kpi-value" style={{ color: '#0B3974' }}>
              {totalStudents}
            </div>
            <div className="kpi-subtext" style={{ color: '#64748b' }}>
              Registered in 13 classes
            </div>
          </div>
        </div>

        {/* Brand Red Highlight: Overdue Fee Defaulters */}
        <div
          className="students-kpi-card kpi-red"
          style={{ cursor: 'pointer' }}
          onClick={() => setQuickFilter(quickFilter === 'overdue' ? 'all' : 'overdue')}
          title="Click to view fee defaulters"
        >
          <div className="kpi-icon-box red">
            <AlertTriangle size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="kpi-title" style={{ color: '#E62929' }}>
              Fee Overdue Alert
            </div>
            <div className="kpi-value" style={{ color: '#E62929' }}>
              {overdueCount}
            </div>
            <div className="kpi-subtext" style={{ color: '#b81b1b', fontWeight: 600 }}>
              <span className="overdue-pulse-dot" /> Urgent recovery required
            </div>
          </div>
        </div>

        {/* Brand Red Highlight: Low Attendance */}
        <div
          className="students-kpi-card kpi-red"
          style={{ cursor: 'pointer' }}
          onClick={() => setQuickFilter(quickFilter === 'low-attendance' ? 'all' : 'low-attendance')}
          title="Click to view students with <85% attendance"
        >
          <div className="kpi-icon-box red">
            <Bell size={22} />
          </div>
          <div>
            <div className="kpi-title" style={{ color: '#E62929' }}>
              Low Attendance (&lt;85%)
            </div>
            <div className="kpi-value" style={{ color: '#E62929' }}>
              {lowAttendanceCount}
            </div>
            <div className="kpi-subtext" style={{ color: '#64748b' }}>
              Warning notices pending
            </div>
          </div>
        </div>

        {/* Cleared Fees */}
        <div className="students-kpi-card kpi-green">
          <div className="kpi-icon-box green">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="kpi-title">Fees Reconciled</div>
            <div className="kpi-value" style={{ color: '#2e7d32' }}>
              {paidCount}
            </div>
            <div className="kpi-subtext" style={{ color: '#2e7d32' }}>
              {totalStudents > 0 ? Math.round((paidCount / totalStudents) * 100) : 0}% clearance rate
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filter Alert Pills */}
      <div className="students-quick-filters">
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginRight: '4px' }}>
          Quick Filter:
        </span>
        <button
          onClick={() => setQuickFilter('all')}
          className={`quick-filter-pill ${quickFilter === 'all' ? 'active-all' : ''}`}
        >
          All Students ({totalStudents})
        </button>
        <button
          onClick={() => setQuickFilter('overdue')}
          className={`quick-filter-pill pill-red ${quickFilter === 'overdue' ? 'active' : ''}`}
        >
          <span className="overdue-pulse-dot" />
          <span>🔴 Overdue Fees ({overdueCount})</span>
        </button>
        <button
          onClick={() => setQuickFilter('low-attendance')}
          className={`quick-filter-pill pill-red ${quickFilter === 'low-attendance' ? 'active' : ''}`}
        >
          <AlertTriangle size={13} />
          <span>⚠️ Low Attendance ({lowAttendanceCount})</span>
        </button>
        <button
          onClick={() => setQuickFilter('paid')}
          className={`quick-filter-pill pill-green ${quickFilter === 'paid' ? 'active' : ''}`}
        >
          <CheckCircle size={13} />
          <span>Fee Cleared ({paidCount})</span>
        </button>

        {(searchQuery || selectedClass !== 'All' || selectedSection !== 'All' || selectedFeeStatus !== 'All' || quickFilter !== 'all') && (
          <button
            onClick={handleResetFilters}
            className="quick-filter-pill"
            style={{ color: '#E62929', borderColor: '#fca5a5', background: '#fff5f5' }}
            title="Reset all search filters"
          >
            <RotateCcw size={13} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Responsive Filter Card */}
      <div className="students-filter-card">
        <div className="students-filter-row">
          {/* Search */}
          <div className="students-search-box">
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input
              type="text"
              placeholder="Search by student name, roll no, ID, parent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Dropdown Filters */}
          <div className="students-dropdown-group">
            {/* Class Filter */}
            <div className="students-select-item">
              <label>Class:</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="All">All Classes</option>
                {classesList.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Filter */}
            <div className="students-select-item">
              <label>Section:</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="All">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>

            {/* Fee Status Filter */}
            <div className="students-select-item">
              <label>Fee Status:</label>
              <select
                value={selectedFeeStatus}
                onChange={(e) => setSelectedFeeStatus(e.target.value)}
                style={{
                  color: selectedFeeStatus === 'Overdue' ? '#E62929' : 'inherit',
                  fontWeight: selectedFeeStatus === 'Overdue' ? 700 : 'normal'
                }}
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">🔴 Overdue</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle: Table vs Cards */}
          <div className="view-mode-toggle">
            <button
              onClick={() => setViewMode('table')}
              className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
              title="Table view for wider screens"
            >
              <TableIcon size={14} />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`view-mode-btn ${viewMode === 'cards' ? 'active' : ''}`}
              title="Card view for touch & mobile devices"
            >
              <LayoutGrid size={14} />
              <span>Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* No Students Found Message */}
      {filteredStudents.length === 0 && (
        <div
          className="bca-card"
          style={{
            textAlign: 'center',
            padding: '50px 20px',
            color: '#64748b',
            background: '#ffffff'
          }}
        >
          <AlertTriangle size={36} color="#E62929" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '1.1rem', color: '#0f172a', margin: '0 0 6px' }}>
            No Students Found
          </h4>
          <p style={{ fontSize: '0.86rem', margin: '0 0 16px' }}>
            No student records match the active query or filter criteria.
          </p>
          <button onClick={handleResetFilters} className="bca-btn bca-btn-secondary">
            <RotateCcw size={14} />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      {/* TABLE VIEW (Desktop / Tablet) */}
      {viewMode === 'table' && filteredStudents.length > 0 && (
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
              {filteredStudents.map((student) => {
                const isOverdue = student.feeStatus === 'Overdue';
                const isLowAttendance = student.attendancePct < 85;

                return (
                  <tr key={student.id} className={isOverdue ? 'row-overdue' : ''}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isOverdue && <span className="overdue-pulse-dot" title="Overdue fee flag" />}
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: isOverdue ? '#E62929' : '#0B3974',
                            fontSize: '0.82rem'
                          }}
                        >
                          {student.id}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Roll: {student.rollNo}</div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={student.avatar}
                          alt={student.name}
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: isOverdue ? '2px solid #E62929' : '2px solid #e2e8f0'
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{student.name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{student.gender}</span>
                            {/* Medical Blood Group Red Badge */}
                            <span className="blood-badge" title="Blood Group">
                              <Droplet size={9} fill="#E62929" />
                              {student.bloodGroup}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <strong style={{ color: '#1e293b' }}>{student.class}</strong>
                      <span style={{ color: '#64748b' }}> - Sec {student.section}</span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: '#334155' }}>{student.parentName}</div>
                    </td>

                    <td>
                      <a
                        href={`tel:${student.parentPhone}`}
                        style={{
                          fontSize: '0.82rem',
                          color: '#0B3974',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          textDecoration: 'none'
                        }}
                        title="Click to call parent"
                      >
                        <Phone size={13} color="#0B3974" />
                        <span>{student.parentPhone}</span>
                      </a>
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
                              backgroundColor:
                                student.attendancePct >= 90
                                  ? '#4CAF50'
                                  : student.attendancePct >= 85
                                  ? '#FFD700'
                                  : '#E62929'
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: isLowAttendance ? '#E62929' : 'inherit'
                          }}
                        >
                          {student.attendancePct}%
                        </span>
                      </div>
                    </td>

                    <td>
                      {isOverdue ? (
                        <span
                          className="bca-badge bca-badge-overdue"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontWeight: 700,
                            color: '#E62929',
                            backgroundColor: '#feecec',
                            borderColor: '#fca5a5'
                          }}
                        >
                          <span className="overdue-pulse-dot" />
                          Overdue
                        </span>
                      ) : (
                        <span className={`bca-badge bca-badge-${student.feeStatus.toLowerCase()}`}>
                          {student.feeStatus}
                        </span>
                      )}
                    </td>

                    <td>
                      <span className="bca-badge bca-badge-active">
                        {student.status}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                        {/* Red SMS button for Overdue fee reminder */}
                        {isOverdue && (
                          <button
                            onClick={() =>
                              showToast(
                                `SMS Notice Sent to ${student.parentName}`,
                                `Overdue notice dispatched to ${student.parentPhone}`,
                                'error'
                              )
                            }
                            className="bca-btn bca-btn-red"
                            style={{ padding: '6px 9px', fontSize: '0.75rem' }}
                            title="Send Fee Alert SMS"
                          >
                            <Send size={13} />
                            <span>SMS</span>
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="bca-btn bca-btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                          title="View Full Profile"
                        >
                          <Eye size={14} />
                          <span>Profile</span>
                        </button>

                        <button
                          onClick={() => showToast(`Printing Student ID Card for ${student.name}`, undefined, 'info')}
                          className="bca-btn bca-btn-secondary"
                          style={{ padding: '6px 8px' }}
                          title="Print ID Card"
                        >
                          <Printer size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MOBILE / RESPONSIVE CARDS VIEW */}
      {viewMode === 'cards' && filteredStudents.length > 0 && (
        <div className="students-cards-container">
          {filteredStudents.map((student) => {
            const isOverdue = student.feeStatus === 'Overdue';
            const isLowAttendance = student.attendancePct < 85;

            return (
              <div
                key={student.id}
                className={`student-card-item ${isOverdue ? 'card-overdue' : ''}`}
              >
                {/* Top Card Row */}
                <div className="student-card-header">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="student-card-avatar"
                    style={{
                      borderColor: isOverdue ? '#E62929' : '#e2e8f0'
                    }}
                  />
                  <div className="student-card-info">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                      <div className="student-card-name">{student.name}</div>
                      {/* Blood Group Red Badge */}
                      <span className="blood-badge">
                        <Droplet size={9} fill="#E62929" />
                        {student.bloodGroup}
                      </span>
                    </div>

                    <div className="student-card-meta">
                      <span style={{ fontWeight: 700, color: isOverdue ? '#E62929' : '#0B3974' }}>
                        {student.id}
                      </span>
                      <span>•</span>
                      <span>Roll: {student.rollNo}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          backgroundColor: '#eff6ff',
                          color: '#0B3974',
                          fontWeight: 700,
                          fontSize: '0.74rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          border: '1px solid #bfdbfe'
                        }}
                      >
                        {student.class} - Sec {student.section}
                      </span>

                      {isOverdue ? (
                        <span
                          className="bca-badge bca-badge-overdue"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 700,
                            color: '#E62929',
                            backgroundColor: '#feecec',
                            borderColor: '#fca5a5'
                          }}
                        >
                          <span className="overdue-pulse-dot" />
                          Fee Overdue
                        </span>
                      ) : (
                        <span className={`bca-badge bca-badge-${student.feeStatus.toLowerCase()}`}>
                          {student.feeStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Body Stats */}
                <div className="student-card-body">
                  <div>
                    <div className="card-stat-label">Guardian</div>
                    <div className="card-stat-value">{student.parentName}</div>
                    <a
                      href={`tel:${student.parentPhone}`}
                      style={{
                        fontSize: '0.78rem',
                        color: '#0B3974',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '3px',
                        textDecoration: 'none',
                        fontWeight: 600
                      }}
                    >
                      <PhoneCall size={12} color="#0B3974" />
                      <span>{student.parentPhone}</span>
                    </a>
                  </div>

                  <div>
                    <div className="card-stat-label">Attendance</div>
                    <div
                      className="card-stat-value"
                      style={{
                        color: isLowAttendance ? '#E62929' : '#1e293b',
                        fontWeight: 700
                      }}
                    >
                      {student.attendancePct}%
                    </div>
                    <div
                      style={{
                        height: '5px',
                        backgroundColor: '#e2e8f0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginTop: '4px'
                      }}
                    >
                      <div
                        style={{
                          width: `${student.attendancePct}%`,
                          height: '100%',
                          backgroundColor:
                            student.attendancePct >= 90
                              ? '#4CAF50'
                              : student.attendancePct >= 85
                              ? '#FFD700'
                              : '#E62929'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="student-card-actions">
                  <button
                    onClick={() => setSelectedStudent(student)}
                    className="bca-btn bca-btn-secondary"
                  >
                    <Eye size={14} />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => showToast(`Printing Student ID Card for ${student.name}`, undefined, 'info')}
                    className="bca-btn bca-btn-secondary"
                    style={{ flex: '0 0 auto', padding: '7px 10px' }}
                    title="Print ID Card"
                  >
                    <Printer size={14} />
                  </button>

                  {isOverdue && (
                    <button
                      onClick={() =>
                        showToast(
                          `SMS Notice Sent to ${student.parentName}`,
                          `Overdue notice dispatched to ${student.parentPhone}`,
                          'error'
                        )
                      }
                      className="bca-btn bca-btn-red"
                      title="Send Urgent Fee Notice SMS"
                    >
                      <Send size={13} />
                      <span>Fee SMS</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAILED STUDENT PROFILE MODAL WITH 8 TABS */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`Student Dossier — ${selectedStudent.name}`}
          subtitle={`${selectedStudent.id} • ${selectedStudent.class}-${selectedStudent.section} (Roll: ${selectedStudent.rollNo})`}
          maxWidth="900px"
          footer={
            <>
              {selectedStudent.feeStatus === 'Overdue' && (
                <button
                  onClick={() =>
                    showToast(
                      `Fee Reminder SMS sent to ${selectedStudent.parentName}`,
                      `Contact: ${selectedStudent.parentPhone}`,
                      'error'
                    )
                  }
                  className="bca-btn bca-btn-red"
                  style={{ marginRight: 'auto' }}
                >
                  <Send size={14} />
                  <span>Send Fee Reminder SMS</span>
                </button>
              )}
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
            {/* Top Brand Accent Banner */}
            <div className="profile-header-banner" />

            {/* Top Student Header Card */}
            <div className="profile-top-card">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: selectedStudent.feeStatus === 'Overdue' ? '3px solid #E62929' : '3px solid #0B3974',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
              <div style={{ flex: 1 }}>
                <div className="student-badges-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#0B3974' }}>{selectedStudent.name}</h3>

                  {/* Blood Group Red Badge */}
                  <span className="blood-badge">
                    <Droplet size={10} fill="#E62929" />
                    Blood Group: {selectedStudent.bloodGroup}
                  </span>

                  {selectedStudent.feeStatus === 'Overdue' ? (
                    <span
                      className="bca-badge bca-badge-overdue"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 700,
                        color: '#E62929',
                        backgroundColor: '#feecec',
                        borderColor: '#fca5a5'
                      }}
                    >
                      <span className="overdue-pulse-dot" />
                      Fee: Overdue
                    </span>
                  ) : (
                    <span className={`bca-badge bca-badge-${selectedStudent.feeStatus.toLowerCase()}`}>
                      Fee: {selectedStudent.feeStatus}
                    </span>
                  )}

                  <span className="bca-badge bca-badge-active">
                    {selectedStudent.status}
                  </span>
                </div>

                <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '0.84rem' }}>
                  Enrolled: <strong>{selectedStudent.admissionDate}</strong> • Class:{' '}
                  <strong>
                    {selectedStudent.class}-{selectedStudent.section}
                  </strong>
                </p>
              </div>
            </div>

            {/* Emergency Contact Highlight Box in Brand Red */}
            <div className="emergency-contact-box" style={{ marginBottom: '18px' }}>
              <div style={{ background: '#feecec', padding: '8px', borderRadius: '50%', color: '#E62929' }}>
                <Phone size={18} color="#E62929" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#E62929', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Emergency Medical &amp; Campus Contact
                </div>
                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                  {selectedStudent.emergencyContact
                    ? `${selectedStudent.emergencyContact} (Parent Hotline)`
                    : <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 500 }}>Not Provided</span>}
                </div>
              </div>
              {selectedStudent.emergencyContact && (
                <a
                  href={`tel:${selectedStudent.emergencyContact}`}
                  className="bca-btn bca-btn-red"
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                >
                  <PhoneCall size={13} />
                  <span>Call Now</span>
                </a>
              )}
            </div>

            {/* 8 Tabs Bar (Horizontally scrollable with touch) */}
            <div className="profile-tabs-scroll">
              {[
                'Overview',
                'Personal Information',
                'Parent Information',
                'Attendance',
                'Fees',
                'Results',
                'Progress',
                'Documents'
              ].map((tab) => {
                const isActive = profileActiveTab === tab;
                const isFeesTab = tab === 'Fees';
                const hasOverdue = isFeesTab && selectedStudent.feeStatus === 'Overdue';

                return (
                  <button
                    key={tab}
                    onClick={() => setProfileActiveTab(tab as any)}
                    className="profile-tab-button"
                    style={{
                      borderBottom: isActive ? '2.5px solid #0B3974' : '2.5px solid transparent',
                      color: isActive ? '#0B3974' : '#64748b',
                      fontWeight: isActive ? 700 : 500
                    }}
                  >
                    <span>{tab}</span>
                    {hasOverdue && (
                      <span
                        style={{
                          backgroundColor: '#E62929',
                          color: '#ffffff',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '10px'
                        }}
                      >
                        Due
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Overview */}
            {profileActiveTab === 'Overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div className="bca-card" style={{ padding: '16px', borderLeft: `4px solid ${selectedStudent.recentMarks.length > 0 ? '#4CAF50' : '#cbd5e1'}` }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Academic Results
                  </span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2e7d32', margin: '6px 0' }}>
                    {selectedStudent.recentMarks.length > 0
                      ? `${selectedStudent.recentMarks.length} Subject(s) Recorded`
                      : <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>No Results Yet</span>}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                    Class: {selectedStudent.class}
                  </p>
                </div>

                <div
                  className="bca-card"
                  style={{
                    padding: '16px',
                    borderLeft: selectedStudent.attendancePct !== null && selectedStudent.attendancePct < 85 ? '4px solid #E62929' : '4px solid #0B3974'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Cumulative Attendance
                  </span>
                  <div
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      color: selectedStudent.attendancePct !== null && selectedStudent.attendancePct < 85 ? '#E62929' : '#0B3974',
                      margin: '6px 0'
                    }}
                  >
                    {selectedStudent.attendancePct !== null ? `${selectedStudent.attendancePct}%` : <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>Not Available</span>}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                    {selectedStudent.attendanceHistory.length > 0
                      ? `${selectedStudent.attendanceHistory[0].present} days present recorded`
                      : 'No attendance records yet'}
                  </p>
                </div>

                <div
                  className="bca-card"
                  style={{
                    padding: '16px',
                    borderLeft: selectedStudent.feeStatus === 'Overdue' ? '4px solid #E62929' : '4px solid #4CAF50',
                    background: selectedStudent.feeStatus === 'Overdue' ? '#fffafa' : '#ffffff'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Fee Clearance
                  </span>
                  <div
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      color: selectedStudent.feeStatus === 'Overdue' ? '#E62929' : '#2e7d32',
                      margin: '6px 0'
                    }}
                  >
                    {selectedStudent.feeStatus}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                    {selectedStudent.feeRecords.length > 0
                      ? `${selectedStudent.feeRecords.length} voucher(s) on record`
                      : 'No fee vouchers issued yet'}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Personal Information */}
            {profileActiveTab === 'Personal Information' && (
              <div className="profile-info-grid">
                <div><strong>Full Name:</strong> {selectedStudent.name}</div>
                <div><strong>Date of Birth:</strong> {selectedStudent.dob || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Provided</span>}</div>
                <div><strong>Gender:</strong> {selectedStudent.gender}</div>
                <div>
                  <strong>Blood Group:</strong>{' '}
                  {selectedStudent.bloodGroup ? (
                    <span className="blood-badge">
                      <Droplet size={10} fill="#E62929" />
                      {selectedStudent.bloodGroup}
                    </span>
                  ) : (
                    <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Provided</span>
                  )}
                </div>
                <div><strong>Admission Date:</strong> {selectedStudent.admissionDate || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Provided</span>}</div>
                <div>
                  <strong style={{ color: '#E62929' }}>Emergency Contact:</strong>{' '}
                  {selectedStudent.emergencyContact || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Provided</span>}
                </div>
                <div style={{ gridColumn: 'span 1' }}>
                  <strong>Residential Address:</strong>{' '}
                  {selectedStudent.address || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Provided</span>}
                </div>
                <div style={{ gridColumn: 'span 1' }}>
                  <strong>Previous School:</strong>{' '}
                  {selectedStudent.previousSchool || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Provided</span>}
                </div>
              </div>
            )}

            {/* Tab 3: Parent Information */}
            {profileActiveTab === 'Parent Information' && (
              <div className="profile-info-grid">
                <div><strong>Father / Guardian Name:</strong> {selectedStudent.parentName}</div>
                <div><strong>Relationship:</strong> Father / Guardian</div>
                <div>
                  <strong>Primary Phone:</strong>{' '}
                  {selectedStudent.parentPhone !== 'Not Provided' ? (
                    <a href={`tel:${selectedStudent.parentPhone}`} style={{ color: '#0B3974', fontWeight: 600 }}>
                      {selectedStudent.parentPhone}
                    </a>
                  ) : (
                    <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Provided</span>
                  )}
                </div>
                <div><strong>Email Address:</strong>{' '}{selectedStudent.parentEmail !== 'Not Provided' ? selectedStudent.parentEmail : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Provided</span>}</div>
              </div>
            )}

            {/* Tab 4: Attendance */}
            {profileActiveTab === 'Attendance' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ margin: 0, color: '#0B3974' }}>Monthly Attendance Breakdown (2026)</h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Academic Year 2026-2027
                  </span>
                </div>
                <div className="bca-table-wrapper">
                  <table className="bca-table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Present Days</th>
                        <th>Absences (Unexcused)</th>
                        <th>Late Marks</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.attendanceHistory.map((item, idx) => (
                        <tr key={idx}>
                          <td><strong>{item.month} 2026</strong></td>
                          <td><span style={{ color: '#2e7d32', fontWeight: 700 }}>{item.present} Days</span></td>
                          <td>
                            <span
                              style={{
                                color: item.absent > 0 ? '#E62929' : '#64748b',
                                fontWeight: item.absent > 0 ? 800 : 500
                              }}
                            >
                              {item.absent > 0 ? `⚠️ ${item.absent} Days` : '0'}
                            </span>
                          </td>
                          <td><span style={{ color: item.late > 0 ? '#b8860b' : '#64748b' }}>{item.late}</span></td>
                          <td>
                            <span className={`bca-badge ${item.absent === 0 ? 'bca-badge-present' : 'bca-badge-late'}`}>
                              {item.absent === 0 ? 'Excellent' : 'Satisfactory'}
                            </span>
                          </td>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ margin: 0, color: '#0B3974' }}>Recent Fee Vouchers & Payments</h4>
                  {selectedStudent.feeStatus === 'Overdue' ? (
                    <span className="bca-badge bca-badge-overdue" style={{ fontWeight: 700 }}>
                      <span className="overdue-pulse-dot" /> Action Required: Overdue Voucher
                    </span>
                  ) : selectedStudent.feeStatus === 'Pending' ? (
                    <span className="bca-badge bca-badge-pending" style={{ fontWeight: 700, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                      Pending Payment
                    </span>
                  ) : (
                    <span className="bca-badge bca-badge-paid" style={{ fontWeight: 700 }}>
                      All Dues Cleared
                    </span>
                  )}
                </div>
                <div className="bca-table-wrapper">
                  <table className="bca-table">
                    <thead>
                      <tr>
                        <th>Voucher #</th>
                        <th>Billing Month</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Payment / Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.feeRecords && selectedStudent.feeRecords.length > 0 ? (
                        selectedStudent.feeRecords.map((fee, idx) => {
                          const isRecordOverdue = fee.status === 'Overdue';
                          const isRecordPaid = fee.status === 'Paid';

                          return (
                            <tr key={idx} className={isRecordOverdue ? 'row-overdue' : ''}>
                              <td><code>{fee.voucherNo}</code></td>
                              <td>{fee.month}</td>
                              <td>
                                <strong style={{ color: isRecordOverdue ? '#E62929' : 'inherit' }}>
                                  Rs. {fee.amount.toLocaleString()}
                                </strong>
                              </td>
                              <td>
                                {isRecordOverdue ? (
                                  <span
                                    className="bca-badge bca-badge-overdue"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      fontWeight: 700,
                                      color: '#E62929',
                                      backgroundColor: '#feecec',
                                      borderColor: '#fca5a5'
                                    }}
                                  >
                                    <span className="overdue-pulse-dot" />
                                    Overdue
                                  </span>
                                ) : isRecordPaid ? (
                                  <span className="bca-badge bca-badge-paid">Paid</span>
                                ) : (
                                  <span
                                    className="bca-badge bca-badge-pending"
                                    style={{
                                      background: '#fef3c7',
                                      color: '#92400e',
                                      border: '1px solid #fde68a',
                                      fontWeight: 700
                                    }}
                                  >
                                    Pending (Unpaid)
                                  </span>
                                )}
                              </td>
                              <td>{fee.date}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '30px 15px', color: '#64748b' }}>
                            <div style={{ fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                              No fee vouchers or payment records found for this student.
                            </div>
                            <div style={{ fontSize: '0.78rem' }}>
                              Fee vouchers issued from Fee Management or Admissions will automatically synchronize here.
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 6: Results */}
            {profileActiveTab === 'Results' && (
              <div>
                <h4 style={{ margin: '0 0 12px 0', color: '#0B3974' }}>Term Examination Assessment</h4>
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
                          <td><strong style={{ color: '#0B3974' }}>{m.marks}</strong></td>
                          <td>{((m.marks / m.total) * 100).toFixed(0)}%</td>
                          <td>
                            <span
                              className="bca-badge"
                              style={{
                                backgroundColor: '#e8f5e9',
                                color: '#1b5e20',
                                border: '1px solid #a5d6a7',
                                fontWeight: 700
                              }}
                            >
                              {m.grade}
                            </span>
                          </td>
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
                <h4 style={{ margin: '0 0 12px 0', color: '#0B3974' }}>Teacher Remarks &amp; Growth Index</h4>
                <div style={{ textAlign: 'center', padding: '36px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                  <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.92rem' }}>No Remarks Added Yet</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    No teacher remarks or growth notes have been recorded for {selectedStudent.name}.
                  </div>
                </div>
              </div>
            )}

            {/* Tab 8: Documents */}
            {profileActiveTab === 'Documents' && (
              <div style={{ textAlign: 'center', padding: '36px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                <FileText size={36} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
                <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.92rem' }}>No Uploaded Verification Documents</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                  No digital files (B-Form, leaving certificate, or photos) have been uploaded for {selectedStudent.name}.
                </div>
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
        subtitle="Register an active student profile into Read Academy Sahiwal"
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
        <div className="profile-header-banner" style={{ margin: '-24px -24px 18px -24px' }} />
        <form id="addStudentForm" onSubmit={handleCreateStudent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
              Student Full Name <span style={{ color: '#E62929' }}>*</span>
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

          <div className="add-student-form-grid">
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Class <span style={{ color: '#E62929' }}>*</span>
              </label>
              <select
                value={newStudentClass}
                onChange={(e) => setNewStudentClass(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              >
                {classesList.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Section <span style={{ color: '#E62929' }}>*</span>
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

          <div className="add-student-form-grid">
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Parent / Guardian Name <span style={{ color: '#E62929' }}>*</span>
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
                Contact Phone <span style={{ color: '#E62929' }}>*</span>
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

          {/* Emergency Alert Note */}
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: '#fff5f5',
              border: '1px solid #fecaca',
              borderLeft: '4px solid #E62929',
              borderRadius: '6px',
              fontSize: '0.78rem',
              color: '#b81b1b',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertTriangle size={16} color="#E62929" style={{ flexShrink: 0 }} />
            <span>
              <strong>Emergency Record:</strong> An automated SMS alert and NADRA verification check will be queued for this admission.
            </span>
          </div>
        </form>
      </Modal>
    </div>
  );
};
