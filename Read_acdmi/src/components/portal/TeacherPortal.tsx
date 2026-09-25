import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  XCircle,
  FileText,
  Award,
  Bell,
  LogOut,
  Send,
  Plus,
  Users,
  CreditCard,
  Download,
  AlertCircle,
  ClipboardList,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { Modal } from '../common/Modal';

export const TeacherPortal: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, setActivePortal } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'timetable' | 'attendance' | 'marks' | 'homework' | 'duties' | 'salary'>('overview');

  // Attendance state
  const [selectedClass, setSelectedClass] = useState('Grade 9-A');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [studentAttendance, setStudentAttendance] = useState([
    { id: 'std-1', rollNo: 'RAS-2026-89', name: 'Hamza Tariq', status: 'Present' },
    { id: 'std-2', rollNo: 'RAS-2026-90', name: 'Ayesha Bibi', status: 'Present' },
    { id: 'std-3', rollNo: 'RAS-2026-91', name: 'Bilal Ahmad', status: 'Late' },
    { id: 'std-4', rollNo: 'RAS-2026-92', name: 'Zainab Fatima', status: 'Present' },
    { id: 'std-5', rollNo: 'RAS-2026-93', name: 'Muhammad Usman', status: 'Absent' },
    { id: 'std-6', rollNo: 'RAS-2026-94', name: 'Fatima Noor', status: 'Present' },
  ]);

  // Homework state
  const [homeworkList, setHomeworkList] = useState([
    {
      id: 'hw-1',
      title: 'Newton Laws of Motion Numericals (Problems 3.1 - 3.8)',
      subject: 'Physics',
      class: 'Grade 9-A',
      dueDate: '2026-09-26',
      submissions: '32/38 Submitted'
    },
    {
      id: 'hw-2',
      title: 'Quadratic Equations Exercise 1.2 Solved on Register',
      subject: 'Mathematics',
      class: 'Grade 10-B',
      dueDate: '2026-09-27',
      submissions: '28/35 Submitted'
    }
  ]);
  const [showHwModal, setShowHwModal] = useState(false);
  const [newHwTitle, setNewHwTitle] = useState('');
  const [newHwSubject, setNewHwSubject] = useState('Physics');
  const [newHwClass, setNewHwClass] = useState('Grade 9-A');
  const [newHwDueDate, setNewHwDueDate] = useState('2026-09-28');
  const [newHwDesc, setNewHwDesc] = useState('');

  // Marks entry state
  const [marksClass, setMarksClass] = useState('Grade 9-A');
  const [marksSubject, setMarksSubject] = useState('Physics');
  const [marksExam, setMarksExam] = useState('Mid-Term Examination 2026');
  const [marksRecords, setMarksRecords] = useState([
    { id: 'std-1', rollNo: 'RAS-2026-89', name: 'Hamza Tariq', obtained: 92, total: 100 },
    { id: 'std-2', rollNo: 'RAS-2026-90', name: 'Ayesha Bibi', obtained: 88, total: 100 },
    { id: 'std-3', rollNo: 'RAS-2026-91', name: 'Bilal Ahmad', obtained: 74, total: 100 },
    { id: 'std-4', rollNo: 'RAS-2026-92', name: 'Zainab Fatima', obtained: 95, total: 100 },
    { id: 'std-5', rollNo: 'RAS-2026-93', name: 'Muhammad Usman', obtained: 68, total: 100 },
  ]);

  const handleToggleAttendance = (id: string, newStatus: string) => {
    setStudentAttendance(prev =>
      prev.map(s => s.id === id ? { ...s, status: newStatus } : s)
    );
  };

  const handleSaveAttendance = () => {
    const presents = studentAttendance.filter(s => s.status === 'Present').length;
    const absents = studentAttendance.filter(s => s.status === 'Absent').length;
    showToast(
      'Attendance Saved Successfully!',
      `${selectedClass} on ${attendanceDate}: ${presents} Present, ${absents} Absent registered.`,
      'success'
    );
  };

  const handleAddHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHwTitle) return;
    setHomeworkList(prev => [
      {
        id: `hw-${Date.now()}`,
        title: newHwTitle,
        subject: newHwSubject,
        class: newHwClass,
        dueDate: newHwDueDate,
        submissions: '0/38 Submitted'
      },
      ...prev
    ]);
    setShowHwModal(false);
    setNewHwTitle('');
    setNewHwDesc('');
    showToast('Assignment Assigned', `New ${newHwSubject} homework posted to student diaries`, 'success');
  };

  const handleSaveMarks = () => {
    showToast(
      'Marks Submitted & Graded',
      `Assessment entries for ${marksClass} - ${marksSubject} published to Student dossiers.`,
      'success'
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <header
        style={{
          backgroundColor: '#0B3974',
          color: '#ffffff',
          padding: '14px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', backgroundColor: '#ffffff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
            <img src="/logo.png" alt="Read Academy Sahiwal" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>
              Read Academy Sahiwal
            </div>
            <div style={{ fontSize: '0.74rem', color: '#bfdbfe', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Faculty Academic Workspace</span>
              <span>•</span>
              <span style={{ background: '#1e40af', padding: '1px 8px', borderRadius: '10px', color: '#93c5fd', fontWeight: 600 }}>
                Teacher Portal
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right', display: 'none', mdDisplay: 'block' } as any}>
            <div style={{ fontSize: '0.86rem', fontWeight: 700 }}>
              {user?.fullName || 'Sir Qasim Raza'}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#93c5fd' }}>
              {user?.email || 'teacher@readacademy.edu.pk'} (T-101)
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Website View
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            style={{
              background: '#E62929',
              border: 'none',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ maxWidth: '1240px', width: '100%', margin: '24px auto', padding: '0 16px', flex: 1 }}>
        {/* Faculty Profile Hero Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0B3974 0%, #1e40af 100%)',
            borderRadius: '16px',
            padding: '24px',
            color: '#ffffff',
            boxShadow: '0 10px 25px rgba(11, 57, 116, 0.2)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
              alt="Faculty Avatar"
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid rgba(255,255,255,0.4)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>
                  {user?.fullName || 'Sir Qasim Raza'}
                </h2>
                <span style={{ background: '#4CAF50', color: '#ffffff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}>
                  Active Faculty
                </span>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 600 }}>
                  Emp ID: T-101
                </span>
              </div>
              <p style={{ margin: '4px 0 0', color: '#bfdbfe', fontSize: '0.84rem' }}>
                Department of Science &amp; Physics • M.Phil Physics (PU Lahore)
              </p>
              <div style={{ display: 'flex', gap: '14px', marginTop: '8px', fontSize: '0.78rem', color: '#93c5fd' }}>
                <span>Official Email: <strong>{user?.email || 'teacher@readacademy.edu.pk'}</strong></span>
                <span>•</span>
                <span>Assigned Incharge: <strong>Grade 9 (Matric) - Section A</strong></span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('attendance')}
              className="bca-btn"
              style={{ background: '#ffffff', color: '#0B3974', fontWeight: 700, padding: '8px 16px', borderRadius: '8px' }}
            >
              <CheckCircle size={15} /> Mark Attendance
            </button>
            <button
              onClick={() => { setActiveTab('homework'); setShowHwModal(true); }}
              className="bca-btn"
              style={{ background: '#E62929', color: '#ffffff', fontWeight: 700, padding: '8px 16px', borderRadius: '8px' }}
            >
              <Plus size={15} /> Assign Homework
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '20px' }}>
          {[
            { id: 'overview', label: 'Faculty Overview', icon: Sparkles },
            { id: 'timetable', label: 'My Lecture Schedule', icon: Clock },
            { id: 'attendance', label: 'Class Attendance', icon: CheckCircle },
            { id: 'marks', label: 'Exam Marks & Grading', icon: Award },
            { id: 'homework', label: 'Homework Diary', icon: BookOpen },
            { id: 'duties', label: 'Duties & Leave', icon: ClipboardList },
            { id: 'salary', label: 'Salary & Slip', icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: isCurrent ? '2px solid #0B3974' : '1px solid #cbd5e1',
                  background: isCurrent ? '#0B3974' : '#ffffff',
                  color: isCurrent ? '#ffffff' : '#475569',
                  fontWeight: isCurrent ? 700 : 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isCurrent ? '0 4px 12px rgba(11, 57, 116, 0.15)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', borderLeft: '5px solid #0B3974' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Assigned Classes</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0B3974', margin: '4px 0' }}>3 Sections</div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Grade 9-A, Grade 10-B, FSC-I</div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', borderLeft: '5px solid #4CAF50' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Today Lecture Load</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2e7d32', margin: '4px 0' }}>4 Periods</div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Next: 09:30 AM (Physics Lab)</div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', borderLeft: '5px solid #E62929' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Assigned Campus Duty</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#E62929', margin: '6px 0' }}>Morning Assembly</div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>07:45 AM - Main Ground</div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', borderLeft: '5px solid #f59e0b' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Faculty Leave Balance</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#b45309', margin: '4px 0' }}>14 Days</div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>8 Casual • 6 Medical</div>
              </div>
            </div>

            {/* Today Schedule List */}
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                  Today's Lecture Schedule
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Academic Session 2026-2027</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { time: '08:00 AM - 08:45 AM', subject: 'Physics (Theory)', class: 'Grade 9 (Matric) - Section A', room: 'Room 201', status: 'Completed' },
                  { time: '08:45 AM - 09:30 AM', subject: 'Free Period / Lesson Planning', class: 'Staff Room Desk #4', room: 'Faculty Lounge', status: 'In Progress' },
                  { time: '09:30 AM - 10:15 AM', subject: 'Physics Practical (Vernier Caliper)', class: 'Grade 9-A', room: 'Science Lab 2', status: 'Upcoming' },
                  { time: '11:00 AM - 11:45 AM', subject: 'Mathematics (Matrices)', class: 'Grade 10-B', room: 'Room 205', status: 'Upcoming' },
                ].map((slot, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: slot.status === 'In Progress' ? '#eff6ff' : '#f8fafc',
                      border: slot.status === 'In Progress' ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '8px', height: '36px', borderRadius: '4px', backgroundColor: slot.status === 'Completed' ? '#4CAF50' : slot.status === 'In Progress' ? '#0B3974' : '#cbd5e1' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{slot.subject}</div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{slot.class} • {slot.room}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>{slot.time}</span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: slot.status === 'Completed' ? '#dcfce7' : slot.status === 'In Progress' ? '#dbeafe' : '#f1f5f9',
                          color: slot.status === 'Completed' ? '#15803d' : slot.status === 'In Progress' ? '#1d4ed8' : '#64748b'
                        }}
                      >
                        {slot.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TIMETABLE */}
        {activeTab === 'timetable' && (
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              Weekly Teaching Timetable (Master Schedule)
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Day</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Period 1 (08:00)</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Period 2 (08:45)</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Period 3 (09:30)</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Period 4 (10:15)</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Period 5 (11:15)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { day: 'Monday', p1: 'Grade 9-A (Physics)', p2: 'Planning', p3: 'Lab 2 (Practical)', p4: 'Grade 10-B (Math)', p5: 'Duty' },
                    { day: 'Tuesday', p1: 'Grade 10-B (Math)', p2: 'Grade 9-A (Physics)', p3: 'Grade 9-A (Physics)', p4: 'Planning', p5: 'FSC-I (Physics)' },
                    { day: 'Wednesday', p1: 'Planning', p2: 'Grade 10-B (Math)', p3: 'FSC-I (Lab)', p4: 'Grade 9-A (Physics)', p5: 'Remedial' },
                    { day: 'Thursday', p1: 'Grade 9-A (Physics)', p2: 'Planning', p3: 'Grade 10-B (Math)', p4: 'Lab 2 (Practical)', p5: 'Grade 9-A' },
                    { day: 'Friday', p1: 'Grade 10-B (Math)', p2: 'Grade 9-A (Physics)', p3: 'Assembly & Quiz', p4: '-', p5: '-' },
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px', fontWeight: 700, color: '#0B3974' }}>{row.day}</td>
                      <td style={{ padding: '10px' }}>{row.p1}</td>
                      <td style={{ padding: '10px' }}>{row.p2}</td>
                      <td style={{ padding: '10px' }}>{row.p3}</td>
                      <td style={{ padding: '10px' }}>{row.p4}</td>
                      <td style={{ padding: '10px' }}>{row.p5}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                  Daily Student Attendance Register
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                  Mark and synchronize classroom attendance in real-time
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                >
                  <option value="Grade 9-A">Grade 9-A (Matric)</option>
                  <option value="Grade 10-B">Grade 10-B (Matric)</option>
                  <option value="FSC-I">FSC-I Pre-Engineering</option>
                </select>

                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                />

                <button
                  onClick={handleSaveAttendance}
                  className="bca-btn bca-btn-emerald"
                  style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                >
                  <CheckCircle size={14} /> Submit Attendance
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {studentAttendance.map((student) => (
                <div
                  key={student.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: 800, color: '#0B3974', fontSize: '0.8rem', width: '90px' }}>
                      {student.rollNo}
                    </span>
                    <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.88rem' }}>
                      {student.name}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['Present', 'Absent', 'Late', 'Excused'].map((status) => {
                      const isSelected = student.status === status;
                      let bg = isSelected ? '#2563eb' : '#ffffff';
                      let color = isSelected ? '#ffffff' : '#64748b';
                      if (isSelected && status === 'Present') bg = '#16a34a';
                      if (isSelected && status === 'Absent') bg = '#dc2626';
                      if (isSelected && status === 'Late') bg = '#ea580c';

                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleToggleAttendance(student.id, status)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: isSelected ? 'none' : '1px solid #cbd5e1',
                            background: bg,
                            color: color,
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MARKS & GRADES */}
        {activeTab === 'marks' && (
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                  Student Marks Entry &amp; Grading Console
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                  Enter exam scores directly into the institutional record
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={marksSubject}
                  onChange={(e) => setMarksSubject(e.target.value)}
                  style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                >
                  <option value="Physics">Physics</option>
                  <option value="Mathematics">Mathematics</option>
                </select>

                <button
                  onClick={handleSaveMarks}
                  className="bca-btn bca-btn-primary"
                  style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                >
                  <Award size={14} /> Publish Marks
                </button>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Roll No</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Student Name</th>
                  <th style={{ padding: '10px', textAlign: 'center', width: '120px' }}>Obtained Marks</th>
                  <th style={{ padding: '10px', textAlign: 'center', width: '100px' }}>Total Marks</th>
                  <th style={{ padding: '10px', textAlign: 'center', width: '100px' }}>Percentage</th>
                  <th style={{ padding: '10px', textAlign: 'center', width: '80px' }}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {marksRecords.map((rec, idx) => {
                  const pct = ((rec.obtained / rec.total) * 100).toFixed(1);
                  let grade = 'F';
                  if (Number(pct) >= 80) grade = 'A+';
                  else if (Number(pct) >= 70) grade = 'A';
                  else if (Number(pct) >= 60) grade = 'B';
                  else if (Number(pct) >= 50) grade = 'C';

                  return (
                    <tr key={rec.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px', fontWeight: 700, color: '#0B3974' }}>{rec.rollNo}</td>
                      <td style={{ padding: '10px', fontWeight: 600 }}>{rec.name}</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        <input
                          type="number"
                          value={rec.obtained}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setMarksRecords(prev => prev.map((item, i) => i === idx ? { ...item, obtained: val } : item));
                          }}
                          style={{ width: '70px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 700 }}
                        />
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#64748b' }}>{rec.total}</td>
                      <td style={{ padding: '10px', textAlign: 'center', fontWeight: 700, color: '#16a34a' }}>{pct}%</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                          {grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: HOMEWORK DIARY */}
        {activeTab === 'homework' && (
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                  Assigned Homework &amp; Diary Items
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                  Posted tasks automatically appear in students and parents portals
                </p>
              </div>

              <button
                onClick={() => setShowHwModal(true)}
                className="bca-btn bca-btn-primary"
                style={{ padding: '7px 14px', fontSize: '0.82rem' }}
              >
                <Plus size={14} /> New Homework Task
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {homeworkList.map((hw) => (
                <div
                  key={hw.id}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700 }}>
                        {hw.subject}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e293b' }}>
                        {hw.title}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                      Class: <strong>{hw.class}</strong> • Due: <strong>{hw.dueDate}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#059669', background: '#ecfdf5', padding: '3px 8px', borderRadius: '12px', fontWeight: 600 }}>
                      {hw.submissions}
                    </span>
                    <button
                      onClick={() => showToast('Viewing Submissions', `Opening student submission log for ${hw.title}`, 'info')}
                      className="bca-btn bca-btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '0.76rem' }}
                    >
                      View Submissions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: DUTIES & LEAVE */}
        {activeTab === 'duties' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>
                Assigned Campus Duties
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', borderLeft: '4px solid #E62929' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#1e293b' }}>Morning Assembly &amp; Discipline</div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Every Monday &amp; Wednesday (07:45 AM - 08:15 AM)</div>
                </div>
                <div style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', borderLeft: '4px solid #0B3974' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#1e293b' }}>Science Lab Safety Inspection</div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Weekly audit of Physics &amp; Chemistry equipment</div>
                </div>
              </div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>
                  Leave Balance &amp; Applications
                </h3>
                <button
                  onClick={() => showToast('Leave Application Submitted', 'Your leave request has been routed to Principal Office for approval', 'success')}
                  className="bca-btn bca-btn-secondary"
                  style={{ padding: '5px 10px', fontSize: '0.76rem' }}
                >
                  Apply For Leave
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div style={{ padding: '12px', borderRadius: '8px', background: '#ecfdf5', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#065f46', fontWeight: 700 }}>Casual Leave</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>8 Days</div>
                  <span style={{ fontSize: '0.7rem', color: '#047857' }}>Remaining this year</span>
                </div>
                <div style={{ padding: '12px', borderRadius: '8px', background: '#eff6ff', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#1e40af', fontWeight: 700 }}>Medical Leave</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563eb' }}>6 Days</div>
                  <span style={{ fontSize: '0.7rem', color: '#1d4ed8' }}>Remaining this year</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SALARY & SLIP */}
        {activeTab === 'salary' && (
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src="/logo.png" alt="Read Academy Sahiwal" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                    Official Monthly Pay Statement
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    Read Academy Sahiwal Faculty Compensation Record
                  </p>
                </div>
              </div>

              <button
                onClick={() => showToast('Downloading Official Pay Slip', 'Generating PDF Payslip for current month...', 'success')}
                className="bca-btn bca-btn-primary"
                style={{ padding: '7px 14px', fontSize: '0.82rem' }}
              >
                <Download size={14} /> Download Payslip (PDF)
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Basic Salary</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B3974' }}>Rs. 85,000</div>
              </div>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Medical Allowance</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B3974' }}>Rs. 8,500</div>
              </div>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Conveyance Allowance</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B3974' }}>Rs. 6,500</div>
              </div>
              <div style={{ padding: '12px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                <span style={{ fontSize: '0.74rem', color: '#065f46', fontWeight: 700 }}>Net Take-Home Salary</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669' }}>Rs. 100,000</div>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#64748b', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}>
              Disbursement Account: <strong>Bank AL Habib Ltd (PK78BAHL100293849102)</strong> • Disbursed on 1st of every calendar month.
            </div>
          </div>
        )}
      </div>

      {/* NEW HOMEWORK MODAL */}
      {showHwModal && (
        <Modal
          isOpen={showHwModal}
          onClose={() => setShowHwModal(false)}
          title="Assign New Homework"
          subtitle="Publish assignment directly to student diary"
          footer={
            <>
              <button
                type="submit"
                form="newHwForm"
                className="bca-btn bca-btn-primary"
              >
                Post Assignment
              </button>
              <button
                type="button"
                onClick={() => setShowHwModal(false)}
                className="bca-btn bca-btn-secondary"
              >
                Cancel
              </button>
            </>
          }
        >
          <form id="newHwForm" onSubmit={handleAddHomework} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Task / Assignment Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Chapter 4 Numerical Problems 4.1 to 4.5"
                value={newHwTitle}
                onChange={(e) => setNewHwTitle(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Target Class
                </label>
                <select
                  value={newHwClass}
                  onChange={(e) => setNewHwClass(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Grade 9-A">Grade 9-A</option>
                  <option value="Grade 10-B">Grade 10-B</option>
                  <option value="FSC-I">FSC-I</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={newHwDueDate}
                  onChange={(e) => setNewHwDueDate(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Instructions for Students
              </label>
              <textarea
                rows={3}
                placeholder="Write specific notebook guidelines, formula derivations, or textbook page numbers..."
                value={newHwDesc}
                onChange={(e) => setNewHwDesc(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical' }}
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
