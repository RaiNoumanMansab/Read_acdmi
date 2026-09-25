-- ==============================================================================
-- SEED DATA FOR READ ACADEMY SAHIWAL (PostgreSQL)
-- Matches frontend mockData.ts & admin initial accounts
-- ==============================================================================

-- 1. Default Super Admin User (Password: admin1234)
INSERT INTO users (id, email, password_hash, full_name, phone, role, status)
VALUES (
    'usr-admin-01',
    'admin@readacademy.edu.pk',
    '$2a$10$w8T0M4j2N7GkWsE1hNqS8e4D4t9M.Zq3gJpQ2H3x1Z1sL5sK8L2Gy',
    'Dr. Muhammad Tariq Khan',
    '+923007982018',
    'SUPER_ADMIN',
    'ACTIVE'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO admin_profiles (id, user_id, emp_id, designation, department, permissions, is_super_admin, emergency_contact)
VALUES (
    'adm-prof-01',
    'usr-admin-01',
    'ADM-001',
    'Campus Director & Principal',
    'Executive Leadership',
    ARRAY['ALL'],
    TRUE,
    '+923007982018'
) ON CONFLICT (emp_id) DO NOTHING;

-- 2. Classes
INSERT INTO classes (id, name, numeric_level, capacity) VALUES
('cls-09', 'Grade 9', 9, 45),
('cls-10', 'Grade 10 (Matric)', 10, 45),
('cls-11', 'FSc Pre-Medical (Part 1)', 11, 40),
('cls-12', 'ICS (Part 1)', 11, 40)
ON CONFLICT (name) DO NOTHING;

-- 3. Sections
INSERT INTO sections (id, class_id, name, room_number) VALUES
('sec-09a', 'cls-09', 'Section A - Jinnah', 'Room 201'),
('sec-09b', 'cls-09', 'Section B - Iqbal', 'Room 202'),
('sec-10a', 'cls-10', 'Section A - Sir Syed', 'Room 301')
ON CONFLICT (class_id, name) DO NOTHING;

-- 4. Subjects
INSERT INTO subjects (id, code, name, department, weekly_periods) VALUES
('sub-phy-09', 'PHY-09', 'Physics', 'Science', 6),
('sub-mth-09', 'MTH-09', 'Mathematics', 'Science', 6),
('sub-chm-09', 'CHM-09', 'Chemistry', 'Science', 5),
('sub-eng-09', 'ENG-09', 'English Compulsory', 'Humanities', 5),
('sub-bio-09', 'BIO-09', 'Biology', 'Science', 5),
('sub-cs-09', 'CS-09', 'Computer Science', 'IT & CS', 5)
ON CONFLICT (code) DO NOTHING;

-- 5. Teachers
INSERT INTO users (id, email, password_hash, full_name, phone, role, status)
VALUES (
    'usr-tch-01',
    'qasim.raza@readacademy.edu.pk',
    '$2a$10$w8T0M4j2N7GkWsE1hNqS8e4D4t9M.Zq3gJpQ2H3x1Z1sL5sK8L2Gy',
    'Sir Qasim Raza',
    '+923014455667',
    'TEACHER',
    'ACTIVE'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO teachers (id, user_id, emp_id, full_name, department, specialization, qualification, experience_years, phone, email, basic_salary)
VALUES (
    'tch-01',
    'usr-tch-01',
    'T-101',
    'Sir Qasim Raza',
    'Science',
    'Physics & Applied Mathematics',
    'M.Phil Physics (PU Lahore)',
    8,
    '+923014455667',
    'qasim.raza@readacademy.edu.pk',
    85000.00
) ON CONFLICT (emp_id) DO NOTHING;

-- Assign Class Teacher
UPDATE sections SET class_teacher_id = 'tch-01' WHERE id = 'sec-09a';

-- 6. Class Subject Mapping
INSERT INTO class_subjects (id, class_id, section_id, subject_id, teacher_id, weekly_periods)
VALUES ('cs-01', 'cls-09', 'sec-09a', 'sub-phy-09', 'tch-01', 6)
ON CONFLICT (class_id, section_id, subject_id) DO NOTHING;

-- 7. Teacher Duty
INSERT INTO teacher_duties (id, teacher_id, duty_title, description, status)
VALUES ('dty-01', 'tch-01', 'Morning Assembly & Lab In-charge', 'Supervising the main science lab and sound setup during assembly.', 'Active')
ON CONFLICT DO NOTHING;

-- 8. Students
INSERT INTO users (id, email, password_hash, full_name, phone, role, status)
VALUES (
    'usr-std-01',
    'hamza.tariq@readacademy.edu.pk',
    '$2a$10$w8T0M4j2N7GkWsE1hNqS8e4D4t9M.Zq3gJpQ2H3x1Z1sL5sK8L2Gy',
    'Hamza Tariq',
    '+923059988771',
    'STUDENT',
    'ACTIVE'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO students (
    id, user_id, roll_no, admission_no, full_name, gender, dob, blood_group,
    class_id, section_id, parent_name, parent_phone, parent_email,
    emergency_contact, home_address, fee_status, status
) VALUES (
    'std-01',
    'usr-std-01',
    'RAS-2026-89',
    'ADM-2026-042',
    'Hamza Tariq',
    'MALE',
    '2010-04-12',
    'B+',
    'cls-09',
    'sec-09a',
    'Tariq Mahmood',
    '+923001234567',
    'tariq.mahmood@example.com',
    '+923007982018',
    'House 14, Street 3, Farid Town, Sahiwal',
    'PAID',
    'Active'
) ON CONFLICT (roll_no) DO NOTHING;

-- 9. Exam & Datesheet & Marks
INSERT INTO exams (id, title, term, academic_year, start_date, end_date, status)
VALUES ('ex-mid-2026', 'First Term Mid-Examinations 2026', 'Mid-Term', '2026-2027', '2026-10-15', '2026-10-25', 'UPCOMING')
ON CONFLICT DO NOTHING;

INSERT INTO exam_datesheets (id, exam_id, class_id, subject_id, exam_date, day_name, start_time, end_time, room_number, invigilator_id)
VALUES ('ds-01', 'ex-mid-2026', 'cls-09', 'sub-phy-09', '2026-10-15', 'Thursday', '09:00 AM', '12:00 PM', 'Hall A - Room 201', 'tch-01')
ON CONFLICT DO NOTHING;

INSERT INTO marks_entries (id, exam_id, student_id, subject_id, total_marks, obtained_marks, grade, remarks)
VALUES ('mk-01', 'ex-mid-2026', 'std-01', 'sub-phy-09', 100.00, 92.50, 'A+', 'Outstanding conceptual clarity')
ON CONFLICT (exam_id, student_id, subject_id) DO NOTHING;

-- 10. Fee Voucher
INSERT INTO fee_vouchers (id, voucher_no, student_id, billing_month, tuition_fee, exam_fee, utility_charges, total_amount, due_date, status)
VALUES ('vch-2026-09-01', 'VCH-2026-09-001', 'std-01', 'September 2026', 8500.00, 500.00, 500.00, 9500.00, '2026-09-20', 'PAID')
ON CONFLICT (voucher_no) DO NOTHING;

-- 11. Gallery Album & Images
INSERT INTO gallery_albums (id, title, category, cover_url, event_date)
VALUES ('alb-01', 'Annual Sports Gala 2026', 'Sports', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800', '2026-02-15')
ON CONFLICT DO NOTHING;

INSERT INTO gallery_images (id, album_id, image_url, caption, sort_order) VALUES
('img-01', 'alb-01', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800', 'Opening ceremony track events', 1),
('img-02', 'alb-01', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800', 'Inter-house cricket championship trophy', 2)
ON CONFLICT DO NOTHING;

-- 12. Notice Board
INSERT INTO notices (id, title, content, category, priority, audience, pinned, published_date)
VALUES (
    'ntc-01',
    'Mid-Term Examination Schedule Announced',
    'All students of Grade 9 and Matric are notified that Mid-Term Examinations will commence from 15th October 2026. Date sheets are available on student portal.',
    'Academic',
    'HIGH',
    'All',
    TRUE,
    CURRENT_DATE
) ON CONFLICT DO NOTHING;
