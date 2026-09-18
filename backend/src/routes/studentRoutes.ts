import { Router, Request, Response } from 'express';
import { Prisma, FeeStatus } from '@prisma/client';
import { prisma } from '../db/prisma.js';

const router = Router();

// GET /api/students - List all students with query filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { classId, sectionId, feeStatus, q } = req.query;

    const whereClause: Prisma.StudentWhereInput = {};

    if (classId) whereClause.classId = String(classId);
    if (sectionId) whereClause.sectionId = String(sectionId);
    if (feeStatus) whereClause.feeStatus = String(feeStatus).toUpperCase() as FeeStatus;

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
        feeVouchers: {
          orderBy: { createdAt: 'desc' },
        },
        attendance: {
          orderBy: { date: 'desc' },
          take: 30,
        },
        marksEntries: {
          include: {
            subject: true,
            exam: true,
          },
          orderBy: { createdAt: 'desc' },
        },
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
      gender = 'MALE',
      dob = '2011-01-01',
      bloodGroup = 'B+',
      classId,
      sectionId,
      parentName,
      parentPhone,
      parentEmail = 'parent@readacademy.edu.pk',
      emergencyContact,
      homeAddress = 'Sahiwal, Punjab',
      feeStatus = 'PENDING',
      previousSchool,
    } = req.body;

    if (!fullName || !parentName) {
      res.status(400).json({ status: 'error', message: 'Full name and parent name are required' });
      return;
    }

    // 1. Resolve Class
    let targetClass = null;
    if (classId) {
      targetClass = await prisma.class.findFirst({
        where: {
          OR: [
            { id: classId },
            { name: { equals: classId, mode: 'insensitive' } },
            { name: { contains: classId, mode: 'insensitive' } },
          ],
        },
      });
    }
    if (!targetClass) {
      targetClass = await prisma.class.findFirst();
      if (!targetClass) {
        targetClass = await prisma.class.create({
          data: { name: 'Grade 9', numericLevel: 9, capacity: 40 },
        });
      }
    }

    // 2. Resolve Section
    let targetSection = null;
    if (sectionId) {
      targetSection = await prisma.section.findFirst({
        where: {
          classId: targetClass.id,
          OR: [
            { id: sectionId },
            { name: { contains: sectionId, mode: 'insensitive' } },
          ],
        },
      });
    }
    if (!targetSection) {
      targetSection = await prisma.section.findFirst({
        where: { classId: targetClass.id },
      });
      if (!targetSection) {
        targetSection = await prisma.section.create({
          data: {
            classId: targetClass.id,
            name: 'Section A - Jinnah',
            roomNumber: 'Room 201',
          },
        });
      }
    }

    // 3. Roll No and Admission No
    const studentCount = await prisma.student.count();
    const finalRollNo = rollNo || `RAS-2026-${String(studentCount + 10).padStart(2, '0')}`;
    const finalAdmissionNo = admissionNo || `ADM-2026-${Date.now().toString().slice(-4)}`;

    const newStudent = await prisma.student.create({
      data: {
        rollNo: finalRollNo,
        admissionNo: finalAdmissionNo,
        fullName,
        gender: String(gender).toUpperCase() === 'FEMALE' ? 'FEMALE' : 'MALE',
        dob: new Date(dob),
        bloodGroup,
        classId: targetClass.id,
        sectionId: targetSection.id,
        parentName,
        parentPhone: parentPhone || '+92 300 0000000',
        parentEmail,
        emergencyContact: emergencyContact || parentPhone || '+92 300 0000000',
        homeAddress,
        feeStatus: feeStatus.toUpperCase() as FeeStatus,
        previousSchool,
      },
      include: {
        class: true,
        section: true,
      },
    });

    // 4. Create initial fee voucher
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const countVouchers = await prisma.feeVoucher.count();
    const voucherNo = `VCH-2026-${String(countVouchers + 1).padStart(3, '0')}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 15);

    const voucher = await prisma.feeVoucher.create({
      data: {
        voucherNo,
        studentId: newStudent.id,
        billingMonth: currentMonth,
        tuitionFee: 18000,
        examFee: 500,
        labFee: 500,
        utilityCharges: 500,
        lateFine: 0,
        totalAmount: 19500,
        dueDate,
        status: 'PENDING',
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Student enrolled successfully and fee voucher generated',
      data: newStudent,
      voucher,
    });
  } catch (error: unknown) {
    console.error('Create student error:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
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
