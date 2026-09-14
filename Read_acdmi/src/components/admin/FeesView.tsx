import React, { useState } from 'react';
import {
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock,
  Printer,
  Eye,
  CreditCard,
  Download,
  Filter,
  Search,
  DollarSign,
  Building,
  School,
  FileCheck
} from 'lucide-react';
import { MOCK_FEE_VOUCHERS, SCHOOL_INFO } from '../../mockData';
import type { FeeVoucher } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

export const FeesView: React.FC = () => {
  const { showToast } = useToast();
  const [vouchers, setVouchers] = useState<FeeVoucher[]>(MOCK_FEE_VOUCHERS);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'defaulters' | 'history'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState<FeeVoucher | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<FeeVoucher | null>(null);

  // Filter vouchers
  const filtered = vouchers.filter((v) => {
    const matchesSearch =
      v.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.voucherNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.studentId.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'pending') return matchesSearch && v.status === 'Pending';
    if (activeTab === 'defaulters') return matchesSearch && v.status === 'Overdue';
    if (activeTab === 'history') return matchesSearch && v.status === 'Paid';
    return matchesSearch;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Title & Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Fees & Voucher Management
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Generate 3-part bank fee challans, reconcile online payments, and manage fee recoveries
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => showToast('Batch 3-Copy Bank Vouchers generated for all students', undefined, 'success')}
            className="bca-btn bca-btn-secondary"
          >
            <Printer size={16} />
            <span>Batch Print Vouchers</span>
          </button>
          <button
            onClick={() => showToast('Fee billing cycle initiated for October 2026', undefined, 'info')}
            className="bca-btn bca-btn-primary"
          >
            <Receipt size={16} />
            <span>Generate New Billing Run</span>
          </button>
        </div>
      </div>

      {/* 4 Dashboard Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div className="bca-card" style={{ padding: '20px', borderLeft: '4px solid #0B3974' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0B3974' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>TOTAL RECOVERY</span>
            <Receipt size={18} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
            Rs. 2.45M
          </div>
          <span style={{ fontSize: '0.74rem', color: '#4CAF50', fontWeight: 700 }}>92% of billing cycle</span>
        </div>

        <div className="bca-card" style={{ padding: '20px', borderLeft: '4px solid #FFD700' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#b45309' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>PENDING DUES</span>
            <Clock size={18} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#b45309', margin: '4px 0' }}>
            Rs. 340,000
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Due by Sept 18</span>
        </div>

        <div className="bca-card" style={{ padding: '20px', borderLeft: '4px solid #E62929' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E62929' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>OVERDUE DEFAULTERS</span>
            <AlertCircle size={18} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#E62929', margin: '4px 0' }}>
            Rs. 39,500
          </div>
          <span style={{ fontSize: '0.74rem', color: '#E62929', fontWeight: 700 }}>1 student with fine</span>
        </div>

        <div className="bca-card" style={{ padding: '20px', borderLeft: '4px solid #4CAF50' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4CAF50' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>THIS MONTH RECEIVED</span>
            <CheckCircle size={18} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4CAF50', margin: '4px 0' }}>
            Rs. 2.45M
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Auto-reconciled with HBL & UBL</span>
        </div>
      </div>

      {/* Sub-tabs & Search Filter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'all', label: 'All Vouchers' },
            { id: 'pending', label: 'Pending Dues' },
            { id: 'defaulters', label: 'Defaulters Screen' },
            { id: 'history', label: 'Payment Receipts & History' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="bca-btn"
              style={{
                backgroundColor: activeTab === tab.id ? '#0B3974' : '#ffffff',
                color: activeTab === tab.id ? '#ffffff' : '#475569',
                border: activeTab === tab.id ? 'none' : '1px solid #cbd5e1',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: activeTab === tab.id ? 700 : 500
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ width: '260px', position: 'relative' }}>
          <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input
            type="text"
            placeholder="Search voucher #, student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '7px 10px 7px 32px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
          />
        </div>
      </div>

      {/* Fee Table */}
      <div className="bca-table-wrapper">
        <table className="bca-table">
          <thead>
            <tr>
              <th>Voucher #</th>
              <th>Student</th>
              <th>Class</th>
              <th>Billing Month</th>
              <th>Total Amount</th>
              <th>Due Date</th>
              <th>Paid Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((voucher) => (
              <tr key={voucher.voucherNo}>
                <td>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0B3974', fontSize: '0.82rem' }}>
                    {voucher.voucherNo}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{voucher.studentName}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{voucher.studentId}</div>
                </td>
                <td>{voucher.class} - {voucher.section}</td>
                <td>{voucher.month}</td>
                <td>
                  <strong style={{ color: '#0f172a', fontSize: '0.92rem' }}>
                    Rs. {voucher.totalAmount.toLocaleString()}
                  </strong>
                </td>
                <td>{voucher.dueDate}</td>
                <td>{voucher.paidDate || '-'}</td>
                <td>
                  <span className={`bca-badge bca-badge-${voucher.status.toLowerCase()}`}>
                    {voucher.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button
                      onClick={() => setSelectedVoucher(voucher)}
                      className="bca-btn bca-btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                      title="Preview 3-Copy Bank Fee Voucher"
                    >
                      <Eye size={13} /> Voucher
                    </button>
                    {voucher.status === 'Paid' && (
                      <button
                        onClick={() => setSelectedReceipt(voucher)}
                        className="bca-btn bca-btn-emerald"
                        style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                        title="View Official Payment Receipt"
                      >
                        <FileCheck size={13} /> Receipt
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PRINTABLE 3-COPY FEE VOUCHER PREVIEW MODAL */}
      {selectedVoucher && (
        <Modal
          isOpen={!!selectedVoucher}
          onClose={() => setSelectedVoucher(null)}
          title={`Official Fee Challan Voucher — ${selectedVoucher.voucherNo}`}
          subtitle={`3-Part Bank Challan: Bank Copy • School Copy • Student Copy`}
          maxWidth="940px"
          footer={
            <>
              <button onClick={handlePrint} className="bca-btn bca-btn-primary">
                <Printer size={16} /> Print 3-Part Voucher
              </button>
              <button onClick={() => setSelectedVoucher(null)} className="bca-btn bca-btn-secondary">
                Close
              </button>
            </>
          }
        >
          <div>
            <div style={{ marginBottom: '14px', textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
              Designed for standard A4 landscape 3-fold printing across any commercial bank branch (HBL / Meezan / UBL / Askari).
            </div>

            {/* 3-Column Voucher Preview Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '14px',
                backgroundColor: '#f8fafc',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1'
              }}
            >
              {['BANK COPY', 'SCHOOL ACCOUNTS COPY', 'STUDENT COPY'].map((copyTitle, colIdx) => (
                <div
                  key={colIdx}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px dashed #94a3b8',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '0.76rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* Voucher Header */}
                  <div style={{ textAlign: 'center', borderBottom: '2px solid #0B3974', paddingBottom: '8px', marginBottom: '8px' }}>
                    <img src="/logo.png" alt="Read Academy Sahiwal" style={{ height: '36px', marginBottom: '3px' }} />
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0B3974' }}>
                      READ ACADEMY SAHIWAL
                    </div>
                    <div style={{ fontSize: '0.64rem', color: '#E62929', fontWeight: 700 }}>
                      Read To Lead • Since 2018
                    </div>
                    <div
                      style={{
                        display: 'inline-block',
                        background: '#eff6ff',
                        color: '#0B3974',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontWeight: 700,
                        fontSize: '0.68rem',
                        marginTop: '3px',
                        border: '1px solid #bfdbfe'
                      }}
                    >
                      {copyTitle}
                    </div>
                  </div>

                  {/* Voucher Meta Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '8px' }}>
                    <div><strong>Challan No:</strong> <code>{selectedVoucher.voucherNo}</code></div>
                    <div><strong>Student Name:</strong> {selectedVoucher.studentName}</div>
                    <div><strong>Student ID:</strong> {selectedVoucher.studentId}</div>
                    <div><strong>Class:</strong> {selectedVoucher.class} - {selectedVoucher.section}</div>
                    <div><strong>Billing Month:</strong> {selectedVoucher.month}</div>
                    <div><strong>Issue Date:</strong> 2026-09-01</div>
                    <div><strong style={{ color: '#E62929' }}>Due Date:</strong> {selectedVoucher.dueDate}</div>
                  </div>

                  {/* Fee Itemization Table */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', marginBottom: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '4px 6px' }}>Tuition Fee</td>
                          <td style={{ padding: '4px 6px', textAlign: 'right' }}>Rs. {selectedVoucher.tuitionFee.toLocaleString()}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '4px 6px' }}>Examination Fee</td>
                          <td style={{ padding: '4px 6px', textAlign: 'right' }}>Rs. {selectedVoucher.examFee.toLocaleString()}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '4px 6px' }}>Science & IT Lab</td>
                          <td style={{ padding: '4px 6px', textAlign: 'right' }}>Rs. {selectedVoucher.labFee.toLocaleString()}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '4px 6px' }}>Utilities & Campus</td>
                          <td style={{ padding: '4px 6px', textAlign: 'right' }}>Rs. {selectedVoucher.utilityCharges.toLocaleString()}</td>
                        </tr>
                        {selectedVoucher.fine > 0 && (
                          <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#E62929' }}>
                            <td style={{ padding: '4px 6px' }}>Late Surcharge Fine</td>
                            <td style={{ padding: '4px 6px', textAlign: 'right' }}>Rs. {selectedVoucher.fine.toLocaleString()}</td>
                          </tr>
                        )}
                        <tr style={{ backgroundColor: '#f8fafc', fontWeight: 800 }}>
                          <td style={{ padding: '5px 6px' }}>TOTAL PAYABLE</td>
                          <td style={{ padding: '5px 6px', textAlign: 'right', color: '#0B3974' }}>
                            Rs. {selectedVoucher.totalAmount.toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Bank Details & Barcode */}
                  <div style={{ fontSize: '0.66rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '6px' }}>
                    <div><strong>Bank:</strong> Habib Bank Limited (HBL) Sahiwal</div>
                    <div><strong>A/C Title:</strong> Read Academy Sahiwal Accounts</div>
                    <div><strong>A/C No:</strong> 0192-7729104-03</div>
                  </div>

                  {/* Signature line */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '6px', borderTop: '1px solid #cbd5e1', fontSize: '0.64rem', color: '#64748b' }}>
                    <span>Cashier Stamp</span>
                    <span>Officer Sign</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* PAYMENT RECEIPT MODAL */}
      {selectedReceipt && (
        <Modal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          title="Official Fee Payment Receipt"
          subtitle={`Receipt verified for Voucher #${selectedReceipt.voucherNo}`}
          maxWidth="560px"
          footer={
            <>
              <button onClick={handlePrint} className="bca-btn bca-btn-primary">
                <Printer size={16} /> Print Receipt
              </button>
              <button onClick={() => setSelectedReceipt(null)} className="bca-btn bca-btn-secondary">
                Close
              </button>
            </>
          }
        >
          <div style={{ border: '2px solid #e2e8f0', borderRadius: '12px', padding: '24px', backgroundColor: '#ffffff', borderTop: '4px solid #FFD700' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #0B3974', paddingBottom: '14px', marginBottom: '16px' }}>
              <img src="/logo.png" alt="Read Academy Sahiwal" style={{ height: '48px', marginBottom: '4px' }} />
              <h3 style={{ margin: 0, color: '#0B3974' }}>READ ACADEMY SAHIWAL</h3>
              <p style={{ margin: '2px 0', fontSize: '0.8rem', color: '#E62929', fontWeight: 700 }}>Read To Lead (Since 2018)</p>
              <p style={{ margin: '2px 0', fontSize: '0.78rem', color: '#64748b' }}>Official Electronic Payment Receipt</p>
              <span className="bca-badge bca-badge-paid" style={{ marginTop: '6px' }}>PAID & RECONCILED</span>
            </div>

            <div className="bca-form-row" style={{ fontSize: '0.84rem', marginBottom: '18px' }}>
              <div><strong>Receipt No:</strong> REC-2026-9042</div>
              <div><strong>Date:</strong> {selectedReceipt.paidDate || '2026-09-03'}</div>
              <div><strong>Student Name:</strong> {selectedReceipt.studentName}</div>
              <div><strong>Student ID:</strong> {selectedReceipt.studentId}</div>
              <div><strong>Class:</strong> {selectedReceipt.class}-{selectedReceipt.section}</div>
              <div><strong>Payment Mode:</strong> {selectedReceipt.paymentMethod || 'Online Transfer'}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>Month Billed:</span>
                <strong>{selectedReceipt.month}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#4CAF50', marginTop: '6px' }}>
                <span>Amount Paid:</span>
                <span>Rs. {selectedReceipt.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8' }}>
              This is a computer-generated official receipt. No physical signature is required.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
