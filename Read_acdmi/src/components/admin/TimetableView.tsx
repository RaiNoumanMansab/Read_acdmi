import React, { useState } from 'react';
import {
  Printer,
  Plus,
  MapPin
} from 'lucide-react';
import { MOCK_TIMETABLE } from '../../mockData';
import type { TimetableSlot, TimetableSchedule } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

interface ActiveSlotState extends TimetableSlot {
  day: string;
  class: string;
  section: string;
}

export const TimetableView: React.FC = () => {
  const { showToast } = useToast();
  const [selectedClass, setSelectedClass] = useState('Grade 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [schedule, setSchedule] = useState<TimetableSchedule>(MOCK_TIMETABLE);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeSlot, setActiveSlot] = useState<ActiveSlotState | null>(null);

  const days: (keyof TimetableSchedule)[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = [
    { num: 1, time: '08:00 - 08:45' },
    { num: 2, time: '08:45 - 09:30' },
    { num: 3, time: '09:30 - 10:15' },
    { num: 'BREAK', time: '10:15 - 10:45', isBreak: true },
    { num: 4, time: '10:45 - 11:30' },
    { num: 5, time: '11:30 - 12:15' },
    { num: 6, time: '12:15 - 01:00' },
    { num: 7, time: '01:00 - 01:45' }
  ];

  const getSlot = (day: keyof TimetableSchedule, periodNum: number | string) => {
    return schedule[day]?.find((s) => s.period === periodNum);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Master Class Timetable
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Weekly institutional period schedule, lecture rooms, and assigned faculty
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handlePrint}
            className="bca-btn bca-btn-secondary"
          >
            <Printer size={16} />
            <span>Print Timetable</span>
          </button>
          <button
            onClick={() => {
              setActiveSlot({
                day: 'Monday',
                class: selectedClass,
                section: selectedSection,
                period: 1,
                time: '08:00 - 08:45 AM',
                subject: 'New Subject',
                teacher: 'Select Teacher',
                room: 'Room 101'
              });
              setShowEditModal(true);
            }}
            className="bca-btn bca-btn-primary"
          >
            <Plus size={16} />
            <span>Add Class Period</span>
          </button>
        </div>
      </div>

      {/* Class & Section Selector Card */}
      <div
        className="bca-card"
        style={{
          padding: '16px 20px',
          marginBottom: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
              Academic Grade
            </label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                showToast(`Loaded timetable for ${e.target.value}-${selectedSection}`, undefined, 'info');
              }}
              style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700, color: '#0f172a' }}
            >
              <option value="Grade 6">Grade 6 (Middle Wing)</option>
              <option value="Grade 7">Grade 7 (Middle Wing)</option>
              <option value="Grade 8">Grade 8 (Middle Wing)</option>
              <option value="Grade 9">Grade 9 (SSC-I Matric)</option>
              <option value="Grade 10">Grade 10 (SSC-II Matric)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                showToast(`Loaded timetable for ${selectedClass}-${e.target.value}`, undefined, 'info');
              }}
              style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700, color: '#0f172a' }}
            >
              <option value="A">Section A (Boys Campus)</option>
              <option value="B">Section B (Girls Campus)</option>
              <option value="C">Section C (Cambridge Stream)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="bca-badge bca-badge-primary">Term 1 (Autumn 2026)</span>
          <span className="bca-badge bca-badge-active">38 Periods / Wk</span>
        </div>
      </div>

      {/* Grid Timetable Table */}
      <div className="bca-table-wrapper">
        <table className="bca-table" style={{ textAlign: 'center' }}>
          <thead>
            <tr>
              <th style={{ width: '110px', textAlign: 'left' }}>Day / Period</th>
              {periods.map((p, idx) => (
                <th key={idx} style={{ minWidth: '135px' }}>
                  {p.isBreak ? (
                    <div>
                      <div style={{ color: '#059669', fontWeight: 800 }}>Break</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>{p.time}</div>
                    </div>
                  ) : (
                    <div>
                      <div>Period {p.num}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>{p.time}</div>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td style={{ textAlign: 'left', fontWeight: 800, color: '#1e293b', background: '#f8fafc' }}>
                  {day}
                </td>
                {periods.map((p, pIdx) => {
                  if (p.isBreak) {
                    return (
                      <td
                        key={pIdx}
                        style={{
                          background: '#f1f5f9',
                          color: '#94a3b8',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          letterSpacing: '0.05em'
                        }}
                      >
                        RECESS
                      </td>
                    );
                  }

                  const slot = getSlot(day, p.num as number);
                  if (!slot || slot.subject === '-') {
                    return (
                      <td
                        key={pIdx}
                        style={{ background: '#fafafa', color: '#cbd5e1', cursor: 'pointer' }}
                        onClick={() => {
                          setActiveSlot({
                            class: selectedClass,
                            section: selectedSection,
                            day,
                            period: p.num as number,
                            time: p.time,
                            subject: 'Free Period / Library',
                            teacher: 'Duty Substitute',
                            room: 'Library Room 2'
                          });
                          setShowEditModal(true);
                        }}
                      >
                        <span style={{ fontSize: '0.74rem' }}>+ Add</span>
                      </td>
                    );
                  }

                  return (
                    <td
                      key={pIdx}
                      onClick={() => {
                        setActiveSlot({
                          ...slot,
                          day,
                          class: selectedClass,
                          section: selectedSection
                        });
                        setShowEditModal(true);
                      }}
                      style={{
                        cursor: 'pointer',
                        transition: 'background-color 0.15s',
                        padding: '10px 8px'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eff6ff')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div
                        style={{
                          background:
                            slot.subject.includes('Physics')
                              ? '#dbeafe'
                              : slot.subject.includes('Mathematics')
                              ? '#fef3c7'
                              : slot.subject.includes('Computer')
                              ? '#ede9fe'
                              : slot.subject.includes('Chemistry')
                              ? '#dcfce7'
                              : '#f1f5f9',
                          borderRadius: '8px',
                          padding: '8px 10px',
                          textAlign: 'left',
                          border: '1px solid rgba(0,0,0,0.05)'
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a' }}>
                          {slot.subject}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '2px' }}>
                          {slot.teacher}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <MapPin size={11} /> {slot.room}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT / VIEW TIMETABLE SLOT MODAL */}
      {activeSlot && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title={`Academic Period Details — ${activeSlot.day}`}
          subtitle={`Period ${activeSlot.period} (${activeSlot.time}) • ${activeSlot.class}-${activeSlot.section}`}
          maxWidth="480px"
          footer={
            <>
              <button
                onClick={() => {
                  const daySlots = [...(schedule[activeSlot.day as keyof TimetableSchedule] || [])];
                  const existingIdx = daySlots.findIndex((s) => s.period === activeSlot.period);
                  if (existingIdx >= 0) {
                    daySlots[existingIdx] = {
                      period: activeSlot.period,
                      time: activeSlot.time,
                      subject: activeSlot.subject,
                      teacher: activeSlot.teacher,
                      room: activeSlot.room
                    };
                  } else {
                    daySlots.push({
                      period: activeSlot.period,
                      time: activeSlot.time,
                      subject: activeSlot.subject,
                      teacher: activeSlot.teacher,
                      room: activeSlot.room
                    });
                  }
                  setSchedule({
                    ...schedule,
                    [activeSlot.day]: daySlots
                  });
                  showToast('Timetable Slot Updated', `${activeSlot.subject} scheduled for ${activeSlot.day}`, 'success');
                  setShowEditModal(false);
                }}
                className="bca-btn bca-btn-primary"
              >
                Save Changes
              </button>
              <button onClick={() => setShowEditModal(false)} className="bca-btn bca-btn-secondary">
                Cancel
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Subject Name
              </label>
              <input
                type="text"
                value={activeSlot.subject}
                onChange={(e) => setActiveSlot({ ...activeSlot, subject: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Assigned Faculty Member
              </label>
              <input
                type="text"
                value={activeSlot.teacher}
                onChange={(e) => setActiveSlot({ ...activeSlot, teacher: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Lecture Hall / Laboratory Room
              </label>
              <input
                type="text"
                value={activeSlot.room}
                onChange={(e) => setActiveSlot({ ...activeSlot, room: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
