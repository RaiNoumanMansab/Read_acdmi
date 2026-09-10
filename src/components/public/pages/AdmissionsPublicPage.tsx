import React, { useState } from 'react';
import {
  CheckCircle,
  Download,
  Send
} from 'lucide-react';
import { useToast } from '../../common/Toast';

export const AdmissionsPublicPage: React.FC = () => {
  const { showToast } = useToast();

  // Inquiry form
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [childName, setChildName] = useState('');
  const [targetGrade, setTargetGrade] = useState('Grade 9');
  const [prevSchool, setPrevSchool] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName || !parentPhone || !childName) {
      showToast('Please provide parent name, phone, and child name', undefined, 'error');
      return;
    }
    showToast(
      'Admission Inquiry Submitted Successfully',
      `Our Admissions Registrar will contact you at ${parentPhone} within 24 business hours.`,
      'success'
    );
    setParentName('');
    setParentEmail('');
    setParentPhone('');
    setChildName('');
    setMessage('');
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
          borderBottom: '4px solid #FFD700'
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Admissions Open 2026-2027 • Read To Lead
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, margin: '8px 0 16px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Begin Your Journey at Read Academy Sahiwal
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            We welcome motivated students who demonstrate intellectual curiosity, a strong work ethic, and an eagerness to contribute to our vibrant campus community.
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

      {/* Step-by-Step Admission Process */}
      <section style={{ padding: '80px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 52px auto' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.12em', textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
              Simple & Transparent
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
                    <td><strong>Senior Wing (Grades 9-12)</strong></td>
                    <td><strong style={{ color: '#0B3974' }}>Rs. 18,000</strong></td>
                    <td>Rs. 35,000</td>
                  </tr>
                  <tr>
                    <td><strong>Middle Wing (Grades 6-8)</strong></td>
                    <td><strong style={{ color: '#0B3974' }}>Rs. 14,500</strong></td>
                    <td>Rs. 30,000</td>
                  </tr>
                  <tr>
                    <td><strong>Primary Wing (Grades 1-5)</strong></td>
                    <td><strong style={{ color: '#0B3974' }}>Rs. 12,000</strong></td>
                    <td>Rs. 25,000</td>
                  </tr>
                  <tr>
                    <td><strong>Early Years (KG/Nursery)</strong></td>
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

            <form onSubmit={handleSubmitInquiry} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Parent / Guardian Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div className="bca-form-row">
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="parent@example.com"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    Mobile Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div className="bca-form-row">
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    Prospective Student Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hamza Tariq"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    Target Grade / Class *
                  </label>
                  <select
                    value={targetGrade}
                    onChange={(e) => setTargetGrade(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="Early Years">Early Years (Playgroup / KG)</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9 (SSC-I Matric)</option>
                    <option value="Grade 10">Grade 10 (SSC-II Matric)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Current / Previous School Attended
                </label>
                <input
                  type="text"
                  placeholder="e.g. Islamabad Grammar School"
                  value={prevSchool}
                  onChange={(e) => setPrevSchool(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
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
                className="bca-btn bca-btn-gold"
                style={{ padding: '12px', justifyContent: 'center', fontSize: '0.95rem', marginTop: '6px' }}
              >
                <Send size={16} />
                <span>Submit Admission Inquiry</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
