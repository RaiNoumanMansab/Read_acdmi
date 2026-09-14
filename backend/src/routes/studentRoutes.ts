import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma.js';

const router = Router();

// GET /api/students - List all students with query filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { classId, sectionId, feeStatus, q } = req.query;

    const whereClause: any = {};

    if (classId) whereClause.classId = String(classId);
    if (sectionId) whereClause.sectionId = String(sectionId);
    if (feeStatus) whereClause.feeStatus = String(feeStatus).toUpperCase();

    if (q) {
      whereClause.OR = [
        { fullName: { contains: String(q), mode: 'insensitive' } },
        { rollNo: { contains: String(q), mode: 'insensitive' } },
        { admissionNo: { contains: String(q), mode: 'insensitive' } },
        { parentName: { contains: String(q), mode: 'insensitive' } },
        { parentPhone: { contains: String(q), mode: 'insensitive' } },
      ];
    }

    const students = await prisma.student.findMany({
      where: whereClause,
      include: {
        class: true,
        section: true,
      },
      orderBy: { rollNo: 'asc' },
    });

    res.json({ status: 'success', count: students.length, data: students });
  } catch (error) {
    console.error('Fetch students error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve students' });
  }
});

// GET /api/students/:idOrRoll - Single student details
router.get('/:idOrRoll', async (req: Request, res: Response): Promise<void> => {
  try {
    const { idOrRoll } = req.params;
    const student = await prisma.student.findFirst({
      where: {
        OR: [{ id: idOrRoll }, { rollNo: idOrRoll }],
      },
      include: {
        class: true,
        section: true,
        attendance: { take: 30, orderBy: { date: 'desc' } },
        feeVouchers: { orderBy: { dueDate: 'desc' } },
        marksEntries: {
          include: {
            subject: true,
            exam: true,
          },
        },
      },
    });

    if (!student) {
      res.status(404).json({ status: 'error', message: 'Student not found' });
      return;
    }

    res.json({ status: 'success', data: student });
  } catch (error) {
    console.error('Fetch student error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve student profile' });
  }
});

// POST /api/students - Enroll / Add student
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      rollNo,
      admissionNo,
      fullName,
      gender,
      dob,
      bloodGroup,
      classId,
      sectionId,
      parentName,
      parentPhone,
      parentEmail,
      emergencyContact,
      homeAddress,
      feeStatus = 'PENDING',
      previousSchool,
    } = req.body;

    if (!rollNo || !fullName || !gender || !dob || !classId || !sectionId || !parentName || !parentPhone || !homeAddress) {
      res.status(400).json({ status: 'error', message: 'Missing required student fields' });
      return;
    }

    const newStudent = await prisma.student.create({
      data: {
        rollNo,
        admissionNo,
        fullName,
        gender: gender.toUpperCase(),
        dob: new Date(dob),
        bloodGroup,
        classId,
        sectionId,
        parentName,
        parentPhone,
        parentEmail,
        emergencyContact,
        homeAddress,
        feeStatus: feeStatus.toUpperCase(),
        previousSchool,
      },
      include: {
        class: true,
        section: true,
      },
    });

    res.status(201).json({ status: 'success', message: 'Student enrolled successfully', data: newStudent });
  } catch (error: any) {
    console.error('Create student error:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ status: 'error', message: 'A student with this Roll No or Admission No already exists' });
      return;
    }
    res.status(500).json({ status: 'error', message: 'Failed to create student' });
  }
});

// PUT /api/students/:id - Update student profile
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.dob) {
      updateData.dob = new Date(updateData.dob);
    }
    if (updateData.gender) {
      updateData.gender = updateData.gender.toUpperCase();
    }
    if (updateData.feeStatus) {
      updateData.feeStatus = updateData.feeStatus.toUpperCase();
    }

    const updated = await prisma.student.update({
      where: { id },
      data: updateData,
      include: {
        class: true,
        section: true,
      },
    });

    res.json({ status: 'success', message: 'Student updated successfully', data: updated });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update student' });
  }
});

// DELETE /api/students/:id - Delete student record
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.student.delete({ where: { id } });
    res.json({ status: 'success', message: 'Student removed successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete student' });
  }
});

export default router;
