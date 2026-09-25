import React, { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Filter,
  Send,
  Calendar,
  AlertCircle,
  Users,
  Eye,
  Edit2,
  Trash2
} from 'lucide-react';
import type { Notice } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';
import { cmsApi } from '../../services/api';

const mapBackendNotice = (n: any): Notice => ({
  id: n.id,
  title: n.title,
  category: n.category || 'Academic',
  date: n.publishedDate ? n.publishedDate.split('T')[0] : '2026-09-08',
  priority: (n.priority === 'HIGH' || n.priority === 'URGENT' ? 'High' : 'Normal'),
  audience: n.audience || 'All',
  targetAudience: n.audience || 'All',
  content: n.content,
  pinned: n.pinned ?? false,
  publishedBy: 'Principal Office',
  author: 'Principal Office'
});

export const NoticesView: React.FC = () => {
  const { showToast } = useToast();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeNotice, setActiveNotice] = useState<Notice | null>(null);

  // Load notices from live API
  useEffect(() => {
    let isMounted = true;
    cmsApi.getNotices().then((res) => {
      if (isMounted) {
        if (res?.data && Array.isArray(res.data)) {
          setNotices(res.data.map(mapBackendNotice));
        } else {
          setNotices([]);
        }
        setLoading(false);
      }
    }).catch((err) => {
      console.warn('Backend notices fetch failed:', err);
      if (isMounted) {
        setNotices([]);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // New Notice form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Notice['category']>('Academic');
  const [newPriority, setNewPriority] = useState<Notice['priority']>('Normal');
  const [newAudience, setNewAudience] = useState<Notice['audience']>('All');
  const [newContent, setNewContent] = useState('');

  // Edit Notice state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<Notice['category']>('Academic');
  const [editPriority, setEditPriority] = useState<Notice['priority']>('Normal');
  const [editAudience, setEditAudience] = useState<Notice['audience']>('All');
  const [editContent, setEditContent] = useState('');

  const handleOpenEditNotice = (n: Notice) => {
    setEditingNotice(n);
    setEditTitle(n.title);
    setEditCategory(n.category);
    setEditPriority(n.priority);
    setEditAudience(n.audience || n.targetAudience || 'All');
    setEditContent(n.content);
    setEditModalOpen(true);
  };

  const handleSaveEditNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;
    try {
      await cmsApi.updateNotice(editingNotice.id, {
        title: editTitle,
        content: editContent,
        category: editCategory,
        priority: editPriority === 'High' ? 'HIGH' : 'NORMAL',
        audience: editAudience
      });
    } catch (err) {
      console.warn('Backend update error:', err);
    }
    setNotices((prev) =>
      prev.map((n) =>
        n.id === editingNotice.id
          ? {
              ...n,
              title: editTitle,
              category: editCategory,
              priority: editPriority,
              audience: editAudience,
              targetAudience: editAudience,
              content: editContent
            }
          : n
      )
    );
    showToast('Notice updated successfully', undefined, 'success');
    setEditModalOpen(false);
    setEditingNotice(null);
  };

  const handleDeleteNotice = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete notice "${title}"?`)) return;
    try {
      await cmsApi.deleteNotice(id);
    } catch (err) {
      console.warn('Backend delete error:', err);
    }
    setNotices((prev) => prev.filter((n) => n.id !== id));
    showToast('Notice deleted successfully', undefined, 'success');
  };

  const categories = ['All', 'Academic', 'Fee', 'Events', 'Holiday', 'Administrative'];

  const filtered = notices.filter((n) => {
    if (categoryFilter === 'All') return true;
    return n.category === categoryFilter;
  });

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) {
      showToast('Please provide notice title and message body', undefined, 'error');
      return;
    }
    try {
      const res = await cmsApi.publishNotice({
        title: newTitle,
        content: newContent,
        category: newCategory,
        priority: newPriority === 'High' ? 'HIGH' : 'NORMAL',
        audience: newAudience
      });
      if (res?.data) {
        setNotices((prev) => [mapBackendNotice(res.data), ...prev]);
      } else {
        const newNotice: Notice = {
          id: `NOT-${Date.now()}`,
          title: newTitle,
          category: newCategory,
          date: new Date().toISOString().split('T')[0],
          priority: newPriority,
          audience: newAudience || 'All',
          targetAudience: newAudience,
          content: newContent,
          pinned: false,
          publishedBy: 'Super Admin Office',
          author: 'Super Admin Office'
        };
        setNotices([newNotice, ...notices]);
      }
    } catch {
      const newNotice: Notice = {
        id: `NOT-${Date.now()}`,
        title: newTitle,
        category: newCategory,
        date: new Date().toISOString().split('T')[0],
        priority: newPriority,
        audience: newAudience || 'All',
        targetAudience: newAudience,
        content: newContent,
        pinned: false,
        publishedBy: 'Super Admin Office',
        author: 'Super Admin Office'
      };
      setNotices([newNotice, ...notices]);
    }
    setShowAddModal(false);
    showToast('Notice Published & Broadcasted', `Dispatched to ${newAudience}`, 'success');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Notice Board & Broadcast Circulars
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Publish campus notices, send urgent alerts to parents, and archive institutional circulars
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bca-btn bca-btn-primary"
        >
          <Plus size={16} />
          <span>Publish Notice</span>
        </button>
      </div>

      {/* Category Pills */}
      <div
        className="bca-card"
        style={{
          padding: '12px 18px',
          marginBottom: '20px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto'
        }}
      >
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className="bca-btn"
            style={{
              backgroundColor: categoryFilter === c ? '#2563eb' : '#f8fafc',
              color: categoryFilter === c ? '#ffffff' : '#64748b',
              border: '1px solid',
              borderColor: categoryFilter === c ? '#2563eb' : '#e2e8f0',
              padding: '6px 14px',
              fontSize: '0.8rem',
              whiteSpace: 'nowrap'
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Notices Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#64748b', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          {loading ? 'Loading circulars & notices from database...' : 'No circular notices found in this category.'}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '18px'
          }}
        >
          {filtered.map((notice) => (
            <div
              key={notice.id}
              className="bca-card"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderLeft: notice.priority === 'Urgent' ? '4px solid #f43f5e' : notice.priority === 'High' ? '4px solid #f59e0b' : '4px solid #2563eb'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="bca-badge bca-badge-primary">
                  {notice.category}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: notice.priority === 'Urgent' ? '#ffe4e6' : notice.priority === 'High' ? '#fef3c7' : '#f1f5f9',
                    color: notice.priority === 'Urgent' ? '#e11d48' : notice.priority === 'High' ? '#b45309' : '#64748b'
                  }}
                >
                  {notice.priority}
                </span>
              </div>

              <h3 style={{ fontSize: '1.08rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                {notice.title}
              </h3>

              <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                {notice.content}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px', fontSize: '0.76rem', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={13} />
                <span>Target: <strong>{notice.targetAudience || notice.audience}</strong></span>
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button
                  onClick={() => setActiveNotice(notice)}
                  className="bca-btn bca-btn-secondary"
                  style={{ padding: '3px 8px', fontSize: '0.74rem' }}
                >
                  <Eye size={12} /> View
                </button>
                <button
                  onClick={() => handleOpenEditNotice(notice)}
                  className="bca-btn bca-btn-secondary"
                  title="Edit Notice"
                  style={{ padding: '3px 8px', color: '#2563eb' }}
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={() => handleDeleteNotice(notice.id, notice.title)}
                  className="bca-btn bca-btn-secondary"
                  title="Delete Notice"
                  style={{ padding: '3px 8px', color: '#e11d48' }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
            </div>
          ))}
        </div>
      )}

      {/* NOTICE DETAIL MODAL */}
      {activeNotice && (
        <Modal
          isOpen={!!activeNotice}
          onClose={() => setActiveNotice(null)}
          title={activeNotice.title}
          subtitle={`Published on ${activeNotice.date} by ${activeNotice.author}`}
          maxWidth="560px"
          footer={
            <button onClick={() => setActiveNotice(null)} className="bca-btn bca-btn-secondary">
              Close
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="bca-badge bca-badge-primary">{activeNotice.category}</span>
              <span className="bca-badge bca-badge-active">Priority: {activeNotice.priority}</span>
              <span className="bca-badge bca-badge-present">Target: {activeNotice.targetAudience}</span>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: '#1e293b', whiteSpace: 'pre-wrap' }}>
              {activeNotice.content}
            </p>
          </div>
        </Modal>
      )}

      {/* PUBLISH NOTICE MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Publish Circular Notice"
        subtitle="Dispatches notification to web portal, mobile app and SMS gateway"
        maxWidth="540px"
        footer={
          <>
            <button type="submit" form="noticeForm" className="bca-btn bca-btn-primary">
              <Send size={15} /> Publish Circular
            </button>
            <button type="button" onClick={() => setShowAddModal(false)} className="bca-btn bca-btn-secondary">
              Cancel
            </button>
          </>
        }
      >
        <form id="noticeForm" onSubmit={handleCreateNotice} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
              Notice Subject / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Schedule of Annual Sports Gala 2026"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div className="bca-form-row-3">
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              >
                <option value="Academic">Academic</option>
                <option value="Fee">Fee</option>
                <option value="Events">Events</option>
                <option value="Holiday">Holiday</option>
                <option value="Administrative">Administrative</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Target Audience</label>
              <select
                value={newAudience}
                onChange={(e) => setNewAudience(e.target.value as any)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              >
                <option value="All">All School</option>
                <option value="Parents">Parents Only</option>
                <option value="Students">Students Only</option>
                <option value="Teachers">Teachers Only</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Notice Text Body *</label>
            <textarea
              rows={4}
              required
              placeholder="Write the full circular announcement..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>
        </form>
      </Modal>

      {/* EDIT NOTICE MODAL */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Notice Circular"
        subtitle={`Update announcement: ${editingNotice?.title}`}
        maxWidth="540px"
        footer={
          <>
            <button type="submit" form="edit-notice-form" className="bca-btn bca-btn-primary">
              Save Changes
            </button>
            <button type="button" onClick={() => setEditModalOpen(false)} className="bca-btn bca-btn-secondary">
              Cancel
            </button>
          </>
        }
      >
        <form id="edit-notice-form" onSubmit={handleSaveEditNotice} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Notice Heading / Title *</label>
            <input
              type="text"
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Category</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as any)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              >
                <option value="Academic">Academic</option>
                <option value="Fee">Fee</option>
                <option value="Events">Events</option>
                <option value="Holiday">Holiday</option>
                <option value="Administrative">Administrative</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Priority</label>
              <select
                value={editPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Target Audience</label>
              <select
                value={editAudience}
                onChange={(e) => setEditAudience(e.target.value as any)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              >
                <option value="All">All School</option>
                <option value="Parents">Parents Only</option>
                <option value="Students">Students Only</option>
                <option value="Teachers">Teachers Only</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Notice Text Body *</label>
            <textarea
              rows={4}
              required
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
