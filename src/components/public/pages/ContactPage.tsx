import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Calendar,
  Compass
} from 'lucide-react';
import { SCHOOL_INFO } from '../../../mockData';
import { useToast } from '../../common/Toast';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'message' | 'tour'>('message');

  // Contact form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Admission Inquiry');
  const [message, setMessage] = useState('');

  // Tour form
  const [tourName, setTourName] = useState('');
  const [tourPhone, setTourPhone] = useState('');
  const [tourDate, setTourDate] = useState('2026-09-16');
  const [tourTime, setTourTime] = useState('10:00 AM');
  const [wingInterest, setWingInterest] = useState('Senior School (Grades 9-12)');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill required fields', undefined, 'error');
      return;
    }
    showToast(
      'Message Dispatched to Reception Desk',
      'Our team will respond via email or phone within 24 hours.',
      'success'
    );
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const handleBookTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourName || !tourPhone) {
      showToast('Please provide your name and phone number', undefined, 'error');
      return;
    }
    showToast(
      'Campus Tour Scheduled!',
      `We look forward to hosting you on ${tourDate} at ${tourTime}. Confirmation sent to ${tourPhone}.`,
      'success'
    );
    setTourName('');
    setTourPhone('');
  };

  return (
    <div>
      {/* Hero Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #04142a 0%, #0B3974 100%)',
          color: '#ffffff',
          padding: '70px 24px',
          textAlign: 'center',
          borderBottom: '4px solid #FFD700'
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Get in Touch • Read Academy Sahiwal
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, margin: '8px 0 16px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
            We'd Love to Hear From You
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            Whether you have questions regarding our curriculum, wish to apply, or want to schedule a guided tour of our campus, our team is here to assist.
          </p>
        </div>
      </section>

      {/* Main Grid: Info Cards + Form */}
      <section style={{ padding: '80px 24px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '40px' }}>
          {/* Left Column: Contact Cards & Map */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div className="bca-card" style={{ padding: '20px' }}>
                <MapPin size={22} color="#0B3974" style={{ marginBottom: '10px' }} />
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 6px 0', color: '#0B3974' }}>
                  Campus Address
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                  {SCHOOL_INFO.address}
                </p>
              </div>

              <div className="bca-card" style={{ padding: '20px' }}>
                <Phone size={22} color="#0B3974" style={{ marginBottom: '10px' }} />
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 6px 0', color: '#0B3974' }}>
                  Direct Phone
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                  {SCHOOL_INFO.phone}<br />
                  +92 40 4461002 (Admissions)
                </p>
              </div>

              <div className="bca-card" style={{ padding: '20px' }}>
                <Mail size={22} color="#0B3974" style={{ marginBottom: '10px' }} />
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 6px 0', color: '#0B3974' }}>
                  Email Inquiries
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                  {SCHOOL_INFO.email}<br />
                  info@readacademy.edu.pk
                </p>
              </div>

              <div className="bca-card" style={{ padding: '20px' }}>
                <Clock size={22} color="#0B3974" style={{ marginBottom: '10px' }} />
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 6px 0', color: '#0B3974' }}>
                  Administrative Hours
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                  Mon - Fri: 07:30 AM - 03:30 PM<br />
                  Sat: 08:00 AM - 01:00 PM
                </p>
              </div>
            </div>

            {/* Styled Campus Location Map Card */}
            <div className="bca-card" style={{ padding: '24px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Compass size={18} color="#0B3974" />
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0B3974' }}>
                  Campus Location & Coordinates
                </h4>
              </div>

              <div
                style={{
                  height: '240px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '12px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #0B3974 0%, #04142a 100%)'
                }}
              >
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    textAlign: 'center',
                    maxWidth: '280px',
                    borderTop: '4px solid #FFD700'
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#0B3974', fontSize: '0.95rem' }}>
                    Read Academy Sahiwal
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                    {SCHOOL_INFO.address}
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '0.72rem', color: '#0B3974', fontWeight: 700 }}>
                    📍 30.6682° N, 73.1114° E (Sahiwal)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Toggleable Message / Tour Form */}
          <div className="bca-card" style={{ padding: '36px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              <button
                onClick={() => setActiveTab('message')}
                className="bca-btn"
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  backgroundColor: activeTab === 'message' ? '#0B3974' : '#f8fafc',
                  color: activeTab === 'message' ? '#ffffff' : '#475569',
                  border: '1px solid',
                  borderColor: activeTab === 'message' ? '#0B3974' : '#cbd5e1',
                  padding: '10px',
                  fontSize: '0.86rem',
                  fontWeight: activeTab === 'message' ? 700 : 500
                }}
              >
                Send Message / Inquiry
              </button>

              <button
                onClick={() => setActiveTab('tour')}
                className="bca-btn"
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  backgroundColor: activeTab === 'tour' ? '#0B3974' : '#f8fafc',
                  color: activeTab === 'tour' ? '#ffffff' : '#475569',
                  border: '1px solid',
                  borderColor: activeTab === 'tour' ? '#0B3974' : '#cbd5e1',
                  padding: '10px',
                  fontSize: '0.86rem',
                  fontWeight: activeTab === 'tour' ? 700 : 500
                }}
              >
                Schedule Campus Tour
              </button>
            </div>

            {/* TAB 1: MESSAGE FORM */}
            {activeTab === 'message' && (
              <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px 0', color: '#0f172a' }}>
                  Send an Inquiry
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 14px 0' }}>
                  Have a specific question? Write to us and an admissions counselor will follow up.
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ayesha Siddiqui"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="parent@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                      Phone / Mobile
                    </label>
                    <input
                      type="tel"
                      placeholder="+92 300 0000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    Inquiry Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option>General Admission Inquiry</option>
                    <option>Fee Structure & Scholarships</option>
                    <option>Matriculation / SSC Curriculum (Grades 9 & 10)</option>
                    <option>Middle & Primary Wing Inquiries</option>
                    <option>Sports & Extracurricular Facilities</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    Message Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we help your family today?..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <button
                  type="submit"
                  className="bca-btn bca-btn-primary"
                  style={{ padding: '12px', justifyContent: 'center', fontSize: '0.95rem' }}
                >
                  <Send size={16} />
                  <span>Send Message</span>
                </button>
              </form>
            )}

            {/* TAB 2: TOUR FORM */}
            {activeTab === 'tour' && (
              <form onSubmit={handleBookTour} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px 0', color: '#0f172a' }}>
                  Book a Guided Campus Tour
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 14px 0' }}>
                  Walk through our robotics laboratories, sports pavilions, and smart classrooms with an admissions officer.
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    Parent / Visitor Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kamran Malik"
                    value={tourName}
                    onChange={(e) => setTourName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    Mobile Number (SMS Confirmation) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 321 0000000"
                    value={tourPhone}
                    onChange={(e) => setTourPhone(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={tourDate}
                      onChange={(e) => setTourDate(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                      Preferred Slot *
                    </label>
                    <select
                      value={tourTime}
                      onChange={(e) => setTourTime(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    >
                      <option>09:00 AM - Morning Slot</option>
                      <option>11:00 AM - Midday Slot</option>
                      <option>01:30 PM - Afternoon Slot</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    Target Academic Wing
                  </label>
                  <select
                    value={wingInterest}
                    onChange={(e) => setWingInterest(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option>Early Years & Kindergarten (Ages 3-5)</option>
                    <option>Primary Wing (Grades 1-5)</option>
                    <option>Middle Wing (Grades 6-8)</option>
                    <option>Senior School (Grades 9-12)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="bca-btn bca-btn-primary"
                  style={{ padding: '12px', justifyContent: 'center', fontSize: '0.95rem', marginTop: '6px' }}
                >
                  <Calendar size={16} />
                  <span>Confirm Campus Tour Booking</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
