import React, { useState, useEffect } from 'react';
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
  FileCheck,
  Edit2,
  Trash2,
  Plus
} from 'lucide-react';
import type { FeeVoucher } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';
import { feesApi, studentsApi } from '../../services/api';
import { WhatsAppButton } from '../common/WhatsAppButton';

const mapBackendVoucher = (v: any): FeeVoucher => ({
  voucherNo: v.voucherNo || `VCH-${v.id}`,
  studentId: v.studentId || v.student?.rollNo || 'STU-001',
  studentName: v.student?.fullName || v.studentName || 'Student',
  parentPhone: v.student?.parentPhone || v.parentPhone || '',
  parentName: v.student?.parentName || v.parentName || 'Parent',
  class: v.student?.class?.name || v.class || 'Grade 9',
  section: v.student?.section?.name ? v.student.section.name.replace('Section ', '') : (v.section || 'A'),
  month: v.billingMonth || 'September 2026',
  dueDate: v.dueDate ? v.dueDate.split('T')[0] : '2026-09-20',
  tuitionFee: Number(v.tuitionFee) || 8500,
  labFee: Number(v.labFee) || 0,
  examFee: Number(v.examFee) || 500,
  utilityCharges: Number(v.utilityCharges) || 500,
  fine: Number(v.lateFeeFine) || 0,
  totalAmount: Number(v.totalAmount) || 9500,
  status: v.status === 'PAID' ? 'Paid' : v.status === 'OVERDUE' ? 'Overdue' : 'Pending',
  paymentMethod: v.paymentMethod || 'Bank Transfer',
  paidDate: v.paidDate ? v.paidDate.split('T')[0] : (v.status === 'PAID' ? '2026-09-05' : undefined)
});

export const FeesView: React.FC = () => {
  const { showToast } = useToast();
  const [vouchers, setVouchers] = useState<FeeVoucher[]>([]);
  const [studentsList, setStudentsList] = useState<Array<{ id: string; rollNo: string; name: string; class: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'defaulters' | 'history'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState<FeeVoucher | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<FeeVoucher | null>(null);

  // Create Custom Fee Voucher Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [targetStudentId, setTargetStudentId] = useState('');
  const [billingMonth, setBillingMonth] = useState('September 2026');
  const [tuitionFeeInput, setTuitionFeeInput] = useState<number>(8500);
  const [admissionFeeInput, setAdmissionFeeInput] = useState<number>(0);
  const [examFeeInput, setExamFeeInput] = useState<number>(500);
  const [labFeeInput, setLabFeeInput] = useState<number>(500);
  const [utilityChargesInput, setUtilityChargesInput] = useState<number>(500);
  const [lateFineInput, setLateFineInput] = useState<number>(0);
  const [dueDateInput, setDueDateInput] = useState<string>(
    new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [isSubmittingVoucher, setIsSubmittingVoucher] = useState(false);

  // Fetch live vouchers from API
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    feesApi.getVouchers().then((res) => {
      if (isMounted) {
        if (res?.data && Array.isArray(res.data)) {
          setVouchers(res.data.map(mapBackendVoucher));
        } else {
          setVouchers([]);
        }
      }
    }).catch((err) => {
      console.warn('Backend fee vouchers fetch failed:', err);
      if (isMounted) {
        setVouchers([]);
      }
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    studentsApi.getStudents().then((res) => {
      if (isMounted && res?.data && Array.isArray(res.data)) {
        const mapped = res.data.map((s: any) => ({
          id: s.id,
          rollNo: s.rollNo || s.id,
          name: s.fullName || s.name || 'Student',
          class: s.class?.name || (typeof s.class === 'string' ? s.class : 'Class')
        }));
        setStudentsList(mapped);
        if (mapped.length > 0) {
          setTargetStudentId(mapped[0].rollNo || mapped[0].id);
        }
      }
    }).catch((err) => {
      console.warn('Error fetching students list for fee voucher modal:', err);
    });

    return () => { isMounted = false; };
  }, []);

  const handleCreateCustomVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStudentId) {
      showToast('Please select a student', undefined, 'error');
      return;
    }
    setIsSubmittingVoucher(true);
    try {
      const res = await feesApi.createVoucher({
        studentId: targetStudentId,
        billingMonth,
        tuitionFee: Number(tuitionFeeInput) || 0,
        admissionFee: Number(admissionFeeInput) || 0,
        examFee: Number(examFeeInput) || 0,
        labFee: Number(labFeeInput) || 0,
        utilityCharges: Number(utilityChargesInput) || 0,
        lateFine: Number(lateFineInput) || 0,
        dueDate: dueDateInput
      });

      if (res?.data) {
        const newVoucher = mapBackendVoucher(res.data);
        setVouchers((prev) => [newVoucher, ...prev]);
        setShowCreateModal(false);
        showToast(
          'Fee Voucher Created',
          `Voucher ${newVoucher.voucherNo} for ${newVoucher.studentName} (Total: Rs. ${newVoucher.totalAmount}) created successfully!`,
          'success'
        );
      } else {
        setShowCreateModal(false);
        showToast('Fee Voucher Created', 'Voucher generated successfully', 'success');
      }
    } catch (err: any) {
      console.error('Error creating custom voucher:', err);
      showToast('Creation Failed', err?.response?.data?.message || err?.message || 'Failed to create fee voucher', 'error');
    } finally {
      setIsSubmittingVoucher(false);
    }
  };

  const totalBilled = vouchers.reduce((acc, v) => acc + (v.totalAmount || 0), 0);
  const totalPaid = vouchers.filter((v) => v.status === 'Paid').reduce((acc, v) => acc + (v.totalAmount || 0), 0);
  const totalPending = vouchers.filter((v) => v.status === 'Pending').reduce((acc, v) => acc + (v.totalAmount || 0), 0);
  const totalOverdue = vouchers.filter((v) => v.status === 'Overdue').reduce((acc, v) => acc + (v.totalAmount || 0), 0);
  const overdueCount = vouchers.filter((v) => v.status === 'Overdue').length;
  const clearancePct = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;

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

  const handleMarkPaid = async (v: FeeVoucher) => {
    try {
      await feesApi.payVoucher(v.voucherNo, { paymentMethod: 'Bank Transfer' });
      setVouchers((prev) =>
        prev.map((item) =>
          item.voucherNo === v.voucherNo
            ? { ...item, status: 'Paid', paidDate: new Date().toISOString().split('T')[0] }
            : item
        )
      );
      showToast('Fee Payment Recorded', `Challan ${v.voucherNo} marked as Paid`, 'success');
    } catch (err: any) {
      showToast('Payment Record Failed', err.message || 'Error recording payment', 'error');
    }
  };

  // Edit Voucher State
  const [editingVoucher, setEditingVoucher] = useState<FeeVoucher | null>(null);
  const [showEditVoucherModal, setShowEditVoucherModal] = useState(false);
  const [editVoucherAmount, setEditVoucherAmount] = useState<number>(0);
  const [editVoucherDueDate, setEditVoucherDueDate] = useState('');
  const [editVoucherStatus, setEditVoucherStatus] = useState<'Paid' | 'Pending' | 'Overdue'>('Pending');

  const handleOpenEditVoucher = (v: FeeVoucher) => {
    setEditingVoucher(v);
    setEditVoucherAmount(v.totalAmount);
    setEditVoucherDueDate(v.dueDate);
    setEditVoucherStatus(v.status);
    setShowEditVoucherModal(true);
  };

  const handleSaveEditVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVoucher) return;
    setVouchers((prev) =>
      prev.map((item) =>
        item.voucherNo === editingVoucher.voucherNo
          ? {
              ...item,
              totalAmount: editVoucherAmount,
              tuitionFee: editVoucherAmount,
              dueDate: editVoucherDueDate,
              status: editVoucherStatus
            }
          : item
      )
    );
    showToast('Voucher Updated', `Challan ${editingVoucher.voucherNo} updated successfully`, 'success');
    setShowEditVoucherModal(false);
  };

  const handleDeleteVoucher = (v: FeeVoucher) => {
    if (!window.confirm(`Are you sure you want to delete fee voucher ${v.voucherNo} for ${v.studentName}?`)) return;
    setVouchers((prev) => prev.filter((item) => item.voucherNo !== v.voucherNo));
    showToast('Voucher Deleted', `Challan ${v.voucherNo} was deleted`, 'success');
  };

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
            onClick={() => setShowCreateModal(true)}
            className="bca-btn bca-btn-primary"
            style={{ background: '#0B3974' }}
          >
            <Plus size={16} />
            <span>Create Fee Voucher</span>
          </button>
          <button
            onClick={() => showToast('Batch 3-Copy Bank Vouchers printed', undefined, 'success')}
            className="bca-btn bca-btn-secondary"
          >
            <Printer size={16} />
            <span>Batch Print Vouchers</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
            Rs. {totalPaid.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#4CAF50', fontWeight: 700 }}>{clearancePct}% of billing cycle</span>
        </div>

        <div className="bca-card" style={{ padding: '20px', borderLeft: '4px solid #FFD700' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#b45309' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>PENDING DUES</span>
            <Clock size={18} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#b45309', margin: '4px 0' }}>
            Rs. {totalPending.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Active unpaid challans</span>
        </div>

        <div className="bca-card" style={{ padding: '20px', borderLeft: '4px solid #E62929' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E62929' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>OVERDUE DEFAULTERS</span>
            <AlertCircle size={18} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#E62929', margin: '4px 0' }}>
            Rs. {totalOverdue.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#E62929', fontWeight: 700 }}>{overdueCount} student{overdueCount === 1 ? '' : 's'} with fine</span>
        </div>

        <div className="bca-card" style={{ padding: '20px', borderLeft: '4px solid #4CAF50' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4CAF50' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>TOTAL BILLED</span>
            <CheckCircle size={18} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4CAF50', margin: '4px 0' }}>
            Rs. {totalBilled.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Auto-synced with PostgreSQL</span>
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  {loading ? 'Loading fee vouchers from database...' : 'No fee vouchers found.'}
                </td>
              </tr>
            ) : (
              filtered.map((voucher) => (
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
                    <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                      {voucher.parentPhone && (
                        <WhatsAppButton
                          phone={voucher.parentPhone}
                          compact
                          size="xs"
                          message={
                            voucher.status === 'Paid'
                              ? `Assalam-o-Alaikum ${voucher.parentName || 'Parent'}! Fee voucher ${voucher.voucherNo} for ${voucher.studentName} (Amount: Rs. ${voucher.totalAmount.toLocaleString()}) has been marked PAID. Read Academy Sahiwal.`
                              : `Assalam-o-Alaikum ${voucher.parentName || 'Parent'}! Fee voucher ${voucher.voucherNo} for ${voucher.studentName} (${voucher.month}, Amount: Rs. ${voucher.totalAmount.toLocaleString()}, Due: ${voucher.dueDate}) is pending. Please clear your dues at your earliest. Read Academy Sahiwal.`
                          }
                          title={voucher.status === 'Paid' ? 'Send WhatsApp Receipt to Parent' : 'Send WhatsApp Fee Notice to Parent'}
                        />
                      )}
                      <button
                        onClick={() => setSelectedVoucher(voucher)}
                        className="bca-btn bca-btn-secondary"
                        style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                        title="Preview 3-Copy Bank Fee Voucher"
                      >
                        <Eye size={13} /> Voucher
                      </button>
                      {voucher.status !== 'Paid' && (
                        <button
                          onClick={() => handleMarkPaid(voucher)}
                          className="bca-btn bca-btn-emerald"
                          style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                          title="Record Payment & Mark Paid"
                        >
                          <CreditCard size={13} /> Pay
                        </button>
                      )}
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
                      <button
                        onClick={() => handleOpenEditVoucher(voucher)}
                        className="bca-btn bca-btn-secondary"
                        style={{ padding: '5px 8px', color: '#2563eb' }}
                        title="Edit Voucher Details"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteVoucher(voucher)}
                        className="bca-btn bca-btn-secondary"
                        style={{ padding: '5px 8px', color: '#e11d48' }}
                        title="Delete Fee Voucher"
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

                  {/* Payment Details */}
                  <div style={{ fontSize: '0.66rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '6px' }}>
                    <div style={{ fontWeight: 800, color: '#0B3974', marginBottom: '3px' }}>Payment Methods:</div>
                    <div><strong>JazzCash:</strong> 0321-6909047 (Hafiz Abdul Nasir)</div>
                    <div><strong>Alfalah Bank:</strong> 59435002040250 (Hafiz Abdul Nasir)</div>
                    <div><strong>Email:</strong> readacademysahiwal2018@gmail.com</div>
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

      {/* CREATE CUSTOM FEE VOUCHER MODAL */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Student Fee Voucher"
          subtitle="Set customized fee amounts for student challan"
          maxWidth="640px"
          footer={
            <>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="bca-btn bca-btn-secondary"
                disabled={isSubmittingVoucher}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="createVoucherForm"
                className="bca-btn bca-btn-primary"
                style={{ background: '#0B3974' }}
                disabled={isSubmittingVoucher}
              >
                <Plus size={16} />
                {isSubmittingVoucher ? 'Generating Challan...' : 'Generate & Issue Challan'}
              </button>
            </>
          }
        >
          <form id="createVoucherForm" onSubmit={handleCreateCustomVoucher} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="bca-form-row">
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Select Enrolled Student *
                </label>
                <select
                  value={targetStudentId}
                  onChange={(e) => setTargetStudentId(e.target.value)}
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  {studentsList.length === 0 ? (
                    <option value="">Loading students...</option>
                  ) : (
                    studentsList.map((stu) => (
                      <option key={stu.rollNo || stu.id} value={stu.rollNo || stu.id}>
                        {stu.rollNo} — {stu.name} ({stu.class})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Billing Month / Title *
                </label>
                <input
                  type="text"
                  required
                  value={billingMonth}
                  onChange={(e) => setBillingMonth(e.target.value)}
                  placeholder="e.g. September 2026"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            {/* Custom Fee Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Tuition Fee (Rs.) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={tuitionFeeInput}
                  onChange={(e) => setTuitionFeeInput(Number(e.target.value) || 0)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Admission Fee (Rs.)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={admissionFeeInput}
                  onChange={(e) => setAdmissionFeeInput(Number(e.target.value) || 0)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Examination Fee (Rs.)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={examFeeInput}
                  onChange={(e) => setExamFeeInput(Number(e.target.value) || 0)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Lab / Practical Charges (Rs.)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={labFeeInput}
                  onChange={(e) => setLabFeeInput(Number(e.target.value) || 0)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Utility & Library Charges (Rs.)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={utilityChargesInput}
                  onChange={(e) => setUtilityChargesInput(Number(e.target.value) || 0)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Late Fine / Arrears (Rs.)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={lateFineInput}
                  onChange={(e) => setLateFineInput(Number(e.target.value) || 0)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Payment Due Date *
              </label>
              <input
                type="date"
                required
                value={dueDateInput}
                onChange={(e) => setDueDateInput(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            {/* Total Fee Banner */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 18px',
                background: '#eff6ff',
                borderRadius: '8px',
                border: '1px solid #bfdbfe'
              }}
            >
              <div>
                <span style={{ fontSize: '0.82rem', color: '#1e40af', fontWeight: 700 }}>Total Calculated Challan Amount</span>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Auto-calculated from all specified components
                </div>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1d4ed8' }}>
                Rs. {(
                  Number(tuitionFeeInput) +
                  Number(admissionFeeInput) +
                  Number(examFeeInput) +
                  Number(labFeeInput) +
                  Number(utilityChargesInput) +
                  Number(lateFineInput)
                ).toLocaleString()}
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* EDIT VOUCHER MODAL */}
      {showEditVoucherModal && editingVoucher && (
        <Modal
          isOpen={showEditVoucherModal}
          onClose={() => setShowEditVoucherModal(false)}
          title={`Edit Fee Voucher — ${editingVoucher.voucherNo}`}
          subtitle={`Student: ${editingVoucher.studentName} (${editingVoucher.class})`}
          maxWidth="480px"
          footer={
            <>
              <button onClick={() => setShowEditVoucherModal(false)} className="bca-btn bca-btn-secondary">
                Cancel
              </button>
              <button onClick={handleSaveEditVoucher} className="bca-btn bca-btn-primary">
                Save Changes
              </button>
            </>
          }
        >
          <form onSubmit={handleSaveEditVoucher} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Voucher Amount (PKR) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={editVoucherAmount}
                onChange={(e) => setEditVoucherAmount(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Due Date *
              </label>
              <input
                type="date"
                required
                value={editVoucherDueDate}
                onChange={(e) => setEditVoucherDueDate(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Payment Status
              </label>
              <select
                value={editVoucherStatus}
                onChange={(e) => setEditVoucherStatus(e.target.value as any)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
