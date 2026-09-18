import React, { useState, useEffect } from 'react';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { AdmissionsPublicPage } from './pages/AdmissionsPublicPage';
import { TeachersPublicPage } from './pages/TeachersPublicPage';
import { GalleryPublicPage } from './pages/GalleryPublicPage';
import { EventsPublicPage } from './pages/EventsPublicPage';
import { BlogPublicPage } from './pages/BlogPublicPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';
import { CheckCircle, Upload, FileText, Paperclip, Trash2 } from 'lucide-react';
import { admissionsApi, academicsApi } from '../../services/api';

interface PublicWebsiteProps {
  onOpenAdmin: () => void;
}

interface UploadedDoc {
  docType: string;
  fileName: string;
  fileSize: string;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({ onOpenAdmin }) => {
  const { showToast } = useToast();
  const [activePage, setActivePage] = useState('home');
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  // Quick Apply Modal Form State
  const [applicantName, setApplicantName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dob, setDob] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [address, setAddress] = useState('');
  const [prevSchool, setPrevSchool] = useState('');
  const [prevPercentage, setPrevPercentage] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([
    'Birth Certificate (B-Form)',
    'Passport Sized Photographs'
  ]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedDoc[]>([]);
  const [notes, setNotes] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Grade 9');
  const [classesList, setClassesList] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const AVAILABLE_DOCUMENTS = [
    'Birth Certificate (B-Form)',
    'Past Academic Transcripts',
    'Father / Guardian CNIC Copy',
    'Passport Sized Photographs',
    'School Leaving Certificate (SLC)',
  ];

  const toggleDoc = (doc: string) => {
    setSelectedDocs((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]
    );
  };

  const handleDocFileUpload = (docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('File Too Large', 'Maximum file size allowed is 10MB', 'error');
      return;
    }

    const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    setUploadedFiles((prev) => {
      const filtered = prev.filter((f) => f.docType !== docType);
      return [...filtered, { docType, fileName: file.name, fileSize: sizeStr }];
    });

    if (!selectedDocs.includes(docType)) {
      setSelectedDocs((prev) => [...prev, docType]);
    }
    showToast('Document Attached', `${file.name} attached for ${docType}`, 'success');
  };

  const handleRemoveUploadedDoc = (docType: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.docType !== docType));
  };

  // Fetch classes dynamically from backend API (sorted sequence-wise)
  useEffect(() => {
    let isMounted = true;
    academicsApi.getClasses().then((res) => {
      if (isMounted && res?.data && res.data.length > 0) {
        const sorted = [...res.data].sort((a: any, b: any) => {
          const levelA = typeof a.numericLevel === 'number' ? a.numericLevel : 99;
          const levelB = typeof b.numericLevel === 'number' ? b.numericLevel : 99;
          return levelA - levelB;
        });
        setClassesList(sorted);
        setGradeLevel(sorted[0].id || sorted[0].name);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !guardianPhone.trim() || !guardianName.trim()) {
      showToast('Please fill all required fields', 'Scholar name, guardian name, and phone are required.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const finalDocuments = selectedDocs.map((docType) => {
        const attached = uploadedFiles.find((f) => f.docType === docType);
        if (attached) {
          return `${docType} [Attached: ${attached.fileName} (${attached.fileSize})]`;
        }
        return docType;
      });

      uploadedFiles.forEach((f) => {
        if (!selectedDocs.includes(f.docType)) {
          finalDocuments.push(`Additional Document: ${f.fileName} (${f.fileSize})`);
        }
      });

      const res = await admissionsApi.submitAdmission({
        studentName: applicantName.trim(),
        appliedClassId: gradeLevel,
        appliedClass: gradeLevel,
        gender: gender === 'Female' ? 'FEMALE' : 'MALE',
        dob: dob || undefined,
        parentName: guardianName.trim(),
        parentPhone: guardianPhone.trim(),
        parentEmail: guardianEmail.trim() || undefined,
        homeAddress: address.trim() || 'Sahiwal, Punjab',
        previousSchool: prevSchool.trim() || undefined,
        previousPercentage: prevPercentage ? parseFloat(prevPercentage.replace(/[^\d.]/g, '')) : undefined,
        documentsSubmitted: finalDocuments,
        adminNotes: notes.trim() || 'Registered via Website Apply for Admission Modal'
      });

      const appNo = res?.data?.applicationNo || 'NEW';
      showToast(
        'Admission Application Registered!',
        `Application #${appNo} for ${applicantName} submitted successfully to database. Our admissions team will contact ${guardianPhone}.`,
        'success'
      );
      setApplyModalOpen(false);
      setApplicantName('');
      setGender('Male');
      setDob('');
      setGuardianName('');
      setGuardianPhone('');
      setGuardianEmail('');
      setAddress('');
      setPrevSchool('');
      setPrevPercentage('');
      setNotes('');
      setSelectedDocs(['Birth Certificate (B-Form)', 'Passport Sized Photographs']);
      setUploadedFiles([]);
    } catch (err: any) {
      console.error('Admission submit error:', err);
      showToast('Submission Failed', err?.message || 'Could not connect to admissions server. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigate = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      {/* Sticky Header */}
      <PublicHeader
        activePage={activePage}
        setActivePage={handleNavigate}
        onOpenAdmin={onOpenAdmin}
        onOpenApply={() => setApplyModalOpen(true)}
      />

      {/* Main Page Body */}
      <main style={{ flex: 1 }}>
        {activePage === 'home' && <HomePage onNavigate={handleNavigate} onOpenApply={() => setApplyModalOpen(true)} />}
        {activePage === 'about' && <AboutPage />}
        {activePage === 'academics' && <AcademicsPage onOpenApply={() => setApplyModalOpen(true)} />}
        {activePage === 'admissions' && <AdmissionsPublicPage />}
        {activePage === 'teachers' && <TeachersPublicPage />}
        {activePage === 'gallery' && <GalleryPublicPage />}
        {activePage === 'events' && <EventsPublicPage />}
        {activePage === 'blog' && <BlogPublicPage />}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'login' && <LoginPage onNavigate={handleNavigate} onOpenAdmin={onOpenAdmin} />}
        {activePage === 'signup' && <SignUpPage onNavigate={handleNavigate} />}
      </main>

      {/* Global Footer */}
      <PublicFooter
        setActivePage={handleNavigate}
        onOpenAdmin={onOpenAdmin}
      />

      {/* Quick Apply Now Modal */}
      {applyModalOpen && (
        <Modal
          isOpen={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          title="Start Admission Application"
          subtitle="Academic Session 2026-2027 • Read Academy Sahiwal"
          maxWidth="760px"
          footer={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="submit" form="quickApplyForm" disabled={isSubmitting} className="bca-btn bca-btn-gold">
                  {isSubmitting ? 'Registering...' : 'Submit Application'}
                </button>
                <button type="button" disabled={isSubmitting} onClick={() => setApplyModalOpen(false)} className="bca-btn bca-btn-secondary">
                  Cancel
                </button>
              </div>
              <div style={{ textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setApplyModalOpen(false);
                    handleNavigate('admissions');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0B3974',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  Or explore Full Admissions Page & Fee Structure →
                </button>
              </div>
            </div>
          }
        >
          <form id="quickApplyForm" onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Section 1: Scholar Information */}
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0B3974', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                1. Candidate / Student Information
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zaid Khan"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600 }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                    Desired Class / Grade *
                  </label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600 }}
                  >
                    {classesList.length > 0 ? (
                      classesList.map((c: any) => (
                        <option key={c.id} value={c.id || c.name}>
                          {c.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Nursery">Nursery</option>
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 3">Grade 3</option>
                        <option value="Grade 4">Grade 4</option>
                        <option value="Grade 5">Grade 5</option>
                        <option value="Grade 6">Grade 6</option>
                        <option value="Grade 7">Grade 7</option>
                        <option value="Grade 8">Grade 8</option>
                        <option value="Grade 9 (Matric)">Grade 9 (Matric)</option>
                        <option value="Grade 10 (Matric)">Grade 10 (Matric)</option>
                        <option value="FSC Pre-Medical">FSC Pre-Medical</option>
                        <option value="FSC Pre-Engineering">FSC Pre-Engineering</option>
                        <option value="ICS">ICS</option>
                        <option value="I.Com">I.Com</option>
                        <option value="FA">FA</option>
                        <option value="D.Com">D.Com</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Parent / Guardian Information */}
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0B3974', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                2. Parent / Guardian Details
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                    Father / Guardian Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Farooq Khan"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                    Contact Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                    Contact Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="guardian@example.com"
                    value={guardianEmail}
                    onChange={(e) => setGuardianEmail(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 1' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                    Residential Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. House #12, Street 4, Farid Town, Sahiwal"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Previous Academic Record */}
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0B3974', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                3. Previous Academic Background
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                    Previous School Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sahiwal Public School"
                    value={prevSchool}
                    onChange={(e) => setPrevSchool(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                    Previous Record / Percentage (%)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 88.5% or Grade A"
                    value={prevPercentage}
                    onChange={(e) => setPrevPercentage(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Submitted Verification Documents & File Upload */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0B3974', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  4. Verification Documents & Soft Copies Upload
                </div>
                <span style={{ fontSize: '0.74rem', color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: '12px', fontWeight: 700, border: '1px solid #a7f3d0' }}>
                  Soft Copy Upload Supported (PDF, JPG, PNG)
                </span>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '0 0 12px 0' }}>
                Select available documents and attach files directly from your computer/mobile:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {AVAILABLE_DOCUMENTS.map((doc) => {
                  const isChecked = selectedDocs.includes(doc);
                  const attachedFile = uploadedFiles.find((f) => f.docType === doc);
                  const inputId = `quick-file-input-${doc.replace(/[^a-zA-Z0-9]/g, '-')}`;

                  return (
                    <div
                      key={doc}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        backgroundColor: attachedFile ? '#f0fdf4' : isChecked ? '#eff6ff' : '#ffffff',
                        border: attachedFile ? '1px solid #86efac' : isChecked ? '1px solid #3b82f6' : '1px solid #cbd5e1',
                        transition: 'all 0.15s ease',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}
                    >
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                          fontWeight: isChecked || attachedFile ? 700 : 500,
                          color: attachedFile ? '#166534' : isChecked ? '#1e40af' : '#334155',
                          flex: 1,
                          minWidth: '220px'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked || !!attachedFile}
                          onChange={() => toggleDoc(doc)}
                          style={{ accentColor: '#2563eb', cursor: 'pointer', width: '16px', height: '16px' }}
                        />
                        <span>{doc}</span>
                      </label>

                      {/* File attachment area */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {attachedFile && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff', padding: '4px 10px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                            <FileText size={14} color="#16a34a" />
                            <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#166534', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {attachedFile.fileName}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>({attachedFile.fileSize})</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveUploadedDoc(doc)}
                              style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                              title="Remove file"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}

                        <input
                          id={inputId}
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          style={{ display: 'none' }}
                          onChange={(e) => handleDocFileUpload(doc, e)}
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById(inputId)?.click()}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '5px 10px',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: attachedFile ? '1px solid #86efac' : '1px solid #cbd5e1',
                            background: attachedFile ? '#dcfce7' : '#f8fafc',
                            color: attachedFile ? '#15803d' : '#475569'
                          }}
                        >
                          <Paperclip size={13} />
                          {attachedFile ? 'Change File' : 'Upload File'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* General Multi-file Upload Box */}
              <div
                style={{
                  marginTop: '12px',
                  border: '1px dashed #94a3b8',
                  borderRadius: '10px',
                  padding: '12px',
                  textAlign: 'center',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer'
                }}
                onClick={() => document.getElementById('quick-general-files-input')?.click()}
              >
                <input
                  id="quick-general-files-input"
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      Array.from(e.target.files).forEach((file) => {
                        const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
                        setUploadedFiles((prev) => [
                          ...prev,
                          { docType: `Additional (${file.name})`, fileName: file.name, fileSize: sizeStr }
                        ]);
                      });
                      showToast('Additional Files Attached', `${e.target.files.length} extra file(s) attached.`, 'success');
                    }
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.78rem', color: '#2563eb', fontWeight: 700 }}>
                  <Upload size={16} />
                  <span>+ Or Click to Attach Any Other Certificates / Result Cards (PDF / JPG / PNG)</span>
                </div>
              </div>
            </div>

            {/* Section 5: Assessment Note / Remarks */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                Assessment Note / Special Remarks
              </label>
              <textarea
                rows={2}
                placeholder="Any special remarks, sports achievements, or queries for the admissions panel..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical' }}
              />
            </div>

            <div style={{ backgroundColor: '#e8f5e9', padding: '10px 14px', borderRadius: '8px', fontSize: '0.78rem', color: '#1b5e20', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <CheckCircle size={16} color="#4CAF50" style={{ flexShrink: 0 }} />
              <span>Direct live database submission. Official application number and dossier will be registered instantly.</span>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
