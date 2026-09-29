import { Router, Request, Response } from 'express';
import { Prisma, FeeStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../db/prisma.js';
import { isValidPKPhone, normalizePKPhone } from '../utils/phoneValidator.js';

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

    // Attach documentsSubmitted from linked admission applications
    const admissionNos = students.map((s) => s.admissionNo).filter(Boolean) as string[];
    const studentNames = students.map((s) => s.fullName);

    const admissions = await prisma.admissionApplication.findMany({
      where: {
        OR: [
          { applicationNo: { in: admissionNos } },
          { studentName: { in: studentNames } },
        ],
      },
      select: {
        applicationNo: true,
        studentName: true,
        documentsSubmitted: true,
      },
    });

    const docMap = new Map<string, any>();
    for (const a of admissions) {
      if (a.applicationNo) docMap.set(a.applicationNo, a.documentsSubmitted);
      if (a.studentName) docMap.set(a.studentName.toLowerCase().trim(), a.documentsSubmitted);
    }

    const studentsWithDocs = students.map((s) => {
      let docs = s.admissionNo ? docMap.get(s.admissionNo) : null;
      if (!docs || (Array.isArray(docs) && docs.length === 0)) {
        docs = docMap.get(s.fullName.toLowerCase().trim()) || [];
      }
      const safeDocs = Array.isArray(docs) ? docs : [];

      // Ensure student has a valid avatarUrl
      let avatar = s.avatarUrl;
      if (!avatar && safeDocs.length > 0) {
        const photoDoc = safeDocs.find((d: any) =>
          (d.docType && /photo|picture|pic/i.test(d.docType)) ||
          (d.name && /photo|picture|pic/i.test(d.name))
        );
        if (photoDoc && (photoDoc.fileUrl || photoDoc.dataUrl)) {
          avatar = photoDoc.fileUrl || photoDoc.dataUrl;
        }
      }
      if (!avatar) {
        avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.fullName || 'Student')}&background=0B3974&color=fff&bold=true`;
      }

      return {
        ...s,
        avatarUrl: avatar,
        documentsSubmitted: safeDocs,
      };
    });

    res.json({ status: 'success', count: studentsWithDocs.length, data: studentsWithDocs });
  } catch (error) {
    console.error('Fetch students error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve students' });
  }
});

// GET /api/students/:idOrRoll - Single student details with documents
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

    let docs: any[] = [];
    if (student.admissionNo) {
      const app = await prisma.admissionApplication.findFirst({
        where: { applicationNo: student.admissionNo },
        select: { documentsSubmitted: true },
      });
      if (app && Array.isArray(app.documentsSubmitted)) {
        docs = app.documentsSubmitted;
      }
    }
    if (docs.length === 0) {
      const app = await prisma.admissionApplication.findFirst({
        where: { studentName: { equals: student.fullName, mode: 'insensitive' } },
        select: { documentsSubmitted: true },
      });
      if (app && Array.isArray(app.documentsSubmitted)) {
        docs = app.documentsSubmitted;
      }
    }

    let avatar = student.avatarUrl;
    if (!avatar && docs.length > 0) {
      const photoDoc = docs.find((d: any) =>
        (d.docType && /photo|picture|pic/i.test(d.docType)) ||
        (d.name && /photo|picture|pic/i.test(d.name))
      );
      if (photoDoc && (photoDoc.fileUrl || photoDoc.dataUrl)) {
        avatar = photoDoc.fileUrl || photoDoc.dataUrl;
      }
    }
    if (!avatar) {
      avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.fullName || 'Student')}&background=0B3974&color=fff&bold=true`;
    }

    res.json({ status: 'success', data: { ...student, avatarUrl: avatar, documentsSubmitted: docs } });
  } catch (error) {
    console.error('Fetch student error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve student profile' });
  }
});

// POST /api/students/:idOrRoll/documents - Attach / upload document to student dossier
router.post('/:idOrRoll/documents', async (req: Request, res: Response): Promise<void> => {
  try {
    const { idOrRoll } = req.params;
    const { name, docType, fileSize, fileType, dataUrl } = req.body;

    if (!name || !dataUrl) {
      res.status(400).json({ status: 'error', message: 'Document name and dataUrl are required' });
      return;
    }

    const student = await prisma.student.findFirst({
      where: { OR: [{ id: idOrRoll }, { rollNo: idOrRoll }] },
    });

    if (!student) {
      res.status(404).json({ status: 'error', message: 'Student not found' });
      return;
    }

    const newDoc = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      docType: docType || 'Supporting Document',
      fileSize: fileSize || '180 KB',
      fileType: fileType || (dataUrl.startsWith('data:image/') ? 'image/jpeg' : 'application/pdf'),
      dataUrl,
      uploadedAt: new Date().toISOString(),
    };

    let app = student.admissionNo
      ? await prisma.admissionApplication.findFirst({ where: { applicationNo: student.admissionNo } })
      : await prisma.admissionApplication.findFirst({ where: { studentName: { equals: student.fullName, mode: 'insensitive' } } });

    if (app) {
      const existingDocs = Array.isArray(app.documentsSubmitted) ? app.documentsSubmitted : [];
      const updatedDocs = [...existingDocs, newDoc];
      await prisma.admissionApplication.update({
        where: { id: app.id },
        data: { documentsSubmitted: updatedDocs },
      });
      res.status(201).json({ status: 'success', message: 'Document attached successfully', data: newDoc, allDocuments: updatedDocs });
    } else {
      const appNo = student.admissionNo || `ADM-2026-${Date.now().toString().slice(-4)}`;
      const createdApp = await prisma.admissionApplication.create({
        data: {
          applicationNo: appNo,
          studentName: student.fullName,
          appliedClassId: student.classId,
          gender: student.gender,
          dob: student.dob,
          parentName: student.parentName,
          parentPhone: student.parentPhone,
          parentEmail: student.parentEmail,
          homeAddress: student.homeAddress,
          status: 'APPROVED',
          documentsSubmitted: [newDoc],
        },
      });
      if (!student.admissionNo) {
        await prisma.student.update({
          where: { id: student.id },
          data: { admissionNo: appNo },
        });
      }
      res.status(201).json({ status: 'success', message: 'Document attached successfully', data: newDoc, allDocuments: [newDoc] });
    }
  } catch (error) {
    console.error('Attach document error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to attach document' });
  }
});

// DELETE /api/students/:idOrRoll/documents/:docId - Remove a document from student dossier
router.delete('/:idOrRoll/documents/:docId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { idOrRoll, docId } = req.params;
    const student = await prisma.student.findFirst({
      where: { OR: [{ id: idOrRoll }, { rollNo: idOrRoll }] },
    });

    if (!student) {
      res.status(404).json({ status: 'error', message: 'Student not found' });
      return;
    }

    let app = student.admissionNo
      ? await prisma.admissionApplication.findFirst({ where: { applicationNo: student.admissionNo } })
      : await prisma.admissionApplication.findFirst({ where: { studentName: { equals: student.fullName, mode: 'insensitive' } } });

    if (app && Array.isArray(app.documentsSubmitted)) {
      const filtered = app.documentsSubmitted.filter((d: any) => d.id !== docId && d.name !== docId);
      await prisma.admissionApplication.update({
        where: { id: app.id },
        data: { documentsSubmitted: filtered },
      });
      res.json({ status: 'success', message: 'Document removed', allDocuments: filtered });
    } else {
      res.json({ status: 'success', message: 'Document not found or already removed', allDocuments: [] });
    }
  } catch (error) {
    console.error('Remove document error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to remove document' });
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
      avatarUrl,
    } = req.body;

    if (!fullName || !parentName) {
      res.status(400).json({ status: 'error', message: 'Full name and parent name are required' });
      return;
    }

    if (parentPhone && !isValidPKPhone(parentPhone)) {
      res.status(400).json({ status: 'error', message: 'Please enter a valid Pakistani mobile number (e.g. +92 300 1234567 or 03001234567)' });
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

    // Create or find User login account for student
    let studentUser = null;
    if (parentEmail && parentEmail !== 'parent@readacademy.edu.pk') {
      const candidate = await prisma.user.findFirst({
        where: { email: { equals: parentEmail.trim(), mode: 'insensitive' } },
        include: { studentProfile: true },
      });
      if (candidate && !candidate.studentProfile) {
        studentUser = candidate;
      }
    }

    if (!studentUser) {
      const cleanRoll = finalRollNo.toLowerCase().replace(/[^a-z0-9]/g, '');
      const studentEmail = `${cleanRoll}@readacademy.edu.pk`;
      const existingAccount = await prisma.user.findFirst({
        where: { email: { equals: studentEmail, mode: 'insensitive' } },
      });
      if (existingAccount) {
        studentUser = existingAccount;
      } else {
        const passwordHash = await bcrypt.hash('student123', 10);
        studentUser = await prisma.user.create({
          data: {
            email: studentEmail,
            fullName: fullName.trim(),
            phone: parentPhone || null,
            passwordHash,
            role: 'STUDENT',
            status: 'ACTIVE',
          },
        });
      }
    }

    const newStudent = await prisma.student.create({
      data: {
        userId: studentUser.id,
        rollNo: finalRollNo,
        admissionNo: finalAdmissionNo,
        fullName,
        avatarUrl: avatarUrl || null,
        gender: String(gender).toUpperCase() === 'FEMALE' ? 'FEMALE' : 'MALE',
        dob: new Date(dob),
        bloodGroup,
        classId: targetClass.id,
        sectionId: targetSection.id,
        parentName,
        parentPhone: parentPhone ? normalizePKPhone(parentPhone) : '+92 300 0000000',
        parentEmail,
        emergencyContact: emergencyContact ? normalizePKPhone(emergencyContact) : (parentPhone ? normalizePKPhone(parentPhone) : '+92 300 0000000'),
        homeAddress,
        feeStatus: feeStatus.toUpperCase() as FeeStatus,
        previousSchool,
      },
      include: {
        class: true,
        section: true,
      },
    });

    if (avatarUrl && studentUser) {
      await prisma.user.update({
        where: { id: studentUser.id },
        data: { avatarUrl },
      }).catch(() => {});
    }

    // 4. Create initial fee voucher
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const countVouchers = await prisma.feeVoucher.count();
    const voucherNo = `VCH-2026-${String(countVouchers + 1).padStart(3, '0')}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 15);

    const getMonthlyFeeByClass = (className?: string): number => {
      const lower = (className || '').toLowerCase();
      if (lower.includes('9') || lower.includes('10') || lower.includes('matric')) return 6000;
      if (lower.includes('7') || lower.includes('8')) return 4000;
      if (lower.includes('4') || lower.includes('5') || lower.includes('6')) return 3000;
      return 2000; // Nursery – Class 3
    };

    const monthlyTuition = getMonthlyFeeByClass(newStudent.class?.name);
    const admissionPaperFund = 1000;
    const initialTotal = monthlyTuition + admissionPaperFund;

    const voucher = await prisma.feeVoucher.create({
      data: {
        voucherNo,
        studentId: newStudent.id,
        billingMonth: currentMonth,
        tuitionFee: initialTotal,
        examFee: 0,
        labFee: 0,
        utilityCharges: 0,
        lateFine: 0,
        totalAmount: initialTotal,
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
    const body = req.body;

    const dataToUpdate: any = {};

    if (body.fullName || body.name) dataToUpdate.fullName = body.fullName || body.name;
    if (body.rollNo) dataToUpdate.rollNo = body.rollNo;
    if (body.admissionNo !== undefined) dataToUpdate.admissionNo = body.admissionNo;
    if (body.bloodGroup !== undefined) dataToUpdate.bloodGroup = body.bloodGroup;
    if (body.parentName) dataToUpdate.parentName = body.parentName;
    if (body.parentPhone) {
      if (!isValidPKPhone(body.parentPhone)) {
        res.status(400).json({ status: 'error', message: 'Please enter a valid Pakistani mobile number (e.g. +92 300 1234567 or 03001234567)' });
        return;
      }
      dataToUpdate.parentPhone = normalizePKPhone(body.parentPhone);
    }
    if (body.parentEmail !== undefined) dataToUpdate.parentEmail = body.parentEmail;
    if (body.emergencyContact !== undefined) dataToUpdate.emergencyContact = body.emergencyContact ? normalizePKPhone(body.emergencyContact) : '';
    if (body.homeAddress || body.address) dataToUpdate.homeAddress = body.homeAddress || body.address;
    if (body.previousSchool !== undefined) dataToUpdate.previousSchool = body.previousSchool;
    if (body.status) dataToUpdate.status = body.status;

    if (body.dob) {
      dataToUpdate.dob = new Date(body.dob);
    }
    if (body.admissionDate) {
      dataToUpdate.admissionDate = new Date(body.admissionDate);
    }
    if (body.gender) {
      dataToUpdate.gender = String(body.gender).toUpperCase() === 'FEMALE' ? 'FEMALE' : 'MALE';
    }
    if (body.feeStatus) {
      const fs = String(body.feeStatus).toUpperCase();
      dataToUpdate.feeStatus = fs === 'PAID' ? 'PAID' : fs === 'OVERDUE' ? 'OVERDUE' : 'PENDING';
    }

    // Resolve classId if provided as class name or classId
    if (body.classId) {
      dataToUpdate.classId = body.classId;
    } else if (body.class) {
      const cls = await prisma.class.findFirst({
        where: {
          OR: [
            { id: body.class },
            { name: { equals: body.class, mode: 'insensitive' } },
            { name: { contains: body.class, mode: 'insensitive' } },
          ],
        },
      });
      if (cls) dataToUpdate.classId = cls.id;
    }

    // Resolve sectionId if provided as section name or sectionId
    if (body.sectionId) {
      dataToUpdate.sectionId = body.sectionId;
    } else if (body.section) {
      const sec = await prisma.section.findFirst({
        where: {
          OR: [
            { id: body.section },
            { name: { contains: body.section, mode: 'insensitive' } },
          ],
        },
      });
      if (sec) dataToUpdate.sectionId = sec.id;
    }

    const updated = await prisma.student.update({
      where: { id },
      data: dataToUpdate,
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
