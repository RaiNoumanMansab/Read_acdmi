import { Router, Request, Response } from 'express';
import { Prisma, ApplicationStatus } from '@prisma/client';
import { prisma } from '../db/prisma.js';

const router = Router();

// GET /api/admissions - List all admission applications
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, classId } = req.query;
    const whereClause: Prisma.AdmissionApplicationWhereInput = {};

    if (status) whereClause.status = String(status).toUpperCase() as ApplicationStatus;
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
      appliedClass,
      targetGrade,
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

    if (!studentName || !parentName || !parentPhone) {
      res.status(400).json({ status: 'error', message: 'Student name, parent name, and phone number are required' });
      return;
    }

    // Resolve class: can be id or name (e.g. "cls-09", "Grade 9", "Early Years")
    const classQuery = String(appliedClassId || appliedClass || targetGrade || 'Grade 9').trim();
    let targetClass = await prisma.class.findFirst({
      where: {
        OR: [
          { id: classQuery },
          { name: { equals: classQuery, mode: 'insensitive' } },
          { name: { contains: classQuery, mode: 'insensitive' } },
        ],
      },
    });

    if (!targetClass) {
      targetClass = await prisma.class.findFirst();
    }

    if (!targetClass) {
      targetClass = await prisma.class.create({
        data: {
          name: classQuery || 'Grade 9',
          numericLevel: 9,
          capacity: 45,
        },
      });
    }

    const applicationNo = `ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const normalizedGender = (gender && String(gender).toUpperCase() === 'FEMALE') ? 'FEMALE' : 'MALE';
    const parsedDob = dob ? new Date(dob) : new Date('2011-01-01');

    const parsedPercentage = previousPercentage ? parseFloat(String(previousPercentage).replace(/[^\d.]/g, '')) : null;

    const application = await prisma.admissionApplication.create({
      data: {
        applicationNo,
        studentName: String(studentName).trim(),
        appliedClassId: targetClass.id,
        gender: normalizedGender,
        dob: isNaN(parsedDob.getTime()) ? new Date('2011-01-01') : parsedDob,
        parentName: String(parentName).trim(),
        parentPhone: String(parentPhone).trim(),
        parentEmail: parentEmail ? String(parentEmail).trim() : null,
        homeAddress: homeAddress ? String(homeAddress).trim() : 'Sahiwal, Punjab',
        previousSchool: previousSchool ? String(previousSchool).trim() : null,
        previousPercentage: (parsedPercentage !== null && !isNaN(parsedPercentage)) ? parsedPercentage : null,
        documentsSubmitted: Array.isArray(documentsSubmitted) ? documentsSubmitted : [],
        adminNotes: adminNotes ? String(adminNotes).trim() : null,
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
    const {
      status,
      adminNotes,
      tuitionFee,
      admissionFee,
      examFee,
      labFee,
      utilityCharges,
      dueDate: customDueDate,
    } = req.body;

    if (!status) {
      res.status(400).json({ status: 'error', message: 'Status is required' });
      return;
    }

    const existing = await prisma.admissionApplication.findFirst({
      where: {
        OR: [
          { id },
          { applicationNo: id },
        ],
      },
    });

    if (!existing) {
      res.status(404).json({ status: 'error', message: 'Application not found' });
      return;
    }

    const updated = await prisma.admissionApplication.update({
      where: { id: existing.id },
      data: {
        status: status.toUpperCase(),
        ...(adminNotes && { adminNotes }),
      },
      include: { appliedClass: true },
    });

    let enrolledStudent = null;
    let generatedVoucher = null;

    if (status.toUpperCase() === 'APPROVED') {
      // Check if student is already enrolled
      const existingStudent = await prisma.student.findFirst({
        where: {
          OR: [
            { admissionNo: existing.applicationNo },
            {
              fullName: existing.studentName,
              parentPhone: existing.parentPhone,
            },
          ],
        },
      });

      if (!existingStudent) {
        // 1. Get or create section for the class
        let section = await prisma.section.findFirst({
          where: { classId: existing.appliedClassId },
        });

        if (!section) {
          section = await prisma.section.create({
            data: {
              classId: existing.appliedClassId,
              name: 'Section A - Jinnah',
              roomNumber: 'Room 201',
            },
          });
        }

        // 2. Generate Roll No
        const totalStudents = await prisma.student.count();
        const rollNo = `RAS-2026-${String(totalStudents + 10).padStart(2, '0')}`;

        // 3. Create Student record in PostgreSQL
        enrolledStudent = await prisma.student.create({
          data: {
            rollNo,
            admissionNo: existing.applicationNo,
            fullName: existing.studentName,
            gender: existing.gender,
            dob: existing.dob,
            bloodGroup: 'B+',
            classId: existing.appliedClassId,
            sectionId: section.id,
            parentName: existing.parentName,
            parentPhone: existing.parentPhone,
            parentEmail: existing.parentEmail,
            emergencyContact: existing.parentPhone,
            homeAddress: existing.homeAddress,
            previousSchool: existing.previousSchool,
            feeStatus: 'PENDING',
            status: 'Active',
          },
          include: {
            class: true,
            section: true,
          },
        });

        // 4. Generate initial Fee Voucher for this new student
        const currentMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
        const countVouchers = await prisma.feeVoucher.count();
        const voucherNo = `VCH-2026-${String(countVouchers + 1).padStart(3, '0')}`;
        const finalDueDate = customDueDate ? new Date(customDueDate) : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

        const feeTuition = tuitionFee !== undefined ? Number(tuitionFee) : 18000;
        const feeAdmission = admissionFee !== undefined ? Number(admissionFee) : 0;
        const feeExam = examFee !== undefined ? Number(examFee) : 0;
        const feeLab = labFee !== undefined ? Number(labFee) : 0;
        const feeUtility = utilityCharges !== undefined ? Number(utilityCharges) : 0;
        const finalTotal = feeTuition + feeAdmission + feeExam + feeLab + feeUtility;

        generatedVoucher = await prisma.feeVoucher.create({
          data: {
            voucherNo,
            studentId: enrolledStudent.id,
            billingMonth: currentMonth,
            tuitionFee: feeTuition + feeAdmission,
            examFee: feeExam,
            labFee: feeLab,
            utilityCharges: feeUtility,
            lateFine: 0,
            totalAmount: finalTotal,
            dueDate: finalDueDate,
            status: 'PENDING',
          },
          include: {
            student: {
              include: {
                class: true,
                section: true,
              },
            },
          },
        });
      }
    }

    res.json({
      status: 'success',
      message: 'Application status updated',
      data: {
        application: updated,
        enrolledStudent,
        generatedVoucher,
      },
    });
  } catch (error) {
    console.error('Update admission status error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update application status' });
  }
});

// DELETE /api/admissions/:id
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await prisma.admissionApplication.findFirst({
      where: {
        OR: [
          { id },
          { applicationNo: id },
        ],
      },
    });

    if (existing) {
      await prisma.admissionApplication.delete({ where: { id: existing.id } });
    }
    res.json({ status: 'success', message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete admission error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete application' });
  }
});

export default router;
