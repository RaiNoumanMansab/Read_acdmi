import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Printer,
  Plus,
  MapPin,
  Trash2,
  Edit2,
  Save,
  Clock,
  BookOpen,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  List
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';
import { academicsApi, teachersApi } from '../../services/api';

export const ALL_ACADEMIC_GRADES = [
  'Playgroup',
  'Nursery',
  'Prep / KG',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6 (Middle Wing)',
  'Grade 7 (Middle Wing)',
  'Grade 8 (Middle Wing)',
  'Grade 9 (Matric)',
  'Grade 10 (Matric)',
  'FSC Pre-Medical',
  'FSC Pre-Engineering',
  'ICS',
  'I.Com',
  'FA',
  'D.Com'
];

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export interface TimetableRecord {
  id: string;
  className: string;
  sectionName: string;
  dayOfWeek: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectName: string;
  teacherName: string;
  roomNumber: string;
}

export const TimetableView: React.FC = () => {
  const { showToast } = useToast();

  const [records, setRecords] = useState<TimetableRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Available options from live DB
  const [classesList, setClassesList] = useState<any[]>([]);
  const [subjectsList, setSubjectsList] = useState<any[]>([]);
  const [teachersList, setTeachersList] = useState<any[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [sectionFilter, setSectionFilter] = useState('All');
  const [dayFilter, setDayFilter] = useState('All');

  // Add / Edit Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<TimetableRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    className: 'Grade 10 (Matric)',
    sectionName: 'A',
    dayOfWeek: 'Monday',
    periodNumber: 1,
    startTime: '08:00 AM',
    endTime: '08:45 AM',
    subjectName: '',
    teacherName: '',
    roomNumber: 'Room 201'
  });

  // All available grades merged from defaults and live DB
  const allAvailableClasses = useMemo(() => {
    const names = [...ALL_ACADEMIC_GRADES];
    classesList.forEach((c) => {
      const n = c.name;
      if (n && !names.includes(n)) {
        names.push(n);
      }
    });
    return names;
  }, [classesList]);

  // Load Classes, Subjects, and Teachers
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      academicsApi.getClasses().catch(() => null),
      academicsApi.getSubjects().catch(() => null),
      teachersApi.getTeachers().catch(() => null)
    ]).then(([clsRes, subRes, tchRes]) => {
      if (!isMounted) return;
      if (clsRes?.data && Array.isArray(clsRes.data)) {
        setClassesList(clsRes.data);
      }
      if (subRes?.data && Array.isArray(subRes.data)) {
        setSubjectsList(subRes.data);
      }
      if (tchRes?.data && Array.isArray(tchRes.data)) {
        setTeachersList(tchRes.data);
      }
    });

    return () => { isMounted = false; };
  }, []);

  // Fetch all timetable slots from Database
  const fetchTimetable = useCallback(async () => {
    setLoading(true);
    try {
      const res = await academicsApi.getTimetable();
      if (res?.data && Array.isArray(res.data)) {
        const mapped: TimetableRecord[] = res.data.map((slot: any) => ({
          id: slot.id,
          className: slot.class?.name || slot.className || 'Grade 10 (Matric)',
          sectionName: slot.section?.name ? slot.section.name.replace('Section ', '') : (slot.sectionName || 'A'),
          dayOfWeek: slot.dayOfWeek || 'Monday',
          periodNumber: Number(slot.periodNumber) || 1,
          startTime: slot.startTime || '08:00 AM',
          endTime: slot.endTime || '08:45 AM',
          subjectName: slot.subject?.name || slot.subjectName || 'Subject',
          teacherName: slot.teacher?.fullName || slot.teacherName || 'Faculty Member',
          roomNumber: slot.roomNumber || 'Room 101'
        }));
        setRecords(mapped);
      } else {
        setRecords([]);
      }
    } catch (err) {
      console.warn('Could not load timetable slots:', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (classFilter !== 'All' && r.className !== classFilter) return false;
      if (sectionFilter !== 'All' && r.sectionName !== sectionFilter) return false;
      if (dayFilter !== 'All' && r.dayOfWeek !== dayFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches =
          r.subjectName.toLowerCase().includes(query) ||
          r.teacherName.toLowerCase().includes(query) ||
          r.roomNumber.toLowerCase().includes(query) ||
          r.className.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    });
  }, [records, classFilter, sectionFilter, dayFilter, searchQuery]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      id: '',
      className: classFilter !== 'All' ? classFilter : 'Grade 10 (Matric)',
      sectionName: sectionFilter !== 'All' ? sectionFilter : 'A',
      dayOfWeek: dayFilter !== 'All' ? dayFilter : 'Monday',
      periodNumber: 1,
      startTime: '08:00 AM',
      endTime: '08:45 AM',
      subjectName: subjectsList[0]?.name || '',
      teacherName: teachersList[0]?.fullName || '',
      roomNumber: 'Room 201'
    });
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (rec: TimetableRecord) => {
    setIsEditing(true);
    setFormData({
      id: rec.id,
      className: rec.className,
      sectionName: rec.sectionName,
      dayOfWeek: rec.dayOfWeek,
      periodNumber: rec.periodNumber,
      startTime: rec.startTime,
      endTime: rec.endTime,
      subjectName: rec.subjectName,
      teacherName: rec.teacherName,
      roomNumber: rec.roomNumber
    });
    setShowModal(true);
  };

  // Open Delete Modal
  const handleOpenDelete = (rec: TimetableRecord) => {
    setRecordToDelete(rec);
    setShowDeleteModal(true);
  };

  // Save (Create or Update) Slot
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subjectName.trim()) {
      showToast('Validation Error', 'Please specify a Subject name for this period', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await academicsApi.saveTimetableSlot({
        className: formData.className,
        sectionName: formData.sectionName,
        dayOfWeek: formData.dayOfWeek,
        periodNumber: Number(formData.periodNumber),
        startTime: formData.startTime.trim() || '08:00 AM',
        endTime: formData.endTime.trim() || '08:45 AM',
        subjectName: formData.subjectName.trim(),
        teacherName: formData.teacherName.trim() || 'Assigned Faculty',
        roomNumber: formData.roomNumber.trim() || 'Room 101'
      });

      showToast(
        isEditing ? 'Timetable Period Updated' : 'Timetable Period Created',
        `${formData.subjectName} (${formData.className} ${formData.sectionName}) scheduled for ${formData.dayOfWeek} Period ${formData.periodNumber}`,
        'success'
      );

      setShowModal(false);
      await fetchTimetable();
    } catch (err: any) {
      console.error('Save timetable slot error:', err);
      showToast('Save Failed', err?.message || 'Failed to save timetable period to database', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Slot
  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    setIsDeleting(true);
    try {
      await academicsApi.deleteTimetableSlot(recordToDelete.id);
      showToast(
        'Period Deleted',
        `${recordToDelete.subjectName} removed from ${recordToDelete.dayOfWeek} Period ${recordToDelete.periodNumber}`,
        'info'
      );
      setShowDeleteModal(false);
      setRecordToDelete(null);
      await fetchTimetable();
    } catch (err: any) {
      console.error('Delete timetable slot error:', err);
      showToast('Delete Failed', err?.message || 'Could not delete period from database', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Quick stats
  const totalSlots = records.length;
  const uniqueClassesCount = useMemo(() => new Set(records.map(r => `${r.className}-${r.sectionName}`)).size, [records]);
  const uniqueTeachersCount = useMemo(() => new Set(records.map(r => r.teacherName).filter(Boolean)).size, [records]);

  // Grouped periods for grid view
  const gridPeriods = useMemo(() => {
    const targetClass = classFilter !== 'All' ? classFilter : 'Grade 10 (Matric)';
    const targetSection = sectionFilter !== 'All' ? sectionFilter : 'A';
    const targetSlots = records.filter(r => r.className === targetClass && r.sectionName === targetSection);

    // Collect distinct period numbers scheduled
    const distinctPeriods = Array.from(new Set(targetSlots.map(s => s.periodNumber))).sort((a, b) => a - b);
    return { targetClass, targetSection, targetSlots, distinctPeriods };
  }, [records, classFilter, sectionFilter]);

  return (
    <div>
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Class Timetable Management</span>
            <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '12px', fontWeight: 700 }}>
              Live DB Synced
            </span>
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Create and manage academic period schedules, faculty allocations, and lecture rooms
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* View Mode Toggle */}
          <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'list' ? '#ffffff' : 'transparent',
                color: viewMode === 'list' ? '#0B3974' : '#64748b',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <List size={14} />
              <span>Records Table</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                color: viewMode === 'grid' ? '#0B3974' : '#64748b',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <LayoutGrid size={14} />
              <span>Weekly Grid</span>
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="bca-btn bca-btn-secondary"
          >
            <Printer size={16} />
            <span>Print</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="bca-btn bca-btn-primary"
          >
            <Plus size={16} />
            <span>Add Class Period</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        <div className="bca-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Scheduled Periods</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{totalSlots}</div>
          </div>
        </div>

        <div className="bca-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Active Classes</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{uniqueClassesCount}</div>
          </div>
        </div>

        <div className="bca-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#faf5ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Faculty Allocated</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{uniqueTeachersCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="bca-card"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
          {/* Search */}
          <div style={{ position: 'relative', minWidth: '220px', flex: '1 1 200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search subject, teacher, room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
            />
          </div>

          {/* Academic Grade */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Grade:</span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.84rem', color: '#0f172a' }}
            >
              <option value="All">All Grades ({allAvailableClasses.length})</option>
              {allAvailableClasses.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Section:</span>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.84rem', color: '#0f172a' }}
            >
              <option value="All">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
            </select>
          </div>

          {/* Day of Week */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Day:</span>
            <select
              value={dayFilter}
              onChange={(e) => setDayFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.84rem', color: '#0f172a' }}
            >
              <option value="All">All Days</option>
              {DAYS_OF_WEEK.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="bca-badge bca-badge-primary">Session 2026-2027</span>
          <span className="bca-badge bca-badge-active">
            {filteredRecords.length} {filteredRecords.length === 1 ? 'Period' : 'Periods'}
          </span>
        </div>
      </div>

      {/* VIEW 1: RECORDS TABLE (CRUD VIEW) */}
      {viewMode === 'list' && (
        <div className="bca-table-wrapper">
          <table className="bca-table">
            <thead>
              <tr>
                <th style={{ width: '50px', textAlign: 'center' }}>#</th>
                <th>Class & Section</th>
                <th>Day</th>
                <th>Period</th>
                <th>Timing</th>
                <th>Subject</th>
                <th>Assigned Faculty</th>
                <th>Room / Hall</th>
                <th style={{ textAlign: 'center', width: '110px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                    <div style={{ display: 'inline-block', width: '22px', height: '22px', border: '2px solid #cbd5e1', borderTopColor: '#0B3974', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '8px' }}></div>
                    <div>Loading timetable periods from database...</div>
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <Calendar size={28} />
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', marginBottom: '4px' }}>
                      No Timetable Periods Created Yet
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '420px', margin: '0 auto 16px' }}>
                      Create and assign timetable periods with your own subjects, timings, and faculty allocations.
                    </p>
                    <button onClick={handleOpenAdd} className="bca-btn bca-btn-primary" style={{ padding: '8px 18px' }}>
                      <Plus size={16} />
                      <span>Add First Class Period</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((slot, idx) => (
                  <tr key={slot.id || idx}>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: '#94a3b8', fontSize: '0.8rem' }}>
                      {idx + 1}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>
                        {slot.className}
                      </div>
                      <span className="bca-badge bca-badge-primary" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>
                        Section {slot.sectionName}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>
                        {slot.dayOfWeek}
                      </span>
                    </td>
                    <td>
                      <span className="bca-badge bca-badge-active" style={{ fontWeight: 800 }}>
                        Period {slot.periodNumber}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.84rem', color: '#475569', fontWeight: 600 }}>
                        <Clock size={13} style={{ color: '#0284c7' }} />
                        <span>{slot.startTime} – {slot.endTime}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: '#0B3974', fontSize: '0.9rem' }}>
                        {slot.subjectName}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.85rem' }}>
                        {slot.teacherName}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#15803d', fontWeight: 600 }}>
                        <MapPin size={13} />
                        <span>{slot.roomNumber}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleOpenEdit(slot)}
                          className="bca-action-btn bca-btn-edit"
                          title="Edit Class Period"
                          style={{
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            color: '#1d4ed8',
                            borderRadius: '6px',
                            padding: '6px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(slot)}
                          className="bca-action-btn bca-btn-delete"
                          title="Delete Class Period"
                          style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            borderRadius: '6px',
                            padding: '6px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 2: WEEKLY SCHEDULE GRID (DYNAMICALLY SHOWS USER-CREATED SLOTS) */}
      {viewMode === 'grid' && (
        <div>
          <div className="bca-card" style={{ padding: '16px 20px', marginBottom: '16px', background: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                  Weekly Schedule: {gridPeriods.targetClass} (Section {gridPeriods.targetSection})
                </h4>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                  Filter by Grade and Section above to view weekly periods for other classes
                </p>
              </div>
              <button onClick={handleOpenAdd} className="bca-btn bca-btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                <Plus size={14} />
                <span>Add Period</span>
              </button>
            </div>
          </div>

          {gridPeriods.targetSlots.length === 0 ? (
            <div className="bca-card" style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
              <Clock size={32} style={{ color: '#94a3b8', margin: '0 auto 10px' }} />
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                No Periods Scheduled for {gridPeriods.targetClass} (Section {gridPeriods.targetSection})
              </div>
              <p style={{ fontSize: '0.84rem', color: '#64748b', maxWidth: '380px', margin: '4px auto 14px' }}>
                Click below to add class periods, timings, and assign teachers for this grade.
              </p>
              <button onClick={handleOpenAdd} className="bca-btn bca-btn-primary" style={{ padding: '8px 16px' }}>
                <Plus size={15} />
                <span>Add Class Period</span>
              </button>
            </div>
          ) : (
            <div className="bca-table-wrapper">
              <table className="bca-table">
                <thead>
                  <tr>
                    <th style={{ width: '130px' }}>Day of Week</th>
                    {gridPeriods.distinctPeriods.map((pNum) => {
                      const sampleSlot = gridPeriods.targetSlots.find(s => s.periodNumber === pNum);
                      return (
                        <th key={pNum} style={{ minWidth: '150px' }}>
                          <div>Period {pNum}</div>
                          {sampleSlot && (
                            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
                              {sampleSlot.startTime} – {sampleSlot.endTime}
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {DAYS_OF_WEEK.map((day) => {
                    const daySlots = gridPeriods.targetSlots.filter(s => s.dayOfWeek === day);
                    return (
                      <tr key={day}>
                        <td style={{ fontWeight: 800, color: '#0f172a', background: '#f8fafc' }}>
                          {day}
                        </td>
                        {gridPeriods.distinctPeriods.map((pNum) => {
                          const slot = daySlots.find(s => s.periodNumber === pNum);
                          if (!slot) {
                            return (
                              <td key={pNum} style={{ background: '#fafbfc', textAlign: 'center', color: '#cbd5e1' }}>
                                <span>—</span>
                              </td>
                            );
                          }
                          return (
                            <td key={pNum} style={{ verticalAlign: 'top', padding: '8px' }}>
                              <div
                                style={{
                                  backgroundColor: '#f0fdf4',
                                  borderLeft: '3px solid #16a34a',
                                  borderRadius: '8px',
                                  padding: '8px 10px',
                                  textAlign: 'left',
                                  border: '1px solid #bbf7d0',
                                  position: 'relative'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                                  <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a' }}>
                                    {slot.subjectName}
                                  </div>
                                  <div style={{ display: 'inline-flex', gap: '3px' }}>
                                    <button
                                      onClick={() => handleOpenEdit(slot)}
                                      style={{ background: 'transparent', border: 'none', color: '#2563eb', cursor: 'pointer', padding: '2px' }}
                                      title="Edit"
                                    >
                                      <Edit2 size={12} />
                                    </button>
                                    <button
                                      onClick={() => handleOpenDelete(slot)}
                                      style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '2px' }}
                                      title="Delete"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                                <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '2px' }}>
                                  {slot.teacherName}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <MapPin size={11} /> {slot.roomNumber}
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT TIMETABLE MODAL */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={isEditing ? 'Edit Class Period' : 'Add New Class Period'}
        >
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Grade & Section */}
            <div className="bca-form-row">
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Academic Grade *
                </label>
                <select
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600 }}
                >
                  {allAvailableClasses.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Section *
                </label>
                <select
                  value={formData.sectionName}
                  onChange={(e) => setFormData({ ...formData, sectionName: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600 }}
                >
                  {['A', 'B', 'C', 'D'].map((s) => (
                    <option key={s} value={s}>Section {s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Day & Period Number */}
            <div className="bca-form-row">
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Day of Week *
                </label>
                <select
                  value={formData.dayOfWeek}
                  onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600 }}
                >
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Period Number / Slot *
                </label>
                <select
                  value={formData.periodNumber}
                  onChange={(e) => setFormData({ ...formData, periodNumber: Number(e.target.value) })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600 }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>Period {num}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Timing */}
            <div className="bca-form-row">
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Start Time *
                </label>
                <input
                  type="text"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  placeholder="08:00 AM"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  End Time *
                </label>
                <input
                  type="text"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  placeholder="08:45 AM"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  required
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Subject Name *
              </label>
              <input
                type="text"
                list="timetable-subjects-list"
                value={formData.subjectName}
                onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                placeholder="e.g. Mathematics, Physics, Chemistry, English"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                required
              />
              <datalist id="timetable-subjects-list">
                {subjectsList.map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
            </div>

            {/* Teacher */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Assigned Faculty Member
              </label>
              <input
                type="text"
                list="timetable-teachers-list"
                value={formData.teacherName}
                onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                placeholder="e.g. Sir Qasim Raza, Ms. Ayesha"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
              <datalist id="timetable-teachers-list">
                {teachersList.map((t) => (
                  <option key={t.id} value={t.fullName} />
                ))}
              </datalist>
            </div>

            {/* Room */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Room / Hall / Laboratory
              </label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                placeholder="e.g. Room 201, Chemistry Lab, Lecture Hall B"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={isSaving}
                className="bca-btn bca-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="bca-btn bca-btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Save size={16} />
                <span>{isSaving ? 'Saving to DB...' : isEditing ? 'Update Period' : 'Save to Database'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && recordToDelete && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Timetable Period"
        >
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', color: '#b91c1c' }}>
              <AlertCircle size={28} />
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
                Confirm Deletion
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0 0 18px' }}>
              Are you sure you want to delete this period from the database?
            </p>
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px', fontSize: '0.84rem' }}>
              <div><strong>Class:</strong> {recordToDelete.className} (Section {recordToDelete.sectionName})</div>
              <div><strong>Day & Period:</strong> {recordToDelete.dayOfWeek} – Period {recordToDelete.periodNumber}</div>
              <div><strong>Timing:</strong> {recordToDelete.startTime} – {recordToDelete.endTime}</div>
              <div><strong>Subject:</strong> {recordToDelete.subjectName}</div>
              {recordToDelete.teacherName && <div><strong>Faculty:</strong> {recordToDelete.teacherName}</div>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="bca-btn bca-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="bca-btn bca-btn-red"
                style={{ background: '#dc2626', color: '#ffffff', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Trash2 size={16} />
                <span>{isDeleting ? 'Deleting...' : 'Delete Period'}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
