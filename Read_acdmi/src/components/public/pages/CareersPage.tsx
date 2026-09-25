import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Calendar,
  DollarSign,
  GraduationCap,
  MapPin,
  Users,
  Send,
  Upload,
  FileText,
  Sparkles,
  ChevronRight,
  AlertCircle,
  Building,
  Check,
  Award
} from 'lucide-react';
import { jobsApi } from '../../../services/api';
import { Modal } from '../../common/Modal';
import { useToast } from '../../common/Toast';
import { WhatsAppButton } from '../../common/WhatsAppButton';
import { SCHOOL_WHATSAPP_NUMBER } from '../../../utils/whatsapp';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  primarySubject?: string;
  jobType: string;
  qualification: string;
  experienceYears: number;
  salaryRange?: string;
  location: string;
  openings: number;
  description: string;
  requirements: string[];
  responsibilities: string[];
  deadline?: string;
  status: string;
  createdAt: string;
  _count?: { applications: number };
}

export const CareersPage: React.FC = () => {
  const { showToast } = useToast();

  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedJobType, setSelectedJobType] = useState('All');

  // Application Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dob, setDob] = useState('');
  const [highestDegree, setHighestDegree] = useState('');
  const [institute, setInstitute] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(2);
  const [currentOrg, setCurrentOrg] = useState('');
  const [currentSalary, setCurrentSalary] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('Immediate');
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFileName, setCvFileName] = useState('');
  const [cvDataUrl, setCvDataUrl] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobsApi.getJobs({ publicOnly: true });
      if (res?.data && Array.isArray(res.data)) {
        setJobs(res.data);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.warn('Could not fetch jobs:', err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const departments = ['All', 'Science & STEM', 'Mathematics', 'English & Humanities', 'Junior School', 'Administration'];

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.primarySubject && j.primarySubject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      j.qualification.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || j.department === selectedDept;
    const matchesType = selectedJobType === 'All' || j.jobType === selectedJobType;
    return matchesSearch && matchesDept && matchesType;
  });

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setGender('Male');
    setDob('');
    setHighestDegree('');
    setInstitute('');
    setExperienceYears(2);
    setCurrentOrg('');
    setCurrentSalary('');
    setExpectedSalary('');
    setNoticePeriod('Immediate');
    setCoverLetter('');
    setCvFileName('');
    setCvDataUrl('');
    setSelectedJob(null);
  };

  const handleOpenApply = (job?: JobPosting) => {
    setSelectedJob(job || null);
    if (job) {
      setHighestDegree(job.qualification || '');
      setExperienceYears(job.experienceYears || 2);
    }
    setApplyModalOpen(true);
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('File Too Large', 'Please upload a CV under 10MB', 'error');
        return;
      }
      setCvFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setCvDataUrl(reader.result as string);
        showToast('Resume Attached', `${file.name} ready for submission`, 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !highestDegree) {
      showToast('Validation Error', 'Full Name, Email, Phone, and Highest Degree are required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        jobId: selectedJob?.id || null,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        gender,
        dob: dob || null,
        highestDegree: highestDegree.trim(),
        institute: institute.trim() || null,
        experienceYears: Number(experienceYears || 0),
        currentOrg: currentOrg.trim() || null,
        currentSalary: currentSalary ? Number(currentSalary) : null,
        expectedSalary: expectedSalary ? Number(expectedSalary) : null,
        noticePeriod,
        coverLetter: coverLetter.trim() || null,
        cvFileName: cvFileName || null,
        cvDataUrl: cvDataUrl || null
      };

      const res = await jobsApi.applyForJob(payload);
      if (res?.data) {
        setApplyModalOpen(false);
        resetForm();
        showToast(
          'Application Submitted Successfully!',
          'Your faculty application has been submitted to Read Academy. Our HR administration will review it and contact you.',
          'success'
        );
      }
    } catch (err: any) {
      console.error('Job submission failed:', err);
      showToast('Submission Failed', err?.message || 'Could not submit application', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* 1. HERO BANNER */}
      <section
        style={{
          background: 'linear-gradient(135deg, #04142a 0%, #0B3974 100%)',
          color: '#ffffff',
          padding: '80px 24px 70px',
          textAlign: 'center',
          position: 'relative',
          borderBottom: '4px solid #E62929'
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 215, 0, 0.15)',
              border: '1px solid rgba(255, 215, 0, 0.4)',
              color: '#FFD700',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '16px'
            }}
          >
            <Sparkles size={14} /> Faculty & Staff Recruitment • 2026-2027
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: 900,
              margin: '0 0 16px',
              letterSpacing: '-0.02em',
              lineHeight: 1.15
            }}
          >
            Shape Future Leaders at <span style={{ color: '#FFD700' }}>Read Academy</span>
          </h1>

          <p style={{ fontSize: '1.08rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 28px' }}>
            We invite distinguished educators, passionate subject specialists, and visionary mentors to join
            Sahiwal’s premier academic institution. Experience merit-based growth, modern laboratories, and an inspiring teaching culture.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="#openings"
              className="bca-btn bca-btn-gold"
              style={{ padding: '12px 26px', fontSize: '0.92rem', textDecoration: 'none' }}
            >
              <Briefcase size={16} /> Explore Open Positions ({jobs.length})
            </a>
            <WhatsAppButton
              phone={SCHOOL_WHATSAPP_NUMBER}
              label="HR WhatsApp Helpline (0321-6909047)"
              message="Assalam-o-Alaikum! I want to inquire about faculty teaching vacancies at Read Academy Sahiwal."
              size="md"
            />
          </div>
        </div>
      </section>

      {/* 2. WHY TEACH AT READ ACADEMY */}
      <section style={{ maxWidth: '1240px', margin: '-30px auto 60px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {[
            {
              icon: Award,
              color: '#2563eb',
              bg: '#eff6ff',
              title: 'Competitive Compensation',
              desc: 'Market-leading basic pay scales, annual increments, and medical/provident allowances.'
            },
            {
              icon: Building,
              color: '#059669',
              bg: '#ecfdf5',
              title: 'Modern Teaching Labs',
              desc: 'State-of-the-art physics, chemistry, biology, and computer science practical labs.'
            },
            {
              icon: GraduationCap,
              color: '#7c3aed',
              bg: '#f5f3ff',
              title: 'Professional Mentorship',
              desc: 'Continuous teacher training workshops, board paper evaluation skills, and career progression.'
            },
            {
              icon: Users,
              color: '#ea580c',
              bg: '#fff7ed',
              title: 'Inspiring Culture',
              desc: 'Discipline-driven environment with highly motivated students from Nursery to Intermediate.'
            }
          ].map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  padding: '24px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: benefit.bg,
                    color: benefit.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={22} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  {benefit.title}
                </h3>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
                  {benefit.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CURRENT VACANCIES LIST */}
      <section id="openings" style={{ maxWidth: '1240px', margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
              Current Teaching & Staff Vacancies
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
              Apply online in minutes. Selected candidates will be invited for demonstration and interview.
            </p>
          </div>

          <button
            onClick={() => handleOpenApply()}
            className="bca-btn bca-btn-secondary"
            style={{ padding: '9px 18px', fontSize: '0.84rem' }}
          >
            <Send size={15} /> General Application (Any Subject)
          </button>
        </div>

        {/* Filter Toolbar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '16px 20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexWrap: 'wrap',
            marginBottom: '24px'
          }}
        >
          <div style={{ flex: '1 1 260px', position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by job title, subject, or qualification..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.88rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', flexWrap: 'wrap' }}>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '20px',
                  border: selectedDept === dept ? 'none' : '1px solid #cbd5e1',
                  backgroundColor: selectedDept === dept ? '#0B3974' : '#ffffff',
                  color: selectedDept === dept ? '#ffffff' : '#475569',
                  fontSize: '0.8rem',
                  fontWeight: selectedDept === dept ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Job Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 600 }}>Loading active openings from database...</div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '60px 20px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              color: '#64748b'
            }}
          >
            <Briefcase size={40} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ margin: '0 0 6px', color: '#0f172a' }}>No Openings Found</h3>
            <p style={{ margin: '0 0 20px', fontSize: '0.88rem' }}>
              No current vacancy matches your filter. You can still submit a general faculty application.
            </p>
            <button
              onClick={() => handleOpenApply()}
              className="bca-btn bca-btn-primary"
            >
              Submit General Teacher Application
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '22px' }}>
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  padding: '24px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
                }}
              >
                {/* Badges Row */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <span
                    style={{
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 9px',
                      borderRadius: '6px',
                      border: '1px solid #bfdbfe'
                    }}
                  >
                    {job.department}
                  </span>
                  <span
                    style={{
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '3px 9px',
                      borderRadius: '6px'
                    }}
                  >
                    {job.jobType}
                  </span>
                  {job.openings > 1 && (
                    <span
                      style={{
                        backgroundColor: '#fef3c7',
                        color: '#b45309',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: '6px'
                      }}
                    >
                      {job.openings} Vacancies
                    </span>
                  )}
                </div>

                {/* Job Title */}
                <h3 style={{ margin: '0 0 10px', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
                  {job.title}
                </h3>

                {/* Meta details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: '#475569', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <GraduationCap size={15} color="#2563eb" />
                    <span><strong>Required:</strong> {job.qualification}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <Clock size={15} color="#059669" />
                    <span><strong>Experience:</strong> {job.experienceYears}+ Years</span>
                  </div>
                  {job.salaryRange && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <DollarSign size={15} color="#d97706" />
                      <span><strong>Salary:</strong> {job.salaryRange}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <MapPin size={15} color="#dc2626" />
                    <span>{job.location}</span>
                  </div>
                </div>

                {/* Description snippet */}
                <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 16px', flex: 1 }}>
                  {job.description}
                </p>

                {/* Requirements highlights */}
                {job.requirements && job.requirements.length > 0 && (
                  <div style={{ marginBottom: '16px', backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Key Requirements:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {job.requirements.slice(0, 2).map((req, rIdx) => (
                        <li key={rIdx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Card Footer */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  {job.deadline ? (
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                      Apply by: <strong>{new Date(job.deadline).toLocaleDateString()}</strong>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>
                      Open Vacancy
                    </div>
                  )}

                  <button
                    onClick={() => handleOpenApply(job)}
                    className="bca-btn bca-btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                  >
                    <span>Apply Now</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. ONLINE TEACHER APPLICATION MODAL */}
      {applyModalOpen && (
        <Modal
          isOpen={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          title={
            selectedJob
              ? `Apply: ${selectedJob.title}`
              : 'Submit Faculty Application — Read Academy'
          }
          subtitle={
            selectedJob
              ? `${selectedJob.department} • Ref: ${selectedJob.id.slice(0, 8)}`
              : 'General Faculty & Staff Candidate Registration'
          }
          maxWidth="720px"
        >
          <form onSubmit={handleSubmitApplication} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {selectedJob && (
                <div
                  style={{
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    color: '#1e40af'
                  }}
                >
                  <strong>Applying For:</strong> {selectedJob.title} ({selectedJob.department}) • Min Experience: {selectedJob.experienceYears} Years
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                {/* Full Name */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Kashif Raza"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Email Address <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="kashif.raza@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Phone / WhatsApp Number <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Highest Degree */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Highest Academic Degree <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. M.Sc Physics / M.Phil"
                    value={highestDegree}
                    onChange={(e) => setHighestDegree(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Institute */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    University / Institute
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BZU Multan / Punjab University"
                    value={institute}
                    onChange={(e) => setInstitute(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Experience in Years */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Teaching Experience (Years)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Current Organization */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Current / Previous School / College
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DPS Sahiwal / Army Public"
                    value={currentOrg}
                    onChange={(e) => setCurrentOrg(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Current Salary */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Current Monthly Salary (PKR)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={currentSalary}
                    onChange={(e) => setCurrentSalary(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Expected Salary */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Expected Monthly Salary (PKR)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 70000"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Notice Period */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Joining Availability / Notice Period
                  </label>
                  <select
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  >
                    <option value="Immediate">Immediate Joining</option>
                    <option value="15 Days">Within 15 Days</option>
                    <option value="1 Month">1 Month Notice Period</option>
                  </select>
                </div>

                {/* CV / Resume Upload */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Upload Resume / CV (PDF / DOC / Image)
                  </label>
                  <div
                    style={{
                      border: '2px dashed #cbd5e1',
                      borderRadius: '10px',
                      padding: '16px',
                      textAlign: 'center',
                      backgroundColor: '#f8fafc',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,image/*"
                      onChange={handleCvUpload}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0,
                        cursor: 'pointer',
                        width: '100%',
                        height: '100%'
                      }}
                    />
                    <Upload size={22} color="#0B3974" style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b' }}>
                      {cvFileName ? cvFileName : 'Click to Upload Curriculum Vitae (CV)'}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      Max file size: 10MB • PDF, DOCX, or JPG format
                    </div>
                  </div>
                </div>

                {/* Cover Letter */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Brief Statement / Teaching Philosophy
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Share your teaching style, board exam results track record, or why you want to join Read Academy..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  disabled={isSubmitting}
                  className="bca-btn bca-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bca-btn bca-btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <Send size={15} />
                  <span>{isSubmitting ? 'Submitting Application...' : 'Submit Application'}</span>
                </button>
              </div>
            </form>
        </Modal>
      )}
    </div>
  );
};
