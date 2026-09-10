export type AppMode = 'public' | 'admin';

export type PublicPage =
  | 'home'
  | 'about'
  | 'academics'
  | 'admissions'
  | 'teachers'
  | 'gallery'
  | 'events'
  | 'blog'
  | 'blog-detail'
  | 'contact';

export type AdminTab =
  | 'dashboard'
  | 'students'
  | 'admissions'
  | 'attendance'
  | 'fees'
  | 'teachers'
  | 'teacher-duties'
  | 'timetable'
  | 'classes-subjects'
  | 'exams-results'
  | 'student-progress'
  | 'homework'
  | 'notices'
  | 'blogs'
  | 'gallery'
  | 'events'
  | 'payroll'
  | 'accounts'
  | 'reports'
  | 'settings';

export interface Student {
  id: string;
  name: string;
  avatar: string;
  rollNo: string;
  class: string;
  section: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  attendancePct: number;
  feeStatus: 'Paid' | 'Pending' | 'Overdue';
  status: 'Active' | 'Inactive';
  dob: string;
  gender: 'Male' | 'Female';
  bloodGroup: string;
  address: string;
  admissionDate: string;
  emergencyContact: string;
  previousSchool?: string;
  recentMarks: { subject: string; marks: number; total: number; grade: string }[];
  attendanceHistory: { month: string; present: number; absent: number; late: number }[];
  feeRecords: { voucherNo: string; month: string; amount: number; status: string; date: string }[];
}

export interface AdmissionApplication {
  id: string;
  studentName: string;
  appliedClass: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  applicationDate: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Under Review';
  gender: string;
  dob: string;
  previousSchool: string;
  previousPercentage: string;
  address: string;
  documentsSubmitted: string[];
  notes?: string;
}

export interface Teacher {
  id: string;
  name: string;
  avatar: string;
  empId: string;
  subject: string;
  department: string;
  classes: string[];
  phone: string;
  email: string;
  joiningDate: string;
  status: 'Active' | 'On Leave';
  qualification: string;
  experienceYears: number;
  attendancePct: number;
  salary: number;
  assignedDuties: string[];
}

export interface TeacherDuty {
  id: string;
  teacherName: string;
  teacherAvatar: string;
  subject: string;
  class: string;
  section: string;
  periodsPerWeek: number;
  duties: string[];
  workloadStatus: 'Normal' | 'High' | 'Overloaded';
}

export interface TimetableSlot {
  period: number;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

export type TimetableSchedule = {
  [day in 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday']: TimetableSlot[];
};

export interface FeeVoucher {
  voucherNo: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  month: string;
  tuitionFee: number;
  examFee: number;
  labFee: number;
  utilityCharges: number;
  fine: number;
  totalAmount: number;
  dueDate: string;
  paidDate?: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  paymentMethod?: 'Cash' | 'Bank Transfer' | 'Online Gateway' | 'Cheque';
}

export interface Exam {
  id: string;
  name: string;
  term: string;
  academicYear?: string;
  startDate: string;
  endDate: string;
  classes: string[];
  classesIncluded?: string[];
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  totalStudents: number;
}

export interface MarksEntry {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  subject: string;
  totalMarks: number;
  obtainedMarks: number;
  grade: string;
  remarks: string;
}

export interface HomeworkItem {
  id: string;
  title: string;
  subject: string;
  class: string;
  section?: string;
  teacherName: string;
  assignedDate: string;
  dueDate: string;
  submissionCount?: number;
  totalSubmissions?: number;
  totalStudents: number;
  status: 'Active' | 'Completed' | 'Pending Review';
  description?: string;
  instructions?: string;
  attachmentName?: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'Academic' | 'Urgent' | 'Holiday' | 'Event' | 'Administrative' | string;
  date: string;
  author: string;
  audience: 'All' | 'Parents' | 'Teachers' | 'Students' | string;
  targetAudience?: string;
  status?: 'Published' | 'Draft';
  content: string;
  priority: 'High' | 'Normal' | 'Urgent';
  pinned?: boolean;
  publishedBy?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  authorRole: string;
  authorAvatar: string;
  publishedDate: string;
  date?: string;
  readTime: string;
  featuredImage: string;
  coverImage?: string;
  status: 'Published' | 'Draft';
  views: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  category: string;
  date: string;
  coverImage?: string;
  imageUrl?: string;
  photosCount: number;
  images: { url: string; caption: string }[];
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'Sports' | 'Academic' | 'Cultural' | 'Ceremony' | 'Workshops';
  description: string;
  image: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  registeredCount: number;
  organizer: string;
  targetAudience?: string;
  isPublic?: boolean;
}

export interface PayrollRecord {
  id: string;
  empId: string;
  employeeName: string;
  teacherName?: string;
  role: string;
  designation?: string;
  avatar: string;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  tax: number;
  netSalary: number;
  netPay?: number;
  paymentDate?: string;
  status: 'Paid' | 'Pending' | 'Processing';
  accountNo: string;
}

export interface ClassEntity {
  id: string;
  name: string;
  section?: string;
  sections?: string[];
  studentsCount?: number;
  totalStudents?: number;
  capacity?: number;
  classTeacher: string;
  room?: string;
  roomNumber?: string;
}

export interface SubjectEntity {
  id?: string;
  code: string;
  name: string;
  dept?: string;
  department?: string;
  classes?: string;
  teachers?: string;
  leadTeacher?: string;
  weeklyPeriods?: number;
  totalPeriodsWeekly?: number;
}

export interface DateSheetItem {
  id: string;
  examId: string;
  date: string;
  day: string;
  time: string;
  class: string;
  subject: string;
  room: string;
  invigilator?: string;
}

export type GalleryItem = GalleryAlbum;
export type Homework = HomeworkItem;

export interface FinancialCategory {
  category: string;
  name?: string;
  amount: number;
  percentage: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  totalExpense?: number;
  netProfit: number;
  netLoss: number;
  thisMonthIncome: number;
  thisMonthExpenses: number;
  incomeCategories: FinancialCategory[];
  expenseCategories: FinancialCategory[];
}

export interface AccountTransaction {
  id: string;
  date: string;
  title: string;
  category: string;
  type: 'Income' | 'Expense';
  amount: number;
  reference: string;
}
