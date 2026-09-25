import React, { useState, useEffect } from 'react';
import {
  PenTool,
  Plus,
  Eye,
  Calendar,
  Clock,
  Search,
  Filter,
  Trash2,
  Edit2,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import type { BlogPost } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';
import { cmsApi } from '../../services/api';

const mapBackendBlog = (b: any): BlogPost => ({
  id: b.id,
  title: b.title,
  slug: b.slug,
  category: b.category,
  author: b.author?.fullName || 'Academic Council',
  authorRole: 'Senior Contributor',
  authorAvatar: b.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  publishedDate: b.publishedAt ? b.publishedAt.split('T')[0] : '2026-09-08',
  date: b.publishedAt ? b.publishedAt.split('T')[0] : '2026-09-08',
  readTime: '5 min read',
  featuredImage: b.featuredImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
  coverImage: b.featuredImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
  tags: b.tags || ['Education', 'Read Academy'],
  excerpt: b.excerpt || b.content?.slice(0, 150) || '',
  content: b.content || '',
  status: b.isPublished ? 'Published' : 'Draft',
  views: b.viewsCount || 24
});

export const BlogsCmsView: React.FC = () => {
  const { showToast } = useToast();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch blogs from API
  useEffect(() => {
    let isMounted = true;
    cmsApi.getBlogs().then((res) => {
      if (isMounted) {
        if (res?.data && Array.isArray(res.data)) {
          setBlogs(res.data.map(mapBackendBlog));
        } else {
          setBlogs([]);
        }
        setLoading(false);
      }
    }).catch((err) => {
      console.warn('Backend blogs fetch failed:', err);
      if (isMounted) {
        setBlogs([]);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // New Blog form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academics');
  const [author, setAuthor] = useState('Academic Council');
  const [excerpt, setExcerpt] = useState('');
  const [readTime, setReadTime] = useState('5 min read');

  // Edit Blog state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('Academics');
  const [editAuthor, setEditAuthor] = useState('');
  const [editExcerpt, setEditExcerpt] = useState('');
  const [editContent, setEditContent] = useState('');

  const handleOpenEditBlog = (b: BlogPost) => {
    setEditingBlog(b);
    setEditTitle(b.title);
    setEditCategory(b.category);
    setEditAuthor(b.author);
    setEditExcerpt(b.excerpt || '');
    setEditContent(b.content || b.excerpt || '');
    setEditModalOpen(true);
  };

  const handleSaveEditBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    try {
      await cmsApi.updateBlog(editingBlog.id, {
        title: editTitle,
        category: editCategory,
        excerpt: editExcerpt,
        content: editContent
      });
    } catch (err) {
      console.warn('Backend blog update error:', err);
    }
    setBlogs((prev) =>
      prev.map((b) =>
        b.id === editingBlog.id
          ? {
              ...b,
              title: editTitle,
              category: editCategory,
              author: editAuthor,
              excerpt: editExcerpt,
              content: editContent
            }
          : b
      )
    );
    showToast('Blog article updated successfully', undefined, 'success');
    setEditModalOpen(false);
    setEditingBlog(null);
  };

  const handleDeleteBlog = async (id: string, postTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete article "${postTitle}"?`)) return;
    try {
      await cmsApi.deleteBlog(id);
    } catch (err) {
      console.warn('Backend blog delete error:', err);
    }
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    showToast('Blog article deleted successfully', undefined, 'success');
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt) {
      showToast('Please fill required article fields', undefined, 'error');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    try {
      const res = await cmsApi.publishBlog({
        title,
        excerpt,
        content: excerpt + '\n\nAt Read Academy Sahiwal, our pedagogical philosophy blends empirical inquiry with moral integrity. Our students explore advanced projects in robotics, mathematics, and science.',
        category,
        tags: [category, 'Read Academy', 'Education']
      });
      if (res?.data) {
        setBlogs((prev) => [mapBackendBlog(res.data), ...prev]);
      } else {
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
          tags: [category, 'Read Academy', 'Education'],
          excerpt,
          content: excerpt + '\n\nAt Read Academy Sahiwal, our pedagogical philosophy blends empirical inquiry with moral integrity. Our students explore advanced projects in robotics, mathematics, and science.',
          status: 'Published',
          views: 12
        };
        setBlogs([newPost, ...blogs]);
      }
    } catch {
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
        tags: [category, 'Read Academy', 'Education'],
        excerpt,
        content: excerpt + '\n\nAt Read Academy Sahiwal, our pedagogical philosophy blends empirical inquiry with moral integrity. Our students explore advanced projects in robotics, mathematics, and science.',
        status: 'Published',
        views: 12
      };
      setBlogs([newPost, ...blogs]);
    }
    setShowAddModal(false);
    showToast('Article Published to Public Website', title, 'success');
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
      {blogs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#64748b', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          {loading ? 'Loading blog articles from database...' : 'No published blog posts found.'}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
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
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button
                  onClick={() => setSelectedPost(b)}
                  className="bca-btn bca-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                >
                  <Eye size={13} /> Preview
                </button>
                <button
                  onClick={() => handleOpenEditBlog(b)}
                  className="bca-btn bca-btn-secondary"
                  title="Edit Blog"
                  style={{ padding: '4px 8px', color: '#2563eb' }}
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => handleDeleteBlog(b.id, b.title)}
                  className="bca-btn bca-btn-secondary"
                  title="Delete Blog"
                  style={{ padding: '4px 8px', color: '#e11d48' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            </div>
          ))}
        </div>
      )}

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

          <div className="bca-form-row">
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

      {/* EDIT BLOG MODAL */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Blog Article"
        subtitle={`Update post: ${editingBlog?.title}`}
        maxWidth="620px"
        footer={
          <>
            <button type="submit" form="edit-blog-form" className="bca-btn bca-btn-primary">
              Save Changes
            </button>
            <button type="button" onClick={() => setEditModalOpen(false)} className="bca-btn bca-btn-secondary">
              Cancel
            </button>
          </>
        }
      >
        <form id="edit-blog-form" onSubmit={handleSaveEditBlog} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Article Headline *</label>
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
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Category *</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
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
                value={editAuthor}
                onChange={(e) => setEditAuthor(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Short Abstract / Excerpt *</label>
            <textarea
              rows={2}
              required
              value={editExcerpt}
              onChange={(e) => setEditExcerpt(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Full Article Content</label>
            <textarea
              rows={4}
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
