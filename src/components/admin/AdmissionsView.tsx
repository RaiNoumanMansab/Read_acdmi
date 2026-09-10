import React, { useState } from 'react';
import {
  UserPlus,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  Search,
  Filter,
  Eye,
  FileCheck,
  AlertCircle,
  Download,
  Upload,
  Check,
  X
} from 'lucide-react';
import { MOCK_ADMISSIONS } from '../../mockData';
import type { AdmissionApplication } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

export const AdmissionsView: React.FC = () => {
  const { showToast } = useToast();
  const [applications, setApplications] = useState<AdmissionApplication[]>(MOCK_ADMISSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);
  const [showNewFormModal, setShowNewFormModal] = useState(false);

  // Stats calculation
  const totalApps = applications.length;
  const pendingApps = applications.filter((a) => a.status === 'Pending').length;
  const approvedApps = applications.filter((a) => a.status === 'Approved').length;
  const rejectedApps = applications.filter((a) => a.status === 'Rejected').length;
  const thisMonthApps = 18;

  // New Admission form states
  const [formSection, setFormSection] = useState<'student' | 'parent' | 'previous' | 'documents'>('student');
  const [newStudentName, setNewStudentName] = useState('');
  const [newClass, setNewClass] = useState('Grade 9');
  const [newGender, setNewGender] = useState('Male');
  const [newDob, setNewDob] = useState('2011-06-15');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [newParentEmail, setNewParentEmail] = useState('');
  const [newPrevSchool, setNewPrevSchool] = useState('');
  const [newPrevPercentage, setNewPrevPercentage] = useState('88.5%');
  const [newAddress, setNewAddress] = useState('Sector F-7, Islamabad');

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: 'Approved' | 'Rejected' | 'Under Review') => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
    showToast(`Application ${id} status updated to ${newStatus}`, undefined, 'info');
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
  };

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newParentName || !newParentPhone) {
      showToast('Please complete all mandatory fields', undefined, 'error');
      return;
    }
    const newApp: AdmissionApplication = {
      id: `ADM-2026-${Math.floor(200 + Math.random() * 800)}`,
      studentName: newStudentName,
      appliedClass: newClass,
      parentName: newParentName,
      parentPhone: newParentPhone,
      parentEmail: newParentEmail || 'parent@beaconcrest.edu.pk',
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      gender: newGender,
      dob: newDob,
      previousSchool: newPrevSchool || 'City International School',
      previousPercentage: newPrevPercentage,
      address: newAddress,
      documentsSubmitted: ['Birth Certificate (B-Form)', 'Past Academic Transcripts', 'Father CNIC Copy']
    };
    setApplications([newApp, ...applications]);
    setShowNewFormModal(false);
    showToast('Admission Application Registered', `Application ID: ${newApp.id}`, 'success');
  };

  return (
    <div>
      {/* Title & Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Admissions Management
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Review candidate dossiers, entrance assessment benchmarks, and process admission decisions
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => showToast('Exporting Admissions Ledger (Excel)', undefined, 'info')}
            className="bca-btn bca-btn-secondary"
          >
            <Download size={16} />
            <span>Export Registry</span>
          </button>
          <button
            onClick={() => setShowNewFormModal(true)}
            className="bca-btn bca-btn-primary"
          >
            <UserPlus size={16} />
            <span>New Admission Form</span>
          </button>
        </div>
      </div>

      {/* Top 5 Statistics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div className="bca-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2563eb' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>TOTAL APPS</span>
            <UserPlus size={18} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{totalApps}</div>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Academic Year 2026-27</span>
        </div>

        <div className="bca-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d97706' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>PENDING REVIEW</span>
            <Clock size={18} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706', margin: '4px 0' }}>{pendingApps}</div>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Awaiting test evaluation</span>
        </div>

        <div className="bca-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>APPROVED</span>
            <CheckCircle size={18} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669', margin: '4px 0' }}>{approvedApps}</div>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Vouchers issued</span>
        </div>

        <div className="bca-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e11d48' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>REJECTED</span>
            <XCircle size={18} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#e11d48', margin: '4px 0' }}>{rejectedApps}</div>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Below test cutoff</span>
        </div>

        <div className="bca-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7c3aed' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>THIS MONTH</span>
            <Calendar size={18} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#7c3aed', margin: '4px 0' }}>{thisMonthApps}</div>
          <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>+34% vs Aug</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="bca-card"
        style={{
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ flex: '1 1 260px', position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            placeholder="Search candidate name, parent, application ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.86rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Data Table */}
      <div className="bca-table-wrapper">
        <table className="bca-table">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Student Name</th>
              <th>Applied Class</th>
              <th>Parent / Guardian</th>
              <th>Application Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((app) => (
              <tr key={app.id}>
                <td>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1e40af' }}>
                    {app.id}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{app.studentName}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{app.gender} • Prev: {app.previousSchool}</div>
                </td>
                <td>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>{app.appliedClass}</span>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#334155' }}>{app.parentName}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{app.parentPhone}</div>
                </td>
                <td>{app.applicationDate}</td>
                <td>
                  <span className={`bca-badge bca-badge-${app.status.toLowerCase().replace(' ', '-')}`}>
                    {app.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="bca-btn bca-btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                    >
                      <Eye size={13} /> Review
                    </button>
                    {app.status !== 'Approved' && (
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'Approved')}
                        className="bca-btn bca-btn-emerald"
                        style={{ padding: '5px 8px' }}
                        title="Approve Admission"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    {app.status !== 'Rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                        className="bca-btn"
                        style={{ padding: '5px 8px', background: '#ffe4e6', color: '#e11d48', border: 'none' }}
                        title="Reject Application"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* REVIEW APPLICATION MODAL */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Admission Dossier — ${selectedApp.studentName}`}
          subtitle={`Application ID: ${selectedApp.id} • Submitted on ${selectedApp.applicationDate}`}
          maxWidth="720px"
          footer={
            <>
              {selectedApp.status !== 'Approved' && (
                <button
                  onClick={() => handleUpdateStatus(selectedApp.id, 'Approved')}
                  className="bca-btn bca-btn-emerald"
                >
                  <Check size={16} /> Approve & Issue Voucher
                </button>
              )}
              {selectedApp.status !== 'Rejected' && (
                <button
                  onClick={() => handleUpdateStatus(selectedApp.id, 'Rejected')}
                  className="bca-btn"
                  style={{ background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3' }}
                >
                  <X size={16} /> Reject Application
                </button>
              )}
              <button
                onClick={() => setSelectedApp(null)}
                className="bca-btn bca-btn-secondary"
              >
                Close
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '14px', borderRadius: '10px' }}>
              <div>
                <span style={{ fontSize: '0.76rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Desired Class</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d4ed8' }}>{selectedApp.appliedClass}</div>
              </div>
              <div>
                <span className={`bca-badge bca-badge-${selectedApp.status.toLowerCase().replace(' ', '-')}`}>
                  Current Status: {selectedApp.status}
                </span>
              </div>
            </div>

            <div className="bca-form-row" style={{ fontSize: '0.88rem' }}>
              <div><strong>Student Name:</strong> {selectedApp.studentName}</div>
              <div><strong>Gender:</strong> {selectedApp.gender}</div>
              <div><strong>Date of Birth:</strong> {selectedApp.dob}</div>
              <div><strong>Previous School:</strong> {selectedApp.previousSchool}</div>
              <div><strong>Previous Academic Record:</strong> {selectedApp.previousPercentage}</div>
              <div><strong>Father / Guardian:</strong> {selectedApp.parentName}</div>
              <div><strong>Contact Number:</strong> {selectedApp.parentPhone}</div>
              <div><strong>Contact Email:</strong> {selectedApp.parentEmail}</div>
              <div style={{ gridColumn: 'span 2' }}><strong>Residential Address:</strong> {selectedApp.address}</div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.92rem' }}>Submitted Verification Documents</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedApp.documentsSubmitted.map((doc, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: '#1e40af',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <FileCheck size={14} /> {doc}
                  </span>
                ))}
              </div>
            </div>

            {selectedApp.notes && (
              <div style={{ padding: '10px 14px', background: '#fff1f2', borderRadius: '8px', borderLeft: '4px solid #f43f5e', fontSize: '0.84rem', color: '#9f1239' }}>
                <strong>Assessment Note:</strong> {selectedApp.notes}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* MULTI-SECTION ADMISSION FORM MODAL */}
      <Modal
        isOpen={showNewFormModal}
        onClose={() => setShowNewFormModal(false)}
        title="Student Admission Application Form"
        subtitle="Step-by-step registration for upcoming academic session"
        maxWidth="750px"
        footer={
          <>
            <button
              type="submit"
              form="admissionAppForm"
              className="bca-btn bca-btn-primary"
            >
              Submit Application
            </button>
            <button
              type="button"
              onClick={() => setShowNewFormModal(false)}
              className="bca-btn bca-btn-secondary"
            >
              Cancel
            </button>
          </>
        }
      >
        <form id="admissionAppForm" onSubmit={handleCreateApplication}>
          {/* Form Step Pills */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
            {[
              { id: 'student', label: '1. Student Information' },
              { id: 'parent', label: '2. Parent / Guardian' },
              { id: 'previous', label: '3. Previous School & Address' },
              { id: 'documents', label: '4. Documents & Photo' }
            ].map((step) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setFormSection(step.id as any)}
                style={{
                  border: 'none',
                  background: formSection === step.id ? '#2563eb' : '#f1f5f9',
                  color: formSection === step.id ? '#ffffff' : '#64748b',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {step.label}
              </button>
            ))}
          </div>

          {/* Section 1: Student Information */}
          {formSection === 'student' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Candidate Full Name (as on Birth Certificate) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohail Shahzad"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div className="bca-form-row">
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Applying For Class *
                  </label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
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

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Gender *
                  </label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={newDob}
                  onChange={(e) => setNewDob(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
          )}

          {/* Section 2: Parent Information */}
          {formSection === 'parent' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Father / Guardian Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shahzad Aslam"
                  value={newParentName}
                  onChange={(e) => setNewParentName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div className="bca-form-row">
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Primary Mobile / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+92 300 5551234"
                    value={newParentPhone}
                    onChange={(e) => setNewParentPhone(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="parent@example.com"
                    value={newParentEmail}
                    onChange={(e) => setNewParentEmail(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Previous School & Address */}
          {formSection === 'previous' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="bca-form-row">
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Previous School Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lahore Grammar School"
                    value={newPrevSchool}
                    onChange={(e) => setNewPrevSchool(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Last Class Percentage / Grade
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 89.2% or Grade A"
                    value={newPrevPercentage}
                    onChange={(e) => setNewPrevPercentage(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Residential Permanent Address *
                </label>
                <textarea
                  rows={3}
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical' }}
                />
              </div>
            </div>
          )}

          {/* Section 4: Documents & Photo */}
          {formSection === 'documents' && (
            <div>
              <p style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '14px' }}>
                Upload soft copies of candidate certificates (Mock UI Upload):
              </p>
              <div
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: '30px',
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  cursor: 'pointer'
                }}
                onClick={() => showToast('Mock files attached: B-Form, Photos & Report Card', undefined, 'success')}
              >
                <Upload size={32} color="#2563eb" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontWeight: 700, color: '#1e293b' }}>Click to Browse or Drag Files Here</div>
                <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '4px' }}>
                  Supported formats: PDF, JPG, PNG (Max 10MB each)
                </div>
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};
