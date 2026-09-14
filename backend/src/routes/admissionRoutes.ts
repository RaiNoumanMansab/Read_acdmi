import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma.js';

const router = Router();

// GET /api/admissions - List all admission applications
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, classId } = req.query;
    const whereClause: any = {};

    if (status) whereClause.status = String(status).toUpperCase();
    if (classId) whereClause.appliedClassId = String(classId);

    const applications = await prisma.admissionApplication.findMany({
      where: whereClause,
      include: { appliedClass: true },
      orderBy: { applicationDate: 'desc' },
    });

    res.json({ status: 'success', count: applications.length, data: applications });
  } catch (error) {
    console.error('Fetch admissions error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve admission applications' });
  }
});

// POST /api/admissions - Submit admission application
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      studentName,
      appliedClassId,
      gender,
      dob,
      parentName,
      parentPhone,
      parentEmail,
      homeAddress,
      previousSchool,
      previousPercentage,
      documentsSubmitted,
      adminNotes,
    } = req.body;

    if (!studentName || !appliedClassId || !gender || !dob || !parentName || !parentPhone || !homeAddress) {
      res.status(400).json({ status: 'error', message: 'Missing required admission fields' });
      return;
    }

    const applicationNo = `ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const application = await prisma.admissionApplication.create({
      data: {
        applicationNo,
        studentName,
        appliedClassId,
        gender: gender.toUpperCase(),
        dob: new Date(dob),
        parentName,
        parentPhone,
        parentEmail,
        homeAddress,
        previousSchool,
        previousPercentage: previousPercentage ? Number(previousPercentage) : null,
        documentsSubmitted: documentsSubmitted || [],
        adminNotes,
        status: 'PENDING',
      },
      include: { appliedClass: true },
    });

    res.status(201).json({
      status: 'success',
      message: 'Admission application submitted successfully',
      data: application,
    });
  } catch (error) {
    console.error('Create admission error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to submit admission application' });
  }
});

// PATCH /api/admissions/:id/status - Update application status
router.patch('/:id/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!status) {
      res.status(400).json({ status: 'error', message: 'Status is required' });
      return;
    }

    const updated = await prisma.admissionApplication.update({
      where: { id },
      data: {
        status: status.toUpperCase(),
        ...(adminNotes && { adminNotes }),
      },
      include: { appliedClass: true },
    });

    res.json({ status: 'success', message: 'Application status updated', data: updated });
  } catch (error) {
    console.error('Update admission status error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update application status' });
  }
});

// DELETE /api/admissions/:id
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.admissionApplication.delete({ where: { id } });
    res.json({ status: 'success', message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete admission error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete application' });
  }
});

export default router;
