-- ==============================================================================
-- DATABASE SCHEMA FOR READ ACADEMY SAHIWAL
-- Target Database: Read_Acdmi (PostgreSQL 18)
-- Generated to match ER Diagram & Frontend System Models exactly
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------------
-- 1. ENUMS
-- -------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'TEACHER', 'PARENT', 'STUDENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PENDING', 'SUSPENDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "FeeStatus" AS ENUM ('PAID', 'PENDING', 'OVERDUE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'LEAVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ExamStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'PENDING', 'PROCESSING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "NoticePriority" AS ENUM ('NORMAL', 'HIGH', 'URGENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -------------------------------------------------------------
-- 2. USERS & PROFILES
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) UNIQUE,
    role "UserRole" NOT NULL DEFAULT 'STUDENT',
    avatar_url TEXT,
    status "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_profiles (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(36) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    emp_id VARCHAR(50) NOT NULL UNIQUE,
    designation VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL DEFAULT 'Administration',
    permissions TEXT[] NOT NULL DEFAULT ARRAY['ALL'],
    is_super_admin BOOLEAN NOT NULL DEFAULT FALSE,
    emergency_contact VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------
-- 3. ACADEMIC STRUCTURE (Classes, Sections, Subjects)
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS classes (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(100) NOT NULL UNIQUE,
    numeric_level INT NOT NULL,
    capacity INT NOT NULL DEFAULT 40,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teachers (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(36) UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    emp_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    department VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    experience_years INT NOT NULL DEFAULT 1,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    joining_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    basic_salary NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    bank_account_no VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sections (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    class_id VARCHAR(36) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    room_number VARCHAR(50),
    class_teacher_id VARCHAR(36) REFERENCES teachers(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_section_class_name UNIQUE (class_id, name)
);

CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    weekly_periods INT NOT NULL DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_subjects (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    class_id VARCHAR(36) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    section_id VARCHAR(36) NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    subject_id VARCHAR(36) NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id VARCHAR(36) NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    weekly_periods INT NOT NULL DEFAULT 5,
    CONSTRAINT uq_class_section_subject UNIQUE (class_id, section_id, subject_id)
);

-- -------------------------------------------------------------
-- 4. STUDENTS & ADMISSIONS
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(36) UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    roll_no VARCHAR(50) NOT NULL UNIQUE,
    admission_no VARCHAR(50) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    gender "Gender" NOT NULL,
    dob DATE NOT NULL,
    blood_group VARCHAR(10),
    class_id VARCHAR(36) NOT NULL REFERENCES classes(id) ON DELETE RESTRICT,
    section_id VARCHAR(36) NOT NULL REFERENCES sections(id) ON DELETE RESTRICT,
    parent_name VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(50) NOT NULL,
    parent_email VARCHAR(255),
    emergency_contact VARCHAR(50),
    home_address TEXT NOT NULL,
    admission_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    previous_school VARCHAR(255),
    fee_status "FeeStatus" NOT NULL DEFAULT 'PENDING',
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_students_roll_class_sec ON students(roll_no, class_id, section_id);

CREATE TABLE IF NOT EXISTS admission_applications (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    application_no VARCHAR(50) NOT NULL UNIQUE,
    student_name VARCHAR(255) NOT NULL,
    applied_class_id VARCHAR(36) NOT NULL REFERENCES classes(id) ON DELETE RESTRICT,
    gender "Gender" NOT NULL,
    dob DATE NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(50) NOT NULL,
    parent_email VARCHAR(255),
    home_address TEXT NOT NULL,
    previous_school VARCHAR(255),
    previous_percentage NUMERIC(5, 2),
    status "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    documents_submitted JSONB,
    admin_notes TEXT,
    application_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------
-- 5. FACULTY DUTIES, ATTENDANCE & PAYROLL
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS teacher_duties (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    teacher_id VARCHAR(36) NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    duty_title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS payroll_records (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    teacher_id VARCHAR(36) NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    month_year VARCHAR(50) NOT NULL,
    basic_salary NUMERIC(10, 2) NOT NULL,
    allowances NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    deductions NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    net_salary NUMERIC(10, 2) NOT NULL,
    payment_status "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    payment_date TIMESTAMP WITH TIME ZONE,
    transaction_ref VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_teacher_month_payroll UNIQUE (teacher_id, month_year)
);

CREATE TABLE IF NOT EXISTS teacher_attendance (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    teacher_id VARCHAR(36) NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    check_in VARCHAR(20),
    check_out VARCHAR(20),
    status "AttendanceStatus" NOT NULL,
    CONSTRAINT uq_teacher_attendance_date UNIQUE (teacher_id, date)
);

CREATE TABLE IF NOT EXISTS timetable_slots (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    class_id VARCHAR(36) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    section_id VARCHAR(36) NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    day_of_week VARCHAR(20) NOT NULL,
    period_number INT NOT NULL,
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    subject_id VARCHAR(36) NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
    teacher_id VARCHAR(36) NOT NULL REFERENCES teachers(id) ON DELETE RESTRICT,
    room_number VARCHAR(50) NOT NULL,
    CONSTRAINT uq_class_sec_day_period UNIQUE (class_id, section_id, day_of_week, period_number)
);

-- -------------------------------------------------------------
-- 6. ATTENDANCE (STUDENTS)
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS student_attendance (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    student_id VARCHAR(36) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status "AttendanceStatus" NOT NULL,
    remarks TEXT,
    sms_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_attendance_date UNIQUE (student_id, date)
);

CREATE INDEX IF NOT EXISTS idx_student_att_date_status ON student_attendance(date, status);

-- -------------------------------------------------------------
-- 7. EXAMINATIONS & DATESHEETS & MARKS
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS exams (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(255) NOT NULL,
    term VARCHAR(100) NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status "ExamStatus" NOT NULL DEFAULT 'UPCOMING',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exam_datesheets (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    exam_id VARCHAR(36) NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    class_id VARCHAR(36) NOT NULL REFERENCES classes(id) ON DELETE RESTRICT,
    subject_id VARCHAR(36) NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
    exam_date DATE NOT NULL,
    day_name VARCHAR(20) NOT NULL,
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    invigilator_id VARCHAR(36) REFERENCES teachers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS marks_entries (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    exam_id VARCHAR(36) NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_id VARCHAR(36) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id VARCHAR(36) NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
    total_marks NUMERIC(5, 2) NOT NULL DEFAULT 100.00,
    obtained_marks NUMERIC(5, 2) NOT NULL,
    grade VARCHAR(10) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_exam_student_subject UNIQUE (exam_id, student_id, subject_id)
);

-- -------------------------------------------------------------
-- 8. HOMEWORK & SUBMISSIONS
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS homework_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    class_id VARCHAR(36) NOT NULL REFERENCES classes(id) ON DELETE RESTRICT,
    section_id VARCHAR(36) REFERENCES sections(id) ON DELETE RESTRICT,
    subject_id VARCHAR(36) NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
    teacher_id VARCHAR(36) NOT NULL REFERENCES teachers(id) ON DELETE RESTRICT,
    assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    attachment_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS homework_submissions (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    homework_id VARCHAR(36) NOT NULL REFERENCES homework_items(id) ON DELETE CASCADE,
    student_id VARCHAR(36) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    submission_text TEXT,
    attachment_url TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'Submitted',
    teacher_feedback TEXT,
    marks_obtained NUMERIC(5, 2),
    CONSTRAINT uq_homework_student_sub UNIQUE (homework_id, student_id)
);

-- -------------------------------------------------------------
-- 9. FEES & FINANCIAL TRANSACTIONS
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS fee_vouchers (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    voucher_no VARCHAR(50) NOT NULL UNIQUE,
    student_id VARCHAR(36) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    billing_month VARCHAR(50) NOT NULL,
    tuition_fee NUMERIC(10, 2) NOT NULL,
    exam_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    lab_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    utility_charges NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    late_fine NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    status "FeeStatus" NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_fee_vouchers_status_month ON fee_vouchers(status, billing_month);

CREATE TABLE IF NOT EXISTS account_transactions (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    title VARCHAR(255) NOT NULL,
    type "TransactionType" NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    reference_no VARCHAR(100),
    recorded_by_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_acct_tx_date_type ON account_transactions(transaction_date, type);

-- -------------------------------------------------------------
-- 10. NOTICES, CMS, GALLERY & EVENTS
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS notices (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority "NoticePriority" NOT NULL DEFAULT 'NORMAL',
    audience VARCHAR(50) NOT NULL DEFAULT 'All',
    published_by_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    pinned BOOLEAN NOT NULL DEFAULT FALSE,
    published_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    author_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    featured_image TEXT,
    views_count INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'Published',
    published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery_albums (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    cover_url TEXT,
    event_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery_images (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    album_id VARCHAR(36) NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS school_events (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    event_time VARCHAR(50),
    location VARCHAR(255),
    description TEXT,
    banner_image TEXT,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    status "ExamStatus" NOT NULL DEFAULT 'UPCOMING'
);

CREATE TABLE IF NOT EXISTS contact_inquiries (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
