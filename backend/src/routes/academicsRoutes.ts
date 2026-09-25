import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
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
    const whereClause: Prisma.SectionWhereInput = {};
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
    const whereClause: Prisma.ClassSubjectWhereInput = {};
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
    const whereClause: Prisma.TimetableSlotWhereInput = {};

    if (classId) {
      const cls = await prisma.class.findFirst({
        where: { OR: [{ id: String(classId) }, { name: String(classId) }] },
      });
      if (cls) {
        whereClause.classId = cls.id;
      } else {
        whereClause.classId = String(classId);
      }
    }

    if (sectionId) {
      const sec = await prisma.section.findFirst({
        where: {
          OR: [
            { id: String(sectionId) },
            { name: String(sectionId) },
            { name: `Section ${sectionId}` },
          ],
        },
      });
      if (sec) {
        whereClause.sectionId = sec.id;
      } else {
        whereClause.sectionId = String(sectionId);
      }
    }

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
    const {
      classId,
      sectionId,
      dayOfWeek,
      periodNumber,
      startTime,
      endTime,
      subjectId,
      teacherId,
      roomNumber,
      subjectName,
      teacherName,
      className,
      sectionName,
    } = req.body;

    if (!dayOfWeek || periodNumber === undefined) {
      res.status(400).json({ status: 'error', message: 'Day of week and period number are required' });
      return;
    }

    // 1. Resolve or Create Class
    let targetClass = null;
    const lookupClass = className || classId;
    if (lookupClass) {
      targetClass = await prisma.class.findFirst({
        where: { OR: [{ id: lookupClass }, { name: lookupClass }] },
      });
    }
    if (!targetClass) {
      targetClass = await prisma.class.create({
        data: {
          name: lookupClass || 'Grade 10',
          numericLevel: 10,
          capacity: 45,
        },
      });
    }

    // 2. Resolve or Create Section
    let targetSection = null;
    const rawSecName = sectionName || sectionId || 'A';
    const formattedSecName = rawSecName.startsWith('Section') ? rawSecName : `Section ${rawSecName}`;
    targetSection = await prisma.section.findFirst({
      where: {
        classId: targetClass.id,
        OR: [
          { id: rawSecName },
          { name: rawSecName },
          { name: formattedSecName },
        ],
      },
    });
    if (!targetSection) {
      targetSection = await prisma.section.create({
        data: {
          classId: targetClass.id,
          name: formattedSecName,
          roomNumber: roomNumber || 'Room 201',
        },
      });
    }

    // 3. Resolve or Create Subject
    const targetSubName = subjectName || subjectId || 'General Subject';
    let targetSubject = null;
    if (subjectId) {
      targetSubject = await prisma.subject.findFirst({
        where: { OR: [{ id: subjectId }, { name: subjectId }, { code: subjectId }] },
      });
    }
    if (!targetSubject && targetSubName) {
      targetSubject = await prisma.subject.findFirst({
        where: { name: { equals: targetSubName, mode: 'insensitive' } },
      });
    }
    if (!targetSubject) {
      const code = targetSubName.substring(0, 3).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);
      targetSubject = await prisma.subject.create({
        data: {
          name: targetSubName,
          code,
          department: 'General Academics',
          weeklyPeriods: 5,
        },
      });
    }

    // 4. Resolve or Create Teacher
    const targetTName = teacherName || teacherId || 'Assigned Faculty';
    let targetTeacher = null;
    if (teacherId) {
      targetTeacher = await prisma.teacher.findFirst({
        where: { OR: [{ id: teacherId }, { fullName: teacherId }] },
      });
    }
    if (!targetTeacher && targetTName) {
      targetTeacher = await prisma.teacher.findFirst({
        where: { fullName: { equals: targetTName, mode: 'insensitive' } },
      });
    }
    if (!targetTeacher) {
      const empId = 'T-' + Math.floor(1000 + Math.random() * 9000);
      targetTeacher = await prisma.teacher.create({
        data: {
          fullName: targetTName,
          empId,
          department: targetSubject.department || 'Academics',
          specialization: targetSubject.name || 'Education',
          qualification: 'Master of Education',
          phone: '+92 300 0000000',
          email: `faculty.${empId.toLowerCase()}@readacademy.edu.pk`,
          joiningDate: new Date(),
          basicSalary: 50000,
          status: 'Active',
        },
      });
    }

    // 5. Upsert Timetable Slot in DB
    const slot = await prisma.timetableSlot.upsert({
      where: {
        classId_sectionId_dayOfWeek_periodNumber: {
          classId: targetClass.id,
          sectionId: targetSection.id,
          dayOfWeek: String(dayOfWeek),
          periodNumber: Number(periodNumber),
        },
      },
      update: {
        startTime: startTime || '08:00',
        endTime: endTime || '08:45',
        subjectId: targetSubject.id,
        teacherId: targetTeacher.id,
        roomNumber: roomNumber || targetSection.roomNumber || 'Room 101',
      },
      create: {
        classId: targetClass.id,
        sectionId: targetSection.id,
        dayOfWeek: String(dayOfWeek),
        periodNumber: Number(periodNumber),
        startTime: startTime || '08:00',
        endTime: endTime || '08:45',
        subjectId: targetSubject.id,
        teacherId: targetTeacher.id,
        roomNumber: roomNumber || targetSection.roomNumber || 'Room 101',
      },
      include: {
        class: true,
        section: true,
        subject: true,
        teacher: true,
      },
    });

    res.status(201).json({ status: 'success', message: 'Timetable slot saved successfully to database', data: slot });
  } catch (error) {
    console.error('Save timetable slot error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to save timetable slot to database' });
  }
});

router.delete('/timetable/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.timetableSlot.delete({ where: { id } });
    res.json({ status: 'success', message: 'Timetable slot deleted from database' });
  } catch (error) {
    console.error('Delete timetable slot error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete timetable slot' });
  }
});

export default router;
