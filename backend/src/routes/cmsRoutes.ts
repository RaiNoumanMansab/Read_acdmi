import { Router, Request, Response } from 'express';
import { Prisma, NoticePriority } from '@prisma/client';
import { prisma } from '../db/prisma.js';

const router = Router();

// ==========================================
// 1. NOTICES
// ==========================================
router.get('/notices', async (req: Request, res: Response) => {
  try {
    const { priority, audience } = req.query;
    const whereClause: Prisma.NoticeWhereInput = {};

    if (priority) whereClause.priority = String(priority).toUpperCase() as NoticePriority;
    if (audience) whereClause.audience = String(audience);

    const notices = await prisma.notice.findMany({
      where: whereClause,
      include: { publishedBy: true },
      orderBy: [{ pinned: 'desc' }, { publishedDate: 'desc' }],
    });

    res.json({ status: 'success', count: notices.length, data: notices });
  } catch (error) {
    console.error('Fetch notices error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve notices' });
  }
});

router.post('/notices', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, category, priority = 'NORMAL', audience = 'All', pinned = false, publishedById } = req.body;

    if (!title || !content || !category) {
      res.status(400).json({ status: 'error', message: 'Title, content, and category are required' });
      return;
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        category,
        priority: priority.toUpperCase(),
        audience,
        pinned: Boolean(pinned),
        publishedById,
      },
    });

    res.status(201).json({ status: 'success', message: 'Notice published', data: notice });
  } catch (error) {
    console.error('Publish notice error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to publish notice' });
  }
});

router.patch('/notices/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, category, priority, audience, pinned } = req.body;
    const updateData: Prisma.NoticeUpdateInput = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;
    if (priority !== undefined) updateData.priority = priority.toUpperCase() as NoticePriority;
    if (audience !== undefined) updateData.audience = audience;
    if (pinned !== undefined) updateData.pinned = Boolean(pinned);

    const notice = await prisma.notice.update({
      where: { id },
      data: updateData,
    });
    res.json({ status: 'success', message: 'Notice updated', data: notice });
  } catch (error) {
    console.error('Update notice error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update notice' });
  }
});

router.delete('/notices/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.notice.delete({ where: { id } });
    res.json({ status: 'success', message: 'Notice deleted' });
  } catch (error) {
    console.error('Delete notice error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete notice' });
  }
});

// ==========================================
// 2. BLOG POSTS
// ==========================================
router.get('/blogs', async (_req: Request, res: Response) => {
  try {
    const blogs = await prisma.blogPost.findMany({
      include: { author: true },
      orderBy: { publishedAt: 'desc' },
    });
    res.json({ status: 'success', count: blogs.length, data: blogs });
  } catch (error) {
    console.error('Fetch blogs error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve blogs' });
  }
});

router.get('/blogs/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const blog = await prisma.blogPost.findUnique({
      where: { slug },
      include: { author: true },
    });

    if (!blog) {
      res.status(404).json({ status: 'error', message: 'Blog post not found' });
      return;
    }

    // Increment views
    await prisma.blogPost.update({
      where: { slug },
      data: { viewsCount: { increment: 1 } },
    });

    res.json({ status: 'success', data: blog });
  } catch (error) {
    console.error('Fetch blog error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve blog post' });
  }
});

router.post('/blogs', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, excerpt, content, category, tags = [], authorId, featuredImage } = req.body;

    if (!title || !content || !category) {
      res.status(400).json({ status: 'error', message: 'Title, content, and category are required' });
      return;
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + `-${Date.now().toString().slice(-4)}`;

    const blog = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        tags,
        authorId,
        featuredImage,
      },
    });

    res.status(201).json({ status: 'success', message: 'Blog post created', data: blog });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create blog post' });
  }
});

router.patch('/blogs/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, category, tags, featuredImage } = req.body;
    const updateData: Prisma.BlogPostUpdateInput = {};
    if (title !== undefined) updateData.title = title;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage;

    const blog = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });
    res.json({ status: 'success', message: 'Blog post updated', data: blog });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update blog post' });
  }
});

router.delete('/blogs/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.blogPost.delete({ where: { id } });
    res.json({ status: 'success', message: 'Blog post deleted' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete blog post' });
  }
});

// ==========================================
// 3. GALLERY ALBUMS & IMAGES
// ==========================================
router.get('/gallery', async (_req: Request, res: Response) => {
  try {
    const albums = await prisma.galleryAlbum.findMany({
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ status: 'success', count: albums.length, data: albums });
  } catch (error) {
    console.error('Fetch gallery error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve gallery albums' });
  }
});

router.post('/gallery/albums', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, coverUrl, eventDate } = req.body;

    if (!title || !category) {
      res.status(400).json({ status: 'error', message: 'Title and category are required' });
      return;
    }

    const album = await prisma.galleryAlbum.create({
      data: {
        title,
        category,
        coverUrl,
        eventDate: eventDate ? new Date(eventDate) : null,
      },
    });

    res.status(201).json({ status: 'success', message: 'Album created', data: album });
  } catch (error) {
    console.error('Create album error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create album' });
  }
});

router.post('/gallery/albums/:albumId/images', async (req: Request, res: Response): Promise<void> => {
  try {
    const { albumId } = req.params;
    const { imageUrl, caption, sortOrder = 0 } = req.body;

    if (!imageUrl) {
      res.status(400).json({ status: 'error', message: 'imageUrl is required' });
      return;
    }

    const image = await prisma.galleryImage.create({
      data: {
        albumId,
        imageUrl,
        caption,
        sortOrder: Number(sortOrder),
      },
    });

    res.status(201).json({ status: 'success', message: 'Image added to album', data: image });
  } catch (error) {
    console.error('Add image error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to add image to album' });
  }
});

router.delete('/gallery/albums/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.galleryImage.deleteMany({ where: { albumId: id } });
    await prisma.galleryAlbum.delete({ where: { id } });
    res.json({ status: 'success', message: 'Album deleted' });
  } catch (error) {
    console.error('Delete album error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete album' });
  }
});

router.delete('/gallery/images/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.galleryImage.delete({ where: { id } });
    res.json({ status: 'success', message: 'Image deleted' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete image' });
  }
});

// ==========================================
// 4. SCHOOL EVENTS
// ==========================================
router.get('/events', async (_req: Request, res: Response) => {
  try {
    const events = await prisma.schoolEvent.findMany({
      orderBy: { eventDate: 'asc' },
    });
    res.json({ status: 'success', count: events.length, data: events });
  } catch (error) {
    console.error('Fetch events error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve events' });
  }
});

router.post('/events', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, eventDate, eventTime, location, description, bannerImage, isPublic = true } = req.body;

    if (!title || !category || !eventDate) {
      res.status(400).json({ status: 'error', message: 'Title, category, and eventDate are required' });
      return;
    }

    const event = await prisma.schoolEvent.create({
      data: {
        title,
        category,
        eventDate: new Date(eventDate),
        eventTime,
        location,
        description,
        bannerImage,
        isPublic: Boolean(isPublic),
      },
    });

    res.status(201).json({ status: 'success', message: 'Event scheduled', data: event });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to schedule event' });
  }
});

router.patch('/events/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, category, eventDate, eventTime, location, description, bannerImage, isPublic, status } = req.body;

    const updateData: Prisma.SchoolEventUpdateInput = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (eventDate !== undefined) updateData.eventDate = new Date(eventDate);
    if (eventTime !== undefined) updateData.eventTime = eventTime;
    if (location !== undefined) updateData.location = location;
    if (description !== undefined) updateData.description = description;
    if (bannerImage !== undefined) updateData.bannerImage = bannerImage;
    if (isPublic !== undefined) updateData.isPublic = Boolean(isPublic);
    if (status !== undefined) updateData.status = status;

    const event = await prisma.schoolEvent.update({
      where: { id },
      data: updateData,
    });

    res.json({ status: 'success', message: 'Event updated', data: event });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update event' });
  }
});

router.delete('/events/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.schoolEvent.delete({ where: { id } });
    res.json({ status: 'success', message: 'Event deleted' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete event' });
  }
});

// ==========================================
// 5. CONTACT INQUIRIES
// ==========================================
router.get('/contact', async (_req: Request, res: Response) => {
  try {
    const inquiries = await prisma.contactInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ status: 'success', count: inquiries.length, data: inquiries });
  } catch (error) {
    console.error('Fetch contact inquiries error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve messages' });
  }
});

router.post('/contact', async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    if (!fullName || !email || !message) {
      res.status(400).json({ status: 'error', message: 'Full name, email, and message are required' });
      return;
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        fullName,
        email,
        phone,
        subject,
        message,
      },
    });

    res.status(201).json({ status: 'success', message: 'Message sent successfully', data: inquiry });
  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to send message' });
  }
});

export default router;
