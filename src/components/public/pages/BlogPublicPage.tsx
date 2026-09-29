import React, { useState, useEffect } from 'react';
import {
  Search,
  ArrowRight,
  Share2,
  RotateCw,
  Clock,
  Eye,
  User,
  BookOpen
} from 'lucide-react';
import type { BlogPost } from '../../../types';
import { Modal } from '../../common/Modal';
import { useToast } from '../../common/Toast';
import { ScrollReveal } from '../../common/ScrollReveal';
import { FlipCard } from '../../common/FlipCard';
import { LoadingState } from '../../common/Spinner';
import { cmsApi } from '../../../services/api';

export const BlogPublicPage: React.FC = () => {
  const { showToast } = useToast();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState<any | null>(null);

  useEffect(() => {
    setLoading(true);
    cmsApi.getBlogs().then((res) => {
      if (res?.data) setBlogs(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Academics', 'STEM & Innovation', 'Sports & Wellness', 'Campus Milestones'];

  const filtered = blogs.filter((post) => {
    const authorName = post.author?.fullName || post.author || '';
    const matchesCat = selectedCategory === 'All' || (post.category && post.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesSearch =
      (post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
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
              Thought Leadership & News • Read To Lead
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', fontWeight: 700, lineHeight: 1.25, margin: '8px 0 16px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
              Read Academy Journal & Educational Insights
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              Read perspectives on progressive pedagogical science, student research breakthroughs, and institutional announcements from our faculty and academic council.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Filter & Search Bar */}
      <section style={{ padding: '36px 24px 16px', backgroundColor: '#f8fafc' }}>
        <ScrollReveal animation="up">
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className="bca-btn"
                  style={{
                    backgroundColor: selectedCategory === c ? '#0B3974' : '#ffffff',
                    color: selectedCategory === c ? '#ffffff' : '#475569',
                    border: '1px solid',
                    borderColor: selectedCategory === c ? '#0B3974' : '#cbd5e1',
                    padding: '6px 16px',
                    fontSize: '0.82rem',
                    fontWeight: selectedCategory === c ? 700 : 500,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
              <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                placeholder="Search articles, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '7px 10px 7px 32px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
              />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Articles Grid */}
      <section style={{ padding: '20px 24px 80px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
              <LoadingState message="Loading campus blog & academic articles..." minHeight="300px" />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              No published articles found in this category.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '24px'
              }}
            >
              {filtered.map((post, idx) => (
                <ScrollReveal key={post.id} animation="up" delay={idx * 80}>
                  <FlipCard
                    minHeight="430px"
                    front={
                      <div
                        style={{
                          borderRadius: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          height: '100%'
                        }}
                      >
                        <div>
                          <div style={{ height: '190px', overflow: 'hidden', position: 'relative' }}>
                            <img src={post.featuredImage} alt={post.title} className="scale-hover-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <span
                              style={{
                                position: 'absolute',
                                top: '12px',
                                left: '12px',
                                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                                color: '#ffffff',
                                backdropFilter: 'blur(4px)',
                                padding: '3px 10px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 700
                              }}
                            >
                              {post.category}
                            </span>
                          </div>

                          <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: '#64748b', marginBottom: '8px' }}>
                              <span>{post.publishedDate}</span> • <span>{post.readTime}</span> • <span>{post.views} views</span>
                            </div>

                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a', lineHeight: 1.35 }}>
                              {post.title}
                            </h3>

                            <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                              {post.excerpt}
                            </p>
                          </div>
                        </div>

                        <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="bca-flip-hint-badge">
                            <RotateCw size={12} /> Hover to Flip
                          </span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePost(post);
                            }}
                            style={{ fontSize: '0.82rem', color: '#0B3974', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                          >
                            Read Article <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    }
                    back={
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '12px', marginBottom: '14px' }}>
                            <div>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                {post.category}
                              </span>
                              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', margin: '4px 0 0 0', lineHeight: 1.3 }}>
                                {post.title}
                              </h4>
                            </div>
                            <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', color: '#FFD700', display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                              <RotateCw size={11} /> Story
                            </span>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', color: '#e2e8f0', marginBottom: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <User size={14} color="#FFD700" style={{ flexShrink: 0 }} />
                              <span>Author: <strong>{post.author}</strong></span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Clock size={14} color="#FFD700" style={{ flexShrink: 0 }} />
                              <span>Reading Time: {post.readTime}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Eye size={14} color="#FFD700" style={{ flexShrink: 0 }} />
                              <span>Community Reads: {post.views}</span>
                            </div>
                          </div>

                          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
                            "{post.excerpt}"
                          </p>
                        </div>

                        <div style={{ paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePost(post);
                            }}
                            style={{
                              width: '100%',
                              backgroundColor: '#E62929',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '10px 16px',
                              fontWeight: 700,
                              fontSize: '0.84rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              boxShadow: '0 4px 14px rgba(230, 41, 41, 0.4)'
                            }}
                          >
                            <BookOpen size={14} /> Read Full Article
                          </button>
                        </div>
                      </div>
                    }
                  />
                </ScrollReveal>
              ))}
        </div>
      )}
        </div>
      </section>

      {/* ARTICLE READ MODAL */}
      {activePost && (
        <Modal
          isOpen={!!activePost}
          onClose={() => setActivePost(null)}
          title={activePost.title}
          subtitle={`By ${activePost.author} • Published ${activePost.publishedDate} • ${activePost.readTime}`}
          maxWidth="760px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast('Article Link Copied to Clipboard', undefined, 'success');
                }}
                className="bca-btn bca-btn-secondary"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                <Share2 size={14} /> Share Article
              </button>
              <button onClick={() => setActivePost(null)} className="bca-btn bca-btn-primary">
                Close Article
              </button>
            </div>
          }
        >
          <div>
            <img
              src={activePost.featuredImage}
              alt={activePost.title}
              style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px', marginBottom: '20px' }}
            />
            <div style={{ fontSize: '1rem', lineHeight: 1.8, color: '#1e293b', whiteSpace: 'pre-line' }}>
              {activePost.content}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
