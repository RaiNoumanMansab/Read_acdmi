import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Users,
  CheckCircle,
  Clock,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  Check,
  X,
  FileText,
  UserCheck,
  Send,
  AlertCircle,
  GraduationCap,
  Download,
  Building,
  DollarSign
} from 'lucide-react';
import { jobsApi } from '../../services/api';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';
import { WhatsAppButton } from '../common/WhatsAppButton';

export const CareersView: React.FC = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [jobSearch, setJobSearch] = useState('');
  const [appSearch, setAppSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [jobFilter, setJobFilter] = useState('All');

  // Job Modal state (Create / Edit)
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDepartment, setJobDepartment] = useState('Science & STEM');
  const [jobSubject, setJobSubject] = useState('');
  const [jobType, setJobType] = useState('Full Time');
  const [jobQualification, setJobQualification] = useState('');
  const [jobExperience, setJobExperience] = useState<number>(2);
  const [jobSalaryRange, setJobSalaryRange] = useState('');
  const [jobOpenings, setJobOpenings] = useState<number>(1);
  const [jobLocation, setJobLocation] = useState('Main Campus, Sahiwal');
  const [jobDeadline, setJobDeadline] = useState('');
  const [jobStatus, setJobStatus] = useState('OPEN');
  const [jobDescription, setJobDescription] = useState('');
  const [jobRequirementsText, setJobRequirementsText] = useState('');
  const [jobResponsibilitiesText, setJobResponsibilitiesText] = useState('');
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);

  // Application Review Modal state
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [reviewStatus, setReviewStatus] = useState('PENDING');
  const [interviewDate, setInterviewDate] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [enrollAsTeacher, setEnrollAsTeacher] = useState(false);
  const [basicSalary, setBasicSalary] = useState<number>(65000);
  const [isUpdatingApp, setIsUpdatingApp] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        jobsApi.getJobs(),
        jobsApi.getApplications()
      ]);
      if (jobsRes?.data && Array.isArray(jobsRes.data)) {
        setJobs(jobsRes.data);
      }
      if (appsRes?.data && Array.isArray(appsRes.data)) {
        setApplications(appsRes.data);
      }
    } catch (err) {
      console.warn('Failed to load career data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open Create Job Modal
  const handleOpenCreateJob = () => {
    setEditingJob(null);
    setJobTitle('');
    setJobDepartment('Science & STEM');
    setJobSubject('');
    setJobType('Full Time');
    setJobQualification('M.Sc / BS (16 Years Education)');
    setJobExperience(2);
    setJobSalaryRange('Rs. 55,000 - 80,000 / month');
    setJobOpenings(1);
    setJobLocation('Main Campus, Sahiwal');
    setJobDeadline(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setJobStatus('OPEN');
    setJobDescription('');
    setJobRequirementsText('M.Sc / BS in relevant field from HEC recognized university.\nMinimum 2 years teaching experience in Matric / F.Sc.\nStrong class management and communication skills.');
    setJobResponsibilitiesText('Deliver daily lectures and practical demonstrations.\nPrepare quizzes, term assessments, and board preparatory papers.\nMaintain regular parent communications.');
    setShowJobModal(true);
  };

  // Open Edit Job Modal
  const handleOpenEditJob = (job: any) => {
    setEditingJob(job);
    setJobTitle(job.title || '');
    setJobDepartment(job.department || 'Science & STEM');
    setJobSubject(job.primarySubject || '');
    setJobType(job.jobType || 'Full Time');
    setJobQualification(job.qualification || '');
    setJobExperience(job.experienceYears || 2);
    setJobSalaryRange(job.salaryRange || '');
    setJobOpenings(job.openings || 1);
    setJobLocation(job.location || 'Main Campus, Sahiwal');
    setJobDeadline(job.deadline ? job.deadline.split('T')[0] : '');
    setJobStatus(job.status || 'OPEN');
    setJobDescription(job.description || '');
    setJobRequirementsText(Array.isArray(job.requirements) ? job.requirements.join('\n') : '');
    setJobResponsibilitiesText(Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : '');
    setShowJobModal(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobDepartment || !jobQualification || !jobDescription) {
      showToast('Validation Error', 'Please fill required fields (Title, Dept, Qualification, Description)', 'error');
      return;
    }

    setIsSubmittingJob(true);
    try {
      const requirements = jobRequirementsText
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);
      const responsibilities = jobResponsibilitiesText
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);

      const payload = {
        title: jobTitle.trim(),
        department: jobDepartment.trim(),
        primarySubject: jobSubject.trim() || null,
        jobType,
        qualification: jobQualification.trim(),
        experienceYears: Number(jobExperience),
        salaryRange: jobSalaryRange.trim() || null,
        location: jobLocation.trim(),
        openings: Number(jobOpenings),
        deadline: jobDeadline || null,
        status: jobStatus,
        description: jobDescription.trim(),
        requirements,
        responsibilities
      };

      if (editingJob) {
        await jobsApi.updateJob(editingJob.id, payload);
        showToast('Job Posting Updated', `Updated opening "${jobTitle}"`, 'success');
      } else {
        await jobsApi.createJob(payload);
        showToast('Job Opening Published', `New position "${jobTitle}" is now live on Careers page`, 'success');
      }
      setShowJobModal(false);
      fetchData();
    } catch (err: any) {
      console.error('Failed to save job:', err);
      showToast('Error', err?.message || 'Could not save job opening', 'error');
    } finally {
      setIsSubmittingJob(false);
    }
  };

  const handleDeleteJob = async (job: any) => {
    if (!window.confirm(`Are you sure you want to delete job posting "${job.title}"?`)) return;
    try {
      await jobsApi.deleteJob(job.id);
      showToast('Job Posting Deleted', undefined, 'info');
      fetchData();
    } catch (err: any) {
      showToast('Delete Failed', err?.message || 'Could not delete job', 'error');
    }
  };

  const handleToggleJobStatus = async (job: any) => {
    const nextStatus = job.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      await jobsApi.updateJob(job.id, { status: nextStatus });
      showToast(`Vacancy ${nextStatus === 'OPEN' ? 'Opened' : 'Closed'}`, `Position is now ${nextStatus}`, 'success');
      fetchData();
    } catch (err: any) {
      showToast('Status Update Failed', err?.message, 'error');
    }
  };

  // Open Application Review Modal
  const handleOpenReviewApp = (app: any) => {
    setSelectedApp(app);
    setReviewStatus(app.status || 'PENDING');
    setInterviewDate(app.interviewDate ? app.interviewDate.split('T')[0] : '');
    setAdminNotes(app.adminNotes || '');
    setEnrollAsTeacher(app.status === 'HIRED');
    setBasicSalary(Number(app.expectedSalary || 65000));
  };

  const handleUpdateAppStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setIsUpdatingApp(true);
    try {
      const res = await jobsApi.updateApplicationStatus(selectedApp.id, {
        status: reviewStatus,
        interviewDate: interviewDate || undefined,
        adminNotes: adminNotes.trim() || undefined,
        enrollAsTeacher: reviewStatus === 'HIRED' ? enrollAsTeacher : false,
        basicSalary: Number(basicSalary)
      });

      if (res?.data?.createdTeacher) {
        showToast(
          'Candidate Hired & Teacher Enrolled!',
          `Created official teacher profile ${res.data.createdTeacher.empId} for ${selectedApp.fullName} in database.`,
          'success'
        );
      } else {
        showToast(
          'Application Status Updated',
          `Candidate marked as ${reviewStatus}`,
          'success'
        );
      }
      setSelectedApp(null);
      fetchData();
    } catch (err: any) {
      console.error('Failed to update application status:', err);
      showToast('Update Failed', err?.message || 'Could not update candidate status', 'error');
    } finally {
      setIsUpdatingApp(false);
    }
  };

  const handleDeleteApp = async (app: any) => {
    if (!window.confirm(`Delete application for ${app.fullName}?`)) return;
    try {
      await jobsApi.deleteApplication(app.id);
      showToast('Application Deleted', undefined, 'info');
      fetchData();
    } catch (err: any) {
      showToast('Delete Failed', err?.message, 'error');
    }
  };

  // Filtered lists
  const filteredJobs = jobs.filter((j) =>
    j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
    j.department.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const filteredApps = applications.filter((a) => {
    const matchesQuery =
      a.fullName.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.email.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.phone.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.applicationNo.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.highestDegree.toLowerCase().includes(appSearch.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchesJob = jobFilter === 'All' || a.jobId === jobFilter;
    return matchesQuery && matchesStatus && matchesJob;
  });

  const totalOpenings = jobs.reduce((acc, j) => acc + (j.openings || 1), 0);
  const totalApps = applications.length;
  const shortlistedCount = applications.filter((a) => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED').length;
  const hiredCount = applications.filter((a) => a.status === 'HIRED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* 1. Header Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Careers & Faculty Recruitment
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Publish teaching vacancies, review online teacher applications, and onboard faculty members
          </p>
        </div>

        <button
          onClick={handleOpenCreateJob}
          className="bca-btn bca-btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} />
          <span>Post New Vacancy</span>
        </button>
      </div>

      {/* 2. KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="bca-card" style={{ padding: '20px', borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2563eb' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>ACTIVE VACANCIES</span>
            <Briefcase size={18} />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#0f172a', margin: '6px 0 2px' }}>
            {jobs.filter((j) => j.status === 'OPEN').length} Open ({totalOpenings} Seats)
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Live on public Careers page</span>
        </div>

        <div className="bca-card" style={{ padding: '20px', borderLeft: '4px solid #0B3974' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0B3974' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>CANDIDATE APPLICATIONS</span>
            <Users size={18} />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#0B3974', margin: '6px 0 2px' }}>
            {totalApps} Total
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Received from online portal</span>
        </div>

        <div className="bca-card" style={{ padding: '20px', borderLeft: '4px solid #d97706' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d97706' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>SHORTLISTED / INTERVIEWS</span>
            <Clock size={18} />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#d97706', margin: '6px 0 2px' }}>
            {shortlistedCount} Candidates
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Scheduled for demonstration</span>
        </div>

        <div className="bca-card" style={{ padding: '20px', borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>HIRED FACULTY</span>
            <CheckCircle size={18} />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#059669', margin: '6px 0 2px' }}>
            {hiredCount} Teachers
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Enrolled into system</span>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '2px' }}>
        <button
          onClick={() => setActiveTab('jobs')}
          style={{
            padding: '10px 18px',
            fontSize: '0.88rem',
            fontWeight: 700,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: activeTab === 'jobs' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'jobs' ? '3px solid #2563eb' : '3px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Briefcase size={16} /> Job Openings ({jobs.length})
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          style={{
            padding: '10px 18px',
            fontSize: '0.88rem',
            fontWeight: 700,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: activeTab === 'applications' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'applications' ? '3px solid #2563eb' : '3px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Users size={16} /> Candidate Applications ({applications.length})
        </button>
      </div>

      {/* TAB 1: JOB OPENINGS LIST */}
      {activeTab === 'jobs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ width: '100%', maxWidth: '320px', position: 'relative' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search job title, department..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Showing {filteredJobs.length} of {jobs.length} postings
            </div>
          </div>

          <div className="bca-table-wrapper">
            <table className="bca-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Department & Subject</th>
                  <th>Type</th>
                  <th>Required Qualification</th>
                  <th>Exp</th>
                  <th>Applicants</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                      {loading ? 'Loading job postings from database...' : 'No job openings found. Click "+ Post New Vacancy" above to add one.'}
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((j) => (
                    <tr key={j.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{j.title}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{j.openings} Opening(s) • {j.salaryRange || 'Competitive'}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{j.department}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{j.primarySubject || 'General'}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.78rem', color: '#475569', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                          {j.jobType}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.82rem' }}>{j.qualification}</span>
                      </td>
                      <td>{j.experienceYears}+ Yrs</td>
                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#2563eb',
                            backgroundColor: '#eff6ff',
                            padding: '2px 8px',
                            borderRadius: '10px'
                          }}
                        >
                          {j._count?.applications || 0}
                        </span>
                      </td>
                      <td>{j.deadline ? new Date(j.deadline).toLocaleDateString() : 'Rolling'}</td>
                      <td>
                        <span
                          className={`bca-badge ${j.status === 'OPEN' ? 'bca-badge-paid' : 'bca-badge-overdue'}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleToggleJobStatus(j)}
                          title="Click to toggle OPEN / CLOSED"
                        >
                          {j.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => handleOpenEditJob(j)}
                            className="bca-btn bca-btn-secondary"
                            style={{ padding: '5px 8px', color: '#2563eb' }}
                            title="Edit Job Posting"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(j)}
                            className="bca-btn bca-btn-secondary"
                            style={{ padding: '5px 8px', color: '#e11d48' }}
                            title="Delete Job"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CANDIDATE APPLICATIONS */}
      {activeTab === 'applications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Filters Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ width: '100%', maxWidth: '280px', position: 'relative' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search candidate, degree, phone..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Position:</span>
              <select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
              >
                <option value="All">All Job Positions</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
              >
                <option value="All">All Statuses</option>
                <option value="PENDING">Pending Review</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                <option value="HIRED">Hired</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          <div className="bca-table-wrapper">
            <table className="bca-table">
              <thead>
                <tr>
                  <th>Application Ref</th>
                  <th>Candidate Name</th>
                  <th>Applied Position</th>
                  <th>Qualification & Exp</th>
                  <th>Contact Details</th>
                  <th>Expected Pay</th>
                  <th>CV / Resume</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                      {loading ? 'Loading applications from database...' : 'No teacher applications found for this filter.'}
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0B3974' }}>
                          {a.applicationNo}
                        </span>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                          {new Date(a.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{a.fullName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{a.gender} • {a.currentOrg || 'Freelance'}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>
                          {a.job?.title || 'General Faculty Candidate'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{a.job?.department || 'Academic'}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#334155' }}>{a.highestDegree}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{a.experienceYears} Yrs Exp • {a.institute || 'University'}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.82rem' }}>{a.phone}</span>
                          <WhatsAppButton
                            phone={a.phone}
                            compact
                            size="xs"
                            message={`Assalam-o-Alaikum ${a.fullName}! This is Read Academy Sahiwal regarding your teacher application (${a.applicationNo}) for ${a.job?.title || 'Faculty'}.`}
                            title="Chat with Candidate on WhatsApp"
                          />
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{a.email}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>
                          Exp: {a.expectedSalary ? `Rs. ${Number(a.expectedSalary).toLocaleString()}` : 'Negotiable'}
                        </div>
                        {a.currentSalary && (
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            Cur: Rs. {Number(a.currentSalary).toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td>
                        {a.cvDataUrl ? (
                          <a
                            href={a.cvDataUrl}
                            download={a.cvFileName || `${a.fullName}_CV.pdf`}
                            className="bca-btn bca-btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                          >
                            <Download size={12} />
                            <span>CV</span>
                          </a>
                        ) : a.cvFileName ? (
                          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{a.cvFileName}</span>
                        ) : (
                          <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontStyle: 'italic' }}>None</span>
                        )}
                      </td>
                      <td>
                        <span
                          className={`bca-badge ${
                            a.status === 'HIRED'
                              ? 'bca-badge-paid'
                              : a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED'
                              ? 'bca-badge-primary'
                              : a.status === 'REJECTED'
                              ? 'bca-badge-overdue'
                              : 'bca-badge-pending'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => handleOpenReviewApp(a)}
                            className="bca-btn bca-btn-secondary"
                            style={{ padding: '5px 8px', color: '#2563eb' }}
                            title="Review Dossier & Set Status"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteApp(a)}
                            className="bca-btn bca-btn-secondary"
                            style={{ padding: '5px 8px', color: '#e11d48' }}
                            title="Delete Application"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. POST / EDIT JOB MODAL */}
      {showJobModal && (
        <Modal
          isOpen={showJobModal}
          onClose={() => setShowJobModal(false)}
          title={editingJob ? 'Edit Job Opening' : 'Post New Teaching Vacancy'}
          subtitle="Position details will be immediately visible on public Careers page"
          maxWidth="700px"
        >
          <form onSubmit={handleSaveJob} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Position Title <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Physics Lecturer (Matric & F.Sc)"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Department <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={jobDepartment}
                  onChange={(e) => setJobDepartment(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                >
                  <option value="Science & STEM">Science & STEM</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English & Humanities">English & Humanities</option>
                  <option value="Junior School">Junior School</option>
                  <option value="Commerce & Accounting">Commerce & Accounting</option>
                  <option value="Administration">Administration</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Primary Subject Specialization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Physics / Mathematics"
                  value={jobSubject}
                  onChange={(e) => setJobSubject(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Job Type
                </label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Visiting Lecturer">Visiting Lecturer</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Required Qualification <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M.Sc / BS Physics (16 Years)"
                  value={jobQualification}
                  onChange={(e) => setJobQualification(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Min Experience (Years)
                </label>
                <input
                  type="number"
                  min={0}
                  value={jobExperience}
                  onChange={(e) => setJobExperience(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Salary Range (PKR)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rs. 60,000 - 85,000 / month"
                  value={jobSalaryRange}
                  onChange={(e) => setJobSalaryRange(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Number of Openings
                </label>
                <input
                  type="number"
                  min={1}
                  value={jobOpenings}
                  onChange={(e) => setJobOpenings(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Application Deadline
                </label>
                <input
                  type="date"
                  value={jobDeadline}
                  onChange={(e) => setJobDeadline(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Vacancy Status
                </label>
                <select
                  value={jobStatus}
                  onChange={(e) => setJobStatus(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                >
                  <option value="OPEN">OPEN (Accepting Applications)</option>
                  <option value="CLOSED">CLOSED (Archived)</option>
                </select>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Job Overview & Description <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the teaching role, key classes, and subject responsibilities..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Key Requirements (One item per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Master degree in relevant discipline\nMinimum 2 years experience in BISE Sahiwal curriculum\nGood communication skills"
                  value={jobRequirementsText}
                  onChange={(e) => setJobRequirementsText(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Core Responsibilities (One item per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Conduct daily lectures and demonstrations\nEvaluate weekly test results and board papers"
                  value={jobResponsibilitiesText}
                  onChange={(e) => setJobResponsibilitiesText(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setShowJobModal(false)}
                className="bca-btn bca-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingJob}
                className="bca-btn bca-btn-primary"
              >
                {isSubmittingJob ? 'Saving...' : editingJob ? 'Update Position' : 'Publish Job'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 5. REVIEW APPLICATION MODAL */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Candidate Dossier — ${selectedApp.fullName}`}
          subtitle={`Ref: ${selectedApp.applicationNo} • Applied on ${new Date(selectedApp.createdAt).toLocaleDateString()}`}
          maxWidth="700px"
        >
          <form onSubmit={handleUpdateAppStatus} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '10px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.86rem' }}>
              <div><strong>Candidate Name:</strong> {selectedApp.fullName}</div>
              <div><strong>Gender:</strong> {selectedApp.gender}</div>
              <div><strong>Applied Position:</strong> {selectedApp.job?.title || 'General Faculty'}</div>
              <div><strong>Department:</strong> {selectedApp.job?.department || 'Academics'}</div>
              <div><strong>Highest Degree:</strong> {selectedApp.highestDegree}</div>
              <div><strong>University / Institute:</strong> {selectedApp.institute || 'N/A'}</div>
              <div><strong>Teaching Experience:</strong> {selectedApp.experienceYears} Years</div>
              <div><strong>Current Org:</strong> {selectedApp.currentOrg || 'N/A'}</div>
              <div><strong>Current Salary:</strong> {selectedApp.currentSalary ? `Rs. ${Number(selectedApp.currentSalary).toLocaleString()}` : 'N/A'}</div>
              <div><strong>Expected Salary:</strong> {selectedApp.expectedSalary ? `Rs. ${Number(selectedApp.expectedSalary).toLocaleString()}` : 'N/A'}</div>
              <div><strong>Notice Period:</strong> {selectedApp.noticePeriod || 'Immediate'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <strong>WhatsApp:</strong> {selectedApp.phone}
                <WhatsAppButton
                  phone={selectedApp.phone}
                  size="xs"
                  label="Chat"
                  message={`Assalam-o-Alaikum ${selectedApp.fullName}! This is Read Academy Administration regarding your teacher application (${selectedApp.applicationNo}).`}
                />
              </div>
            </div>

            {/* Candidate Cover Letter */}
            {selectedApp.coverLetter && (
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '12px 14px', borderRadius: '8px' }}>
                <strong style={{ fontSize: '0.82rem', color: '#334155' }}>Candidate Philosophy / Statement:</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
                  {selectedApp.coverLetter}
                </p>
              </div>
            )}

            {/* CV Download */}
            {selectedApp.cvDataUrl && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#1e40af', fontWeight: 600 }}>
                  <FileText size={16} />
                  <span>Resume Attached: {selectedApp.cvFileName || 'Candidate_CV.pdf'}</span>
                </div>
                <a
                  href={selectedApp.cvDataUrl}
                  download={selectedApp.cvFileName || `${selectedApp.fullName}_CV.pdf`}
                  className="bca-btn bca-btn-primary"
                  style={{ padding: '6px 12px', fontSize: '0.78rem', textDecoration: 'none' }}
                >
                  <Download size={14} /> Download CV
                </a>
              </div>
            )}

            {/* Status Update Fields */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    Recruitment Status
                  </label>
                  <select
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  >
                    <option value="PENDING">Pending Review</option>
                    <option value="SHORTLISTED">Shortlisted for Evaluation</option>
                    <option value="INTERVIEW_SCHEDULED">Interview & Demo Scheduled</option>
                    <option value="HIRED">HIRED (Approve & Appoint)</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    Interview / Demo Date
                  </label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              {/* Hire and Enroll Checkbox */}
              {reviewStatus === 'HIRED' && (
                <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '14px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 700, color: '#065f46', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={enrollAsTeacher}
                      onChange={(e) => setEnrollAsTeacher(e.target.checked)}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span>Automatically Enroll as Official Teacher in Database</span>
                  </label>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#047857' }}>
                    System will automatically generate an Employee ID (e.g. TEA-102), create a login User record, and add candidate to faculty directory.
                  </p>

                  {enrollAsTeacher && (
                    <div style={{ width: '220px' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#065f46', marginBottom: '4px' }}>
                        Agreed Basic Monthly Salary (PKR)
                      </label>
                      <input
                        type="number"
                        value={basicSalary}
                        onChange={(e) => setBasicSalary(Number(e.target.value))}
                        style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #a7f3d0' }}
                      />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Recruitment Committee Notes / Interview Feedback
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes on demonstration lecture, subject mastery, board exam command, or feedback..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="bca-btn bca-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdatingApp}
                className="bca-btn bca-btn-primary"
              >
                {isUpdatingApp ? 'Updating...' : 'Save Decision'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
