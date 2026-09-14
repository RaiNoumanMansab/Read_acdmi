import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Filter,
  Eye,
  Trash2,
  Upload,
  Calendar
} from 'lucide-react';
import { MOCK_GALLERY } from '../../mockData';
import type { GalleryAlbum } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

export const GalleryCmsView: React.FC = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState<GalleryAlbum[]>(MOCK_GALLERY);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryAlbum | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New Media form
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat] = useState('Campus');
  const [newUrl, setNewUrl] = useState('');

  const categories = ['All', 'Campus', 'Science & Innovation', 'Sports', 'Arts & Culture', 'Events'];

  const filtered = items.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) {
      showToast('Please enter an image title', undefined, 'error');
      return;
    }
    const uploadedUrl = newUrl || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=600&auto=format&fit=crop&q=80';
    const newItem: GalleryAlbum = {
      id: `GAL-${Date.now()}`,
      title: newTitle,
      category: newCat,
      coverImage: uploadedUrl,
      imageUrl: uploadedUrl,
      date: new Date().toISOString().split('T')[0],
      photosCount: 1,
      images: [{ url: uploadedUrl, caption: newTitle }]
    };
    setItems([newItem, ...items]);
    setShowUploadModal(false);
    showToast('Photo Published to Public Gallery', newItem.title, 'success');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Media Gallery CMS
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Manage public media albums, campus photography, event showcases, and press assets
          </p>
        </div>

        <button onClick={() => setShowUploadModal(true)} className="bca-btn bca-btn-primary">
          <Upload size={16} />
          <span>Upload Media Assets</span>
        </button>
      </div>

      {/* Categories Filter */}
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
            onClick={() => setSelectedCategory(c)}
            className="bca-btn"
            style={{
              backgroundColor: selectedCategory === c ? '#2563eb' : '#f8fafc',
              color: selectedCategory === c ? '#ffffff' : '#64748b',
              border: '1px solid',
              borderColor: selectedCategory === c ? '#2563eb' : '#e2e8f0',
              padding: '6px 14px',
              fontSize: '0.8rem',
              whiteSpace: 'nowrap'
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '18px'
        }}
      >
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bca-card"
            style={{
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative'
            }}
            onClick={() => setLightboxItem(item)}
          >
            <div style={{ height: '220px', overflow: 'hidden' }}>
              <img
                src={item.coverImage || item.imageUrl}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </div>

            <div style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span className="bca-badge bca-badge-primary">{item.category}</span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{item.date}</span>
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxItem && (
        <Modal
          isOpen={!!lightboxItem}
          onClose={() => setLightboxItem(null)}
          title={lightboxItem.title}
          subtitle={`${lightboxItem.category} • Captured: ${lightboxItem.date}`}
          maxWidth="800px"
          footer={
            <button onClick={() => setLightboxItem(null)} className="bca-btn bca-btn-secondary">
              Close Preview
            </button>
          }
        >
          <div style={{ textAlign: 'center' }}>
            <img
              src={lightboxItem.coverImage || lightboxItem.imageUrl}
              alt={lightboxItem.title}
              style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '10px' }}
            />
          </div>
        </Modal>
      )}

      {/* UPLOAD MODAL */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Media Assets to Gallery"
        subtitle="Add photographic highlights to school archive and public website"
        maxWidth="520px"
        footer={
          <>
            <button type="submit" form="uploadForm" className="bca-btn bca-btn-primary">
              Upload Asset
            </button>
            <button type="button" onClick={() => setShowUploadModal(false)} className="bca-btn bca-btn-secondary">
              Cancel
            </button>
          </>
        }
      >
        <form id="uploadForm" onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
              Media Caption / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Annual Badminton Trophy Finals"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Album Category *</label>
            <select
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            >
              <option value="Campus">Campus Architecture</option>
              <option value="Science & Innovation">Science & Innovation</option>
              <option value="Sports">Sports</option>
              <option value="Arts & Culture">Arts & Culture</option>
              <option value="Events">Events</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Image URL (Demo Upload)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
