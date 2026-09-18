import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Download,
  Send,
  Upload,
  FileText,
  Paperclip,
  Trash2
} from 'lucide-react';
import { useToast } from '../../common/Toast';
import { admissionsApi, academicsApi } from '../../../services/api';

interface UploadedDoc {
  docType: string;
  fileName: string;
  fileSize: string;
}

export const AdmissionsPublicPage: React.FC = () => {
  const { showToast } = useToast();

  // Inquiry form
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [childName, setChildName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dob, setDob] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [targetGrade, setTargetGrade] = useState('Grade 9');
  const [prevSchool, setPrevSchool] = useState('');
  const [prevPercentage, setPrevPercentage] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([
    'Birth Certificate (B-Form)',
    'Passport Sized Photographs'
  ]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedDoc[]>([]);
  const [message, setMessage] = useState('');
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
        setTargetGrade(sorted[0].id || sorted[0].name);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !parentPhone.trim() || !childName.trim()) {
      showToast('Please provide parent name, phone, and candidate name', undefined, 'error');
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
        studentName: childName.trim(),
        appliedClassId: targetGrade,
        appliedClass: targetGrade,
        gender: gender === 'Female' ? 'FEMALE' : 'MALE',
        dob: dob || undefined,
        parentName: parentName.trim(),
        parentPhone: parentPhone.trim(),
        parentEmail: parentEmail.trim() || undefined,
        homeAddress: homeAddress.trim() || 'Sahiwal City',
        previousSchool: prevSchool.trim() || undefined,
        previousPercentage: prevPercentage ? parseFloat(prevPercentage.replace(/[^\d.]/g, '')) : undefined,
        documentsSubmitted: finalDocuments,
        adminNotes: message.trim() || undefined,
      });

      showToast(
        'Admission Application Registered Successfully',
        `Your application no is ${res.data?.applicationNo || 'NEW'}. Registered to database dossier. Our Admissions Registrar will contact you at ${parentPhone}.`,
        'success'
      );
      setParentName('');
      setParentEmail('');
      setParentPhone('');
      setChildName('');
      setGender('Male');
      setDob('');
      setHomeAddress('');
      setPrevPercentage('');
      setMessage('');
      setPrevSchool('');
      setSelectedDocs(['Birth Certificate (B-Form)', 'Passport Sized Photographs']);
      setUploadedFiles([]);
    } catch (err: any) {
      showToast('Submission Failed', err?.message || 'Please verify form fields and server connection', 'error');
    } finally {
      setIsSubmitting(false);
    }
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
            Admissions Open 2026-2027 • Nursery to Matriculation, FA, FSC, ICS, I.Com & D.Com
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, margin: '8px 0 16px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Begin Your Journey at Read Academy Sahiwal
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            We welcome motivated students from Nursery to Matriculation, FA, FSC, ICS, I.Com & D.Com who demonstrate intellectual curiosity, a strong work ethic, and an eagerness to lead.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={() => showToast('Admission Information Brochure Downloaded (PDF)', undefined, 'info')}
              className="bca-btn bca-btn-gold"
              style={{ padding: '10px 22px' }}
            >
              <Download size={16} /> Download Admission Prospectus
            </button>
          </div>
        </div>
      </section>

      {/* 5-Step Admission Flow */}
      <section style={{ padding: '70px 24px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0B3974', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Seamless Enrolment Protocol
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '6px 0 0 0' }}>
              5-Step Admission Journey
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
              { step: '01', title: 'Submit Inquiry', desc: 'Complete the online application form or visit our admissions office in person.' },
              { step: '02', title: 'Entrance Assessment', desc: 'Age-appropriate written evaluation in English, Mathematics, and General Science.' },
              { step: '03', title: 'Parent & Child Interview', desc: 'Warm interactive discussion with the Principal or Wing Head to align expectations.' },
              { step: '04', title: 'Offer Letter', desc: 'Formal admission offer issued with fee voucher and documentation checklist.' },
              { step: '05', title: 'Orientation & Induction', desc: 'Welcome session, campus tour, uniform fitting, and academic kit handover.' }
            ].map((s, idx) => (
              <div
                key={idx}
                className="bca-card"
                style={{ padding: '24px', position: 'relative', borderTop: '4px solid #E62929' }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#feecec',
                    color: '#E62929',
                    border: '1px solid #fecaca',
                    fontSize: '1.1rem',
                    fontWeight: 900,
                    marginBottom: '12px'
                  }}
                >
                  Step {s.step}
                </div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Split Section: Fee Structure & Eligibility vs Online Inquiry Form */}
      <section style={{ padding: '80px 24px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
          {/* Left Column: Fee Schedule & Required Docs */}
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0 0 18px 0' }}>
              Tuition Fee Structure (2026-2027)
            </h2>
            <div className="bca-table-wrapper" style={{ marginBottom: '28px' }}>
              <table className="bca-table" style={{ fontSize: '0.84rem' }}>
                <thead>
                  <tr>
                    <th>Academic Wing</th>
                    <th>Monthly Tuition</th>
                    <th>One-Time Admission</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>College Wing (FA, FSC, ICS, I.Com & D.Com)</strong></td>
                    <td><strong style={{ color: '#0B3974' }}>Rs. 18,000</strong></td>
                    <td>Rs. 35,000</td>
                  </tr>
                  <tr>
                    <td><strong>Senior Wing (Matriculation - Grades 9 & 10)</strong></td>
                    <td><strong style={{ color: '#0B3974' }}>Rs. 16,000</strong></td>
                    <td>Rs. 30,000</td>
                  </tr>
                  <tr>
                    <td><strong>Middle Wing (Grades 6-8)</strong></td>
                    <td><strong style={{ color: '#0B3974' }}>Rs. 14,500</strong></td>
                    <td>Rs. 28,000</td>
                  </tr>
                  <tr>
                    <td><strong>Primary Wing (Grades 1-5)</strong></td>
                    <td><strong style={{ color: '#0B3974' }}>Rs. 12,000</strong></td>
                    <td>Rs. 25,000</td>
                  </tr>
                  <tr>
                    <td><strong>Early Years (Nursery & KG)</strong></td>
                    <td><strong style={{ color: '#0B3974' }}>Rs. 10,500</strong></td>
                    <td>Rs. 20,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ background: '#eef5fc', padding: '16px', borderRadius: '10px', border: '1px solid #bfdbfe', marginBottom: '28px' }}>
              <div style={{ fontWeight: 800, color: '#0B3974', fontSize: '0.88rem', marginBottom: '4px' }}>
                ✨ Sibling Concession & Merit Scholarships
              </div>
              <p style={{ fontSize: '0.8rem', color: '#061d3d', margin: 0, lineHeight: 1.5 }}>
                A 15% tuition concession is granted for the second sibling, and 25% for the third. Full merit scholarships are awarded to students scoring above 92% in previous board examinations.
              </p>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 14px 0' }}>
              Mandatory Registration Documents:
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: '#334155' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={15} color="#4CAF50" /> Child’s Original NADRA Birth Certificate / Form-B copy
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={15} color="#10b981" /> 4 recent passport-sized blue background photographs
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={15} color="#10b981" /> Previous School Leaving Certificate (SLC) & Transcripts
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={15} color="#10b981" /> Valid CNIC / Passport copies of both parents or guardians
              </li>
            </ul>
          </div>

          {/* Right Column: Online Inquiry Form */}
          <div className="bca-card" style={{ padding: '36px', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
              Online Admission Inquiry
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 24px 0' }}>
              Submit your preliminary details to schedule an assessment date and prospectus pickup.
            </p>

            <form onSubmit={handleSubmitInquiry} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* 1. Candidate Details */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0B3974', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  1. Candidate / Student Information
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                      Prospective Student Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hamza Tariq"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                      Gender *
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600 }}
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
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                      Target Grade / Class *
                    </label>
                    <select
                      value={targetGrade}
                      onChange={(e) => setTargetGrade(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600 }}
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

              {/* 2. Parent / Guardian Details */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0B3974', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  2. Parent / Guardian Details
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                      Parent / Guardian Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Mehmood"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                      Mobile Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 1234567"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="parent@example.com"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                      Residential Permanent Address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. House #14, Farid Town, Sahiwal"
                      value={homeAddress}
                      onChange={(e) => setHomeAddress(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>
              </div>

              {/* 3. Previous Academic Record */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0B3974', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  3. Previous Academic Background
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                      Current / Previous School Attended
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Islamabad Grammar School"
                      value={prevSchool}
                      onChange={(e) => setPrevSchool(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
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
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>
              </div>

              {/* 4. Verification Documents & Soft Copies Upload */}
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
                  Select available documents and attach files directly from your device:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {AVAILABLE_DOCUMENTS.map((doc) => {
                    const isChecked = selectedDocs.includes(doc);
                    const attachedFile = uploadedFiles.find((f) => f.docType === doc);
                    const inputId = `public-file-input-${doc.replace(/[^a-zA-Z0-9]/g, '-')}`;

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
                  onClick={() => document.getElementById('public-general-files-input')?.click()}
                >
                  <input
                    id="public-general-files-input"
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

              {/* 5. Additional Notes or Questions */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                  Additional Notes or Questions
                </label>
                <textarea
                  rows={3}
                  placeholder="Share any special interests, sports achievements, or queries..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bca-btn bca-btn-gold"
                style={{ padding: '12px', justifyContent: 'center', fontSize: '0.95rem', marginTop: '6px' }}
              >
                <Send size={16} />
                <span>{isSubmitting ? 'Registering to Database...' : 'Submit Admission Application'}</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
