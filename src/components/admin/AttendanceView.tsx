import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Filter,
  Save,
  Download,
  Users,
  GraduationCap
} from 'lucide-react';
import { MOCK_STUDENTS, MOCK_TEACHERS } from '../../mockData';
import { useToast } from '../common/Toast';
import { Line } from 'react-chartjs-2';

export const AttendanceView: React.FC = () => {
  const { showToast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<'students' | 'teachers'>('students');

  // Student Attendance controls
  const [selectedDate, setSelectedDate] = useState('2026-09-07');
  const [selectedClass, setSelectedClass] = useState('Grade 10');
  const [selectedSection, setSelectedSection] = useState('A');

  // Attendance state map: studentId -> 'Present' | 'Absent' | 'Leave' | 'Late'
  const [studentAttendanceMap, setStudentAttendanceMap] = useState<Record<string, string>>({
    'STU-2026-001': 'Present',
    'STU-2026-002': 'Present',
    'STU-2026-003': 'Present',
    'STU-2026-004': 'Present',
    'STU-2026-005': 'Absent',
    'STU-2026-006': 'Present',
    'STU-2026-007': 'Present',
    'STU-2026-008': 'Late'
  });

  // Teacher Attendance state map
  const [teacherAttendanceMap, setTeacherAttendanceMap] = useState<Record<string, string>>({
    'TCH-001': 'Present',
    'TCH-002': 'Present',
    'TCH-003': 'Present',
    'TCH-004': 'Present',
    'TCH-005': 'Leave',
    'TCH-006': 'Present'
  });

  // Calculate Student summary
  const studentVals = Object.values(studentAttendanceMap);
  const presentCount = studentVals.filter((v) => v === 'Present').length;
  const absentCount = studentVals.filter((v) => v === 'Absent').length;
  const leaveCount = studentVals.filter((v) => v === 'Leave').length;
  const lateCount = studentVals.filter((v) => v === 'Late').length;
  const totalStudentCount = studentVals.length || 1;
  const studentPresentPct = (((presentCount + lateCount) / totalStudentCount) * 100).toFixed(1);

  // Calculate Teacher summary
  const teacherVals = Object.values(teacherAttendanceMap);
  const teacherPresent = teacherVals.filter((v) => v === 'Present').length;
  const teacherAbsent = teacherVals.filter((v) => v === 'Absent').length;
  const teacherLeave = teacherVals.filter((v) => v === 'Leave').length;
  const teacherLate = teacherVals.filter((v) => v === 'Late').length;

  const handleStudentStatusChange = (id: string, status: string) => {
    setStudentAttendanceMap((prev) => ({ ...prev, [id]: status }));
  };

  const handleTeacherStatusChange = (id: string, status: string) => {
    setTeacherAttendanceMap((prev) => ({ ...prev, [id]: status }));
  };

  const handleSaveAttendance = () => {
    showToast('Attendance Register Synced', `Recorded for ${selectedDate}`, 'success');
  };

  const markAllPresent = () => {
    if (activeSubTab === 'students') {
      const updated: Record<string, string> = {};
      MOCK_STUDENTS.forEach((s) => (updated[s.id] = 'Present'));
      setStudentAttendanceMap(updated);
      showToast('All students marked as Present', undefined, 'info');
    } else {
      const updated: Record<string, string> = {};
      MOCK_TEACHERS.forEach((t) => (updated[t.id] = 'Present'));
      setTeacherAttendanceMap(updated);
      showToast('All teachers marked as Present', undefined, 'info');
    }
  };

  // Teacher monthly chart
  const teacherMonthlyChart = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Faculty Attendance %',
        data: [98.2, 97.5, 96.8, 98.4, 97.9],
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        fill: true,
        tension: 0.3
      }
    ]
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Attendance Management
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Daily attendance register, leave sanctions, biometric sync, and analytics
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={markAllPresent} className="bca-btn bca-btn-secondary">
            <UserCheck size={16} />
            <span>Mark All Present</span>
          </button>
          <button onClick={handleSaveAttendance} className="bca-btn bca-btn-primary">
            <Save size={16} />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {/* Mode Tabs: Students vs Teachers */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveSubTab('students')}
          className="bca-btn"
          style={{
            backgroundColor: activeSubTab === 'students' ? '#2563eb' : '#ffffff',
            color: activeSubTab === 'students' ? '#ffffff' : '#334155',
            border: activeSubTab === 'students' ? 'none' : '1px solid #cbd5e1'
          }}
        >
          <Users size={16} />
          <span>Student Attendance Register</span>
        </button>

        <button
          onClick={() => setActiveSubTab('teachers')}
          className="bca-btn"
          style={{
            backgroundColor: activeSubTab === 'teachers' ? '#2563eb' : '#ffffff',
            color: activeSubTab === 'teachers' ? '#ffffff' : '#334155',
            border: activeSubTab === 'teachers' ? 'none' : '1px solid #cbd5e1'
          }}
        >
          <GraduationCap size={16} />
          <span>Teacher & Staff Attendance</span>
        </button>
      </div>

      {/* STUDENT ATTENDANCE SECTION */}
      {activeSubTab === 'students' && (
        <>
          {/* Controls Bar */}
          <div
            className="bca-card"
            style={{
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} color="#64748b" />
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Date:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Class:</span>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Section:</span>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>
            </div>

            {/* Attendance percentage indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Class Rate:</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>
                {studentPresentPct}%
              </span>
            </div>
          </div>

          {/* 4 Summary Stat Pills */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '12px',
              marginBottom: '20px'
            }}
          >
            <div className="bca-card" style={{ padding: '14px 18px', borderLeft: '4px solid #10b981' }}>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>PRESENT</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>{presentCount}</div>
            </div>

            <div className="bca-card" style={{ padding: '14px 18px', borderLeft: '4px solid #f43f5e' }}>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>ABSENT</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#e11d48' }}>{absentCount}</div>
            </div>

            <div className="bca-card" style={{ padding: '14px 18px', borderLeft: '4px solid #64748b' }}>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>ON LEAVE</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#475569' }}>{leaveCount}</div>
            </div>

            <div className="bca-card" style={{ padding: '14px 18px', borderLeft: '4px solid #f59e0b' }}>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>LATE ARRIVAL</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706' }}>{lateCount}</div>
            </div>
          </div>

          {/* Clean Student Attendance Table */}
          <div className="bca-table-wrapper">
            <table className="bca-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Class & Section</th>
                  <th>Overall %</th>
                  <th style={{ textAlign: 'center' }}>Mark Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_STUDENTS.map((student) => {
                  const status = studentAttendanceMap[student.id] || 'Present';
                  return (
                    <tr key={student.id}>
                      <td>
                        <strong>{student.rollNo}</strong>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={student.avatar}
                            alt={student.name}
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{student.name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>ID: {student.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>{student.class} - {student.section}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: student.attendancePct >= 90 ? '#059669' : '#d97706' }}>
                          {student.attendancePct}%
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', borderRadius: '8px', border: '1px solid #cbd5e1', overflow: 'hidden' }}>
                          {['Present', 'Absent', 'Leave', 'Late'].map((opt) => {
                            const isSelected = status === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleStudentStatusChange(student.id, opt)}
                                style={{
                                  padding: '6px 14px',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  border: 'none',
                                  cursor: 'pointer',
                                  backgroundColor: isSelected
                                    ? opt === 'Present'
                                      ? '#10b981'
                                      : opt === 'Absent'
                                      ? '#f43f5e'
                                      : opt === 'Leave'
                                      ? '#64748b'
                                      : '#f59e0b'
                                    : '#ffffff',
                                  color: isSelected ? '#ffffff' : '#475569',
                                  transition: 'all 0.15s'
                                }}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* TEACHER ATTENDANCE SECTION */}
      {activeSubTab === 'teachers' && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
              marginBottom: '20px'
            }}
          >
            <div className="bca-card" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>TOTAL FACULTY</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>86</div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>6 Selected Cohort</span>
            </div>

            <div className="bca-card" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>PRESENT TODAY</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>{teacherPresent}</div>
              <span style={{ fontSize: '0.72rem', color: '#059669' }}>98.2% on duty</span>
            </div>

            <div className="bca-card" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>ON LEAVE / CASUAL</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d97706' }}>{teacherLeave}</div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Authorized substitute arranged</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* Teachers Table */}
            <div className="bca-table-wrapper">
              <table className="bca-table">
                <thead>
                  <tr>
                    <th>Faculty Member</th>
                    <th>Department</th>
                    <th>Biometric In</th>
                    <th style={{ textAlign: 'center' }}>Mark Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_TEACHERS.map((teacher) => {
                    const status = teacherAttendanceMap[teacher.id] || 'Present';
                    return (
                      <tr key={teacher.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={teacher.avatar}
                              alt={teacher.name}
                              style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, color: '#0f172a' }}>{teacher.name}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{teacher.empId}</div>
                            </div>
                          </div>
                        </td>
                        <td>{teacher.department}</td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
                            {status === 'Present' ? '07:28 AM' : '-'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', borderRadius: '8px', border: '1px solid #cbd5e1', overflow: 'hidden' }}>
                            {['Present', 'Absent', 'Leave', 'Late'].map((opt) => {
                              const isSelected = status === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleTeacherStatusChange(teacher.id, opt)}
                                  style={{
                                    padding: '5px 10px',
                                    fontSize: '0.76rem',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: isSelected
                                      ? opt === 'Present'
                                        ? '#10b981'
                                        : opt === 'Absent'
                                        ? '#f43f5e'
                                        : opt === 'Leave'
                                        ? '#64748b'
                                        : '#f59e0b'
                                      : '#ffffff',
                                    color: isSelected ? '#ffffff' : '#475569'
                                  }}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Monthly Trend Chart */}
            <div className="bca-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>
                Faculty Monthly Attendance Trend
              </h3>
              <p style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '16px' }}>
                Overall monthly average across 5 academic terms
              </p>
              <div style={{ height: '220px' }}>
                <Line
                  data={teacherMonthlyChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: { min: 90, max: 100 }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
