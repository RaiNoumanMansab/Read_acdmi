import React, { useState } from 'react';
import {
  Clock,
  Plus,
  CheckCircle,
  Download,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { MOCK_TEACHER_DUTIES } from '../../mockData';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

export interface DutyRosterShift {
  id: string;
  teacherId: string;
  teacherName: string;
  dutyType: 'Assembly Duty' | 'Exam Invigilation' | 'Break Duty' | 'Gate Duty' | 'Lab Supervision' | 'Library Duty' | 'Sports Duty';
  date: string;
  time: string;
  location: string;
  status: 'Scheduled' | 'Completed' | 'Pending';
  instructions: string;
}

const INITIAL_SHIFTS: DutyRosterShift[] = [
  {
    id: 'DTY-2026-101',
    teacherId: 'TCH-001',
    teacherName: 'Prof. Junaid Iqbal',
    dutyType: 'Assembly Duty',
    date: '2026-09-08',
    time: '07:45 AM - 08:15 AM',
    location: 'Central Amphitheatre',
    status: 'Scheduled',
    instructions: 'Supervise student assembly lines, national anthem decorum, and uniform discipline.'
  },
  {
    id: 'DTY-2026-102',
    teacherId: 'TCH-002',
    teacherName: 'Ms. Ayesha Siddiqui',
    dutyType: 'Break Duty',
    date: '2026-09-08',
    time: '10:15 AM - 10:45 AM',
    location: 'Cafeteria & Senior Courtyard',
    status: 'Scheduled',
    instructions: 'Maintain order and assist student council prefects during recess break.'
  },
  {
    id: 'DTY-2026-103',
    teacherId: 'TCH-004',
    teacherName: 'Dr. Nabila Bano',
    dutyType: 'Exam Invigilation',
    date: '2026-09-09',
    time: '09:00 AM - 11:30 AM',
    location: 'Exam Hall 2 (Main Wing)',
    status: 'Pending',
    instructions: 'Cambridge Mid-Term Assessment proctoring. Verify sealed question envelopes.'
  },
  {
    id: 'DTY-2026-104',
    teacherId: 'TCH-006',
    teacherName: 'Capt. (R) Waqar Hashmi',
    dutyType: 'Gate Duty',
    date: '2026-09-08',
    time: '07:20 AM - 08:00 AM',
    location: 'Campus Gate #1 (Vehicular)',
    status: 'Scheduled',
    instructions: 'Oversee vehicle drop-off queue and RFID student entry gate scans.'
  },
  {
    id: 'DTY-2026-105',
    teacherId: 'TCH-005',
    teacherName: 'Mr. Salman Qadir',
    dutyType: 'Lab Supervision',
    date: '2026-09-08',
    time: '01:30 PM - 03:00 PM',
    location: 'Computer Lab 1 & Robotics Wing',
    status: 'Completed',
    instructions: 'Monitor after-school AI & robotics project lab session for Grade 10.'
  }
];

export const TeacherDutiesView: React.FC = () => {
  const { showToast } = useToast();
  const [shifts, setShifts] = useState<DutyRosterShift[]>(INITIAL_SHIFTS);
  const [dutyFilter, setDutyFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Duty Form states
  const [teacherName, setTeacherName] = useState('Prof. Junaid Iqbal');
  const [dutyType, setDutyType] = useState<DutyRosterShift['dutyType']>('Assembly Duty');
  const [date, setDate] = useState('2026-09-09');
  const [time, setTime] = useState('07:45 AM - 08:15 AM');
  const [location, setLocation] = useState('Central Amphitheatre');
  const [instructions, setInstructions] = useState('Supervise student assembly lines and uniform check');

  const dutyTypes: (DutyRosterShift['dutyType'] | 'All')[] = [
    'All',
    'Assembly Duty',
    'Exam Invigilation',
    'Break Duty',
    'Gate Duty',
    'Lab Supervision',
    'Library Duty',
    'Sports Duty'
  ];

  const filtered = shifts.filter((d) => {
    if (dutyFilter === 'All') return true;
    return d.dutyType === dutyFilter;
  });

  const handleAddDuty = (e: React.FormEvent) => {
    e.preventDefault();
    const newShift: DutyRosterShift = {
      id: `DTY-2026-${Math.floor(100 + Math.random() * 900)}`,
      teacherId: 'TCH-001',
      teacherName,
      dutyType,
      date,
      time,
      location,
      status: 'Scheduled',
      instructions
    };
    setShifts([newShift, ...shifts]);
    setShowAddModal(false);
    showToast('Duty Assignment Scheduled', `${dutyType} assigned to ${teacherName}`, 'success');
  };

  return (
    <div>
      {/* Title & Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Teacher Duty Roster & Workload
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Schedule and coordinate morning assemblies, exam invigilation, recess breaks, gate security, and campus supervision
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => showToast('Exporting Weekly Duty Roster (PDF)', undefined, 'info')}
            className="bca-btn bca-btn-secondary"
          >
            <Download size={16} />
            <span>Export Roster</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bca-btn bca-btn-primary"
          >
            <Plus size={16} />
            <span>Assign Duty</span>
          </button>
        </div>
      </div>

      {/* Faculty Workload Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {MOCK_TEACHER_DUTIES.map((td) => (
          <div key={td.id} className="bca-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <img
                src={td.teacherAvatar}
                alt={td.teacherName}
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {td.teacherName}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  {td.subject} • {td.periodsPerWeek} Periods/wk
                </div>
              </div>
              <span className={`bca-badge bca-badge-${td.workloadStatus.toLowerCase()}`}>
                {td.workloadStatus}
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#475569' }}>
              <div style={{ fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Assigned Roles:</div>
              <ul style={{ margin: 0, paddingLeft: '16px', lineHeight: 1.4 }}>
                {td.duties.slice(0, 2).map((duty, idx) => (
                  <li key={idx}>{duty}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs Bar */}
      <div
        className="bca-card"
        style={{
          padding: '12px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto'
        }}
      >
        {dutyTypes.map((dt) => (
          <button
            key={dt}
            onClick={() => setDutyFilter(dt)}
            className="bca-btn"
            style={{
              backgroundColor: dutyFilter === dt ? '#2563eb' : '#f8fafc',
              color: dutyFilter === dt ? '#ffffff' : '#64748b',
              border: '1px solid',
              borderColor: dutyFilter === dt ? '#2563eb' : '#e2e8f0',
              padding: '6px 14px',
              fontSize: '0.8rem',
              whiteSpace: 'nowrap'
            }}
          >
            {dt}
          </button>
        ))}
      </div>

      {/* Duty Table */}
      <div className="bca-table-wrapper">
        <table className="bca-table">
          <thead>
            <tr>
              <th>Roster ID</th>
              <th>Faculty Assigned</th>
              <th>Duty Type</th>
              <th>Date & Shift</th>
              <th>Campus Location</th>
              <th>Instructions</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id}>
                <td><code>{d.id}</code></td>
                <td>
                  <strong style={{ color: '#0f172a' }}>{d.teacherName}</strong>
                </td>
                <td>
                  <span
                    className="bca-badge"
                    style={{
                      background:
                        d.dutyType === 'Exam Invigilation'
                          ? '#fef3c7'
                          : d.dutyType === 'Gate Duty'
                          ? '#ffe4e6'
                          : '#eff6ff',
                      color:
                        d.dutyType === 'Exam Invigilation'
                          ? '#b45309'
                          : d.dutyType === 'Gate Duty'
                          ? '#e11d48'
                          : '#1d4ed8'
                    }}
                  >
                    {d.dutyType}
                  </span>
                </td>
                <td>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1e293b' }}>{d.date}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {d.time}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.84rem', color: '#334155' }}>
                    <MapPin size={14} color="#64748b" />
                    <span>{d.location}</span>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '0.78rem', color: '#475569' }}>
                    {d.instructions}
                  </span>
                </td>
                <td>
                  <span className={`bca-badge bca-badge-${d.status.toLowerCase()}`}>
                    {d.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => {
                      setShifts(shifts.map((item) => (item.id === d.id ? { ...item, status: 'Completed' } : item)));
                      showToast(`Duty ${d.id} marked as Completed`, undefined, 'success');
                    }}
                    className="bca-btn bca-btn-secondary"
                    style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                    title="Mark Completed"
                  >
                    <CheckCircle size={13} color="#059669" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ASSIGN DUTY MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Assign Faculty Duty"
        subtitle="Schedule campus supervision or invigilation shift"
        maxWidth="540px"
        footer={
          <>
            <button type="submit" form="assign-duty-form" className="bca-btn bca-btn-primary">
              Confirm Assignment
            </button>
            <button type="button" onClick={() => setShowAddModal(false)} className="bca-btn bca-btn-secondary">
              Cancel
            </button>
          </>
        }
      >
        <form id="assign-duty-form" onSubmit={handleAddDuty} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
              Faculty Member *
            </label>
            <select
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            >
              <option value="Prof. Junaid Iqbal">Prof. Junaid Iqbal (Science)</option>
              <option value="Ms. Ayesha Siddiqui">Ms. Ayesha Siddiqui (English)</option>
              <option value="Engr. Haris Mumtaz">Engr. Haris Mumtaz (Mathematics)</option>
              <option value="Dr. Nabila Bano">Dr. Nabila Bano (Chemistry)</option>
              <option value="Mr. Salman Qadir">Mr. Salman Qadir (Computer Science)</option>
              <option value="Capt. (R) Waqar Hashmi">Capt. (R) Waqar Hashmi (Sports)</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Duty Type *
              </label>
              <select
                value={dutyType}
                onChange={(e) => setDutyType(e.target.value as DutyRosterShift['dutyType'])}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              >
                <option value="Assembly Duty">Assembly Duty</option>
                <option value="Exam Invigilation">Exam Invigilation</option>
                <option value="Break Duty">Break Duty</option>
                <option value="Gate Duty">Gate Duty</option>
                <option value="Lab Supervision">Lab Supervision</option>
                <option value="Library Duty">Library Duty</option>
                <option value="Sports Duty">Sports Duty</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Time Shift *
              </label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 07:45 AM - 08:15 AM"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Campus Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Gate #1 / Courtyard"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
              Special Directives / Instructions
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Check student ID cards, oversee queue discipline"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ backgroundColor: '#eff6ff', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#1e40af' }}>
            <AlertCircle size={15} color="#2563eb" style={{ flexShrink: 0 }} />
            <span>Automatic SMS reminder will be dispatched to the faculty member 30 minutes prior to duty.</span>
          </div>
        </form>
      </Modal>
    </div>
  );
};
