import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  Users
} from 'lucide-react';
import { MOCK_EVENTS } from '../../../mockData';
import type { SchoolEvent } from '../../../types';
import { Modal } from '../../common/Modal';
import { useToast } from '../../common/Toast';

export const EventsPublicPage: React.FC = () => {
  const { showToast } = useToast();
  const [selectedEventForRsvp, setSelectedEventForRsvp] = useState<SchoolEvent | null>(null);

  // RSVP Form
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [numGuests, setNumGuests] = useState(2);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone) {
      showToast('Please enter your name and contact phone', undefined, 'error');
      return;
    }
    showToast(
      'RSVP Confirmed!',
      `You are registered for "${selectedEventForRsvp?.title}". Confirmation sent to ${guestEmail || guestPhone}.`,
      'success'
    );
    setSelectedEventForRsvp(null);
    setGuestName('');
    setGuestEmail('');
    setGuestPhone('');
  };

  return (
    <div>
      {/* Hero Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #04142a 0%, #0B3974 55%, #0e458e 100%)',
          color: '#ffffff',
          padding: '70px 24px',
          textAlign: 'center',
          borderBottom: '4px solid #E62929'
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Campus Calendar • Read To Lead
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, margin: '8px 0 16px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Events, Symposiums & Sports Galas
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            Join our vibrant learning community for upcoming science exhibitions, academic awards ceremonies, and parent-teacher dialogues.
          </p>
        </div>
      </section>

      {/* Events List */}
      <section style={{ padding: '60px 24px 80px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {MOCK_EVENTS.map((evt) => {
            const d = new Date(evt.date);
            const monthStr = d.toLocaleDateString('en-US', { month: 'short' });
            const dayNum = d.getDate();

            return (
              <div
                key={evt.id}
                className="bca-card"
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  flexWrap: 'wrap',
                  borderTop: '3px solid #E62929'
                }}
              >
                {/* Date Badge */}
                <div
                  style={{
                    backgroundColor: '#feecec',
                    color: '#E62929',
                    borderRadius: '14px',
                    padding: '12px 18px',
                    textAlign: 'center',
                    minWidth: '70px',
                    border: '1px solid #fecaca'
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    {monthStr}
                  </div>
                  <div style={{ fontSize: '1.7rem', fontWeight: 900, lineHeight: 1, color: '#E62929' }}>
                    {dayNum}
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="bca-badge bca-badge-primary">{evt.category}</span>
                    <span style={{ fontSize: '0.76rem', color: '#4CAF50', fontWeight: 800 }}>
                      {evt.registeredCount} RSVPs Confirmed
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px 0', color: '#0f172a' }}>
                    {evt.title}
                  </h3>

                  <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                    {evt.description}
                  </p>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#64748b', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={14} color="#64748b" />
                      <span>{evt.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={14} color="#64748b" />
                      <span>{evt.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Users size={14} color="#64748b" />
                      <span>Organizer: <strong>{evt.organizer}</strong></span>
                    </div>
                  </div>
                </div>

                {/* RSVP Button */}
                <div>
                  <button
                    onClick={() => setSelectedEventForRsvp(evt)}
                    className="bca-btn bca-btn-primary"
                    style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}
                  >
                    RSVP / Register
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* RSVP MODAL */}
      {selectedEventForRsvp && (
        <Modal
          isOpen={!!selectedEventForRsvp}
          onClose={() => setSelectedEventForRsvp(null)}
          title={`RSVP Attendance — ${selectedEventForRsvp.title}`}
          subtitle={`Scheduled for ${selectedEventForRsvp.date} (${selectedEventForRsvp.time}) at ${selectedEventForRsvp.location}`}
          maxWidth="500px"
          footer={
            <>
              <button type="submit" form="rsvpForm" className="bca-btn bca-btn-primary">
                Confirm Reservation
              </button>
              <button type="button" onClick={() => setSelectedEventForRsvp(null)} className="bca-btn bca-btn-secondary">
                Cancel
              </button>
            </>
          }
        >
          <form id="rsvpForm" onSubmit={handleRsvpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Your Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Asad Ullah"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div className="bca-form-row">
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Mobile / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+92 300 0000000"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="parent@example.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Number of Guests Attending
              </label>
              <select
                value={numGuests}
                onChange={(e) => setNumGuests(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              >
                <option value={1}>1 Person</option>
                <option value={2}>2 Persons (Parents)</option>
                <option value={3}>3 Persons (Family)</option>
                <option value={4}>4 Persons (Family + Student)</option>
              </select>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
