import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

async function seed() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  console.log('Connected to Neon database for seeding...');

  try {
    // 1. Create Super Admin
    const adminPass = await bcrypt.hash('admin1234', 10);
    const adminRes = await client.query(`
      INSERT INTO users (id, email, password_hash, full_name, phone, role, status, created_at, updated_at)
      VALUES (gen_random_uuid(), 'admin@readacademy.edu.pk', $1, 'Dr. Muhammad Tariq Khan', '+923007982018', 'SUPER_ADMIN', 'ACTIVE', NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'SUPER_ADMIN'
      RETURNING id, email
    `, [adminPass]);

    const adminId = adminRes.rows[0].id;
    await client.query(`
      INSERT INTO admin_profiles (id, user_id, emp_id, designation, department, permissions, is_super_admin, emergency_contact, created_at)
      VALUES (gen_random_uuid(), $1, 'ADM-001', 'Campus Director & Principal', 'Executive Leadership', ARRAY['ALL'], true, '+923007982018', NOW())
      ON CONFLICT (emp_id) DO NOTHING
    `, [adminId]);
    console.log('✅ Super Admin created: admin@readacademy.edu.pk / admin1234');

    // 2. Create Teacher
    const teacherPass = await bcrypt.hash('teacher1234', 10);
    const teacherRes = await client.query(`
      INSERT INTO users (id, email, password_hash, full_name, phone, role, status, created_at, updated_at)
      VALUES (gen_random_uuid(), 'teacher@readacademy.edu.pk', $1, 'Sir Qasim Raza', '+923014455667', 'TEACHER', 'ACTIVE', NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'TEACHER'
      RETURNING id, email
    `, [teacherPass]);

    const teacherUserId = teacherRes.rows[0].id;
    await client.query(`
      INSERT INTO teachers (id, user_id, emp_id, full_name, department, specialization, qualification, experience_years, phone, email, joining_date, basic_salary, status, created_at)
      VALUES (gen_random_uuid(), $1, 'T-101', 'Sir Qasim Raza', 'Science', 'Physics & Applied Mathematics', 'M.Phil Physics (PU Lahore)', 8, '+923014455667', 'teacher@readacademy.edu.pk', '2020-08-15', 85000, 'Active', NOW())
      ON CONFLICT (emp_id) DO NOTHING
    `, [teacherUserId]);
    console.log('✅ Faculty Account created: teacher@readacademy.edu.pk / teacher1234');

    // 3. Create Student
    const studentPass = await bcrypt.hash('student1234', 10);
    const studentRes = await client.query(`
      INSERT INTO users (id, email, password_hash, full_name, phone, role, status, created_at, updated_at)
      VALUES (gen_random_uuid(), 'student@readacademy.edu.pk', $1, 'Hamza Tariq', '+923059988771', 'STUDENT', 'ACTIVE', NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'STUDENT'
      RETURNING id, email
    `, [studentPass]);

    const studentUserId = studentRes.rows[0].id;
    // Create Grade 9 class if not exists
    const classRes = await client.query(`
      INSERT INTO classes (id, name, numeric_level, capacity, created_at)
      VALUES ('cls-09', 'Grade 9 (Matric)', 9, 45, NOW())
      ON CONFLICT (name) DO UPDATE SET numeric_level = 9
      RETURNING id
    `);
    const classId = classRes.rows[0].id;

    const secRes = await client.query(`
      INSERT INTO sections (id, class_id, name, room_number, created_at)
      VALUES (gen_random_uuid(), $1, 'Section A - Jinnah', 'Room 201', NOW())
      ON CONFLICT (class_id, name) DO NOTHING
      RETURNING id
    `, [classId]);
    const sectionId = secRes.rows[0]?.id || (await client.query(`SELECT id FROM sections WHERE class_id = $1 LIMIT 1`, [classId])).rows[0].id;

    await client.query(`
      INSERT INTO students (id, user_id, roll_no, admission_no, full_name, gender, dob, blood_group, class_id, section_id, parent_name, parent_phone, parent_email, home_address, fee_status, status, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, 'RAS-2026-89', 'ADM-2026-042', 'Hamza Tariq', 'MALE', '2010-04-12', 'B+', $2, $3, 'Tariq Mahmood', '+923001234567', 'tariq.mahmood@example.com', 'Farid Town, Sahiwal', 'PAID', 'Active', NOW(), NOW())
      ON CONFLICT (roll_no) DO NOTHING
    `, [studentUserId, classId, sectionId]);
    console.log('✅ Student Account created: student@readacademy.edu.pk / student1234');

    // 4. Default System Settings
    const defaultSettings: [string, string, string][] = [
      ['name', 'Read Academy Sahiwal', 'general'],
      ['shortName', 'Read Academy', 'general'],
      ['tagline', 'Read To Lead', 'general'],
      ['motto', 'Read To Lead', 'general'],
      ['address', 'Main Campus, Sahiwal, Punjab, Pakistan', 'general'],
      ['phone', '+92 (40) 446-2810 / 0321-6909047', 'general'],
      ['whatsapp', '0321-6909047', 'general'],
      ['email', 'info@readacademy.edu.pk', 'general'],
      ['principal', 'Chaudhry Muhammad Aslam, M.Sc., M.Ed.', 'general'],
      ['activeSession', '2026-2027', 'academic'],
      ['termSystem', '3-Term Trimester', 'academic']
    ];

    for (const [k, v, g] of defaultSettings) {
      await client.query(`
        INSERT INTO system_settings (id, key, value, "group", created_at, updated_at)
        VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
      `, [k, v, g]);
    }
    console.log('✅ Default System Settings populated in Neon');

    // 5. Default Testimonial
    await client.query(`
      INSERT INTO testimonials (id, name, role, content, avatar, rating, is_active, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        'Dr. Kamran Qureshi',
        'Parent of Grade 10 Matriculation Scholar',
        'Enrolling our children at Read Academy Sahiwal has been our best parenting decision. The faculty combines rigorous academic standards with individualized mentorship that unlocked our son’s passion for science and research.',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        5,
        true,
        NOW(),
        NOW()
      )
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Default Testimonial created in Neon');

    console.log('\n🎉 ALL NEON DATABASE RECORDS SEEDED SUCCESSFULLY!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await client.end();
  }
}

seed();
