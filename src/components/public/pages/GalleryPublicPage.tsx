import React, { useState, useEffect } from 'react';
import { Maximize2 } from 'lucide-react';
import type { GalleryAlbum } from '../../../types';
import { Modal } from '../../common/Modal';
import { ScrollReveal } from '../../common/ScrollReveal';
import { LoadingState } from '../../common/Spinner';
import { cmsApi } from '../../../services/api';

export const GalleryPublicPage: React.FC = () => {
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeItem, setActiveItem] = useState<any | null>(null);

  useEffect(() => {
    setLoading(true);
    cmsApi.getGallery().then((res) => {
      if (res?.data) setGallery(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Campus', 'Science & Innovation', 'Sports', 'Arts & Culture', 'Events'];

  const filtered = gallery.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  return (
    <div>
      {/* Hero Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #04142a 0%, #0B3974 55%, #0e458e 100%)',
          color: '#ffffff',
          padding: 'clamp(75px, 8vw, 105px) 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '4px solid #E62929'
        }}
      >
        {/* Background decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.18) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <ScrollReveal animation="up">
          <div style={{ maxWidth: '1020px', margin: '0 auto' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Campus Life in Pictures • Read To Lead
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', fontWeight: 700, lineHeight: 1.25, margin: '8px 0 16px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
              Moments of Discovery, Passion & Achievement
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              Explore visual highlights of life at Read Academy Sahiwal — from intense scientific experiments to sports championships and cultural celebrations.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Category Pills */}
      <section style={{ padding: '36px 24px 16px', backgroundColor: '#f8fafc' }}>
        <ScrollReveal animation="up">
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
        </ScrollReveal>
      </section>

      {/* Gallery Cards Grid */}
      <section style={{ padding: '20px 24px 80px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <LoadingState message="Loading campus media gallery & albums..." minHeight="300px" />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              No media items found in this album category.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '24px'
              }}
            >
              {filtered.map((item, idx) => (
            <ScrollReveal key={item.id} animation="zoom" delay={idx * 60}>
              <div
                onClick={() => setActiveItem(item)}
                className="bca-card card-interactive-lift"
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  borderTop: '4px solid #E62929',
                  height: '100%'
                }}
              >
                <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="scale-hover-img"
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
            </ScrollReveal>
          ))}
            </div>
          )}
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
