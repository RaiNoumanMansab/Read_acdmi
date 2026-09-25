import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticateJWT } from '../middleware/auth.js';
import { getMe, updateProfile } from '../controllers/authController.js';

const router = Router();

// GET /api/admin/dashboard - Aggregated stats for the admin dashboard
router.get('/dashboard', async (_req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date(new Date().toISOString().split('T')[0]);

    // 1. Basic counts
    const [totalStudents, totalTeachers, totalClasses, pendingAdmissions, totalEvents] = await Promise.all([
      prisma.student.count({ where: { status: 'Active' } }),
      prisma.teacher.count({ where: { status: 'Active' } }),
      prisma.class.count(),
      prisma.admissionApplication.count({ where: { status: 'PENDING' } }),
      prisma.schoolEvent.count({ where: { isPublic: true } }),
    ]);

    // 2. Today's attendance percentage
    const todayAttendance = await prisma.studentAttendance.findMany({
      where: { date: today },
    });
    const presentCount = todayAttendance.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length;
    const todayAttendancePct = todayAttendance.length > 0 ? Math.round((presentCount / todayAttendance.length) * 100) : 0;

    // 3. Fee summary for current month
    const currentMonthYear = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const vouchers = await prisma.feeVoucher.findMany();

    let totalBilled = 0;
    let totalCollected = 0;

    vouchers.forEach((v) => {
      const amt = Number(v.totalAmount);
      totalBilled += amt;
      if (v.status === 'PAID') {
        totalCollected += amt;
      }
    });

    const totalPending = totalBilled - totalCollected;
    const feeCollectionPct = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

    // 4. Recent applications & notices
    const [recentAdmissions, recentNotices] = await Promise.all([
      prisma.admissionApplication.findMany({
        take: 5,
        orderBy: { applicationDate: 'desc' },
        include: { appliedClass: true },
      }),
      prisma.notice.findMany({
        take: 4,
        orderBy: [{ pinned: 'desc' }, { publishedDate: 'desc' }],
      }),
    ]);

    // 5. Chart data trends
    const attendanceTrends = [
      { month: 'Apr', rate: 0 },
      { month: 'May', rate: 0 },
      { month: 'Jun', rate: 0 },
      { month: 'Jul', rate: 0 },
      { month: 'Aug', rate: 0 },
      { month: 'Sep', rate: todayAttendancePct },
    ];

    const feeTrends = [
      { month: 'Apr', collected: 0, pending: 0 },
      { month: 'May', collected: 0, pending: 0 },
      { month: 'Jun', collected: 0, pending: 0 },
      { month: 'Jul', collected: 0, pending: 0 },
      { month: 'Aug', collected: 0, pending: 0 },
      { month: 'Sep', collected: totalCollected, pending: totalPending },
    ];

    res.json({
      status: 'success',
      data: {
        stats: {
          totalStudents,
          totalTeachers,
          totalClasses,
          todayAttendancePct,
          feeCollection: {
            billed: totalBilled,
            collected: totalCollected,
            pending: totalPending,
            pct: feeCollectionPct,
          },
          pendingAdmissions,
          activeEvents: totalEvents,
        },
        charts: {
          attendanceTrends,
          feeTrends,
        },
        recentAdmissions,
        recentNotices,
      },
    });
  } catch (error) {
    console.error('Admin dashboard stats error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve admin dashboard stats' });
  }
});

// GET /api/admin/reports - Academic and institutional analytics
router.get('/reports', async (_req: Request, res: Response): Promise<void> => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        sections: true,
        _count: { select: { students: true } },
      },
      orderBy: { numericLevel: 'asc' },
    });

    const teachers = await prisma.teacher.findMany({
      include: {
        duties: true,
        classSubjects: {
          include: {
            class: true,
            subject: true,
          },
        },
      },
    });

    const classSummaries = classes.map((cls) => ({
      classId: cls.id,
      className: cls.name,
      totalStudents: cls._count.students,
      sectionsCount: cls.sections.length,
      capacity: cls.capacity,
    }));

    const facultyWorkload = teachers.map((tch) => ({
      teacherId: tch.id,
      fullName: tch.fullName,
      empId: tch.empId,
      department: tch.department,
      assignedDutiesCount: tch.duties.length,
      subjectsCount: tch.classSubjects.length,
      weeklyPeriods: tch.classSubjects.reduce((sum, cs) => sum + cs.weeklyPeriods, 0),
    }));

    res.json({
      status: 'success',
      data: {
        classSummaries,
        facultyWorkload,
      },
    });
  } catch (error) {
    console.error('Admin reports error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve reports' });
  }
});

// Profile endpoints for Admin
router.get('/profile', authenticateJWT, getMe);
router.put('/profile', authenticateJWT, updateProfile);

export default router;

