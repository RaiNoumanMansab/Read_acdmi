import { PrismaClient, UserRole, Gender } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Read Academy Sahiwal...');

  // 1. Create Default Super Admin
  const adminPasswordHash = await bcrypt.hash('admin1234', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@readacademy.edu.pk' },
    update: {},
    create: {
      email: 'admin@readacademy.edu.pk',
      passwordHash: adminPasswordHash,
      fullName: 'Dr. Muhammad Tariq Khan',
      phone: '+923007982018',
      role: UserRole.SUPER_ADMIN,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    },
  });

  await prisma.adminProfile.upsert({
    where: { empId: 'ADM-001' },
    update: {},
    create: {
      userId: adminUser.id,
      empId: 'ADM-001',
      designation: 'Campus Director & Principal',
      department: 'Executive Leadership',
      permissions: ['ALL'],
      isSuperAdmin: true,
      emergencyContact: '+923007982018',
    },
  });
  console.log('✅ Created Super Admin & Admin Profile:', adminUser.email);

  // 2. Create Classes (Full Academic Sequence)
  const defaultClasses = [
    { id: 'cls-pg', name: 'Playgroup', numericLevel: -2 },
    { id: 'cls-nursery', name: 'Nursery', numericLevel: -1 },
    { id: 'cls-prep', name: 'Prep / KG', numericLevel: 0 },
    { id: 'cls-01', name: 'Grade 1', numericLevel: 1 },
    { id: 'cls-02', name: 'Grade 2', numericLevel: 2 },
    { id: 'cls-03', name: 'Grade 3', numericLevel: 3 },
    { id: 'cls-04', name: 'Grade 4', numericLevel: 4 },
    { id: 'cls-05', name: 'Grade 5', numericLevel: 5 },
    { id: 'cls-06', name: 'Grade 6', numericLevel: 6 },
    { id: 'cls-07', name: 'Grade 7', numericLevel: 7 },
    { id: 'cls-08', name: 'Grade 8', numericLevel: 8 },
    { id: 'cls-09', name: 'Grade 9 (Matric)', numericLevel: 9 },
    { id: 'cls-10', name: 'Grade 10 (Matric)', numericLevel: 10 },
    { id: 'cls-fsc-med', name: 'FSC Pre-Medical', numericLevel: 11 },
    { id: 'cls-fsc-eng', name: 'FSC Pre-Engineering', numericLevel: 12 },
    { id: 'cls-ics', name: 'ICS', numericLevel: 13 },
    { id: 'cls-icom', name: 'I.Com', numericLevel: 14 },
    { id: 'cls-fa', name: 'FA', numericLevel: 15 },
    { id: 'cls-dcom', name: 'D.Com', numericLevel: 16 },
  ];

  for (const c of defaultClasses) {
    await prisma.class.upsert({
      where: { name: c.name },
      update: { numericLevel: c.numericLevel },
      create: { id: c.id, name: c.name, numericLevel: c.numericLevel, capacity: 45 },
    });
  }

  const grade9 = await prisma.class.findFirst({ where: { name: 'Grade 9 (Matric)' } });

  // 3. Create Sections
  const sec9A = await prisma.section.upsert({
    where: { classId_name: { classId: grade9.id, name: 'Section A - Jinnah' } },
    update: {},
    create: { classId: grade9.id, name: 'Section A - Jinnah', roomNumber: 'Room 201' },
  });

  // 4. Create Subjects
  const physics = await prisma.subject.upsert({
    where: { code: 'PHY-09' },
    update: {},
    create: { code: 'PHY-09', name: 'Physics', department: 'Science', weeklyPeriods: 6 },
  });

  const math = await prisma.subject.upsert({
    where: { code: 'MTH-09' },
    update: {},
    create: { code: 'MTH-09', name: 'Mathematics', department: 'Science', weeklyPeriods: 6 },
  });

  // 5. Create Teacher
  const teacherPasswordHash = await bcrypt.hash('teacher1234', 10);
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@readacademy.edu.pk' },
    update: {},
    create: {
      email: 'teacher@readacademy.edu.pk',
      passwordHash: teacherPasswordHash,
      fullName: 'Sir Qasim Raza',
      phone: '+923014455667',
      role: UserRole.TEACHER,
    },
  });

  const teacher = await prisma.teacher.upsert({
    where: { empId: 'T-101' },
    update: {},
    create: {
      userId: teacherUser.id,
      empId: 'T-101',
      fullName: 'Sir Qasim Raza',
      department: 'Science',
      specialization: 'Physics & Applied Mathematics',
      qualification: 'M.Phil Physics (PU Lahore)',
      experienceYears: 8,
      phone: '+923014455667',
      email: 'teacher@readacademy.edu.pk',
      joiningDate: new Date('2020-08-15'),
      basicSalary: 85000.0,
      bankAccountNo: 'PK78BAHL100293849102',
    },
  });
  console.log('✅ Created Faculty Member:', teacher.fullName);

  // 6. Create Student
  const studentPasswordHash = await bcrypt.hash('student1234', 10);
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@readacademy.edu.pk' },
    update: {},
    create: {
      email: 'student@readacademy.edu.pk',
      passwordHash: studentPasswordHash,
      fullName: 'Hamza Tariq',
      phone: '+923059988771',
      role: UserRole.STUDENT,
    },
  });

  const student = await prisma.student.upsert({
    where: { rollNo: 'RAS-2026-89' },
    update: {},
    create: {
      userId: studentUser.id,
      rollNo: 'RAS-2026-89',
      admissionNo: 'ADM-2026-042',
      fullName: 'Hamza Tariq',
      gender: Gender.MALE,
      dob: new Date('2010-04-12'),
      bloodGroup: 'B+',
      classId: grade9.id,
      sectionId: sec9A.id,
      parentName: 'Tariq Mahmood',
      parentPhone: '+923001234567',
      parentEmail: 'tariq.mahmood@example.com',
      homeAddress: 'House 14, Street 3, Farid Town, Sahiwal',
      feeStatus: 'PAID',
    },
  });
  console.log('✅ Created Student Record:', student.fullName, student.rollNo);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
