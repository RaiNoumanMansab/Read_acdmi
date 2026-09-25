import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './db/prisma.js';
import { setupSwagger } from './config/swagger.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import admissionRoutes from './routes/admissionRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import academicsRoutes from './routes/academicsRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import examRoutes from './routes/examRoutes.js';
import homeworkRoutes from './routes/homeworkRoutes.js';
import feeRoutes from './routes/feeRoutes.js';
import cmsRoutes from './routes/cmsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedStaticOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'https://read-acdmi.vercel.app'
];

const envOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((s) => s.replace(/["']/g, '').trim())
  .filter(Boolean);

const allAllowed = [...allowedStaticOrigins, ...envOrigins];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allAllowed.includes(origin) || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);
app.options('*', cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Setup Swagger UI Documentation
setupSwagger(app);

// Basic API Health Check
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    // Check DB connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'success',
      message: 'Read Academy Sahiwal Backend API is running smoothly',
      database: 'PostgreSQL Read_Acdmi connected',
      docsUrl: `http://localhost:${PORT}/api/docs`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/academics', academicsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/homework', homeworkRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs', careerRoutes);
app.use('/api/settings', settingsRoutes);

// Root redirect to docs
app.get('/', (_req: Request, res: Response) => {
  res.redirect('/api/docs');
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📖 Swagger API Docs: http://0.0.0.0:${PORT}/api/docs`);
  console.log(`📚 Read Academy Sahiwal [Node.js + PostgreSQL + Prisma]`);
  console.log(`====================================================`);
});
