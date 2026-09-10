import React, { useState } from 'react';
import {
  PieChart,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  Download,
  Calendar,
  CreditCard
} from 'lucide-react';
import { MOCK_FINANCIAL_SUMMARY } from '../../mockData';
import type { FinancialSummary, AccountTransaction } from '../../types';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

export const AccountsView: React.FC = () => {
  const { showToast } = useToast();
  const [summary, setSummary] = useState<FinancialSummary>(MOCK_FINANCIAL_SUMMARY);
  const [transactions, setTransactions] = useState<AccountTransaction[]>([
    { id: 'TXN-101', date: '2026-09-06', title: 'Tuition Fee Batch Deposits (HBL Online)', category: 'Tuition Fees', type: 'Income', amount: 480000, reference: 'DEP-89410' },
    { id: 'TXN-102', date: '2026-09-05', title: 'Solar Inverter Maintenance & Servicing', category: 'Campus Maintenance', type: 'Expense', amount: 45000, reference: 'INV-4019' },
    { id: 'TXN-103', date: '2026-09-04', title: 'Admission Processing Fees (New Cohort)', category: 'Admissions', type: 'Income', amount: 150000, reference: 'DEP-89402' },
    { id: 'TXN-104', date: '2026-09-02', title: 'IESCO Electricity High-Tension Bill', category: 'Utilities', type: 'Expense', amount: 180000, reference: 'BIL-7721' },
    { id: 'TXN-105', date: '2026-08-31', title: 'Faculty & Administrative Monthly Salaries', category: 'Salaries', type: 'Expense', amount: 1200000, reference: 'PAY-AUG26' }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Txn Form
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(25000);
  const [type, setType] = useState<'Income' | 'Expense'>('Income');
  const [category, setCategory] = useState('Tuition Fees');
  const [reference, setReference] = useState('DEP-901');

  // Chart Data
  const incomeDoughnut = {
    labels: summary.incomeCategories.map(c => c.category || c.name || ''),
    datasets: [
      {
        data: summary.incomeCategories.map(c => c.amount),
        backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4']
      }
    ]
  };

  const expenseDoughnut = {
    labels: summary.expenseCategories.map(c => c.category || c.name || ''),
    datasets: [
      {
        data: summary.expenseCategories.map(c => c.amount),
        backgroundColor: ['#ef4444', '#f97316', '#eab308', '#64748b', '#ec4899']
      }
    ]
  };

  const handleAddTxn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      showToast('Please specify transaction title', undefined, 'error');
      return;
    }
    const newTxn: AccountTransaction = {
      id: `TXN-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title,
      category,
      type,
      amount: Number(amount),
      reference
    };
    setTransactions([newTxn, ...transactions]);
    setShowAddModal(false);
    showToast('Transaction Reconciled to General Ledger', `${type}: Rs. ${amount.toLocaleString()}`, 'success');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            School Accounts, P&L Statement & Treasury
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Reconcile tuition revenue streams, operating expenses, financial statements and balance sheet
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => showToast('Audited Income & Expenditure Statement Exported (PDF)', undefined, 'info')}
            className="bca-btn bca-btn-secondary"
          >
            <Download size={16} />
            <span>Export Financial Report</span>
          </button>
          <button onClick={() => setShowAddModal(true)} className="bca-btn bca-btn-primary">
            <Plus size={16} />
            <span>Record Entry</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div className="bca-card" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>TOTAL GROSS INCOME</span>
            <ArrowUpRight size={20} />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#059669', margin: '4px 0' }}>
            Rs. {summary.totalIncome.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>+12% above budget</span>
        </div>

        <div className="bca-card" style={{ padding: '20px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>TOTAL OPERATING EXPENSES</span>
            <ArrowDownRight size={20} />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#dc2626', margin: '4px 0' }}>
            Rs. {summary.totalExpenses.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Controlled operational overhead</span>
        </div>

        <div className="bca-card" style={{ padding: '20px', borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2563eb' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>NET FISCAL SURPLUS</span>
            <DollarSign size={20} />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#1d4ed8', margin: '4px 0' }}>
            Rs. {summary.netProfit.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>Reinvested in Campus Lab</span>
        </div>

        <div className="bca-card" style={{ padding: '20px', borderLeft: '4px solid #7c3aed' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7c3aed' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>NET OPERATING MARGIN</span>
            <TrendingUp size={20} />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#7c3aed', margin: '4px 0' }}>
            {((summary.netProfit / summary.totalIncome) * 100).toFixed(1)}%
          </div>
          <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>Institutional reserve target met</span>
        </div>
      </div>

      {/* Doughnut Charts Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div className="bca-card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: '1.05rem', fontWeight: 700 }}>Income by Revenue Stream</h3>
          <div style={{ height: '220px' }}>
            <Doughnut data={incomeDoughnut} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bca-card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: '1.05rem', fontWeight: 700 }}>Expenditure by Allocation</h3>
          <div style={{ height: '220px' }}>
            <Doughnut data={expenseDoughnut} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* General Ledger Transactions */}
      <div className="bca-table-wrapper">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Recent General Ledger Transactions</h3>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Audited by Beacon Crest Finance</span>
        </div>
        <table className="bca-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Reference #</th>
              <th>Transaction Description</th>
              <th>Category</th>
              <th>Type</th>
              <th style={{ textAlign: 'right' }}>Amount (PKR)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id}>
                <td>{txn.date}</td>
                <td><code>{txn.reference}</code></td>
                <td><strong style={{ color: '#0f172a' }}>{txn.title}</strong></td>
                <td><span className="bca-badge bca-badge-primary">{txn.category}</span></td>
                <td>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      backgroundColor: txn.type === 'Income' ? '#ecfdf5' : '#fff1f2',
                      color: txn.type === 'Income' ? '#059669' : '#e11d48'
                    }}
                  >
                    {txn.type}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <strong style={{ color: txn.type === 'Income' ? '#059669' : '#e11d48', fontSize: '0.94rem' }}>
                    {txn.type === 'Income' ? '+' : '-'} Rs. {txn.amount.toLocaleString()}
                  </strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RECORD ENTRY MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Record General Ledger Entry"
        subtitle="Post cash or bank transaction into the institutional accounts ledger"
        maxWidth="520px"
        footer={
          <>
            <button type="submit" form="accountTxnForm" className="bca-btn bca-btn-primary">
              Post Transaction
            </button>
            <button type="button" onClick={() => setShowAddModal(false)} className="bca-btn bca-btn-secondary">
              Cancel
            </button>
          </>
        }
      >
        <form id="accountTxnForm" onSubmit={handleAddTxn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
              Transaction Description *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Science Laboratory Reagents Purchase"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Entry Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              >
                <option value="Income">Income (Credit)</option>
                <option value="Expense">Expense (Debit)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Amount (PKR) *</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Bank Ref / Voucher</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
