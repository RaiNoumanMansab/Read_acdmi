import React, { useState } from 'react';
import {
  DollarSign,
  CheckCircle,
  Clock,
  Printer,
  Eye,
  Download,
  Filter,
  Search,
  School,
  FileCheck
} from 'lucide-react';
import { MOCK_PAYROLL, SCHOOL_INFO } from '../../mockData';
import type { PayrollRecord } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

export const PayrollView: React.FC = () => {
  const { showToast } = useToast();
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(MOCK_PAYROLL);
  const [selectedSlip, setSelectedSlip] = useState<PayrollRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const totalPayroll = payrollRecords.reduce((acc, curr) => acc + (curr.netPay ?? curr.netSalary ?? 0), 0);
  const totalDeductions = payrollRecords.reduce((acc, curr) => acc + curr.deductions, 0);

  const filtered = payrollRecords.filter((p) =>
    (p.teacherName || p.employeeName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.designation || p.role || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Faculty & Staff Payroll Management
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Monthly salary disbursements, tax withholdings, allowances, and official employee payslips
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => showToast('Batch Payslips exported as consolidated PDF', undefined, 'info')}
            className="bca-btn bca-btn-secondary"
          >
            <Download size={16} />
            <span>Export Payroll Sheet</span>
          </button>
          <button
            onClick={() => showToast('Disbursement batch executed via Direct Bank Transfer (HBL)', undefined, 'success')}
            className="bca-btn bca-btn-primary"
          >
            <DollarSign size={16} />
            <span>Disburse Monthly Batch</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div className="bca-card" style={{ padding: '18px', borderLeft: '4px solid #0B3974' }}>
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>TOTAL MONTHLY PAYROLL</span>
          <div style={{ fontSize: '1.55rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
            Rs. {totalPayroll.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Billing Month: August 2026</span>
        </div>

        <div className="bca-card" style={{ padding: '18px', borderLeft: '4px solid #4CAF50' }}>
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>DISBURSED AMOUNT</span>
          <div style={{ fontSize: '1.55rem', fontWeight: 800, color: '#4CAF50', margin: '4px 0' }}>
            Rs. {(totalPayroll * 0.95).toLocaleString()}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#4CAF50', fontWeight: 700 }}>82 Faculty Paid</span>
        </div>

        <div className="bca-card" style={{ padding: '18px', borderLeft: '4px solid #FFD700' }}>
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>PENDING DISBURSEMENTS</span>
          <div style={{ fontSize: '1.55rem', fontWeight: 800, color: '#b45309', margin: '4px 0' }}>
            Rs. {(totalPayroll * 0.05).toLocaleString()}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>4 Contract staff</span>
        </div>

        <div className="bca-card" style={{ padding: '18px', borderLeft: '4px solid #64748b' }}>
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>TAX & DEDUCTIONS</span>
          <div style={{ fontSize: '1.55rem', fontWeight: 800, color: '#475569', margin: '4px 0' }}>
            Rs. {totalDeductions.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>FBR Withholding Tax</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bca-card" style={{ padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: '320px', position: 'relative' }}>
          <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input
            type="text"
            placeholder="Search faculty name, emp ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '7px 10px 7px 32px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
          />
        </div>
        <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
          Showing <strong>{filtered.length}</strong> payroll slips
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bca-table-wrapper">
        <table className="bca-table">
          <thead>
            <tr>
              <th>Emp ID</th>
              <th>Faculty Name</th>
              <th>Designation</th>
              <th>Month</th>
              <th>Basic Salary</th>
              <th>Allowances</th>
              <th>Deductions</th>
              <th>Net Payable</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Official Payslip</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((pay) => (
              <tr key={pay.id}>
                <td><code>{pay.empId}</code></td>
                <td><strong style={{ color: '#0f172a' }}>{pay.teacherName}</strong></td>
                <td>{pay.designation || pay.role}</td>
                <td>{pay.month}</td>
                <td>Rs. {pay.basicSalary.toLocaleString()}</td>
                <td style={{ color: '#4CAF50' }}>+ Rs. {pay.allowances.toLocaleString()}</td>
                <td style={{ color: '#E62929' }}>- Rs. {pay.deductions.toLocaleString()}</td>
                <td>
                  <strong style={{ color: '#0B3974', fontSize: '0.94rem' }}>
                    Rs. {(pay.netPay ?? pay.netSalary ?? 0).toLocaleString()}
                  </strong>
                </td>
                <td>
                  <span className={`bca-badge bca-badge-${pay.status.toLowerCase()}`}>
                    {pay.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => setSelectedSlip(pay)}
                    className="bca-btn bca-btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                  >
                    <Eye size={13} /> Payslip
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* OFFICIAL SALARY PAYSLIP MODAL */}
      {selectedSlip && (
        <Modal
          isOpen={!!selectedSlip}
          onClose={() => setSelectedSlip(null)}
          title={`Official Monthly Salary Slip — ${selectedSlip.teacherName}`}
          subtitle={`Disbursement Month: ${selectedSlip.month} • Employee ID: ${selectedSlip.empId}`}
          maxWidth="640px"
          footer={
            <>
              <button onClick={handlePrint} className="bca-btn bca-btn-primary">
                <Printer size={16} /> Print Payslip
              </button>
              <button onClick={() => setSelectedSlip(null)} className="bca-btn bca-btn-secondary">
                Close
              </button>
            </>
          }
        >
          <div style={{ border: '2px solid #e2e8f0', borderRadius: '12px', padding: '24px', background: '#ffffff', borderTop: '4px solid #E62929' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #0B3974', paddingBottom: '12px', marginBottom: '18px' }}>
              <img src="/logo.png" alt="Read Academy Sahiwal" style={{ height: '48px', marginBottom: '6px' }} />
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0B3974', fontWeight: 900 }}>READ ACADEMY SAHIWAL</h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#E62929', fontWeight: 700 }}>
                Read To Lead (Since 2018) • Confidential Faculty Remuneration & Tax Statement
              </p>
            </div>

            <div className="bca-form-row" style={{ fontSize: '0.84rem', background: '#f8fafc', padding: '14px', borderRadius: '8px', marginBottom: '18px' }}>
              <div><strong>Employee Name:</strong> {selectedSlip.teacherName}</div>
              <div><strong>Employee ID:</strong> {selectedSlip.empId}</div>
              <div><strong>Designation:</strong> {selectedSlip.designation}</div>
              <div><strong>Pay Period:</strong> {selectedSlip.month}</div>
              <div><strong>Disbursement Date:</strong> {selectedSlip.paymentDate || '2026-08-31'}</div>
              <div><strong>Payment Mode:</strong> Bank Transfer (HBL Direct)</div>
            </div>

            {/* Breakdown Table */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '18px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Earnings Item</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Amount (PKR)</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', borderLeft: '1px solid #e2e8f0' }}>Deductions Item</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Amount (PKR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '8px 12px' }}>Basic Salary</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>Rs. {selectedSlip.basicSalary.toLocaleString()}</td>
                    <td style={{ padding: '8px 12px', borderLeft: '1px solid #e2e8f0' }}>Income Tax Withholding</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', color: '#E62929' }}>Rs. {(selectedSlip.deductions * 0.7).toFixed(0)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '8px 12px' }}>Academic & Medical Allowance</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>Rs. {selectedSlip.allowances.toLocaleString()}</td>
                    <td style={{ padding: '8px 12px', borderLeft: '1px solid #e2e8f0' }}>EOBI / Provident Fund</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', color: '#E62929' }}>Rs. {(selectedSlip.deductions * 0.3).toFixed(0)}</td>
                  </tr>
                  <tr style={{ background: '#f8fafc', fontWeight: 800, borderTop: '2px solid #e2e8f0' }}>
                    <td style={{ padding: '10px 12px' }}>GROSS EARNINGS</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>Rs. {(selectedSlip.basicSalary + selectedSlip.allowances).toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', borderLeft: '1px solid #e2e8f0' }}>TOTAL DEDUCTIONS</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#E62929' }}>Rs. {selectedSlip.deductions.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', border: '1px solid #bfdbfe' }}>
              <span style={{ fontWeight: 800, color: '#0B3974', fontSize: '0.95rem' }}>NET SALARY TRANSFERRED:</span>
              <span style={{ fontWeight: 900, color: '#0B3974', fontSize: '1.4rem' }}>Rs. {(selectedSlip.netPay ?? selectedSlip.netSalary ?? 0).toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid #cbd5e1', fontSize: '0.74rem', color: '#64748b' }}>
              <span>Employee Signature / Stamp</span>
              <span>Finance Officer</span>
              <span>Auditor Approval</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
