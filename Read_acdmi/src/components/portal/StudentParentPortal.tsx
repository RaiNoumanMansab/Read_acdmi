import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  Calendar,
  CreditCard,
  BookOpen,
  Bell,
  Printer,
  Download,
  LogOut,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  FileText,
  User,
  Shield,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';

export const StudentParentPortal: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, setActivePortal } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'idcard' | 'results' | 'attendance' | 'fees' | 'timetable' | 'homework' | 'notices'>('idcard');

  const studentName = user?.fullName || 'Hamza Tariq';
  const rollNo = user?.student?.rollNo || 'RAS-2026-89';
  const studentClass = user?.student?.class;
  const studentSection = user?.student?.section;
  const className = typeof studentClass === 'object' && studentClass !== null
    ? `${studentClass.name || 'Grade 9'}${studentSection?.name ? ` - Section ${studentSection.name}` : ''}`
    : (typeof studentClass === 'string' && studentClass ? studentClass : 'Grade 9 (Matric) - Section A');
  const parentName = user?.student?.parentName || 'Tariq Mahmood / Rai Nouman';
  const parentPhone = user?.phone || '+92 305 9988771';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
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
              <span>Official Student &amp; Parent Portal</span>
              <span>•</span>
              <span style={{ background: '#16a34a', padding: '1px 8px', borderRadius: '10px', color: '#ffffff', fontWeight: 700 }}>
                {user?.role === 'PARENT' ? 'Parent Access' : 'Student Access'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            School Website
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

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', width: '100%', margin: '24px auto', padding: '0 16px', flex: 1 }}>
        {/* Student Profile Top Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0B3974 0%, #1e3a8a 100%)',
            borderRadius: '16px',
            padding: '24px',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(11, 57, 116, 0.2)',
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
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'}
              alt={studentName}
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #ffffff',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>
                  {studentName}
                </h2>
                <span style={{ background: '#2563eb', color: '#ffffff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: 700 }}>
                  Roll: {rollNo}
                </span>
                <span style={{ background: '#16a34a', color: '#ffffff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: 700 }}>
                  Fee Paid
                </span>
              </div>
              <p style={{ margin: '4px 0 0', color: '#bfdbfe', fontSize: '0.84rem' }}>
                Enrolled Class: <strong>{className}</strong> • Academic Session 2026-2027
              </p>
              <div style={{ display: 'flex', gap: '14px', marginTop: '6px', fontSize: '0.78rem', color: '#93c5fd' }}>
                <span>Guardian: <strong>{parentName}</strong></span>
                <span>•</span>
                <span>Institutional Email: <strong>{user?.email || 'student@readacademy.edu.pk'}</strong></span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => showToast('Printing Student Dossier', 'Preparing official student academic report...', 'info')}
              className="bca-btn"
              style={{ background: '#ffffff', color: '#0B3974', fontWeight: 700, padding: '8px 16px', borderRadius: '8px' }}
            >
              <Printer size={15} /> Print Dossier
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '20px' }}>
          {[
            { id: 'idcard', label: 'Digital Student ID', icon: User },
            { id: 'results', label: 'Academic Results & Report', icon: Award },
            { id: 'attendance', label: 'Attendance Records', icon: Calendar },
            { id: 'fees', label: 'Fee Challan & History', icon: CreditCard },
            { id: 'timetable', label: 'Class Timetable', icon: Clock },
            { id: 'homework', label: 'Daily Homework Diary', icon: BookOpen },
            { id: 'notices', label: 'School Circulars', icon: Bell },
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

        {/* TAB 1: DIGITAL STUDENT ID CARD */}
        {activeTab === 'idcard' && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 30px' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '460px',
                background: '#ffffff',
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                border: '1px solid #e2e8f0'
              }}
            >
              {/* ID Card Header */}
              <div style={{ background: '#0B3974', color: '#ffffff', padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: '#ffffff', padding: '4px 12px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/logo.png" alt="Read Academy Sahiwal" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
                </div>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, letterSpacing: '0.04em' }}>
                    READ ACADEMY SAHIWAL
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#bfdbfe', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Student Institutional Identity Card
                  </div>
                </div>
              </div>

              {/* ID Card Body */}
              <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                <img
                  src={user?.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'}
                  alt={studentName}
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 12px',
                    border: '3px solid #0B3974',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                />

                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', color: '#0B3974', fontWeight: 800 }}>
                  {studentName}
                </h3>
                <div style={{ display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '3px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '16px' }}>
                  Roll No: {rollNo}
                </div>

                <div style={{ textAlign: 'left', background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.84rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Class &amp; Section:</span>
                    <strong style={{ color: '#1e293b' }}>{className}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Guardian Name:</span>
                    <strong style={{ color: '#1e293b' }}>{parentName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Emergency Phone:</span>
                    <strong style={{ color: '#E62929' }}>{parentPhone}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Institutional Email:</span>
                    <strong style={{ color: '#0B3974' }}>{user?.email || 'student@readacademy.edu.pk'}</strong>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div style={{ marginTop: '16px', padding: '8px', borderTop: '1px dashed #cbd5e1' }}>
                  <div style={{ fontFamily: 'monospace', letterSpacing: '0.3em', fontSize: '1.1rem', fontWeight: 900, color: '#334155' }}>
                    |||| ||| ||||| || |||| |||
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{rollNo} • VALID 2026-2027</div>
                </div>
              </div>

              <div style={{ padding: '12px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                <button
                  onClick={() => showToast('Printing ID Card', 'Sending official ID card layout to printer...', 'success')}
                  className="bca-btn bca-btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Printer size={14} /> Print ID Card
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACADEMIC RESULTS */}
        {activeTab === 'results' && (
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src="/logo.png" alt="Read Academy Sahiwal" style={{ height: '42px', width: 'auto', objectFit: 'contain' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                    Mid-Term Examination Result Card 2026
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    Official Board of Academic Examinations • Read Academy Sahiwal
                  </p>
                </div>
              </div>

              <button
                onClick={() => showToast('Downloading Official Report Card', 'Generating signed PDF result card...', 'success')}
                className="bca-btn bca-btn-primary"
              >
                <Download size={14} /> Download Marksheet (PDF)
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', marginBottom: '20px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Subject</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Total Marks</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Obtained Marks</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Percentage</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Grade</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { subject: 'Physics', total: 100, obtained: 92, grade: 'A+', remarks: 'Outstanding analytical concepts' },
                  { subject: 'Mathematics', total: 100, obtained: 95, grade: 'A+', remarks: 'Excellent problem solving' },
                  { subject: 'Chemistry', total: 100, obtained: 88, grade: 'A', remarks: 'Good theoretical grasp' },
                  { subject: 'English', total: 100, obtained: 85, grade: 'A', remarks: 'Strong essay writing' },
                  { subject: 'Computer Science', total: 100, obtained: 94, grade: 'A+', remarks: 'Exceptional coding logic' },
                ].map((item, idx) => {
                  const pct = ((item.obtained / item.total) * 100).toFixed(1);
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#1e293b' }}>{item.subject}</td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#64748b' }}>{item.total}</td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: 800, color: '#0B3974' }}>{item.obtained}</td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: 700, color: '#16a34a' }}>{pct}%</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                          {item.grade}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#64748b', fontSize: '0.8rem' }}>{item.remarks}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Overall Result Banner */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                background: '#f0fdf4',
                borderRadius: '10px',
                border: '1px solid #bbf7d0',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534' }}>
                  Aggregate Total: 454 / 500 (90.8%) • Grade: A+ (Distinction)
                </span>
                <div style={{ fontSize: '0.76rem', color: '#15803d' }}>
                  Class Standing: 3rd Position in Grade 9 (Matric) Section A
                </div>
              </div>

              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#15803d' }}>
                PASSED WITH DISTINCTION
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              Academic Attendance Record
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              <div style={{ padding: '16px', background: '#ecfdf5', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                <span style={{ fontSize: '0.74rem', color: '#065f46', fontWeight: 700 }}>Cumulative Attendance</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669', margin: '4px 0' }}>94.5%</div>
                <span style={{ fontSize: '0.74rem', color: '#047857' }}>Well above 85% requirement</span>
              </div>

              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>Days Present</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0B3974', margin: '4px 0' }}>86 Days</div>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Current academic term</span>
              </div>

              <div style={{ padding: '16px', background: '#fff1f2', borderRadius: '10px', border: '1px solid #fecdd3' }}>
                <span style={{ fontSize: '0.74rem', color: '#9f1239', fontWeight: 700 }}>Leaves / Absent</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#e11d48', margin: '4px 0' }}>5 Days</div>
                <span style={{ fontSize: '0.74rem', color: '#be123c' }}>Approved medical leaves</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FEES */}
        {activeTab === 'fees' && (
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  Fee Vouchers &amp; Payment Receipts
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                  Download 3-part bank challans (Student Copy, Bank Copy, College Copy)
                </p>
              </div>

              <button
                onClick={() => showToast('Printing Bank Challan', 'Opening 3-part bank challan voucher for printing...', 'success')}
                className="bca-btn bca-btn-primary"
              >
                <Download size={14} /> Print Current Fee Challan
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { voucherNo: 'VCH-2026-09-089', month: 'September 2026', tuition: 7500, exam: 1500, utility: 800, total: 9800, status: 'PAID', paidDate: '2026-09-05' },
                { voucherNo: 'VCH-2026-08-089', month: 'August 2026', tuition: 7500, exam: 0, utility: 800, total: 8300, status: 'PAID', paidDate: '2026-08-04' },
                { voucherNo: 'VCH-2026-07-089', month: 'July 2026', tuition: 7500, exam: 0, utility: 800, total: 8300, status: 'PAID', paidDate: '2026-07-06' },
              ].map((voucher) => (
                <div
                  key={voucher.voucherNo}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, color: '#0B3974', fontSize: '0.9rem' }}>{voucher.voucherNo}</span>
                      <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                        {voucher.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px' }}>
                      Billing Period: <strong>{voucher.month}</strong> • Paid on: <strong>{voucher.paidDate}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b' }}>
                        Rs. {voucher.total.toLocaleString()}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Bank AL Habib / Allied Bank</span>
                    </div>
                    <button
                      onClick={() => showToast('Receipt Downloaded', `Fee receipt for ${voucher.month} saved to device`, 'success')}
                      className="bca-btn bca-btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                    >
                      <Download size={13} /> Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: TIMETABLE */}
        {activeTab === 'timetable' && (
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              Class Timetable — Grade 9 (Matric) Section A
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Time</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Subject</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Teacher</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Room / Venue</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { time: '08:00 AM - 08:45 AM', subject: 'Physics (Theory)', teacher: 'Sir Qasim Raza', room: 'Room 201' },
                    { time: '08:45 AM - 09:30 AM', subject: 'Mathematics', teacher: 'Sir Usman Ali', room: 'Room 201' },
                    { time: '09:30 AM - 10:15 AM', subject: 'Physics Practical', teacher: 'Sir Qasim Raza', room: 'Physics Lab 2' },
                    { time: '10:15 AM - 10:45 AM', subject: 'Recess / Break', teacher: '-', room: 'Campus Cafeteria' },
                    { time: '10:45 AM - 11:30 AM', subject: 'Chemistry', teacher: 'Dr. Sarah Bilal', room: 'Room 201' },
                    { time: '11:30 AM - 12:15 PM', subject: 'English Grammar', teacher: 'Ms. Hira Naeem', room: 'Room 201' },
                    { time: '12:15 PM - 01:00 PM', subject: 'Computer Science', teacher: 'Sir Tariq Jamil', room: 'Computer Lab 1' },
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px', fontWeight: 700, color: '#0B3974' }}>{row.time}</td>
                      <td style={{ padding: '10px', fontWeight: 700, color: '#1e293b' }}>{row.subject}</td>
                      <td style={{ padding: '10px', color: '#475569' }}>{row.teacher}</td>
                      <td style={{ padding: '10px', color: '#64748b' }}>{row.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: HOMEWORK DIARY */}
        {activeTab === 'homework' && (
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              Daily Homework Diary &amp; Assignments
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { subject: 'Physics', title: 'Newton Laws Numerical Questions 3.1 to 3.8', teacher: 'Sir Qasim Raza', due: 'Tomorrow (2026-09-25)', status: 'Pending' },
                { subject: 'Mathematics', title: 'Quadratic Equations Ex 1.2 Exercise Problem Set', teacher: 'Sir Usman Ali', due: '2026-09-26', status: 'Submitted' },
                { subject: 'Chemistry', title: 'Periodic Table Trends Diagram on Homework Register', teacher: 'Dr. Sarah Bilal', due: '2026-09-27', status: 'Pending' },
              ].map((hw, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '14px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700 }}>
                        {hw.subject}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
                        {hw.title}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                      Teacher: <strong>{hw.teacher}</strong> • Deadline: <strong>{hw.due}</strong>
                    </div>
                  </div>

                  <div>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        background: hw.status === 'Submitted' ? '#dcfce7' : '#fef3c7',
                        color: hw.status === 'Submitted' ? '#15803d' : '#b45309'
                      }}
                    >
                      {hw.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: NOTICES */}
        {activeTab === 'notices' && (
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              Official Circulars &amp; Campus Notices
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { title: 'Annual Sports Gala 2026 Announcement & Trials', date: 'September 22, 2026', desc: 'Inter-house cricket, football, and athletics trials start next week on the main campus ground.' },
                { title: 'Matriculation Board Exam Registration Deadline', date: 'September 18, 2026', desc: 'All Grade 9 and 10 students must submit their verified B-Form and photos to the registrar office.' },
                { title: 'Parent-Teacher Meeting (PTM) Schedule', date: 'September 12, 2026', desc: 'Mid-term evaluation PTM is scheduled for Saturday, 09:00 AM to 01:00 PM.' },
              ].map((notice, idx) => (
                <div key={idx} style={{ padding: '14px', borderRadius: '8px', background: '#f8fafc', borderLeft: '4px solid #0B3974', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 800, color: '#0B3974', fontSize: '0.92rem' }}>{notice.title}</span>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{notice.date}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569' }}>{notice.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
