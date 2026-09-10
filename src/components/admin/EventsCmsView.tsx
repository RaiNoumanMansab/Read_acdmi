import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  Users,
  Eye,
  CheckCircle,
  Download
} from 'lucide-react';
import { MOCK_EVENTS } from '../../mockData';
import type { SchoolEvent } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

export const EventsCmsView: React.FC = () => {
  const { showToast } = useToast();
  const [events, setEvents] = useState<SchoolEvent[]>(MOCK_EVENTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SchoolEvent | null>(null);

  // New Event form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<SchoolEvent['category']>('Academic');
  const [newDate, setNewDate] = useState('2026-10-15');
  const [newTime, setNewTime] = useState('09:00 AM - 01:00 PM');
  const [newLocation, setNewLocation] = useState('Auditorium Hall');
  const [newDesc, setNewDesc] = useState('');

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) {
      showToast('Please specify event title', undefined, 'error');
      return;
    }
    const newEvt: SchoolEvent = {
      id: `EVT-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      date: newDate,
      time: newTime,
      location: newLocation,
      description: newDesc || 'Institutional event open to registered participants and families.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
      status: 'Upcoming',
      organizer: 'Institutional Events Directorate',
      targetAudience: 'All School',
      isPublic: true,
      registeredCount: 0
    };
    setEvents([...events, newEvt]);
    setShowAddModal(false);
    showToast('Event Scheduled & Published', newEvt.title, 'success');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Events & Academic Calendar CMS
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Coordinate sports festivals, parent-teacher symposiums, science exhibitions, and public celebrations
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="bca-btn bca-btn-primary">
          <Plus size={16} />
          <span>Add Calendar Event</span>
        </button>
      </div>

      {/* Events Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px'
        }}
      >
        {events.map((evt) => {
          const evtDate = new Date(evt.date);
          const monthStr = evtDate.toLocaleDateString('en-US', { month: 'short' });
          const dayNum = evtDate.getDate();

          return (
            <div
              key={evt.id}
              className="bca-card"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                  <div
                    style={{
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      textAlign: 'center',
                      minWidth: '58px',
                      border: '1px solid #bfdbfe'
                    }}
                  >
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase' }}>
                      {monthStr}
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, lineHeight: 1.1 }}>
                      {dayNum}
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <span className="bca-badge bca-badge-primary" style={{ marginBottom: '4px' }}>
                      {evt.category}
                    </span>
                    <h3 style={{ fontSize: '1.08rem', fontWeight: 700, margin: '4px 0 0', color: '#0f172a' }}>
                      {evt.title}
                    </h3>
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                  {evt.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: '#64748b', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="#64748b" />
                    <span>{evt.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#64748b" />
                    <span>{evt.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} color="#64748b" />
                    <span>Audience: <strong>{evt.targetAudience}</strong></span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 700 }}>
                  {evt.registeredCount} RSVPs Confirmed
                </span>
                <button
                  onClick={() => setSelectedEvent(evt)}
                  className="bca-btn bca-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                >
                  <Eye size={13} /> Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* EVENT DETAIL MODAL */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.title}
          subtitle={`${selectedEvent.category} • Scheduled on ${selectedEvent.date}`}
          maxWidth="560px"
          footer={
            <button onClick={() => setSelectedEvent(null)} className="bca-btn bca-btn-secondary">
              Close
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem' }}>
            <div><strong>Date:</strong> {selectedEvent.date}</div>
            <div><strong>Timing:</strong> {selectedEvent.time}</div>
            <div><strong>Location / Hall:</strong> {selectedEvent.location}</div>
            <div><strong>Target Participants:</strong> {selectedEvent.targetAudience}</div>
            <div><strong>Confirmed Attendees:</strong> {selectedEvent.registeredCount} Registrations</div>
            <div style={{ marginTop: '8px' }}>
              <strong>Event Overview:</strong>
              <p style={{ margin: '4px 0 0', color: '#475569', lineHeight: 1.6 }}>{selectedEvent.description}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* ADD EVENT MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Schedule Calendar Event"
        subtitle="Publishes to school calendar, parent portal and public website"
        maxWidth="540px"
        footer={
          <>
            <button type="submit" form="eventForm" className="bca-btn bca-btn-primary">
              Schedule Event
            </button>
            <button type="button" onClick={() => setShowAddModal(false)} className="bca-btn bca-btn-secondary">
              Cancel
            </button>
          </>
        }
      >
        <form id="eventForm" onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Event Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Annual Speech & Debate Championship"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div className="bca-form-row">
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Category *</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              >
                <option value="Academic">Academic</option>
                <option value="Sports">Sports</option>
                <option value="Cultural">Cultural</option>
                <option value="Celebration">Celebration</option>
                <option value="PTM">Parent-Teacher Meeting (PTM)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Event Date *</label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div className="bca-form-row">
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Time *</label>
              <input
                type="text"
                required
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Location *</label>
              <input
                type="text"
                required
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Description</label>
            <textarea
              rows={3}
              placeholder="Provide event details, itinerary or registration rules..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
