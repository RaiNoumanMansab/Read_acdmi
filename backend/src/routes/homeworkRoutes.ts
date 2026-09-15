import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma.js';

const router = Router();

// GET /api/homework - List assignments
router.get('/', async (req: Request, res: Response) => {
  try {
    const { classId, sectionId, subjectId, teacherId } = req.query;
    const whereClause: Prisma.HomeworkItemWhereInput = {};

    if (classId) whereClause.classId = String(classId);
    if (sectionId) whereClause.sectionId = String(sectionId);
    if (subjectId) whereClause.subjectId = String(subjectId);
    if (teacherId) whereClause.teacherId = String(teacherId);

    const items = await prisma.homeworkItem.findMany({
      where: whereClause,
      include: {
        class: true,
        section: true,
        subject: true,
        teacher: true,
        _count: { select: { submissions: true } },
      },
      orderBy: { assignedDate: 'desc' },
    });

    res.json({ status: 'success', count: items.length, data: items });
  } catch (error) {
    console.error('Fetch homework error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve homework assignments' });
  }
});

// POST /api/homework - Create homework assignment
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, classId, sectionId, subjectId, teacherId, dueDate, attachmentUrl } = req.body;

    if (!title || !classId || !subjectId || !teacherId || !dueDate) {
      res.status(400).json({ status: 'error', message: 'Missing required homework assignment fields' });
      return;
    }

    const homework = await prisma.homeworkItem.create({
      data: {
        title,
        description,
        classId,
        sectionId,
        subjectId,
        teacherId,
        dueDate: new Date(dueDate),
        attachmentUrl,
      },
      include: {
        class: true,
        section: true,
        subject: true,
        teacher: true,
      },
    });

    res.status(201).json({ status: 'success', message: 'Homework assigned', data: homework });
  } catch (error) {
    console.error('Create homework error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create homework assignment' });
  }
});

// GET /api/homework/:id/submissions - View student submissions
router.get('/:id/submissions', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const submissions = await prisma.homeworkSubmission.findMany({
      where: { homeworkId: id },
      include: {
        student: {
          include: {
            class: true,
            section: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    res.json({ status: 'success', count: submissions.length, data: submissions });
  } catch (error) {
    console.error('Fetch submissions error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve submissions' });
  }
});

// POST /api/homework/:id/submit - Student homework submission
router.post('/:id/submit', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { studentId, submissionText, attachmentUrl } = req.body;

    if (!studentId) {
      res.status(400).json({ status: 'error', message: 'studentId is required' });
      return;
    }

    const submission = await prisma.homeworkSubmission.upsert({
      where: {
        homeworkId_studentId: {
          homeworkId: id,
          studentId,
        },
      },
      update: {
        submissionText,
        attachmentUrl,
        submittedAt: new Date(),
        status: 'Submitted',
      },
      create: {
        homeworkId: id,
        studentId,
        submissionText,
        attachmentUrl,
        status: 'Submitted',
      },
      include: { student: true },
    });

    res.status(201).json({ status: 'success', message: 'Homework submitted', data: submission });
  } catch (error) {
    console.error('Submit homework error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to submit homework' });
  }
});

// PATCH /api/homework/submissions/:submissionId/grade - Feedback & grading
router.patch('/submissions/:submissionId/grade', async (req: Request, res: Response): Promise<void> => {
  try {
    const { submissionId } = req.params;
    const { teacherFeedback, marksObtained } = req.body;

    const updated = await prisma.homeworkSubmission.update({
      where: { id: submissionId },
      data: {
        teacherFeedback,
        marksObtained: marksObtained !== undefined ? Number(marksObtained) : null,
        status: 'Graded',
      },
      include: { student: true },
    });

    res.json({ status: 'success', message: 'Submission graded', data: updated });
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to grade submission' });
  }
});

export default router;
