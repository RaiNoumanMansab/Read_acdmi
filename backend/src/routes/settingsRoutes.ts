import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma.js';

const router = Router();

const DEFAULT_SETTINGS: Record<string, { value: string; group: string }> = {
  name: { value: 'Read Academy Sahiwal', group: 'general' },
  shortName: { value: 'Read Academy', group: 'general' },
  tagline: { value: 'Read To Lead', group: 'general' },
  motto: { value: 'Read To Lead', group: 'general' },
  levels: { value: 'Nursery to Matriculation, FA, FSC, ICS, I.Com & D.Com', group: 'general' },
  code: { value: 'RAS-SWL-2018', group: 'general' },
  established: { value: '2018', group: 'general' },
  affiliation: { value: 'BISE Sahiwal & Federal Board Curriculum', group: 'general' },
  address: { value: 'Main Campus, Sahiwal, Punjab, Pakistan', group: 'general' },
  phone: { value: '+92 (40) 446-2810 / 0321-6909047', group: 'general' },
  whatsapp: { value: '0321-6909047', group: 'general' },
  email: { value: 'info@readacademy.edu.pk', group: 'general' },
  admissionsEmail: { value: 'admissions@readacademy.edu.pk', group: 'general' },
  hours: { value: 'Mon - Fri: 07:30 AM - 02:30 PM | Sat: 08:00 AM - 12:30 PM', group: 'general' },
  principal: { value: 'Chaudhry Muhammad Aslam, M.Sc., M.Ed.', group: 'general' },
  vicePrincipal: { value: 'Mrs. Tahira Naeem, M.A. English', group: 'general' },
  campusArea: { value: '6 Acres', group: 'general' },
  studentTeacherRatio: { value: '15:1', group: 'general' },
  logo: { value: '/logo.png', group: 'general' },
  activeSession: { value: '2026-2027', group: 'academic' },
  termSystem: { value: '3-Term Trimester', group: 'academic' }
};

const DEFAULT_TESTIMONIALS = [
  {
    name: 'Dr. Kamran Qureshi',
    role: 'Parent of Grade 10 Matriculation Scholar',
    content: 'Enrolling our children at Read Academy Sahiwal has been our best parenting decision. The faculty combines rigorous academic standards with individualized mentorship that unlocked our son’s passion for science and research.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5
  },
  {
    name: 'Mrs. Fatima Al-Zahra',
    role: 'Parent of Grade 4 & 7 Students',
    content: 'The values-centric culture, pastoral guidance, and real-time parent portal make managing school life effortless. The teachers at Read Academy truly care about character development alongside academic excellence.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 5
  },
  {
    name: 'Daniyal Tariq',
    role: 'Alumnus (Class of 2023) • Now at Top University',
    content: 'The experiential science labs and debate societies at Read Academy Sahiwal gave me the analytical confidence to lead student bodies and secure competitive academic honors.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 5
  }
];

// Helper to seed defaults if DB is fresh
async function ensureDefaults() {
  try {
    const count = await prisma.systemSetting.count();
    if (count === 0) {
      for (const [key, item] of Object.entries(DEFAULT_SETTINGS)) {
        await prisma.systemSetting.upsert({
          where: { key },
          update: {},
          create: { key, value: item.value, group: item.group }
        });
      }
    }

    const testCount = await prisma.testimonial.count();
    if (testCount === 0) {
      for (const t of DEFAULT_TESTIMONIALS) {
        await prisma.testimonial.create({ data: t });
      }
    }
  } catch (err) {
    console.warn('ensureDefaults warning:', (err as any)?.message || err);
  }
}


// GET /api/settings - Fetch all settings
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaults();
    const rows = await prisma.systemSetting.findMany();
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    // merge with defaults so all keys are guaranteed present
    for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) {
      if (!settings[k]) settings[k] = v.value;
    }
    res.json({ status: 'success', data: settings });
  } catch (error) {
    console.error('Fetch settings error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve settings' });
  }
});

// PUT /api/settings - Update settings (Admin)
router.put('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const updates: Record<string, string> = req.body;
    for (const [key, value] of Object.entries(updates)) {
      if (typeof value === 'string') {
        const group = DEFAULT_SETTINGS[key]?.group || 'general';
        await prisma.systemSetting.upsert({
          where: { key },
          update: { value, group },
          create: { key, value, group }
        });
      }
    }
    const updatedRows = await prisma.systemSetting.findMany();
    const settings: Record<string, string> = {};
    for (const row of updatedRows) {
      settings[row.key] = row.value;
    }
    res.json({ status: 'success', message: 'Settings updated successfully', data: settings });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update settings' });
  }
});

// GET /api/settings/testimonials - Get testimonials
router.get('/testimonials', async (_req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaults();
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' }
    });
    res.json({ status: 'success', data: testimonials });
  } catch (error) {
    console.error('Fetch testimonials error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve testimonials' });
  }
});

// POST /api/settings/testimonials - Add testimonial
router.post('/testimonials', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, role, content, avatar, rating = 5 } = req.body;
    if (!name || !content) {
      res.status(400).json({ status: 'error', message: 'Name and content are required' });
      return;
    }
    const created = await prisma.testimonial.create({
      data: {
        name,
        role: role || 'Parent',
        content,
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        rating: Number(rating) || 5
      }
    });
    res.status(201).json({ status: 'success', message: 'Testimonial created', data: created });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create testimonial' });
  }
});

export default router;
