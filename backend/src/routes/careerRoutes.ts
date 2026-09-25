import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma.js';
import bcrypt from 'bcryptjs';

const router = Router();

// ==========================================
// JOB POSTINGS ENDPOINTS
// ==========================================

// GET /api/jobs - List job postings
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { department, status, jobType, publicOnly } = req.query;

    const whereClause: any = {};
    if (department && department !== 'All') whereClause.department = String(department);
    if (jobType && jobType !== 'All') whereClause.jobType = String(jobType);
    if (status && status !== 'All') {
      whereClause.status = String(status).toUpperCase();
    } else if (publicOnly === 'true') {
      whereClause.status = 'OPEN';
    }

    const jobs = await prisma.jobPosting.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      status: 'success',
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Fetch job postings error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve job postings' });
  }
});

// GET /api/jobs/:id - Single job details
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const job = await prisma.jobPosting.findUnique({
      where: { id },
      include: {
        applications: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!job) {
      res.status(404).json({ status: 'error', message: 'Job posting not found' });
      return;
    }

    res.json({ status: 'success', data: job });
  } catch (error) {
    console.error('Fetch job error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve job details' });
  }
});

// POST /api/jobs - Create new job posting (Admin)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      department,
      primarySubject,
      jobType = 'Full Time',
      qualification,
      experienceYears = 2,
      salaryRange,
      location = 'Main Campus, Sahiwal',
      openings = 1,
      description,
      requirements = [],
      responsibilities = [],
      deadline,
      status = 'OPEN'
    } = req.body;

    if (!title || !department || !qualification || !description) {
      res.status(400).json({
        status: 'error',
        message: 'Title, department, qualification, and description are required'
      });
      return;
    }

    const job = await prisma.jobPosting.create({
      data: {
        title: title.trim(),
        department: department.trim(),
        primarySubject: primarySubject ? primarySubject.trim() : null,
        jobType,
        qualification: qualification.trim(),
        experienceYears: Number(experienceYears || 0),
        salaryRange: salaryRange ? salaryRange.trim() : null,
        location,
        openings: Number(openings || 1),
        description: description.trim(),
        requirements: Array.isArray(requirements) ? requirements : [requirements],
        responsibilities: Array.isArray(responsibilities) ? responsibilities : [responsibilities],
        deadline: deadline ? new Date(deadline) : null,
        status: String(status).toUpperCase() === 'CLOSED' ? 'CLOSED' : 'OPEN'
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Job posting published successfully',
      data: job
    });
  } catch (error) {
    console.error('Create job posting error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create job posting' });
  }
});

// PUT /api/jobs/:id - Edit job posting (Admin)
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      department,
      primarySubject,
      jobType,
      qualification,
      experienceYears,
      salaryRange,
      location,
      openings,
      description,
      requirements,
      responsibilities,
      deadline,
      status
    } = req.body;

    const existing = await prisma.jobPosting.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ status: 'error', message: 'Job posting not found' });
      return;
    }

    const updated = await prisma.jobPosting.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(department && { department: department.trim() }),
        ...(primarySubject !== undefined && { primarySubject }),
        ...(jobType && { jobType }),
        ...(qualification && { qualification: qualification.trim() }),
        ...(experienceYears !== undefined && { experienceYears: Number(experienceYears) }),
        ...(salaryRange !== undefined && { salaryRange }),
        ...(location && { location }),
        ...(openings !== undefined && { openings: Number(openings) }),
        ...(description && { description: description.trim() }),
        ...(requirements && { requirements: Array.isArray(requirements) ? requirements : [requirements] }),
        ...(responsibilities && { responsibilities: Array.isArray(responsibilities) ? responsibilities : [responsibilities] }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
        ...(status && { status: String(status).toUpperCase() })
      }
    });

    res.json({
      status: 'success',
      message: 'Job posting updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Update job posting error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update job posting' });
  }
});

// DELETE /api/jobs/:id - Delete job posting (Admin)
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await prisma.jobPosting.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ status: 'error', message: 'Job posting not found' });
      return;
    }

    await prisma.jobPosting.delete({ where: { id } });
    res.json({ status: 'success', message: 'Job posting deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete job posting' });
  }
});

// ==========================================
// JOB APPLICATIONS ENDPOINTS
// ==========================================

// POST /api/jobs/apply - Teacher Online Application
router.post('/apply', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      jobId,
      fullName,
      email,
      phone,
      gender = 'MALE',
      dob,
      highestDegree,
      institute,
      experienceYears = 0,
      currentOrg,
      currentSalary,
      expectedSalary,
      noticePeriod,
      coverLetter,
      cvFileName,
      cvDataUrl
    } = req.body;

    if (!fullName || !email || !phone || !highestDegree) {
      res.status(400).json({
        status: 'error',
        message: 'Full Name, Email, Phone number, and Highest Degree are required'
      });
      return;
    }

    // Generate Application Tracking Number e.g. "JOB-2026-001"
    const totalApps = await prisma.jobApplication.count();
    const applicationNo = `JOB-2026-${String(totalApps + 101).padStart(3, '0')}`;

    const application = await prisma.jobApplication.create({
      data: {
        applicationNo,
        jobId: jobId || null,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        gender: String(gender).toUpperCase() === 'FEMALE' ? 'FEMALE' : 'MALE',
        dob: dob ? new Date(dob) : null,
        highestDegree: highestDegree.trim(),
        institute: institute ? institute.trim() : null,
        experienceYears: Number(experienceYears || 0),
        currentOrg: currentOrg ? currentOrg.trim() : null,
        currentSalary: currentSalary ? Number(currentSalary) : null,
        expectedSalary: expectedSalary ? Number(expectedSalary) : null,
        noticePeriod: noticePeriod || 'Immediate',
        coverLetter: coverLetter ? coverLetter.trim() : null,
        cvFileName: cvFileName || null,
        cvDataUrl: cvDataUrl || null,
        status: 'PENDING'
      },
      include: {
        job: true
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Job application submitted successfully',
      data: application
    });
  } catch (error) {
    console.error('Job application submission error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to submit job application' });
  }
});

// GET /api/job-applications - Fetch all applications (Admin)
router.get('/applications/all', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, jobId, q } = req.query;

    const whereClause: any = {};
    if (status && status !== 'All') whereClause.status = String(status).toUpperCase();
    if (jobId && jobId !== 'All') whereClause.jobId = String(jobId);

    if (q) {
      whereClause.OR = [
        { fullName: { contains: String(q), mode: 'insensitive' } },
        { email: { contains: String(q), mode: 'insensitive' } },
        { phone: { contains: String(q), mode: 'insensitive' } },
        { applicationNo: { contains: String(q), mode: 'insensitive' } },
        { highestDegree: { contains: String(q), mode: 'insensitive' } }
      ];
    }

    const applications = await prisma.jobApplication.findMany({
      where: whereClause,
      include: {
        job: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      status: 'success',
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Fetch job applications error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve applications' });
  }
});

// PATCH /api/job-applications/:id/status - Update application status (Admin)
router.patch('/applications/:id/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, interviewDate, adminNotes, enrollAsTeacher, basicSalary } = req.body;

    const existing = await prisma.jobApplication.findUnique({
      where: { id },
      include: { job: true }
    });

    if (!existing) {
      res.status(404).json({ status: 'error', message: 'Application not found' });
      return;
    }

    const updated = await prisma.jobApplication.update({
      where: { id },
      data: {
        status: status ? String(status).toUpperCase() : existing.status,
        ...(interviewDate !== undefined && { interviewDate: interviewDate ? new Date(interviewDate) : null }),
        ...(adminNotes !== undefined && { adminNotes })
      },
      include: { job: true }
    });

    let createdTeacher = null;
    // If status is HIRED and enrollAsTeacher is requested, auto-create Teacher & User record!
    if (status && String(status).toUpperCase() === 'HIRED' && enrollAsTeacher) {
      const existingTeacher = await prisma.teacher.findFirst({
        where: {
          OR: [
            { email: { equals: existing.email, mode: 'insensitive' } },
            { phone: existing.phone }
          ]
        }
      });

      if (!existingTeacher) {
        const teacherCount = await prisma.teacher.count();
        const empId = `TEA-${String(teacherCount + 101).padStart(3, '0')}`;

        // Find or create User
        let user = await prisma.user.findFirst({
          where: { email: { equals: existing.email, mode: 'insensitive' } }
        });

        if (!user) {
          const passwordHash = await bcrypt.hash('teacher123', 10);
          user = await prisma.user.create({
            data: {
              email: existing.email,
              fullName: existing.fullName,
              phone: existing.phone,
              passwordHash,
              role: 'TEACHER',
              status: 'ACTIVE'
            }
          });
        }

        createdTeacher = await prisma.teacher.create({
          data: {
            userId: user.id,
            empId,
            fullName: existing.fullName,
            department: existing.job?.department || 'General Faculty',
            specialization: existing.job?.primarySubject || existing.highestDegree,
            qualification: existing.highestDegree,
            experienceYears: Number(existing.experienceYears || 1),
            phone: existing.phone,
            email: existing.email,
            joiningDate: new Date(),
            basicSalary: Number(basicSalary || existing.expectedSalary || 55000)
          }
        });
      }
    }

    res.json({
      status: 'success',
      message: `Candidate status updated to ${updated.status}`,
      data: {
        application: updated,
        createdTeacher
      }
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update application status' });
  }
});

// DELETE /api/job-applications/:id - Delete application (Admin)
router.delete('/applications/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.jobApplication.delete({ where: { id } });
    res.json({ status: 'success', message: 'Job application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete application' });
  }
});

export default router;
