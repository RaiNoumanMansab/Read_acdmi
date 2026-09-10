import React, { useState } from 'react';
import {
  Settings,
  School,
  Calendar,
  DollarSign,
  Bell,
  Shield,
  Save,
  Database,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { SCHOOL_INFO } from '../../mockData';
import { useToast } from '../common/Toast';

export const SettingsView: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'general' | 'academic' | 'fees' | 'notifications' | 'backup'>('general');

  // School profile form
  const [schoolName, setSchoolName] = useState(SCHOOL_INFO.name);
  const [motto, setMotto] = useState(SCHOOL_INFO.motto);
  const [address, setAddress] = useState(SCHOOL_INFO.address);
  const [phone, setPhone] = useState(SCHOOL_INFO.phone);
  const [email, setEmail] = useState(SCHOOL_INFO.email);
  const [principal, setPrincipal] = useState(SCHOOL_INFO.principal);

  // Academic settings
  const [activeSession, setActiveSession] = useState('2026-2027');
  const [termSystem, setTermSystem] = useState('3-Term Trimester');

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('School Profile Updated', 'Institutional information saved successfully', 'success');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Institutional Configuration & System Settings
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            System-wide school profiles, fee schedules, academic sessions, and administrative parameters
          </p>
        </div>

        <button
          onClick={() => showToast('All configuration changes committed to system cache', undefined, 'success')}
          className="bca-btn bca-btn-primary"
        >
          <Save size={16} />
          <span>Save All Settings</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', overflowX: 'auto' }}>
        {[
          { id: 'general', label: 'School Identity', icon: School },
          { id: 'academic', label: 'Academic Sessions & Grading', icon: Calendar },
          { id: 'fees', label: 'Tuition Fee Structure', icon: DollarSign },
          { id: 'notifications', label: 'SMS & Communication Rules', icon: Bell },
          { id: 'backup', label: 'Database & Security Audit', icon: Database }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="bca-btn"
              style={{
                backgroundColor: isSelected ? '#2563eb' : '#ffffff',
                color: isSelected ? '#ffffff' : '#475569',
                border: isSelected ? 'none' : '1px solid #cbd5e1',
                padding: '8px 16px',
                fontSize: '0.82rem',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SCHOOL IDENTITY */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bca-card" style={{ padding: '24px', maxWidth: '780px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>School Official Information</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  School Name
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Institutional Motto
                </label>
                <input
                  type="text"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Campus Physical Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Campus Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Inquiry Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Executive Principal
                </label>
                <input
                  type="text"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            <div style={{ paddingTop: '10px' }}>
              <button type="submit" className="bca-btn bca-btn-primary">
                Save Profile
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: ACADEMIC SESSIONS & GRADING */}
      {activeTab === 'academic' && (
        <div className="bca-card" style={{ padding: '24px', maxWidth: '780px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Active Academic Year & Evaluation System</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Current Active Academic Session
                </label>
                <select
                  value={activeSession}
                  onChange={(e) => setActiveSession(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="2026-2027">Session 2026-2027 (Active)</option>
                  <option value="2027-2028">Session 2027-2028 (Upcoming)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Term Structure
                </label>
                <select
                  value={termSystem}
                  onChange={(e) => setTermSystem(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option>3-Term Trimester (Autumn, Spring, Summer)</option>
                  <option>2-Term Semester (Mid-Year, Final)</option>
                </select>
              </div>
            </div>

            {/* Grading Scale Table */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px' }}>
                Standard Institutional Grading Scale
              </label>
              <table className="bca-table" style={{ fontSize: '0.82rem' }}>
                <thead>
                  <tr>
                    <th>Grade</th>
                    <th>Percentage Range</th>
                    <th>GPA Value</th>
                    <th>Classification</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { g: 'A+', pct: '90% - 100%', gpa: '4.0', rem: 'High Distinction' },
                    { g: 'A', pct: '80% - 89%', gpa: '3.7', rem: 'Distinction' },
                    { g: 'B', pct: '70% - 79%', gpa: '3.0', rem: 'First Division' },
                    { g: 'C', pct: '60% - 69%', gpa: '2.5', rem: 'Second Division' },
                    { g: 'F', pct: 'Below 50%', gpa: '0.0', rem: 'Fail / Retake' }
                  ].map((row, i) => (
                    <tr key={i}>
                      <td><span className="bca-badge bca-badge-present">{row.g}</span></td>
                      <td><strong>{row.pct}</strong></td>
                      <td>{row.gpa}</td>
                      <td>{row.rem}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FEES CONFIG */}
      {activeTab === 'fees' && (
        <div className="bca-card" style={{ padding: '24px', maxWidth: '780px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Default Monthly Fee Schedule per Wing</h3>
          <table className="bca-table" style={{ fontSize: '0.82rem' }}>
            <thead>
              <tr>
                <th>Academic Wing</th>
                <th>Monthly Tuition (PKR)</th>
                <th>Lab & Science Fee</th>
                <th>Admission / Reg Fee (One-Time)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { wing: 'Senior Wing (Grades 9 - 12)', fee: 18000, lab: 3000, adm: 35000 },
                { wing: 'Middle Wing (Grades 6 - 8)', fee: 14500, lab: 1500, adm: 30000 },
                { wing: 'Primary Wing (Grades 1 - 5)', fee: 12000, lab: 500, adm: 25000 },
                { wing: 'Kindergarten & Pre-School', fee: 10500, lab: 0, adm: 20000 }
              ].map((row, i) => (
                <tr key={i}>
                  <td><strong>{row.wing}</strong></td>
                  <td><input type="number" defaultValue={row.fee} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '110px' }} /></td>
                  <td><input type="number" defaultValue={row.lab} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '90px' }} /></td>
                  <td><input type="number" defaultValue={row.adm} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '110px' }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS & INTEGRATIONS */}
      {activeTab === 'notifications' && (
        <div className="bca-card" style={{ padding: '24px', maxWidth: '780px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Automated Parent Communications & Gateways</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { title: 'Daily Attendance SMS Alert', desc: 'Auto-dispatch SMS to guardian mobile if student marked absent by 08:45 AM', checked: true },
              { title: 'Fee Due Reminders (3 Days Prior)', desc: 'Broadcast automated reminder SMS & WhatsApp before the 10th of every month', checked: true },
              { title: 'Examination Results Release', desc: 'Instantly notify parents with marks link when term gradebook is locked', checked: true },
              { title: 'Emergency Weather / Security Circulars', desc: 'High-priority instant broadcast across all channels (SMS, Push, Portal)', checked: true }
            ].map((rule, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{rule.title}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{rule.desc}</div>
                </div>
                <input type="checkbox" defaultChecked={rule.checked} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: BACKUP & AUDIT */}
      {activeTab === 'backup' && (
        <div className="bca-card" style={{ padding: '24px', maxWidth: '780px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Database Snapshot & Disaster Recovery</h3>
          <p style={{ fontSize: '0.84rem', color: '#475569', marginBottom: '18px' }}>
            Beacon Crest ERP automatically archives encrypted snapshots to cloud storage every 6 hours.
          </p>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button
              onClick={() => showToast('Full System Database Snapshot Downloaded (encrypted SQL)', undefined, 'success')}
              className="bca-btn bca-btn-primary"
            >
              <Database size={16} /> Create Backup Snapshot
            </button>
            <button
              onClick={() => showToast('Integrity check completed: All 1,248 student profiles verified', undefined, 'info')}
              className="bca-btn bca-btn-secondary"
            >
              <RefreshCw size={16} /> Run Integrity Audit
            </button>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#64748b', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
            <strong>Last Snapshot:</strong> September 7, 2026, 06:00 AM UTC • <strong>Size:</strong> 42.4 MB • <strong>SHA-256:</strong> <code>e49b81...fa712</code>
          </div>
        </div>
      )}
    </div>
  );
};
