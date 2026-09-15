import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma.js';

const router = Router();

// GET /api/exams - List all exams
router.get('/', async (_req: Request, res: Response) => {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        dateSheets: {
          include: {
            class: true,
            subject: true,
            invigilator: true,
          },
        },
        _count: { select: { marksEntries: true } },
      },
      orderBy: { startDate: 'desc' },
    });
    res.json({ status: 'success', count: exams.length, data: exams });
  } catch (error) {
    console.error('Fetch exams error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve exams' });
  }
});

// POST /api/exams - Create new exam
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, term, academicYear, startDate, endDate, status = 'UPCOMING' } = req.body;

    if (!title || !term || !academicYear || !startDate || !endDate) {
      res.status(400).json({ status: 'error', message: 'Missing required exam fields' });
      return;
    }

    const exam = await prisma.exam.create({
      data: {
        title,
        term,
        academicYear,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status.toUpperCase(),
      },
    });

    res.status(201).json({ status: 'success', message: 'Exam created', data: exam });
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create exam' });
  }
});

// GET /api/exams/:id/datesheet - Get datesheet for an exam
router.get('/:id/datesheet', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { classId } = req.query;

    const whereClause: Prisma.DateSheetItemWhereInput = { examId: id };
    if (classId) whereClause.classId = String(classId);

    const datesheet = await prisma.dateSheetItem.findMany({
      where: whereClause,
      include: {
        class: true,
        subject: true,
        invigilator: true,
      },
      orderBy: { examDate: 'asc' },
    });

    res.json({ status: 'success', count: datesheet.length, data: datesheet });
  } catch (error) {
    console.error('Fetch datesheet error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve datesheet' });
  }
});

// POST /api/exams/:id/datesheet - Add exam datesheet slot
router.post('/:id/datesheet', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { classId, subjectId, examDate, dayName, startTime, endTime, roomNumber, invigilatorId } = req.body;

    if (!classId || !subjectId || !examDate || !dayName || !startTime || !endTime || !roomNumber) {
      res.status(400).json({ status: 'error', message: 'Missing required datesheet fields' });
      return;
    }

    const item = await prisma.dateSheetItem.create({
      data: {
        examId: id,
        classId,
        subjectId,
        examDate: new Date(examDate),
        dayName,
        startTime,
        endTime,
        roomNumber,
        invigilatorId,
      },
      include: {
        class: true,
        subject: true,
        invigilator: true,
      },
    });

    res.status(201).json({ status: 'success', message: 'Exam datesheet item added', data: item });
  } catch (error) {
    console.error('Create datesheet error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to add datesheet item' });
  }
});

// GET /api/exams/:id/marks - Get marks entries for exam
router.get('/:id/marks', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { subjectId, classId, studentId } = req.query;

    const whereClause: Prisma.MarksEntryWhereInput = { examId: id };
    if (subjectId) whereClause.subjectId = String(subjectId);
    if (studentId) whereClause.studentId = String(studentId);
    if (classId) {
      whereClause.student = { classId: String(classId) };
    }

    const marks = await prisma.marksEntry.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            class: true,
            section: true,
          },
        },
        subject: true,
      },
      orderBy: { student: { rollNo: 'asc' } },
    });

    res.json({ status: 'success', count: marks.length, data: marks });
  } catch (error) {
    console.error('Fetch marks error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve marks entries' });
  }
});

// POST /api/exams/:id/marks/bulk - Enter / Update marks in bulk
router.post('/:id/marks/bulk', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { subjectId, totalMarks = 100, entries } = req.body;
    // entries: Array of { studentId, obtainedMarks, remarks? }

    if (!subjectId || !entries || !Array.isArray(entries)) {
      res.status(400).json({ status: 'error', message: 'subjectId and entries array are required' });
      return;
    }

    const calculateGrade = (pct: number): string => {
      if (pct >= 90) return 'A+';
      if (pct >= 80) return 'A';
      if (pct >= 70) return 'B';
      if (pct >= 60) return 'C';
      if (pct >= 50) return 'D';
      return 'F';
    };

    const upsertPromises = entries.map((entry) => {
      const obtained = Number(entry.obtainedMarks);
      const total = Number(totalMarks);
      const pct = (obtained / total) * 100;
      const grade = calculateGrade(pct);

      return prisma.marksEntry.upsert({
        where: {
          examId_studentId_subjectId: {
            examId: id,
            studentId: entry.studentId,
            subjectId,
          },
        },
        update: {
          totalMarks: total,
          obtainedMarks: obtained,
          grade,
          remarks: entry.remarks,
        },
        create: {
          examId: id,
          studentId: entry.studentId,
          subjectId,
          totalMarks: total,
          obtainedMarks: obtained,
          grade,
          remarks: entry.remarks,
        },
      });
    });

    const results = await prisma.$transaction(upsertPromises);

    res.json({
      status: 'success',
      message: `Recorded marks for ${results.length} students`,
    });
  } catch (error) {
    console.error('Bulk marks entry error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to save marks entries' });
  }
});

export default router;
