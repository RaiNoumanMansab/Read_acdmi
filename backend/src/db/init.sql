-- =============================================================================
-- READ ACADEMY SAHIWAL - COMPLETE POSTGRESQL DATABASE SCHEMA
-- Compatible with PostgreSQL 14+, Supabase, Neon.tech, Render
-- =============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------------
-- 1. ENUMS
-- -------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'teacher', 'parent', 'student');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'pending', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE gender_type AS ENUM ('Male', 'Female');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE fee_status_type AS ENUM ('Paid', 'Pending', 'Overdue');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE attendance_status_type AS ENUM ('Present', 'Absent', 'Late', 'Leave');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status_type AS ENUM ('Pending', 'Under Review', 'Approved', 'Rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE exam_status_type AS ENUM ('Upcoming', 'Ongoing', 'Completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_type AS ENUM ('Paid', 'Pending', 'Processing');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('Income', 'Expense');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -------------------------------------------------------------
-- 2. AUTHENTICATION & ADMIN ROLES
-- -------------------------------------------------------------

-- Central Users Table (Includes Admin, Super Admin, Teacher, Parent, Student)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(25) UNIQUE,
    role user_role NOT NULL DEFAULT 'student',
    avatar_url VARCHAR(255),
    status user_status DEFAULT 'active',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_users_role_email ON users(role, email);

-- Dedicated Admin Profile (For Super Admin, Principal, Accountant, Registrar)
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emp_id VARCHAR(30) NOT NULL UNIQUE,  -- e.g. "ADM-001"
    designation VARCHAR(80) NOT NULL,    -- e.g. "Campus Director", "Principal", "Accountant", "Registrar"
    department VARCHAR(60) NOT NULL DEFAULT 'Administration', -- e.g. "Executive Leadership", "Accounts", "IT"
    permissions TEXT[] DEFAULT ARRAY['ALL'], -- ["ALL"] or ["MANAGE_STUDENTS", "MANAGE_FEES", "MANAGE_PAYROLL"]
    is_super_admin BOOLEAN DEFAULT FALSE,
    emergency_contact VARCHAR(25),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Sessions for JWT / Remember-Me authentication
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------
-- 3. ACADEMIC STRUCTURE (Classes, Sections, Subjects)
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE, -- e.g. "Grade 9", "Grade 10 (Matric)"
    numeric_level INT NOT NULL,
    capacity INT DEFAULT 40,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    emp_id VARCHAR(30) NOT NULL UNIQUE, -- e.g. "T-101"
    full_name VARCHAR(120) NOT NULL,
    avatar_url VARCHAR(255),
    department VARCHAR(50) NOT NULL,
    specialization VARCHAR(80) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    experience_years INT DEFAULT 1,
    phone VARCHAR(25) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    joining_date DATE NOT NULL,
    basic_salary DECIMAL(10,2) NOT NULL,
    bank_account_no VARCHAR(50),
    status VARCHAR(15) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    name VARCHAR(30) NOT NULL,        -- e.g. "Section A - Jinnah"
    room_number VARCHAR(30),
    class_teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, name)
);

CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE,  -- e.g. "PHY-09"
    name VARCHAR(80) NOT NULL,         -- e.g. "Physics"
    department VARCHAR(50) NOT NULL,   -- e.g. "Science"
    weekly_periods INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    weekly_periods INT DEFAULT 5,
    UNIQUE(class_id, section_id, subject_id)
);

-- -------------------------------------------------------------
-- 4. STUDENTS
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    roll_no VARCHAR(40) NOT NULL UNIQUE, -- e.g. "RAS-2026-89"
    admission_no VARCHAR(40) UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    avatar_url VARCHAR(255),
    gender gender_type NOT NULL,
    dob DATE NOT NULL,
    blood_group VARCHAR(5),
    class_id UUID NOT NULL REFERENCES classes(id),
    section_id UUID NOT NULL REFERENCES sections(id),
    parent_name VARCHAR(120) NOT NULL,
    parent_phone VARCHAR(25) NOT NULL,
    parent_email VARCHAR(120),
    emergency_contact VARCHAR(25),
    home_address TEXT NOT NULL,
    admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
    previous_school VARCHAR(150),
    fee_status fee_status_type DEFAULT 'Pending',
    status VARCHAR(15) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_students_roll_class ON students(roll_no, class_id, section_id);

-- -------------------------------------------------------------
-- 5. ADMISSION APPLICATIONS
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admission_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_no VARCHAR(40) NOT NULL UNIQUE,
    student_name VARCHAR(120) NOT NULL,
    applied_class_id UUID NOT NULL REFERENCES classes(id),
    gender gender_type NOT NULL,
    dob DATE NOT NULL,
    parent_name VARCHAR(120) NOT NULL,
    parent_phone VARCHAR(25) NOT NULL,
    parent_email VARCHAR(120),
    home_address TEXT NOT NULL,
    previous_school VARCHAR(150),
    previous_percentage DECIMAL(5,2),
    status application_status_type DEFAULT 'Pending',
    documents_submitted JSONB,
    admin_notes TEXT,
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------
-- 6. TEACHER DUTIES & PAYROLL
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS teacher_duties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    duty_title VARCHAR(120) NOT NULL,
    description TEXT,
    assigned_date DATE NOT NULL,
    status VARCHAR(15) DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS payroll_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    month_year VARCHAR(20) NOT NULL, -- "September 2026"
    basic_salary DECIMAL(10,2) NOT NULL,
    allowances DECIMAL(10,2) DEFAULT 0.00,
    deductions DECIMAL(10,2) DEFAULT 0.00,
    tax DECIMAL(10,2) DEFAULT 0.00,
    net_salary DECIMAL(10,2) NOT NULL,
    payment_status payment_status_type DEFAULT 'Pending',
    payment_date DATE,
    transaction_ref VARCHAR(80),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(teacher_id, month_year)
);

-- -------------------------------------------------------------
-- 7. ATTENDANCE & TIMETABLES
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS student_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status attendance_status_type NOT NULL,
    remarks VARCHAR(150),
    sms_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, date)
);
CREATE INDEX IF NOT EXISTS idx_student_att_date ON student_attendance(date, status);

CREATE TABLE IF NOT EXISTS teacher_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    check_in TIME,
    check_out TIME,
    status attendance_status_type NOT NULL,
    UNIQUE(teacher_id, date)
);

CREATE TABLE IF NOT EXISTS timetables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    day_of_week VARCHAR(12) NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
    period_number INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject_id UUID NOT NULL REFERENCES subjects(id),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    room_number VARCHAR(30),
    UNIQUE(class_id, section_id, day_of_week, period_number)
);

-- -------------------------------------------------------------
-- 8. EXAMINATIONS & MARKS
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    term VARCHAR(50) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status exam_status_type DEFAULT 'Upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exam_datesheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id),
    subject_id UUID NOT NULL REFERENCES subjects(id),
    exam_date DATE NOT NULL,
    day_name VARCHAR(15) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(30),
    invigilator_id UUID REFERENCES teachers(id)
);

CREATE TABLE IF NOT EXISTS marks_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id),
    total_marks DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    obtained_marks DECIMAL(5,2) NOT NULL,
    grade VARCHAR(5) NOT NULL,
    remarks VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(exam_id, student_id, subject_id)
);

-- -------------------------------------------------------------
-- 9. HOMEWORK & SUBMISSIONS
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS homework_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    description TEXT,
    class_id UUID NOT NULL REFERENCES classes(id),
    section_id UUID REFERENCES sections(id),
    subject_id UUID NOT NULL REFERENCES subjects(id),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    assigned_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    attachment_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS homework_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    homework_id UUID NOT NULL REFERENCES homework_assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    submission_text TEXT,
    attachment_url VARCHAR(255),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Submitted',
    teacher_feedback TEXT,
    marks_obtained DECIMAL(5,2),
    UNIQUE(homework_id, student_id)
);

-- -------------------------------------------------------------
-- 10. FEES & ACCOUNTS TRANSACTIONS
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS fee_vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voucher_no VARCHAR(40) NOT NULL UNIQUE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    billing_month VARCHAR(20) NOT NULL,
    tuition_fee DECIMAL(10,2) NOT NULL,
    exam_fee DECIMAL(10,2) DEFAULT 0.00,
    lab_fee DECIMAL(10,2) DEFAULT 0.00,
    utility_charges DECIMAL(10,2) DEFAULT 0.00,
    late_fine DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    status fee_status_type DEFAULT 'Pending',
    payment_method VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_vouchers_status_month ON fee_vouchers(status, billing_month);

CREATE TABLE IF NOT EXISTS account_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    title VARCHAR(150) NOT NULL,
    type transaction_type NOT NULL,
    category VARCHAR(60) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    reference_no VARCHAR(80),
    recorded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_transactions_date_type ON account_transactions(transaction_date, type);

-- -------------------------------------------------------------
-- 11. NOTICES & CMS
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(30) NOT NULL,
    priority VARCHAR(10) DEFAULT 'Normal',
    audience VARCHAR(20) DEFAULT 'All',
    published_by UUID REFERENCES users(id),
    pinned BOOLEAN DEFAULT FALSE,
    published_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    tags TEXT[],
    author_id UUID REFERENCES users(id),
    featured_image VARCHAR(255),
    views_count INT DEFAULT 0,
    status VARCHAR(15) DEFAULT 'Published',
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery_albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    cover_url VARCHAR(255),
    event_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    caption VARCHAR(200),
    sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS school_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    category VARCHAR(40) NOT NULL,
    event_date DATE NOT NULL,
    event_time VARCHAR(40),
    location VARCHAR(120),
    description TEXT,
    banner_image VARCHAR(255),
    is_public BOOLEAN DEFAULT TRUE,
    status exam_status_type DEFAULT 'Upcoming'
);

CREATE TABLE IF NOT EXISTS contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL,
    phone VARCHAR(25),
    subject VARCHAR(150),
    message TEXT NOT NULL,
    status VARCHAR(15) DEFAULT 'New',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
