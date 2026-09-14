import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma.js';

const router = Router();

// ==========================================
// 1. CLASSES
// ==========================================
router.get('/classes', async (_req: Request, res: Response) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        sections: true,
        classSubjects: {
          include: {
            subject: true,
            teacher: true,
          },
        },
        _count: { select: { students: true } },
      },
      orderBy: { numericLevel: 'asc' },
    });
    res.json({ status: 'success', count: classes.length, data: classes });
  } catch (error) {
    console.error('Fetch classes error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve classes' });
  }
});

router.post('/classes', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, numericLevel, capacity = 40 } = req.body;
    if (!name || numericLevel === undefined) {
      res.status(400).json({ status: 'error', message: 'Class name and numeric level are required' });
      return;
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        numericLevel: Number(numericLevel),
        capacity: Number(capacity),
      },
    });
    res.status(201).json({ status: 'success', message: 'Class created', data: newClass });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create class' });
  }
});

// ==========================================
// 2. SECTIONS
// ==========================================
router.get('/sections', async (req: Request, res: Response) => {
  try {
    const { classId } = req.query;
    const whereClause: any = {};
    if (classId) whereClause.classId = String(classId);

    const sections = await prisma.section.findMany({
      where: whereClause,
      include: {
        class: true,
        classTeacher: true,
        _count: { select: { students: true } },
      },
      orderBy: { name: 'asc' },
    });
    res.json({ status: 'success', count: sections.length, data: sections });
  } catch (error) {
    console.error('Fetch sections error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve sections' });
  }
});

router.post('/sections', async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId, name, roomNumber, classTeacherId } = req.body;
    if (!classId || !name) {
      res.status(400).json({ status: 'error', message: 'Class ID and section name are required' });
      return;
    }

    const section = await prisma.section.create({
      data: {
        classId,
        name,
        roomNumber,
        classTeacherId,
      },
      include: { class: true, classTeacher: true },
    });
    res.status(201).json({ status: 'success', message: 'Section created', data: section });
  } catch (error) {
    console.error('Create section error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create section' });
  }
});

// ==========================================
// 3. SUBJECTS
// ==========================================
router.get('/subjects', async (_req: Request, res: Response) => {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { name: 'asc' },
    });
    res.json({ status: 'success', count: subjects.length, data: subjects });
  } catch (error) {
    console.error('Fetch subjects error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve subjects' });
  }
});

router.post('/subjects', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, name, department, weeklyPeriods = 5 } = req.body;
    if (!code || !name || !department) {
      res.status(400).json({ status: 'error', message: 'Subject code, name, and department are required' });
      return;
    }

    const subject = await prisma.subject.create({
      data: {
        code,
        name,
        department,
        weeklyPeriods: Number(weeklyPeriods),
      },
    });
    res.status(201).json({ status: 'success', message: 'Subject created', data: subject });
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create subject' });
  }
});

// ==========================================
// 4. CLASS SUBJECTS (Teacher-Subject mapping)
// ==========================================
router.get('/class-subjects', async (req: Request, res: Response) => {
  try {
    const { classId, sectionId, teacherId } = req.query;
    const whereClause: any = {};
    if (classId) whereClause.classId = String(classId);
    if (sectionId) whereClause.sectionId = String(sectionId);
    if (teacherId) whereClause.teacherId = String(teacherId);

    const classSubjects = await prisma.classSubject.findMany({
      where: whereClause,
      include: {
        class: true,
        section: true,
        subject: true,
        teacher: true,
      },
    });
    res.json({ status: 'success', count: classSubjects.length, data: classSubjects });
  } catch (error) {
    console.error('Fetch class subjects error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve class subjects' });
  }
});

router.post('/class-subjects', async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId, sectionId, subjectId, teacherId, weeklyPeriods = 5 } = req.body;
    if (!classId || !sectionId || !subjectId || !teacherId) {
      res.status(400).json({ status: 'error', message: 'Missing class, section, subject, or teacher ID' });
      return;
    }

    const mapping = await prisma.classSubject.upsert({
      where: {
        classId_sectionId_subjectId: {
          classId,
          sectionId,
          subjectId,
        },
      },
      update: {
        teacherId,
        weeklyPeriods: Number(weeklyPeriods),
      },
      create: {
        classId,
        sectionId,
        subjectId,
        teacherId,
        weeklyPeriods: Number(weeklyPeriods),
      },
      include: {
        class: true,
        section: true,
        subject: true,
        teacher: true,
      },
    });

    res.status(201).json({ status: 'success', message: 'Class subject assigned', data: mapping });
  } catch (error) {
    console.error('Assign class subject error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to assign class subject' });
  }
});

// ==========================================
// 5. TIMETABLE
// ==========================================
router.get('/timetable', async (req: Request, res: Response) => {
  try {
    const { classId, sectionId, dayOfWeek } = req.query;
    const whereClause: any = {};
    if (classId) whereClause.classId = String(classId);
    if (sectionId) whereClause.sectionId = String(sectionId);
    if (dayOfWeek) whereClause.dayOfWeek = String(dayOfWeek);

    const slots = await prisma.timetableSlot.findMany({
      where: whereClause,
      include: {
        class: true,
        section: true,
        subject: true,
        teacher: true,
      },
      orderBy: [{ dayOfWeek: 'asc' }, { periodNumber: 'asc' }],
    });
    res.json({ status: 'success', count: slots.length, data: slots });
  } catch (error) {
    console.error('Fetch timetable error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve timetable' });
  }
});

router.post('/timetable', async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId, sectionId, dayOfWeek, periodNumber, startTime, endTime, subjectId, teacherId, roomNumber } = req.body;
    if (!classId || !sectionId || !dayOfWeek || periodNumber === undefined || !startTime || !endTime || !subjectId || !teacherId || !roomNumber) {
      res.status(400).json({ status: 'error', message: 'Missing required timetable slot fields' });
      return;
    }

    const slot = await prisma.timetableSlot.upsert({
      where: {
        classId_sectionId_dayOfWeek_periodNumber: {
          classId,
          sectionId,
          dayOfWeek,
          periodNumber: Number(periodNumber),
        },
      },
      update: {
        startTime,
        endTime,
        subjectId,
        teacherId,
        roomNumber,
      },
      create: {
        classId,
        sectionId,
        dayOfWeek,
        periodNumber: Number(periodNumber),
        startTime,
        endTime,
        subjectId,
        teacherId,
        roomNumber,
      },
      include: {
        class: true,
        section: true,
        subject: true,
        teacher: true,
      },
    });

    res.status(201).json({ status: 'success', message: 'Timetable slot saved', data: slot });
  } catch (error) {
    console.error('Save timetable slot error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to save timetable slot' });
  }
});

router.delete('/timetable/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.timetableSlot.delete({ where: { id } });
    res.json({ status: 'success', message: 'Timetable slot deleted' });
  } catch (error) {
    console.error('Delete timetable slot error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete timetable slot' });
  }
});

export default router;
