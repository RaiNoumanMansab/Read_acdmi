import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma.js';

const router = Router();

// GET /api/attendance/students - Query student attendance
router.get('/students', async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, classId, sectionId } = req.query;

    const queryDate = date ? new Date(String(date)) : new Date();
    // Normalize to YYYY-MM-DD
    const dateOnly = new Date(queryDate.toISOString().split('T')[0]);

    const whereClause: Prisma.StudentAttendanceWhereInput = {
      date: dateOnly,
    };

    if (classId || sectionId) {
      whereClause.student = {
        ...(classId ? { classId: String(classId) } : {}),
        ...(sectionId ? { sectionId: String(sectionId) } : {}),
      };
    }

    const attendance = await prisma.studentAttendance.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            class: true,
            section: true,
          },
        },
      },
      orderBy: { student: { rollNo: 'asc' } },
    });

    res.json({ status: 'success', count: attendance.length, date: dateOnly, data: attendance });
  } catch (error) {
    console.error('Fetch student attendance error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve attendance' });
  }
});

// POST /api/attendance/students/bulk - Save class attendance
router.post('/students/bulk', async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, records } = req.body;
    // records: Array of { studentId: string, status: 'PRESENT'|'ABSENT'|'LATE'|'LEAVE', remarks?: string }

    if (!records || !Array.isArray(records)) {
      res.status(400).json({ status: 'error', message: 'records array is required' });
      return;
    }

    const attendanceDate = date ? new Date(new Date(date).toISOString().split('T')[0]) : new Date(new Date().toISOString().split('T')[0]);

    const upsertPromises = records.map((rec) =>
      prisma.studentAttendance.upsert({
        where: {
          studentId_date: {
            studentId: rec.studentId,
            date: attendanceDate,
          },
        },
        update: {
          status: rec.status.toUpperCase(),
          remarks: rec.remarks,
        },
        create: {
          studentId: rec.studentId,
          date: attendanceDate,
          status: rec.status.toUpperCase(),
          remarks: rec.remarks,
        },
      })
    );

    const results = await prisma.$transaction(upsertPromises);

    res.json({
      status: 'success',
      message: `Marked attendance for ${results.length} students`,
      date: attendanceDate,
    });
  } catch (error) {
    console.error('Bulk attendance error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to record attendance' });
  }
});

// GET /api/attendance/teachers - Query teacher attendance
router.get('/teachers', async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    const dateOnly = date ? new Date(new Date(String(date)).toISOString().split('T')[0]) : new Date(new Date().toISOString().split('T')[0]);

    const attendance = await prisma.teacherAttendance.findMany({
      where: { date: dateOnly },
      include: { teacher: true },
      orderBy: { teacher: { empId: 'asc' } },
    });

    res.json({ status: 'success', count: attendance.length, date: dateOnly, data: attendance });
  } catch (error) {
    console.error('Fetch teacher attendance error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve teacher attendance' });
  }
});

// POST /api/attendance/teachers - Mark teacher attendance
router.post('/teachers', async (req: Request, res: Response): Promise<void> => {
  try {
    const { teacherId, date, status = 'PRESENT', checkIn, checkOut } = req.body;

    if (!teacherId) {
      res.status(400).json({ status: 'error', message: 'teacherId is required' });
      return;
    }

    const attendanceDate = date ? new Date(new Date(date).toISOString().split('T')[0]) : new Date(new Date().toISOString().split('T')[0]);

    const record = await prisma.teacherAttendance.upsert({
      where: {
        teacherId_date: {
          teacherId,
          date: attendanceDate,
        },
      },
      update: {
        status: status.toUpperCase(),
        checkIn,
        checkOut,
      },
      create: {
        teacherId,
        date: attendanceDate,
        status: status.toUpperCase(),
        checkIn,
        checkOut,
      },
      include: { teacher: true },
    });

    res.json({ status: 'success', message: 'Teacher attendance recorded', data: record });
  } catch (error) {
    console.error('Record teacher attendance error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to record teacher attendance' });
  }
});

export default router;
