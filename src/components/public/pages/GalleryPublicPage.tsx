import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { MOCK_GALLERY } from '../../../mockData';
import type { GalleryAlbum } from '../../../types';
import { Modal } from '../../common/Modal';

export const GalleryPublicPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeItem, setActiveItem] = useState<GalleryAlbum | null>(null);

  const categories = ['All', 'Campus', 'Science & Innovation', 'Sports', 'Arts & Culture', 'Events'];

  const filtered = MOCK_GALLERY.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  return (
    <div>
      {/* Hero Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #04142a 0%, #0B3974 100%)',
          color: '#ffffff',
          padding: '70px 24px',
          textAlign: 'center',
          borderBottom: '4px solid #FFD700'
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Campus Life in Pictures • Read To Lead
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, margin: '8px 0 16px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Moments of Discovery, Passion & Achievement
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            Explore visual highlights of life at Read Academy Sahiwal — from intense scientific experiments to sports championships and cultural celebrations.
          </p>
        </div>
      </section>

      {/* Category Pills */}
      <section style={{ padding: '36px 24px 16px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="bca-btn"
              style={{
                backgroundColor: selectedCategory === cat ? '#0B3974' : '#ffffff',
                color: selectedCategory === cat ? '#ffffff' : '#475569',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#0B3974' : '#cbd5e1',
                padding: '8px 18px',
                fontSize: '0.84rem',
                fontWeight: selectedCategory === cat ? 700 : 500
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Cards Grid */}
      <section style={{ padding: '20px 24px 80px', backgroundColor: '#f8fafc' }}>
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '24px'
          }}
        >
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="bca-card"
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                borderTop: '4px solid #E62929'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 30px rgba(230, 41, 41, 0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--bca-shadow-sm)';
              }}
            >
              <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                <img
                  src={item.coverImage}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.3)',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                >
                  <Maximize2 size={32} />
                </div>
              </div>

              <div style={{ padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="bca-badge bca-badge-primary">{item.category}</span>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{item.date}</span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeItem && (
        <Modal
          isOpen={!!activeItem}
          onClose={() => setActiveItem(null)}
          title={activeItem.title}
          subtitle={`${activeItem.category} • Captured on ${activeItem.date}`}
          maxWidth="840px"
          footer={
            <button onClick={() => setActiveItem(null)} className="bca-btn bca-btn-secondary">
              Close Preview
            </button>
          }
        >
          <div style={{ textAlign: 'center' }}>
            <img
              src={activeItem.coverImage}
              alt={activeItem.title}
              style={{ maxWidth: '100%', maxHeight: '540px', objectFit: 'contain', borderRadius: '12px' }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
