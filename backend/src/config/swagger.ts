import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Read Academy Sahiwal - REST API Documentation',
    version: '1.0.0',
    description: `
**Read Academy Sahiwal Enterprise School Management & Public Portal REST API**

Built with **Node.js, Express, TypeScript, PostgreSQL 18, and Prisma ORM**.

### Authentication
Most administrative and faculty endpoints can be authenticated with a JWT token.
Click the **Authorize** button on the right and enter your Bearer token:
\`Bearer <your_token_here>\`
    `,
    contact: {
      name: 'Read Academy IT Operations',
      email: 'admin@readacademy.edu.pk',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token obtained from /api/auth/login',
      },
    },
  },
  tags: [
    { name: 'System', description: 'API health and status' },
    { name: 'Authentication', description: 'User authentication, registration & profile' },
    { name: 'Admin Dashboard & Reports', description: 'Institutional analytics, real-time metrics & reporting' },
    { name: 'Students', description: 'Student enrollment, queries, and student records' },
    { name: 'Admissions', description: 'Online admission applications & review' },
    { name: 'Teachers & Faculty', description: 'Faculty members, duties, and payroll records' },
    { name: 'Academics', description: 'Classes, Sections, Subjects, and Teacher assignments' },
    { name: 'Attendance', description: 'Student & Teacher daily attendance tracking' },
    { name: 'Examinations', description: 'Exam schedules, datesheets, and marks grading' },
    { name: 'Homework', description: 'Homework assignments and student submissions' },
    { name: 'Fees & Accounts', description: 'Fee vouchers, fee collection & accounts ledger' },
    { name: 'CMS & Website', description: 'Notices, Blogs, Photo Gallery, Events, and Contact Inquiries' },
  ],
  paths: {
    // -------------------------------------------------------------
    // SYSTEM
    // -------------------------------------------------------------
    '/api/health': {
      get: {
        tags: ['System'],
        summary: 'Check API and database health status',
        responses: {
          200: { description: 'API and database are healthy' },
          500: { description: 'Database connection failed' },
        },
      },
    },

    // -------------------------------------------------------------
    // AUTHENTICATION
    // -------------------------------------------------------------
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'User Login (Super Admin, Teacher, Student)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@readacademy.edu.pk' },
                  password: { type: 'string', example: 'admin1234' },
                  role: { type: 'string', example: 'SUPER_ADMIN' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful, returns JWT token and user profile' },
          401: { description: 'Invalid email or password' },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new account (Pending approval)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fullName', 'email', 'password'],
                properties: {
                  fullName: { type: 'string', example: 'Ahmed Raza' },
                  email: { type: 'string', example: 'ahmed.raza@example.com' },
                  phone: { type: 'string', example: '+923001234567' },
                  password: { type: 'string', example: 'Secr3tP@ss' },
                  role: { type: 'string', example: 'STUDENT', enum: ['STUDENT', 'TEACHER', 'PARENT'] },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User registered successfully' },
          400: { description: 'Email already exists or invalid data' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get current logged-in user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Current user profile data' },
          401: { description: 'Unauthorized' },
        },
      },
    },

    // -------------------------------------------------------------
    // ADMIN DASHBOARD & REPORTS
    // -------------------------------------------------------------
    '/api/admin/dashboard': {
      get: {
        tags: ['Admin Dashboard & Reports'],
        summary: 'Get real-time admin dashboard metrics, attendance rates, fee collection & chart trends',
        responses: {
          200: { description: 'Dashboard stats and charts data' },
        },
      },
    },
    '/api/admin/reports': {
      get: {
        tags: ['Admin Dashboard & Reports'],
        summary: 'Get institutional academic reports, student summaries per class, and teacher workload analytics',
        responses: {
          200: { description: 'Academic summaries and workload reports' },
        },
      },
    },

    // -------------------------------------------------------------
    // STUDENTS
    // -------------------------------------------------------------
    '/api/students': {
      get: {
        tags: ['Students'],
        summary: 'Get list of students with optional filters and search',
        parameters: [
          { name: 'classId', in: 'query', schema: { type: 'string' }, description: 'Filter by Class ID' },
          { name: 'sectionId', in: 'query', schema: { type: 'string' }, description: 'Filter by Section ID' },
          { name: 'feeStatus', in: 'query', schema: { type: 'string', enum: ['PAID', 'PENDING', 'OVERDUE'] } },
          { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Search name, roll no, phone' },
        ],
        responses: {
          200: { description: 'List of students' },
        },
      },
      post: {
        tags: ['Students'],
        summary: 'Enroll a new student',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['rollNo', 'fullName', 'gender', 'dob', 'classId', 'sectionId', 'parentName', 'parentPhone', 'homeAddress'],
                properties: {
                  rollNo: { type: 'string', example: 'RAS-2026-99' },
                  admissionNo: { type: 'string', example: 'ADM-2026-099' },
                  fullName: { type: 'string', example: 'Bilal Hassan' },
                  gender: { type: 'string', enum: ['MALE', 'FEMALE'], example: 'MALE' },
                  dob: { type: 'string', format: 'date', example: '2010-05-20' },
                  bloodGroup: { type: 'string', example: 'O+' },
                  classId: { type: 'string', example: 'cls-09' },
                  sectionId: { type: 'string', example: 'sec-09a' },
                  parentName: { type: 'string', example: 'Hassan Ali' },
                  parentPhone: { type: 'string', example: '+923009876543' },
                  parentEmail: { type: 'string', example: 'hassan.ali@example.com' },
                  emergencyContact: { type: 'string', example: '+923009876543' },
                  homeAddress: { type: 'string', example: 'Farid Town, Sahiwal' },
                  feeStatus: { type: 'string', enum: ['PAID', 'PENDING', 'OVERDUE'], example: 'PAID' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Student enrolled successfully' },
        },
      },
    },
    '/api/students/{idOrRoll}': {
      get: {
        tags: ['Students'],
        summary: 'Get single student profile with attendance, marks and fee records',
        parameters: [
          { name: 'idOrRoll', in: 'path', required: true, schema: { type: 'string' }, example: 'RAS-2026-89' },
        ],
        responses: {
          200: { description: 'Student profile' },
          404: { description: 'Student not found' },
        },
      },
      put: {
        tags: ['Students'],
        summary: 'Update student profile details',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'idOrRoll', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object' },
            },
          },
        },
        responses: {
          200: { description: 'Student updated successfully' },
        },
      },
      delete: {
        tags: ['Students'],
        summary: 'Delete student record',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'idOrRoll', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Student deleted' },
        },
      },
    },

    // -------------------------------------------------------------
    // ADMISSIONS
    // -------------------------------------------------------------
    '/api/admissions': {
      get: {
        tags: ['Admissions'],
        summary: 'Get all online admission applications',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] } },
          { name: 'classId', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'List of admission applications' },
        },
      },
      post: {
        tags: ['Admissions'],
        summary: 'Submit an online admission form (Public)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['studentName', 'appliedClassId', 'gender', 'dob', 'parentName', 'parentPhone', 'homeAddress'],
                properties: {
                  studentName: { type: 'string', example: 'Ayesha Khan' },
                  appliedClassId: { type: 'string', example: 'cls-09' },
                  gender: { type: 'string', enum: ['MALE', 'FEMALE'], example: 'FEMALE' },
                  dob: { type: 'string', format: 'date', example: '2011-03-14' },
                  parentName: { type: 'string', example: 'Tariq Khan' },
                  parentPhone: { type: 'string', example: '+923001239876' },
                  parentEmail: { type: 'string', example: 'tariq@example.com' },
                  homeAddress: { type: 'string', example: 'College Road, Sahiwal' },
                  previousSchool: { type: 'string', example: 'Divisional Public School' },
                  previousPercentage: { type: 'number', example: 89.5 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Admission submitted with Application No' },
        },
      },
    },
    '/api/admissions/{id}/status': {
      patch: {
        tags: ['Admissions'],
        summary: 'Approve, reject, or review admission application',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'], example: 'APPROVED' },
                  adminNotes: { type: 'string', example: 'Documents verified and test passed' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Status updated' },
        },
      },
    },

    // -------------------------------------------------------------
    // TEACHERS & FACULTY
    // -------------------------------------------------------------
    '/api/teachers': {
      get: {
        tags: ['Teachers & Faculty'],
        summary: 'List teachers with duties and allocated subjects',
        parameters: [
          { name: 'department', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'q', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'List of faculty members' },
        },
      },
      post: {
        tags: ['Teachers & Faculty'],
        summary: 'Add a new faculty member',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['empId', 'fullName', 'department', 'qualification', 'phone', 'email'],
                properties: {
                  empId: { type: 'string', example: 'T-102' },
                  fullName: { type: 'string', example: 'Dr. Shahbaz Ahmad' },
                  department: { type: 'string', example: 'Science' },
                  specialization: { type: 'string', example: 'Organic Chemistry' },
                  qualification: { type: 'string', example: 'Ph.D Chemistry' },
                  experienceYears: { type: 'number', example: 10 },
                  phone: { type: 'string', example: '+923008877665' },
                  email: { type: 'string', example: 'shahbaz.ahmad@readacademy.edu.pk' },
                  basicSalary: { type: 'number', example: 95000 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Faculty member created' },
        },
      },
    },
    '/api/teachers/{id}/duties': {
      post: {
        tags: ['Teachers & Faculty'],
        summary: 'Assign a school duty to a teacher',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['dutyTitle'],
                properties: {
                  dutyTitle: { type: 'string', example: 'Examination Controller Assistant' },
                  description: { type: 'string', example: 'Paper printing and room assignment management' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Duty assigned' },
        },
      },
    },
    '/api/teachers/{id}/payroll': {
      post: {
        tags: ['Teachers & Faculty'],
        summary: 'Generate monthly payroll slip for a teacher',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['monthYear', 'basicSalary'],
                properties: {
                  monthYear: { type: 'string', example: 'October 2026' },
                  basicSalary: { type: 'number', example: 85000 },
                  allowances: { type: 'number', example: 5000 },
                  deductions: { type: 'number', example: 1500 },
                  tax: { type: 'number', example: 2500 },
                  paymentStatus: { type: 'string', enum: ['PAID', 'PENDING', 'PROCESSING'], example: 'PAID' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Payroll slip recorded' },
        },
      },
    },

    // -------------------------------------------------------------
    // ACADEMICS
    // -------------------------------------------------------------
    '/api/academics/classes': {
      get: {
        tags: ['Academics'],
        summary: 'List all academic classes and section counts',
        responses: { 200: { description: 'Classes' } },
      },
      post: {
        tags: ['Academics'],
        summary: 'Create a new class',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'numericLevel'],
                properties: {
                  name: { type: 'string', example: 'Grade 11 - Pre-Eng' },
                  numericLevel: { type: 'number', example: 11 },
                  capacity: { type: 'number', example: 45 },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Class created' } },
      },
    },
    '/api/academics/sections': {
      get: {
        tags: ['Academics'],
        summary: 'List sections with class and class teacher',
        parameters: [{ name: 'classId', in: 'query', schema: { type: 'string' } }],
        responses: { 200: { description: 'Sections' } },
      },
      post: {
        tags: ['Academics'],
        summary: 'Add a section to a class',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['classId', 'name'],
                properties: {
                  classId: { type: 'string', example: 'cls-09' },
                  name: { type: 'string', example: 'Section C - Iqbal' },
                  roomNumber: { type: 'string', example: 'Room 203' },
                  classTeacherId: { type: 'string', example: 'tch-01' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Section created' } },
      },
    },
    '/api/academics/subjects': {
      get: {
        tags: ['Academics'],
        summary: 'List all subjects',
        responses: { 200: { description: 'Subjects' } },
      },
      post: {
        tags: ['Academics'],
        summary: 'Add a subject',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['code', 'name', 'department'],
                properties: {
                  code: { type: 'string', example: 'ISL-09' },
                  name: { type: 'string', example: 'Islamiat Compulsory' },
                  department: { type: 'string', example: 'Humanities' },
                  weeklyPeriods: { type: 'number', example: 4 },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Subject created' } },
      },
    },
    '/api/academics/class-subjects': {
      get: {
        tags: ['Academics'],
        summary: 'List class subject teacher assignments',
        responses: { 200: { description: 'Class subject mappings' } },
      },
      post: {
        tags: ['Academics'],
        summary: 'Assign teacher to a class section subject',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['classId', 'sectionId', 'subjectId', 'teacherId'],
                properties: {
                  classId: { type: 'string', example: 'cls-09' },
                  sectionId: { type: 'string', example: 'sec-09a' },
                  subjectId: { type: 'string', example: 'sub-phy-09' },
                  teacherId: { type: 'string', example: 'tch-01' },
                  weeklyPeriods: { type: 'number', example: 6 },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Teacher assigned to subject' } },
      },
    },
    '/api/academics/timetable': {
      get: {
        tags: ['Academics'],
        summary: 'Get master weekly timetable schedule by class, section, or day',
        parameters: [
          { name: 'classId', in: 'query', schema: { type: 'string' } },
          { name: 'sectionId', in: 'query', schema: { type: 'string' } },
          { name: 'dayOfWeek', in: 'query', schema: { type: 'string' }, example: 'Monday' },
        ],
        responses: { 200: { description: 'Timetable slots' } },
      },
      post: {
        tags: ['Academics'],
        summary: 'Create or update a timetable lecture slot',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['classId', 'sectionId', 'dayOfWeek', 'periodNumber', 'startTime', 'endTime', 'subjectId', 'teacherId', 'roomNumber'],
                properties: {
                  classId: { type: 'string', example: 'cls-09' },
                  sectionId: { type: 'string', example: 'sec-09a' },
                  dayOfWeek: { type: 'string', example: 'Monday' },
                  periodNumber: { type: 'number', example: 1 },
                  startTime: { type: 'string', example: '08:00 AM' },
                  endTime: { type: 'string', example: '08:45 AM' },
                  subjectId: { type: 'string', example: 'sub-phy-09' },
                  teacherId: { type: 'string', example: 'tch-01' },
                  roomNumber: { type: 'string', example: 'Room 201' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Timetable slot saved' } },
      },
    },

    // -------------------------------------------------------------
    // ATTENDANCE
    // -------------------------------------------------------------
    '/api/attendance/students': {
      get: {
        tags: ['Attendance'],
        summary: 'Get student daily attendance by date and class/section',
        parameters: [
          { name: 'date', in: 'query', schema: { type: 'string', format: 'date' }, example: '2026-09-14' },
          { name: 'classId', in: 'query', schema: { type: 'string' } },
          { name: 'sectionId', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Attendance records' } },
      },
    },
    '/api/attendance/students/bulk': {
      post: {
        tags: ['Attendance'],
        summary: 'Mark class attendance in bulk for a date',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['records'],
                properties: {
                  date: { type: 'string', format: 'date', example: '2026-09-14' },
                  records: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['studentId', 'status'],
                      properties: {
                        studentId: { type: 'string', example: 'std-01' },
                        status: { type: 'string', enum: ['PRESENT', 'ABSENT', 'LATE', 'LEAVE'], example: 'PRESENT' },
                        remarks: { type: 'string', example: 'On time' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Attendance marked' } },
      },
    },
    '/api/attendance/teachers': {
      get: {
        tags: ['Attendance'],
        summary: 'Get faculty attendance for a date',
        parameters: [
          { name: 'date', in: 'query', schema: { type: 'string', format: 'date' } },
        ],
        responses: { 200: { description: 'Teacher attendance records' } },
      },
      post: {
        tags: ['Attendance'],
        summary: 'Mark teacher check-in/out attendance',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['teacherId'],
                properties: {
                  teacherId: { type: 'string', example: 'tch-01' },
                  status: { type: 'string', enum: ['PRESENT', 'ABSENT', 'LATE', 'LEAVE'], example: 'PRESENT' },
                  checkIn: { type: 'string', example: '07:45 AM' },
                  checkOut: { type: 'string', example: '02:15 PM' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Attendance recorded' } },
      },
    },

    // -------------------------------------------------------------
    // EXAMINATIONS
    // -------------------------------------------------------------
    '/api/exams': {
      get: {
        tags: ['Examinations'],
        summary: 'List all examinations and terms',
        responses: { 200: { description: 'Exams' } },
      },
      post: {
        tags: ['Examinations'],
        summary: 'Create a new exam term',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'term', 'academicYear', 'startDate', 'endDate'],
                properties: {
                  title: { type: 'string', example: 'Final Board Send-up Exam 2027' },
                  term: { type: 'string', example: 'Pre-Board' },
                  academicYear: { type: 'string', example: '2026-2027' },
                  startDate: { type: 'string', format: 'date', example: '2027-01-10' },
                  endDate: { type: 'string', format: 'date', example: '2027-01-25' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Exam created' } },
      },
    },
    '/api/exams/{id}/datesheet': {
      get: {
        tags: ['Examinations'],
        summary: 'Get datesheet timetable for an exam',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'classId', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Datesheet items' } },
      },
      post: {
        tags: ['Examinations'],
        summary: 'Add datesheet paper schedule',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['classId', 'subjectId', 'examDate', 'dayName', 'startTime', 'endTime', 'roomNumber'],
                properties: {
                  classId: { type: 'string', example: 'cls-09' },
                  subjectId: { type: 'string', example: 'sub-phy-09' },
                  examDate: { type: 'string', format: 'date', example: '2026-10-18' },
                  dayName: { type: 'string', example: 'Sunday' },
                  startTime: { type: 'string', example: '09:00 AM' },
                  endTime: { type: 'string', example: '12:00 PM' },
                  roomNumber: { type: 'string', example: 'Hall A' },
                  invigilatorId: { type: 'string', example: 'tch-01' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Schedule paper added' } },
      },
    },
    '/api/exams/{id}/marks/bulk': {
      post: {
        tags: ['Examinations'],
        summary: 'Enter or update marks for a class subject in bulk',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['subjectId', 'entries'],
                properties: {
                  subjectId: { type: 'string', example: 'sub-phy-09' },
                  totalMarks: { type: 'number', example: 100 },
                  entries: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['studentId', 'obtainedMarks'],
                      properties: {
                        studentId: { type: 'string', example: 'std-01' },
                        obtainedMarks: { type: 'number', example: 94.5 },
                        remarks: { type: 'string', example: 'Excellent performance' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Marks recorded and graded' } },
      },
    },

    // -------------------------------------------------------------
    // HOMEWORK
    // -------------------------------------------------------------
    '/api/homework': {
      get: {
        tags: ['Homework'],
        summary: 'List homework assignments with submission count',
        parameters: [
          { name: 'classId', in: 'query', schema: { type: 'string' } },
          { name: 'subjectId', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Homework list' } },
      },
      post: {
        tags: ['Homework'],
        summary: 'Create homework assignment for class',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'classId', 'subjectId', 'teacherId', 'dueDate'],
                properties: {
                  title: { type: 'string', example: 'Newton Laws of Motion Numericals' },
                  description: { type: 'string', example: 'Solve exercise problems 1 to 10 from Chapter 3' },
                  classId: { type: 'string', example: 'cls-09' },
                  sectionId: { type: 'string', example: 'sec-09a' },
                  subjectId: { type: 'string', example: 'sub-phy-09' },
                  teacherId: { type: 'string', example: 'tch-01' },
                  dueDate: { type: 'string', format: 'date', example: '2026-09-22' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Homework assigned' } },
      },
    },
    '/api/homework/{id}/submit': {
      post: {
        tags: ['Homework'],
        summary: 'Student submits completed homework assignment',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['studentId'],
                properties: {
                  studentId: { type: 'string', example: 'std-01' },
                  submissionText: { type: 'string', example: 'Completed all 10 problems on notebook' },
                  attachmentUrl: { type: 'string', example: 'https://example.com/homework-scans.pdf' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Homework submitted' } },
      },
    },

    // -------------------------------------------------------------
    // FEES & ACCOUNTS
    // -------------------------------------------------------------
    '/api/fees/vouchers': {
      get: {
        tags: ['Fees & Accounts'],
        summary: 'Query fee vouchers by month, status, or student',
        parameters: [
          { name: 'billingMonth', in: 'query', schema: { type: 'string' }, example: 'September 2026' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['PAID', 'PENDING', 'OVERDUE'] } },
          { name: 'studentId', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Fee vouchers' } },
      },
    },
    '/api/fees/vouchers/generate': {
      post: {
        tags: ['Fees & Accounts'],
        summary: 'Bulk generate fee vouchers for an entire class',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['classId', 'billingMonth', 'tuitionFee', 'dueDate'],
                properties: {
                  classId: { type: 'string', example: 'cls-09' },
                  billingMonth: { type: 'string', example: 'October 2026' },
                  tuitionFee: { type: 'number', example: 8500 },
                  examFee: { type: 'number', example: 500 },
                  labFee: { type: 'number', example: 500 },
                  utilityCharges: { type: 'number', example: 500 },
                  dueDate: { type: 'string', format: 'date', example: '2026-10-15' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Vouchers generated' } },
      },
    },
    '/api/fees/vouchers/{id}/pay': {
      patch: {
        tags: ['Fees & Accounts'],
        summary: 'Mark fee voucher as paid and record income transaction',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  paymentMethod: { type: 'string', example: 'Bank Alfalah Online' },
                  paidDate: { type: 'string', format: 'date', example: '2026-09-14' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Voucher marked paid' } },
      },
    },
    '/api/accounts/transactions': {
      get: {
        tags: ['Fees & Accounts'],
        summary: 'Get ledger of income and expense transactions',
        parameters: [
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['INCOME', 'EXPENSE'] } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Transactions' } },
      },
      post: {
        tags: ['Fees & Accounts'],
        summary: 'Record new financial transaction (Income or Expense)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'type', 'category', 'amount'],
                properties: {
                  title: { type: 'string', example: 'Campus Generator Diesel Supply' },
                  type: { type: 'string', enum: ['INCOME', 'EXPENSE'], example: 'EXPENSE' },
                  category: { type: 'string', example: 'Campus Utilities' },
                  amount: { type: 'number', example: 14500 },
                  referenceNo: { type: 'string', example: 'INV-4491' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Transaction recorded' } },
      },
    },

    // -------------------------------------------------------------
    // CMS & WEBSITE
    // -------------------------------------------------------------
    '/api/cms/notices': {
      get: {
        tags: ['CMS & Website'],
        summary: 'Get all public or student/teacher notices',
        parameters: [
          { name: 'priority', in: 'query', schema: { type: 'string', enum: ['NORMAL', 'HIGH', 'URGENT'] } },
        ],
        responses: { 200: { description: 'Notices list' } },
      },
      post: {
        tags: ['CMS & Website'],
        summary: 'Publish a new notice',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'content', 'category'],
                properties: {
                  title: { type: 'string', example: 'Annual Sports Day Postponed to Friday' },
                  content: { type: 'string', example: 'Due to rainy weather forecast, sports trials are shifted to Friday.' },
                  category: { type: 'string', example: 'Sports' },
                  priority: { type: 'string', enum: ['NORMAL', 'HIGH', 'URGENT'], example: 'HIGH' },
                  audience: { type: 'string', example: 'All' },
                  pinned: { type: 'boolean', example: true },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Notice published' } },
      },
    },
    '/api/cms/blogs': {
      get: {
        tags: ['CMS & Website'],
        summary: 'Get published academic articles & blog posts',
        responses: { 200: { description: 'Blog posts' } },
      },
      post: {
        tags: ['CMS & Website'],
        summary: 'Publish a blog post',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'content', 'category'],
                properties: {
                  title: { type: 'string', example: 'How to Master Matric Board Science Practicals' },
                  excerpt: { type: 'string', example: 'Key strategies and tips for top marks in Physics and Biology practicals.' },
                  content: { type: 'string', example: 'Detailed article content goes here...' },
                  category: { type: 'string', example: 'Academic Tips' },
                  tags: { type: 'array', items: { type: 'string' }, example: ['matric', 'physics', 'tips'] },
                  featuredImage: { type: 'string', example: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Blog post created' } },
      },
    },
    '/api/cms/gallery': {
      get: {
        tags: ['CMS & Website'],
        summary: 'Get photo gallery albums with photos',
        responses: { 200: { description: 'Albums' } },
      },
    },
    '/api/cms/events': {
      get: {
        tags: ['CMS & Website'],
        summary: 'Get school events calendar',
        responses: { 200: { description: 'Events' } },
      },
    },
    '/api/cms/contact': {
      post: {
        tags: ['CMS & Website'],
        summary: 'Submit public website contact / inquiry form',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fullName', 'email', 'message'],
                properties: {
                  fullName: { type: 'string', example: 'Imran Bashir' },
                  email: { type: 'string', example: 'imran@example.com' },
                  phone: { type: 'string', example: '+923005544332' },
                  subject: { type: 'string', example: 'Fee structure inquiry for 9th class' },
                  message: { type: 'string', example: 'Hello, please provide details regarding admissions.' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Inquiry received' } },
      },
    },
  },
};

export const setupSwagger = (app: Express): void => {
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'Read Academy API Docs',
      customCss: '.swagger-ui .topbar { background-color: #0f172a; } .swagger-ui .topbar .download-url-wrapper { display: none; }',
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'list',
        filter: true,
      },
    })
  );

  app.get('/api/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
