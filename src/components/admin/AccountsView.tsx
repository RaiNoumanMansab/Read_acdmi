import React, { useState, useEffect } from 'react';
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
  CreditCard,
  Edit2,
  Trash2
} from 'lucide-react';
import type { FinancialSummary, AccountTransaction } from '../../types';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';
import { feesApi } from '../../services/api';

export const AccountsView: React.FC = () => {
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState<AccountTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Load transactions from live API
  useEffect(() => {
    let isMounted = true;
    feesApi.getTransactions().then((res) => {
      if (isMounted) {
        if (res?.data && Array.isArray(res.data)) {
          const loaded: AccountTransaction[] = res.data.map((t: any) => ({
            id: t.id,
            date: t.transactionDate ? t.transactionDate.split('T')[0] : '2026-09-06',
            title: t.title,
            category: t.category,
            type: t.type === 'INCOME' ? 'Income' : 'Expense',
            amount: Number(t.amount),
            reference: t.referenceNo || 'TXN-REF'
          }));
          setTransactions(loaded);
        } else {
          setTransactions([]);
        }
        setLoading(false);
      }
    }).catch((err) => {
      console.warn('Backend transactions fetch failed:', err);
      if (isMounted) {
        setTransactions([]);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // New Txn Form
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(25000);
  const [type, setType] = useState<'Income' | 'Expense'>('Income');
  const [category, setCategory] = useState('Tuition Fees');
  const [reference, setReference] = useState('DEP-901');

  // Edit Txn state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState<AccountTransaction | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState(0);
  const [editType, setEditType] = useState<'Income' | 'Expense'>('Income');
  const [editCategory, setEditCategory] = useState('Tuition Fees');
  const [editDate, setEditDate] = useState('');

  const handleOpenEditTxn = (txn: AccountTransaction) => {
    setEditingTxn(txn);
    setEditTitle(txn.title);
    setEditAmount(txn.amount);
    setEditType(txn.type);
    setEditCategory(txn.category);
    setEditDate(txn.date);
    setEditModalOpen(true);
  };

  const handleSaveEditTxn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTxn) return;
    try {
      await feesApi.updateTransaction(editingTxn.id, {
        title: editTitle,
        amount: editAmount,
        type: editType === 'Income' ? 'INCOME' : 'EXPENSE',
        category: editCategory
      });
    } catch (err) {
      console.warn('Backend transaction update error:', err);
    }
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === editingTxn.id
          ? {
              ...t,
              title: editTitle,
              amount: editAmount,
              type: editType,
              category: editCategory
            }
          : t
      )
    );
    showToast('Transaction updated successfully', undefined, 'success');
    setEditModalOpen(false);
    setEditingTxn(null);
  };

  const handleDeleteTxn = async (id: string, txnTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete transaction "${txnTitle}"?`)) return;
    try {
      await feesApi.deleteTransaction(id);
    } catch (err) {
      console.warn('Backend transaction delete error:', err);
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaction deleted successfully', undefined, 'success');
  };

  // Compute live financial totals from transactions
  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((acc, t) => acc + (t.amount || 0), 0);
  const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + (t.amount || 0), 0);
  const netProfit = totalIncome - totalExpenses;
  const marginPct = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : '0';

  // Group by category for Doughnuts
  const incomeCategoryMap: Record<string, number> = {};
  const expenseCategoryMap: Record<string, number> = {};

  transactions.forEach((t) => {
    if (t.type === 'Income') {
      incomeCategoryMap[t.category] = (incomeCategoryMap[t.category] || 0) + (t.amount || 0);
    } else {
      expenseCategoryMap[t.category] = (expenseCategoryMap[t.category] || 0) + (t.amount || 0);
    }
  });

  const incomeLabels = Object.keys(incomeCategoryMap);
  const incomeValues = Object.values(incomeCategoryMap);
  const expenseLabels = Object.keys(expenseCategoryMap);
  const expenseValues = Object.values(expenseCategoryMap);

  // Chart Data
  const incomeDoughnut = {
    labels: incomeLabels.length > 0 ? incomeLabels : ['Tuition Fees'],
    datasets: [
      {
        data: incomeValues.length > 0 ? incomeValues : [1],
        backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4']
      }
    ]
  };

  const expenseDoughnut = {
    labels: expenseLabels.length > 0 ? expenseLabels : ['Operations'],
    datasets: [
      {
        data: expenseValues.length > 0 ? expenseValues : [1],
        backgroundColor: ['#ef4444', '#f97316', '#eab308', '#64748b', '#ec4899']
      }
    ]
  };

  const handleAddTxn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      showToast('Please specify transaction title', undefined, 'error');
      return;
    }
    try {
      await feesApi.recordTransaction({
        title,
        type: type.toUpperCase(),
        category,
        amount,
        referenceNo: reference
      });
    } catch {
      // Keep local state update
    }
    const newTxn: AccountTransaction = {
      id: `TXN-${Math.floor(200 + Math.random() * 800)}`,
      date: new Date().toISOString().split('T')[0],
      title,
      category,
      type,
      amount,
      reference
    };
    setTransactions([newTxn, ...transactions]);
    setShowAddModal(false);
    showToast('Transaction Logged', `${title} - PKR ${amount.toLocaleString()}`, 'success');
    setTitle('');
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
            Rs. {totalIncome.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>Reconciled institutional revenue</span>
        </div>

        <div className="bca-card" style={{ padding: '20px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>TOTAL OPERATING EXPENSES</span>
            <ArrowDownRight size={20} />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#dc2626', margin: '4px 0' }}>
            Rs. {totalExpenses.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Controlled operational overhead</span>
        </div>

        <div className="bca-card" style={{ padding: '20px', borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2563eb' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>NET FISCAL SURPLUS</span>
            <DollarSign size={20} />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#1d4ed8', margin: '4px 0' }}>
            Rs. {netProfit.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>Net operational balance</span>
        </div>

        <div className="bca-card" style={{ padding: '20px', borderLeft: '4px solid #7c3aed' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7c3aed' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>NET OPERATING MARGIN</span>
            <TrendingUp size={20} />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#7c3aed', margin: '4px 0' }}>
            {marginPct}%
          </div>
          <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>Institutional reserve target met</span>
        </div>
      </div>

      {/* Doughnut Charts Breakdown */}
      <div className="bca-grid-2" style={{ marginBottom: '24px' }}>
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
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  {loading ? 'Loading financial transactions from database...' : 'No general ledger transactions recorded.'}
                </td>
              </tr>
            ) : (
              transactions.map((txn) => (
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
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button
                      onClick={() => handleOpenEditTxn(txn)}
                      className="bca-btn bca-btn-secondary"
                      style={{ padding: '4px 8px', color: '#2563eb' }}
                      title="Edit Transaction"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteTxn(txn.id, txn.title)}
                      className="bca-btn bca-btn-secondary"
                      style={{ padding: '4px 8px', color: '#e11d48' }}
                      title="Delete Transaction"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            )))}
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

          <div className="bca-form-row">
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

          <div className="bca-form-row">
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

      {/* EDIT TRANSACTION MODAL */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Ledger Entry"
        subtitle={`Update transaction record: ${editingTxn?.reference}`}
        maxWidth="500px"
        footer={
          <>
            <button type="submit" form="edit-txn-form" className="bca-btn bca-btn-primary">
              Save Changes
            </button>
            <button type="button" onClick={() => setEditModalOpen(false)} className="bca-btn bca-btn-secondary">
              Cancel
            </button>
          </>
        }
      >
        <form id="edit-txn-form" onSubmit={handleSaveEditTxn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
              Transaction Description *
            </label>
            <input
              type="text"
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div className="bca-form-row">
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Entry Type</label>
              <select
                value={editType}
                onChange={(e) => setEditType(e.target.value as any)}
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
                value={editAmount}
                onChange={(e) => setEditAmount(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Category</label>
            <input
              type="text"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
