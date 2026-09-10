import React, { useState } from 'react';
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
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';
import { CheckCircle } from 'lucide-react';

interface PublicWebsiteProps {
  onOpenAdmin: () => void;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({ onOpenAdmin }) => {
  const { showToast } = useToast();
  const [activePage, setActivePage] = useState('home');
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  // Quick Apply Modal Form State
  const [applicantName, setApplicantName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Grade 9');

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !guardianPhone) {
      showToast('Please fill all required fields', undefined, 'error');
      return;
    }
    showToast(
      'Admission Application Registered!',
      `Application for ${applicantName} submitted. Our admissions team will contact ${guardianPhone}.`,
      'success'
    );
    setApplyModalOpen(false);
    setApplicantName('');
    setGuardianName('');
    setGuardianPhone('');
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
          maxWidth="520px"
          footer={
            <>
              <button type="submit" form="quickApplyForm" className="bca-btn bca-btn-gold">
                Submit Registration
              </button>
              <button type="button" onClick={() => setApplyModalOpen(false)} className="bca-btn bca-btn-secondary">
                Cancel
              </button>
            </>
          }
        >
          <form id="quickApplyForm" onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Prospective Scholar's Full Name *
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
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Parent / Guardian Full Name *
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
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Parent / Guardian Phone (WhatsApp) *
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
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Applying For Grade *
              </label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Early Years">Early Years (Playgroup / KG)</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 9">Grade 9 (SSC-I Matric)</option>
                  <option value="Grade 10">Grade 10 (SSC-II Matric)</option>
                </select>
              </div>

            <div style={{ backgroundColor: '#e8f5e9', padding: '12px', borderRadius: '8px', fontSize: '0.78rem', color: '#1b5e20', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <CheckCircle size={16} color="#4CAF50" style={{ flexShrink: 0 }} />
              <span>Assessment tests are administered on alternate Saturdays at the Main Campus.</span>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
