import { Router, Request, Response } from 'express';
import { Prisma, FeeStatus, TransactionType } from '@prisma/client';
import { prisma } from '../db/prisma.js';

const router = Router();

// ==========================================
// 1. FEE VOUCHERS
// ==========================================
router.get('/vouchers', async (req: Request, res: Response) => {
  try {
    const { billingMonth, status, studentId, classId } = req.query;
    const whereClause: Prisma.FeeVoucherWhereInput = {};

    if (billingMonth) whereClause.billingMonth = String(billingMonth);
    if (status) whereClause.status = String(status).toUpperCase() as FeeStatus;
    if (studentId) whereClause.studentId = String(studentId);
    if (classId) {
      whereClause.student = { classId: String(classId) };
    }

    const vouchers = await prisma.feeVoucher.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            class: true,
            section: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ status: 'success', count: vouchers.length, data: vouchers });
  } catch (error) {
    console.error('Fetch fee vouchers error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve fee vouchers' });
  }
});

// GET /api/fees/vouchers/:idOrVoucher - Single voucher
router.get('/vouchers/:idOrVoucher', async (req: Request, res: Response): Promise<void> => {
  try {
    const { idOrVoucher } = req.params;
    const voucher = await prisma.feeVoucher.findFirst({
      where: {
        OR: [{ id: idOrVoucher }, { voucherNo: idOrVoucher }],
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

    if (!voucher) {
      res.status(404).json({ status: 'error', message: 'Fee voucher not found' });
      return;
    }

    res.json({ status: 'success', data: voucher });
  } catch (error) {
    console.error('Fetch voucher error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve fee voucher' });
  }
});

// POST /api/fees/vouchers - Create individual voucher with custom fees
router.post('/vouchers', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      studentId,
      billingMonth,
      tuitionFee,
      admissionFee = 0,
      examFee = 0,
      labFee = 0,
      utilityCharges = 0,
      lateFine = 0,
      dueDate,
    } = req.body;

    if (!studentId || tuitionFee === undefined) {
      res.status(400).json({ status: 'error', message: 'Student ID and tuition fee are required' });
      return;
    }

    const student = await prisma.student.findFirst({
      where: {
        OR: [
          { id: studentId },
          { rollNo: studentId },
          { fullName: studentId },
        ],
      },
    });

    if (!student) {
      res.status(404).json({ status: 'error', message: 'Student not found' });
      return;
    }

    const month = billingMonth || new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const countVouchers = await prisma.feeVoucher.count();
    const voucherNo = `VCH-${new Date().getFullYear()}-${String(countVouchers + 1).padStart(3, '0')}`;
    const dateDue = dueDate ? new Date(dueDate) : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
    const totalAmount = Number(tuitionFee) + Number(admissionFee) + Number(examFee) + Number(labFee) + Number(utilityCharges) + Number(lateFine);

    const voucher = await prisma.feeVoucher.create({
      data: {
        voucherNo,
        studentId: student.id,
        billingMonth: month,
        tuitionFee: Number(tuitionFee),
        examFee: Number(examFee),
        labFee: Number(labFee),
        utilityCharges: Number(utilityCharges),
        lateFine: Number(lateFine),
        totalAmount,
        dueDate: dateDue,
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

    res.status(201).json({ status: 'success', message: 'Fee voucher created successfully', data: voucher });
  } catch (error) {
    console.error('Create single voucher error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create fee voucher' });
  }
});

// POST /api/fees/vouchers/generate - Bulk generate vouchers for class
router.post('/vouchers/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId, billingMonth, tuitionFee, examFee = 0, labFee = 0, utilityCharges = 0, dueDate } = req.body;

    if (!classId || !billingMonth || tuitionFee === undefined || !dueDate) {
      res.status(400).json({ status: 'error', message: 'Missing required fee voucher parameters' });
      return;
    }

    const students = await prisma.student.findMany({
      where: { classId, status: 'Active' },
    });

    if (students.length === 0) {
      res.status(404).json({ status: 'error', message: 'No active students found in this class' });
      return;
    }

    const totalAmount = Number(tuitionFee) + Number(examFee) + Number(labFee) + Number(utilityCharges);
    const dateDue = new Date(dueDate);

    const generatedVouchers = [];

    for (const student of students) {
      const voucherNo = `VCH-${billingMonth.replace(/\s+/g, '-').toUpperCase()}-${student.rollNo}`;

      const voucher = await prisma.feeVoucher.upsert({
        where: { voucherNo },
        update: {
          tuitionFee: Number(tuitionFee),
          examFee: Number(examFee),
          labFee: Number(labFee),
          utilityCharges: Number(utilityCharges),
          totalAmount,
          dueDate: dateDue,
        },
        create: {
          voucherNo,
          studentId: student.id,
          billingMonth,
          tuitionFee: Number(tuitionFee),
          examFee: Number(examFee),
          labFee: Number(labFee),
          utilityCharges: Number(utilityCharges),
          totalAmount,
          dueDate: dateDue,
          status: 'PENDING',
        },
      });

      generatedVouchers.push(voucher);
    }

    res.status(201).json({
      status: 'success',
      message: `Generated ${generatedVouchers.length} fee vouchers for class`,
      data: generatedVouchers,
    });
  } catch (error) {
    console.error('Generate vouchers error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to generate fee vouchers' });
  }
});

// PATCH /api/fees/vouchers/:id/pay - Mark voucher paid
router.patch('/vouchers/:id/pay', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { paymentMethod = 'Cash Counter', paidDate } = req.body;

    const existing = await prisma.feeVoucher.findFirst({
      where: {
        OR: [
          { id },
          { voucherNo: id },
        ],
      },
    });

    if (!existing) {
      res.status(404).json({ status: 'error', message: 'Fee voucher not found' });
      return;
    }

    const voucher = await prisma.feeVoucher.update({
      where: { id: existing.id },
      data: {
        status: 'PAID',
        paidDate: paidDate ? new Date(paidDate) : new Date(),
        paymentMethod,
      },
      include: { student: true },
    });

    // Also update student feeStatus
    await prisma.student.update({
      where: { id: voucher.studentId },
      data: { feeStatus: 'PAID' },
    });

    // Record automatic transaction in Accounts
    await prisma.accountTransaction.create({
      data: {
        title: `Fee Collection - ${voucher.voucherNo} (${voucher.student.fullName})`,
        type: 'INCOME',
        category: 'Tuition Fees',
        amount: voucher.totalAmount,
        referenceNo: voucher.voucherNo,
      },
    });

    res.json({ status: 'success', message: 'Fee payment recorded successfully', data: voucher });
  } catch (error) {
    console.error('Pay voucher error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to record fee payment' });
  }
});

// ==========================================
// 2. ACCOUNT TRANSACTIONS (Financial Ledger)
// ==========================================
router.get('/transactions', async (req: Request, res: Response) => {
  try {
    const { type, category } = req.query;
    const whereClause: Prisma.AccountTransactionWhereInput = {};

    if (type) whereClause.type = String(type).toUpperCase() as TransactionType;
    if (category) whereClause.category = String(category);

    const transactions = await prisma.accountTransaction.findMany({
      where: whereClause,
      include: { recordedBy: true },
      orderBy: { transactionDate: 'desc' },
    });

    res.json({ status: 'success', count: transactions.length, data: transactions });
  } catch (error) {
    console.error('Fetch transactions error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve transactions' });
  }
});

router.post('/transactions', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, type, category, amount, referenceNo, transactionDate } = req.body;

    if (!title || !type || !category || amount === undefined) {
      res.status(400).json({ status: 'error', message: 'Missing title, type, category, or amount' });
      return;
    }

    const transaction = await prisma.accountTransaction.create({
      data: {
        title,
        type: type.toUpperCase(),
        category,
        amount: Number(amount),
        referenceNo,
        transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
      },
    });

    res.status(201).json({ status: 'success', message: 'Transaction recorded', data: transaction });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to record transaction' });
  }
});

export default router;
