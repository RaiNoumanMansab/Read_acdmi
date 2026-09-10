import React, { useState } from 'react';
import {
  PenTool,
  Plus,
  Eye,
  Calendar,
  Clock,
  Search,
  Filter,
  Trash2,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { MOCK_BLOGS } from '../../mockData';
import type { BlogPost } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

export const BlogsCmsView: React.FC = () => {
  const { showToast } = useToast();
  const [blogs, setBlogs] = useState<BlogPost[]>(MOCK_BLOGS);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Blog form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academics');
  const [author, setAuthor] = useState('Academic Council');
  const [excerpt, setExcerpt] = useState('');
  const [readTime, setReadTime] = useState('5 min read');

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt) {
      showToast('Please fill required article fields', undefined, 'error');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const newPost: BlogPost = {
      id: `BLG-${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      category,
      author,
      authorRole: 'Senior Contributor',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      publishedDate: today,
      date: today,
      readTime,
      featuredImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
      tags: [category, 'Beacon Crest', 'Education'],
      excerpt,
      content: excerpt + '\n\nAt Beacon Crest Academy, our pedagogical philosophy blends empirical inquiry with moral integrity. Our students explore advanced projects in robotics, mathematics, and public policy.',
      status: 'Published',
      views: 12
    };
    setBlogs([newPost, ...blogs]);
    setShowAddModal(false);
    showToast('Article Published to Public Website', newPost.title, 'success');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Blog & Academic Articles CMS
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Publish educational thought leadership, school milestones, and student essays on the public website
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="bca-btn bca-btn-primary">
          <Plus size={16} />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Blogs Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}
      >
        {blogs.map((b) => (
          <div
            key={b.id}
            className="bca-card"
            style={{
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img
                  src={b.featuredImage || b.coverImage}
                  alt={b.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  {b.category}
                </span>
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}
                >
                  {b.status}
                </span>
              </div>

              <div style={{ padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: '#64748b', marginBottom: '8px' }}>
                  <span>{b.publishedDate || b.date}</span> • <span>{b.readTime}</span> • <span>{b.views} views</span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0', lineHeight: 1.35 }}>
                  {b.title}
                </h3>

                <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                  {b.excerpt}
                </p>
              </div>
            </div>

            <div style={{ padding: '12px 18px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.76rem', color: '#64748b' }}>By <strong>{b.author}</strong></span>
              <button
                onClick={() => setSelectedPost(b)}
                className="bca-btn bca-btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
              >
                <Eye size={13} /> Preview Article
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PREVIEW ARTICLE MODAL */}
      {selectedPost && (
        <Modal
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          title={selectedPost.title}
          subtitle={`By ${selectedPost.author} • Published on ${selectedPost.publishedDate || selectedPost.date} • ${selectedPost.category}`}
          maxWidth="700px"
          footer={
            <button onClick={() => setSelectedPost(null)} className="bca-btn bca-btn-secondary">
              Close
            </button>
          }
        >
          <div>
            <img
              src={selectedPost.featuredImage || selectedPost.coverImage}
              alt={selectedPost.title}
              style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '10px', marginBottom: '18px' }}
            />
            <div style={{ fontSize: '0.94rem', lineHeight: 1.7, color: '#1e293b', whiteSpace: 'pre-line' }}>
              {selectedPost.content}
            </div>
          </div>
        </Modal>
      )}

      {/* CREATE BLOG MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Compose School Blog Article"
        subtitle="Publishes to the public website under the News & Insights section"
        maxWidth="600px"
        footer={
          <>
            <button type="submit" form="blogForm" className="bca-btn bca-btn-primary">
              Publish to Website
            </button>
            <button type="button" onClick={() => setShowAddModal(false)} className="bca-btn bca-btn-secondary">
              Cancel
            </button>
          </>
        }
      >
        <form id="blogForm" onSubmit={handleCreateBlog} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
              Article Headline *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Fostering Critical Scientific Inquiry in High School"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              >
                <option value="Academics">Academics</option>
                <option value="Sports">Sports</option>
                <option value="STEM">STEM & Robotics</option>
                <option value="Arts & Culture">Arts & Culture</option>
                <option value="Campus Life">Campus Life</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Author Byline</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Short Abstract / Excerpt *</label>
            <textarea
              rows={3}
              required
              placeholder="Write a brief summary of the article..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
