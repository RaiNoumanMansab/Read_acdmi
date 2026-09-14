import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma.js';

const router = Router();

// GET /api/teachers - List all teachers
router.get('/', async (req: Request, res: Response) => {
  try {
    const { department, status, q } = req.query;
    const whereClause: any = {};

    if (department) whereClause.department = String(department);
    if (status) whereClause.status = String(status);

    if (q) {
      whereClause.OR = [
        { fullName: { contains: String(q), mode: 'insensitive' } },
        { empId: { contains: String(q), mode: 'insensitive' } },
        { email: { contains: String(q), mode: 'insensitive' } },
        { specialization: { contains: String(q), mode: 'insensitive' } },
      ];
    }

    const teachers = await prisma.teacher.findMany({
      where: whereClause,
      include: {
        duties: true,
        sectionsInCharge: true,
        classSubjects: {
          include: {
            class: true,
            section: true,
            subject: true,
          },
        },
      },
      orderBy: { empId: 'asc' },
    });

    res.json({ status: 'success', count: teachers.length, data: teachers });
  } catch (error) {
    console.error('Fetch teachers error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve teachers' });
  }
});

// GET /api/teachers/:id - Single teacher details
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const teacher = await prisma.teacher.findFirst({
      where: {
        OR: [{ id }, { empId: id }],
      },
      include: {
        duties: true,
        payrollRecords: { orderBy: { createdAt: 'desc' } },
        attendance: { take: 30, orderBy: { date: 'desc' } },
        sectionsInCharge: true,
        classSubjects: {
          include: {
            class: true,
            section: true,
            subject: true,
          },
        },
      },
    });

    if (!teacher) {
      res.status(404).json({ status: 'error', message: 'Teacher not found' });
      return;
    }

    res.json({ status: 'success', data: teacher });
  } catch (error) {
    console.error('Fetch teacher error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve teacher' });
  }
});

// POST /api/teachers - Create new teacher
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      empId,
      fullName,
      avatarUrl,
      department,
      specialization,
      qualification,
      experienceYears = 1,
      phone,
      email,
      joiningDate,
      basicSalary = 0,
      bankAccountNo,
    } = req.body;

    if (!empId || !fullName || !department || !qualification || !phone || !email) {
      res.status(400).json({ status: 'error', message: 'Missing required teacher fields' });
      return;
    }

    const newTeacher = await prisma.teacher.create({
      data: {
        empId,
        fullName,
        avatarUrl,
        department,
        specialization: specialization || department,
        qualification,
        experienceYears: Number(experienceYears),
        phone,
        email,
        joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
        basicSalary: Number(basicSalary),
        bankAccountNo,
      },
    });

    res.status(201).json({ status: 'success', message: 'Teacher profile created', data: newTeacher });
  } catch (error: any) {
    console.error('Create teacher error:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ status: 'error', message: 'A teacher with this Emp ID or Email already exists' });
      return;
    }
    res.status(500).json({ status: 'error', message: 'Failed to create teacher' });
  }
});

// PUT /api/teachers/:id - Update teacher profile
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.basicSalary !== undefined) {
      updateData.basicSalary = Number(updateData.basicSalary);
    }
    if (updateData.experienceYears !== undefined) {
      updateData.experienceYears = Number(updateData.experienceYears);
    }
    if (updateData.joiningDate) {
      updateData.joiningDate = new Date(updateData.joiningDate);
    }

    const updated = await prisma.teacher.update({
      where: { id },
      data: updateData,
    });

    res.json({ status: 'success', message: 'Teacher profile updated', data: updated });
  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update teacher' });
  }
});

// DELETE /api/teachers/:id
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.teacher.delete({ where: { id } });
    res.json({ status: 'success', message: 'Teacher profile deleted' });
  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete teacher' });
  }
});

// POST /api/teachers/:id/duties - Assign new duty
router.post('/:id/duties', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { dutyTitle, description } = req.body;

    if (!dutyTitle) {
      res.status(400).json({ status: 'error', message: 'dutyTitle is required' });
      return;
    }

    const duty = await prisma.teacherDuty.create({
      data: {
        teacherId: id,
        dutyTitle,
        description,
        assignedDate: new Date(),
        status: 'Active',
      },
    });

    res.status(201).json({ status: 'success', message: 'Duty assigned successfully', data: duty });
  } catch (error) {
    console.error('Assign duty error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to assign duty' });
  }
});

// POST /api/teachers/:id/payroll - Generate salary slip
router.post('/:id/payroll', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { monthYear, basicSalary, allowances = 0, deductions = 0, tax = 0, paymentStatus = 'PENDING', transactionRef } = req.body;

    const netSalary = Number(basicSalary) + Number(allowances) - Number(deductions) - Number(tax);

    const record = await prisma.payrollRecord.create({
      data: {
        teacherId: id,
        monthYear,
        basicSalary: Number(basicSalary),
        allowances: Number(allowances),
        deductions: Number(deductions),
        tax: Number(tax),
        netSalary,
        paymentStatus: paymentStatus.toUpperCase(),
        transactionRef,
        paymentDate: paymentStatus === 'PAID' ? new Date() : null,
      },
    });

    res.status(201).json({ status: 'success', message: 'Payroll record created', data: record });
  } catch (error) {
    console.error('Create payroll record error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create payroll record' });
  }
});

export default router;
