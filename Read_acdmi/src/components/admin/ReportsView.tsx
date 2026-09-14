import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  BarChart2,
  TrendingUp,
  Users,
  CheckCircle,
  Eye
} from 'lucide-react';
import { useToast } from '../common/Toast';

export const ReportsView: React.FC = () => {
  const { showToast } = useToast();
  const [selectedReport, setSelectedReport] = useState('academic');
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-09-07');

  const reportTypes = [
    {
      id: 'academic',
      title: 'Academic Performance & Examination Index',
      desc: 'Cumulative subject GPAs, class averages, grade distributions, and student percentile rankings',
      icon: BarChart2
    },
    {
      id: 'fees',
      title: 'Fee Collection & Defaulters Reconciliation',
      desc: 'Month-by-month cash receipts, bank ledger deposits, scholarship waivers, and outstanding dues',
      icon: TrendingUp
    },
    {
      id: 'attendance',
      title: 'Student & Staff Attendance Compliance Audit',
      desc: 'Daily registers, unauthorized leaves, chronic absenteeism flags, and punctuality percentages',
      icon: CheckCircle
    },
    {
      id: 'enrollment',
      title: 'Demographic & Enrollment Capacity Report',
      desc: 'Gender parity ratios, grade level saturation, transfer student statistics, and sibling concessions',
      icon: Users
    }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Institutional Analytics & Report Generator
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Generate executive summaries, regulatory compliance audits, and academic transcripts
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => showToast('Exported Report to CSV Format', undefined, 'info')}
            className="bca-btn bca-btn-secondary"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => showToast('Report Generated & Downloaded (PDF with School Seal)', undefined, 'success')}
            className="bca-btn bca-btn-primary"
          >
            <Printer size={16} />
            <span>Generate Official PDF</span>
          </button>
        </div>
      </div>

      {/* Date & Filter Parameters */}
      <div
        className="bca-card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Reporting Window:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
            />
            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Class Scope:</span>
            <select style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}>
              <option>All School (Grades 1-12)</option>
              <option>Primary Wing (Grades 1-5)</option>
              <option>Middle Wing (Grades 6-8)</option>
              <option>Senior Wing (Grades 9-12)</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => showToast('Parameters synchronized and verified', undefined, 'info')}
          className="bca-btn bca-btn-secondary"
          style={{ padding: '6px 14px' }}
        >
          <Filter size={14} /> Refresh Parameters
        </button>
      </div>

      {/* Report Types Catalog */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '18px',
          marginBottom: '24px'
        }}
      >
        {reportTypes.map((rpt) => {
          const isSelected = selectedReport === rpt.id;
          const Icon = rpt.icon;

          return (
            <div
              key={rpt.id}
              onClick={() => setSelectedReport(rpt.id)}
              className="bca-card"
              style={{
                padding: '20px',
                cursor: 'pointer',
                border: '2px solid',
                borderColor: isSelected ? '#2563eb' : 'transparent',
                backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                transition: 'all 0.15s ease'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: isSelected ? '#2563eb' : '#f1f5f9',
                  color: isSelected ? '#ffffff' : '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}
              >
                <Icon size={20} />
              </div>

              <h3 style={{ fontSize: '1.02rem', fontWeight: 700, margin: '0 0 6px 0', color: '#0f172a' }}>
                {rpt.title}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                {rpt.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* LIVE PREVIEW LEDGER */}
      <div className="bca-table-wrapper">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>
              Preview: {reportTypes.find(r => r.id === selectedReport)?.title}
            </h3>
            <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
              Generated on {new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })} • 1,248 Records Audited
            </span>
          </div>
          <span className="bca-badge bca-badge-present">Audited & Verified</span>
        </div>

        {selectedReport === 'academic' && (
          <table className="bca-table">
            <thead>
              <tr>
                <th>Class & Section</th>
                <th>Total Enrolled</th>
                <th>Passing Rate (%)</th>
                <th>Subject Distinction Lead</th>
                <th>Class Average</th>
                <th>Academic Standing</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cls: 'Grade 10-A', count: 38, pass: '97.4%', lead: 'Physics (94.2%)', avg: '88.5%', status: 'Exemplary' },
                { cls: 'Grade 10-B', count: 36, pass: '94.4%', lead: 'Mathematics (91.0%)', avg: '84.8%', status: 'High Standing' },
                { cls: 'Grade 9-A', count: 40, pass: '95.0%', lead: 'Computer Science (93.1%)', avg: '86.2%', status: 'Exemplary' },
                { cls: 'Grade 8-A', count: 35, pass: '91.4%', lead: 'English Literature (89.5%)', avg: '81.9%', status: 'Satisfactory' }
              ].map((row, idx) => (
                <tr key={idx}>
                  <td><strong>{row.cls}</strong></td>
                  <td>{row.count} Students</td>
                  <td><strong style={{ color: '#059669' }}>{row.pass}</strong></td>
                  <td>{row.lead}</td>
                  <td><strong>{row.avg}</strong></td>
                  <td><span className="bca-badge bca-badge-present">{row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selectedReport === 'fees' && (
          <table className="bca-table">
            <thead>
              <tr>
                <th>Grade Wing</th>
                <th>Total Invoiced</th>
                <th>Total Realized</th>
                <th>Collection Rate</th>
                <th>Outstanding Dues</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { wing: 'Senior Wing (Grades 9-12)', inv: 'Rs. 1,450,000', col: 'Rs. 1,380,000', rate: '95.1%', out: 'Rs. 70,000' },
                { wing: 'Middle Wing (Grades 6-8)', inv: 'Rs. 980,000', col: 'Rs. 910,000', rate: '92.8%', out: 'Rs. 70,000' },
                { wing: 'Primary Wing (Grades 1-5)', inv: 'Rs. 820,000', col: 'Rs. 790,000', rate: '96.3%', out: 'Rs. 30,000' }
              ].map((row, idx) => (
                <tr key={idx}>
                  <td><strong>{row.wing}</strong></td>
                  <td>{row.inv}</td>
                  <td><strong style={{ color: '#059669' }}>{row.col}</strong></td>
                  <td><span className="bca-badge bca-badge-present">{row.rate}</span></td>
                  <td><strong style={{ color: '#e11d48' }}>{row.out}</strong></td>
                  <td>
                    <button
                      onClick={() => showToast(`Defaulter reminders queued for ${row.wing}`, undefined, 'info')}
                      className="bca-btn bca-btn-secondary"
                      style={{ padding: '3px 8px', fontSize: '0.74rem' }}
                    >
                      Dispatch SMS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {(selectedReport === 'attendance' || selectedReport === 'enrollment') && (
          <table className="bca-table">
            <thead>
              <tr>
                <th>Segment</th>
                <th>Cohort Total</th>
                <th>Daily Rate</th>
                <th>Excused Absences</th>
                <th>Chronic Defaulters</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { seg: 'Senior Boys Wing', tot: 420, rate: '94.2%', exc: 18, def: 3, st: 'Compliant' },
                { seg: 'Senior Girls Wing', tot: 430, rate: '96.8%', exc: 12, def: 1, st: 'Exemplary' },
                { seg: 'Faculty & Instructors', tot: 86, rate: '98.1%', exc: 2, def: 0, st: 'Exemplary' }
              ].map((row, idx) => (
                <tr key={idx}>
                  <td><strong>{row.seg}</strong></td>
                  <td>{row.tot} Members</td>
                  <td><strong style={{ color: '#059669' }}>{row.rate}</strong></td>
                  <td>{row.exc}</td>
                  <td><strong style={{ color: row.def > 0 ? '#e11d48' : '#059669' }}>{row.def}</strong></td>
                  <td><span className="bca-badge bca-badge-present">{row.st}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
