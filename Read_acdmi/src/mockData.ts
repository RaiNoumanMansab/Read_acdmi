import type {
  Student,
  AdmissionApplication,
  Teacher,
  TeacherDuty,
  TimetableSchedule,
  FeeVoucher,
  Exam,
  MarksEntry,
  HomeworkItem,
  Notice,
  BlogPost,
  GalleryAlbum,
  SchoolEvent,
  PayrollRecord,
  FinancialSummary,
  DateSheetItem
} from './types';

export const SCHOOL_INFO = {
  name: 'Read Academy Sahiwal',
  shortName: 'Read Academy',
  acronym: 'RA',
  tagline: 'Read To Lead',
  motto: 'Read To Lead',
  code: 'RAS-SWL-2018',
  established: '2018',
  affiliation: 'BISE Sahiwal & Federal Board Curriculum',
  address: 'Main Campus, Sahiwal, Punjab, Pakistan',
  phone: '+92 (40) 446-2810 / +92 300 7982018',
  email: 'info@readacademy.edu.pk',
  admissionsEmail: 'admissions@readacademy.edu.pk',
  hours: 'Mon - Fri: 07:30 AM - 02:30 PM | Sat: 08:00 AM - 12:30 PM',
  principal: 'Chaudhry Muhammad Aslam, M.Sc., M.Ed.',
  vicePrincipal: 'Mrs. Tahira Naeem, M.A. English',
  studentCount: 1248,
  teacherCount: 86,
  campusArea: '6 Acres',
  studentTeacherRatio: '15:1',
  logo: '/logo.png'
};

export const MOCK_STUDENTS: Student[] = [
  {
    id: 'STU-2026-001',
    name: 'Hamza Farooq',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    rollNo: '10-A-01',
    class: 'Grade 10',
    section: 'A',
    parentName: 'Farooq Azam Sheikh',
    parentPhone: '+92 300 5519283',
    parentEmail: 'farooq.azam@gmail.com',
    attendancePct: 96.5,
    feeStatus: 'Paid',
    status: 'Active',
    dob: '2010-04-14',
    gender: 'Male',
    bloodGroup: 'B+',
    address: 'House #42, Street 18, Sector G-10/2, Islamabad',
    admissionDate: '2020-08-15',
    emergencyContact: '+92 333 4920194',
    previousSchool: 'Army Public School & College',
    recentMarks: [
      { subject: 'Mathematics', marks: 95, total: 100, grade: 'A+' },
      { subject: 'Physics', marks: 91, total: 100, grade: 'A+' },
      { subject: 'Chemistry', marks: 88, total: 100, grade: 'A' },
      { subject: 'Computer Science', marks: 98, total: 100, grade: 'A+' },
      { subject: 'English Literature', marks: 89, total: 100, grade: 'A' },
      { subject: 'Urdu', marks: 92, total: 100, grade: 'A+' }
    ],
    attendanceHistory: [
      { month: 'Apr', present: 22, absent: 1, late: 0 },
      { month: 'May', present: 23, absent: 0, late: 1 },
      { month: 'Jun', present: 21, absent: 1, late: 0 },
      { month: 'Aug', present: 24, absent: 0, late: 0 },
      { month: 'Sep', present: 6, absent: 0, late: 0 }
    ],
    feeRecords: [
      { voucherNo: 'V-2026-901', month: 'September 2026', amount: 32000, status: 'Paid', date: '2026-09-03' },
      { voucherNo: 'V-2026-801', month: 'August 2026', amount: 32000, status: 'Paid', date: '2026-08-04' },
      { voucherNo: 'V-2026-701', month: 'July 2026', amount: 32000, status: 'Paid', date: '2026-07-05' }
    ]
  },
  {
    id: 'STU-2026-002',
    name: 'Aiman Fatima',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    rollNo: '10-A-02',
    class: 'Grade 10',
    section: 'A',
    parentName: 'Dr. Tariq Mehmood',
    parentPhone: '+92 321 8472910',
    parentEmail: 'dr.tariq.m@yahoo.com',
    attendancePct: 98.2,
    feeStatus: 'Paid',
    status: 'Active',
    dob: '2010-09-22',
    gender: 'Female',
    bloodGroup: 'O+',
    address: 'Plot 112, Street 4, Bahria Town Phase 4, Islamabad',
    admissionDate: '2019-04-10',
    emergencyContact: '+92 301 9283746',
    previousSchool: 'Roots Millennium School',
    recentMarks: [
      { subject: 'Mathematics', marks: 98, total: 100, grade: 'A+' },
      { subject: 'Biology', marks: 96, total: 100, grade: 'A+' },
      { subject: 'Chemistry', marks: 94, total: 100, grade: 'A+' },
      { subject: 'Physics', marks: 92, total: 100, grade: 'A+' },
      { subject: 'English', marks: 95, total: 100, grade: 'A+' }
    ],
    attendanceHistory: [
      { month: 'Apr', present: 23, absent: 0, late: 0 },
      { month: 'May', present: 24, absent: 0, late: 0 },
      { month: 'Jun', present: 22, absent: 0, late: 0 },
      { month: 'Aug', present: 24, absent: 0, late: 1 }
    ],
    feeRecords: [
      { voucherNo: 'V-2026-902', month: 'September 2026', amount: 34500, status: 'Paid', date: '2026-09-02' }
    ]
  },
  {
    id: 'STU-2026-003',
    name: 'Bilal Hassan Cheema',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rollNo: '10-B-05',
    class: 'Grade 10',
    section: 'B',
    parentName: 'Hassan Nisar Cheema',
    parentPhone: '+92 333 5192847',
    parentEmail: 'hassan.cheema@fintech.pk',
    attendancePct: 88.4,
    feeStatus: 'Pending',
    status: 'Active',
    dob: '2010-01-11',
    gender: 'Male',
    bloodGroup: 'A+',
    address: 'House #89, Sector I-8/2, Islamabad',
    admissionDate: '2021-09-01',
    emergencyContact: '+92 334 5678901',
    recentMarks: [
      { subject: 'Mathematics', marks: 78, total: 100, grade: 'B' },
      { subject: 'Physics', marks: 82, total: 100, grade: 'A' },
      { subject: 'English', marks: 85, total: 100, grade: 'A' }
    ],
    attendanceHistory: [
      { month: 'Aug', present: 21, absent: 3, late: 2 },
      { month: 'Sep', present: 5, absent: 1, late: 0 }
    ],
    feeRecords: [
      { voucherNo: 'V-2026-903', month: 'September 2026', amount: 32000, status: 'Pending', date: '2026-09-10' }
    ]
  },
  {
    id: 'STU-2026-004',
    name: 'Zainab Khurram',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rollNo: '9-A-12',
    class: 'Grade 9',
    section: 'A',
    parentName: 'Khurram Shahzad',
    parentPhone: '+92 300 4819203',
    parentEmail: 'khurram.shahzad@consultant.com',
    attendancePct: 94.0,
    feeStatus: 'Paid',
    status: 'Active',
    dob: '2011-06-18',
    gender: 'Female',
    bloodGroup: 'AB+',
    address: 'Villa 14, River Garden, Islamabad Highway',
    admissionDate: '2022-03-12',
    emergencyContact: '+92 321 5566778',
    recentMarks: [
      { subject: 'General Science', marks: 90, total: 100, grade: 'A+' },
      { subject: 'Mathematics', marks: 88, total: 100, grade: 'A' },
      { subject: 'Pakistan Studies', marks: 94, total: 100, grade: 'A+' }
    ],
    attendanceHistory: [
      { month: 'Aug', present: 23, absent: 1, late: 0 }
    ],
    feeRecords: [
      { voucherNo: 'V-2026-904', month: 'September 2026', amount: 28500, status: 'Paid', date: '2026-09-01' }
    ]
  },
  {
    id: 'STU-2026-005',
    name: 'Usman Ghani',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rollNo: '10-B-03',
    class: 'Grade 10',
    section: 'B',
    parentName: 'Muhammad Ghani',
    parentPhone: '+92 345 9182374',
    parentEmail: 'm.ghani@textiles.com',
    attendancePct: 76.8,
    feeStatus: 'Overdue',
    status: 'Active',
    dob: '2010-11-05',
    gender: 'Male',
    bloodGroup: 'A-',
    address: 'Civil Lines, Sahiwal, Punjab',
    admissionDate: '2024-08-10',
    emergencyContact: '+92 300 1122334',
    recentMarks: [
      { subject: 'Physics', marks: 68, total: 100, grade: 'C' },
      { subject: 'Chemistry', marks: 65, total: 100, grade: 'C' },
      { subject: 'Mathematics', marks: 61, total: 100, grade: 'D' }
    ],
    attendanceHistory: [
      { month: 'Aug', present: 18, absent: 6, late: 3 }
    ],
    feeRecords: [
      { voucherNo: 'V-2026-805', month: 'August 2026', amount: 18000, status: 'Overdue', date: '2026-08-10' }
    ]
  },
  {
    id: 'STU-2026-006',
    name: 'Mahnoor Bilal',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    rollNo: '8-C-09',
    class: 'Grade 8',
    section: 'C',
    parentName: 'Bilal Rasheed Malik',
    parentPhone: '+92 312 9988776',
    parentEmail: 'bilal.malik@legalfirm.pk',
    attendancePct: 99.1,
    feeStatus: 'Paid',
    status: 'Active',
    dob: '2012-08-14',
    gender: 'Female',
    bloodGroup: 'O-',
    address: 'Fateh Sher Colony, Sahiwal',
    admissionDate: '2023-04-01',
    emergencyContact: '+92 333 9988776',
    recentMarks: [
      { subject: 'English', marks: 99, total: 100, grade: 'A+' },
      { subject: 'History', marks: 95, total: 100, grade: 'A+' },
      { subject: 'Science', marks: 93, total: 100, grade: 'A+' }
    ],
    attendanceHistory: [
      { month: 'Aug', present: 24, absent: 0, late: 0 }
    ],
    feeRecords: [
      { voucherNo: 'V-2026-906', month: 'September 2026', amount: 16000, status: 'Paid', date: '2026-09-04' }
    ]
  },
  {
    id: 'STU-2026-007',
    name: 'Danyal Rehan',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    rollNo: '10-A-07',
    class: 'Grade 10',
    section: 'A',
    parentName: 'Brig. Rehan Aslam',
    parentPhone: '+92 300 8521470',
    parentEmail: 'rehan.aslam@defence.pk',
    attendancePct: 97.4,
    feeStatus: 'Paid',
    status: 'Active',
    dob: '2010-03-29',
    gender: 'Male',
    bloodGroup: 'B+',
    address: 'Canal View Housing Scheme, Sahiwal',
    admissionDate: '2018-08-01',
    emergencyContact: '+92 321 8521470',
    recentMarks: [
      { subject: 'Physics (SSC-II)', marks: 94, total: 100, grade: 'A+' },
      { subject: 'Mathematics (Science)', marks: 97, total: 100, grade: 'A+' },
      { subject: 'Chemistry (SSC-II)', marks: 92, total: 100, grade: 'A+' }
    ],
    attendanceHistory: [
      { month: 'Aug', present: 24, absent: 0, late: 0 }
    ],
    feeRecords: [
      { voucherNo: 'V-2026-907', month: 'September 2026', amount: 18500, status: 'Paid', date: '2026-09-02' }
    ]
  },
  {
    id: 'STU-2026-008',
    name: 'Sara Murtaza',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rollNo: '6-B-14',
    class: 'Grade 6',
    section: 'B',
    parentName: 'Syed Murtaza Ali',
    parentPhone: '+92 333 4455667',
    parentEmail: 'murtaza.ali@telecom.com',
    attendancePct: 91.0,
    feeStatus: 'Pending',
    status: 'Active',
    dob: '2014-05-19',
    gender: 'Female',
    bloodGroup: 'A+',
    address: 'Sector E-7, Margalla Road, Islamabad',
    admissionDate: '2024-04-15',
    emergencyContact: '+92 300 4455667',
    recentMarks: [
      { subject: 'Mathematics', marks: 84, total: 100, grade: 'A' },
      { subject: 'Science', marks: 89, total: 100, grade: 'A' }
    ],
    attendanceHistory: [
      { month: 'Aug', present: 22, absent: 2, late: 1 }
    ],
    feeRecords: [
      { voucherNo: 'V-2026-908', month: 'September 2026', amount: 24000, status: 'Pending', date: '2026-09-10' }
    ]
  }
];

export const MOCK_ADMISSIONS: AdmissionApplication[] = [
  {
    id: 'ADM-2026-108',
    studentName: 'Shahmeer Khan',
    appliedClass: 'Grade 9',
    parentName: 'Imran Khan Lodhi',
    parentPhone: '+92 300 9876543',
    parentEmail: 'imran.lodhi@gmail.com',
    applicationDate: '2026-09-05',
    status: 'Pending',
    gender: 'Male',
    dob: '2012-02-14',
    previousSchool: 'Lahore Grammar School',
    previousPercentage: '89.4%',
    address: 'House #12, Street 8, DHA Phase 2, Islamabad',
    documentsSubmitted: ['Birth Certificate', 'Previous Report Card', 'Parent CNIC Copy', '4 Photographs']
  },
  {
    id: 'ADM-2026-107',
    studentName: 'Zoya Qureshi',
    appliedClass: 'Grade 10 (Science - Bio)',
    parentName: 'Dr. Kamran Qureshi',
    parentPhone: '+92 321 5432109',
    parentEmail: 'dr.kamran@pims.gov.pk',
    applicationDate: '2026-09-04',
    status: 'Approved',
    gender: 'Female',
    dob: '2010-10-09',
    previousSchool: 'District Public School Sahiwal',
    previousPercentage: '93.8%',
    address: 'Civil Lines, Girls College Road, Sahiwal',
    documentsSubmitted: ['Matriculation / O-Level Result', 'Character Certificate', 'Vaccination Record']
  },
  {
    id: 'ADM-2026-106',
    studentName: 'Ayan Zubair',
    appliedClass: 'Grade 1',
    parentName: 'Muhammad Zubair',
    parentPhone: '+92 334 1122334',
    parentEmail: 'zubair.m@bankalfalah.com',
    applicationDate: '2026-09-03',
    status: 'Under Review',
    gender: 'Male',
    dob: '2020-07-21',
    previousSchool: 'Froebel International Pre-School',
    previousPercentage: 'N/A (Early Years)',
    address: 'Sector G-13/4, Islamabad',
    documentsSubmitted: ['B-Form', 'Vaccination Card', 'Father CNIC']
  },
  {
    id: 'ADM-2026-105',
    studentName: 'Eshal Mansoor',
    appliedClass: 'Grade 6',
    parentName: 'Mansoor Akhtar',
    parentPhone: '+92 313 7788990',
    parentEmail: 'mansoor.akhtar@aviation.pk',
    applicationDate: '2026-09-02',
    status: 'Approved',
    gender: 'Female',
    dob: '2014-12-03',
    previousSchool: 'Super Nova School',
    previousPercentage: '86.5%',
    address: 'Sector F-10/3, Islamabad',
    documentsSubmitted: ['School Leaving Certificate', 'Past 2 Years Report Cards']
  },
  {
    id: 'ADM-2026-104',
    studentName: 'Rohail Ahmad',
    appliedClass: 'Grade 8',
    parentName: 'Sohail Ahmad',
    parentPhone: '+92 300 2233445',
    parentEmail: 'sohail.ahmad@yahoo.com',
    applicationDate: '2026-08-29',
    status: 'Rejected',
    gender: 'Male',
    dob: '2012-09-17',
    previousSchool: 'City School Islamabad',
    previousPercentage: '54.2%',
    address: 'Sector I-9/1, Islamabad',
    documentsSubmitted: ['Report Card', 'Birth Certificate'],
    notes: 'Did not meet admission entrance exam benchmark in Mathematics.'
  },
  {
    id: 'ADM-2026-103',
    studentName: 'Hania Asad',
    appliedClass: 'Grade 10',
    parentName: 'Asadullah Jan',
    parentPhone: '+92 333 9988112',
    parentEmail: 'asadullah.jan@mofa.gov.pk',
    applicationDate: '2026-08-27',
    status: 'Approved',
    gender: 'Female',
    dob: '2011-01-30',
    previousSchool: 'Embassy International School, Riyadh',
    previousPercentage: '91.0%',
    address: 'Diplomatic Enclave, Sector G-5, Islamabad',
    documentsSubmitted: ['Foreign Equivalence Certificate', 'Passport Copy', 'B-Form']
  }
];

export const MOCK_TEACHERS: Teacher[] = [
  {
    id: 'TCH-001',
    name: 'Prof. Junaid Iqbal',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    empId: 'EMP-9801',
    subject: 'Physics (SSC-I & II)',
    department: 'Science & STEM',
    classes: ['Grade 9-A', 'Grade 10-A', 'Grade 10-B'],
    phone: '+92 300 8594012',
    email: 'junaid.iqbal@readacademy.edu.pk',
    joiningDate: '2018-08-01',
    status: 'Active',
    qualification: 'M.Phil Physics (QAU), B.Ed',
    experienceYears: 14,
    attendancePct: 98.4,
    salary: 165000,
    assignedDuties: ['Science Lab Head', 'Morning Assembly Supervisor (Tue)', 'STEM Olympiad Mentor']
  },
  {
    id: 'TCH-002',
    name: 'Ms. Ayesha Siddiqui',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    empId: 'EMP-9804',
    subject: 'English Language & Literature',
    department: 'Languages',
    classes: ['Grade 9-A', 'Grade 9-B', 'Grade 10-A'],
    phone: '+92 321 4455889',
    email: 'ayesha.s@readacademy.edu.pk',
    joiningDate: '2019-02-15',
    status: 'Active',
    qualification: 'M.A. English Literature (NUML), CELTA Certified',
    experienceYears: 9,
    attendancePct: 96.0,
    salary: 135000,
    assignedDuties: ['Debating Society In-charge', 'Annual Magazine Chief Editor']
  },
  {
    id: 'TCH-003',
    name: 'Engr. Haris Mumtaz',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    empId: 'EMP-9812',
    subject: 'Mathematics (General & Science)',
    department: 'Mathematics',
    classes: ['Grade 8-A', 'Grade 9-A', 'Grade 10-A'],
    phone: '+92 333 7891234',
    email: 'haris.mumtaz@readacademy.edu.pk',
    joiningDate: '2019-09-01',
    status: 'Active',
    qualification: 'M.Sc Applied Mathematics (NUST)',
    experienceYears: 8,
    attendancePct: 97.2,
    salary: 145000,
    assignedDuties: ['Math Kangaroo Coordinator', 'Senior Class Tutor']
  },
  {
    id: 'TCH-004',
    name: 'Dr. Nabila Bano',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
    empId: 'EMP-9799',
    subject: 'Chemistry (SSC-I & II)',
    department: 'Science & STEM',
    classes: ['Grade 9-B', 'Grade 10-B'],
    phone: '+92 312 9090887',
    email: 'nabila.bano@readacademy.edu.pk',
    joiningDate: '2018-01-10',
    status: 'Active',
    qualification: 'Ph.D. Organic Chemistry (HEC Scholar)',
    experienceYears: 16,
    attendancePct: 99.0,
    salary: 185000,
    assignedDuties: ['Head of Department (Science)', 'Exam Proctor Head']
  },
  {
    id: 'TCH-005',
    name: 'Mr. Salman Qadir',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    empId: 'EMP-9825',
    subject: 'Computer Science & AI',
    department: 'Computer Science',
    classes: ['Grade 8-A', 'Grade 9-A', 'Grade 10-A'],
    phone: '+92 345 5566778',
    email: 'salman.qadir@beaconcrest.edu.pk',
    joiningDate: '2021-03-01',
    status: 'Active',
    qualification: 'BS Computer Science (FAST-NUCES)',
    experienceYears: 6,
    attendancePct: 94.5,
    salary: 130000,
    assignedDuties: ['Robotics Club Advisor', 'Campus IT & Portal Co-lead']
  },
  {
    id: 'TCH-006',
    name: 'Capt. (R) Waqar Hashmi',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    empId: 'EMP-9800',
    subject: 'Physical Education & Sports',
    department: 'Sports & Co-Curricular',
    classes: ['Grade 6-12 (All)'],
    phone: '+92 300 7711223',
    email: 'waqar.hashmi@beaconcrest.edu.pk',
    joiningDate: '2017-10-01',
    status: 'Active',
    qualification: 'B.Sc Sports Sciences, Army Physical Training Corps',
    experienceYears: 18,
    attendancePct: 98.8,
    salary: 140000,
    assignedDuties: ['Director of Sports', 'Discipline Committee Member', 'Annual Gala Lead']
  }
];

export const MOCK_TEACHER_DUTIES: TeacherDuty[] = [
  {
    id: 'DUTY-01',
    teacherName: 'Prof. Junaid Iqbal',
    teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subject: 'Physics',
    class: 'Grade 10 & 11',
    section: 'A',
    periodsPerWeek: 24,
    duties: ['Morning Assembly Supervision (Tuesdays)', 'Physics Lab Safety Oversight', 'Inter-School STEM Olympiad Mentor'],
    workloadStatus: 'Normal'
  },
  {
    id: 'DUTY-02',
    teacherName: 'Ms. Ayesha Siddiqui',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    subject: 'English',
    class: 'Grade 9 & 10',
    section: 'A & B',
    periodsPerWeek: 28,
    duties: ['Debate Society In-charge', 'Annual School Magazine Chief Editor', 'English Recitation Competition Organizer'],
    workloadStatus: 'High'
  },
  {
    id: 'DUTY-03',
    teacherName: 'Engr. Haris Mumtaz',
    teacherAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    subject: 'Mathematics',
    class: 'Grade 10 & 11',
    section: 'A & B',
    periodsPerWeek: 26,
    duties: ['International Kangaroo Math Coordinator', 'Grade 10-A Homeroom Tutor'],
    workloadStatus: 'Normal'
  },
  {
    id: 'DUTY-04',
    teacherName: 'Dr. Nabila Bano',
    teacherAvatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
    subject: 'Chemistry',
    class: 'Grade 9 & 10',
    section: 'A & B',
    periodsPerWeek: 20,
    duties: ['Head of Department (Science)', 'Exam Proctor Head', 'Curriculum Committee Member'],
    workloadStatus: 'Normal'
  },
  {
    id: 'DUTY-05',
    teacherName: 'Mr. Salman Qadir',
    teacherAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    subject: 'Computer Science',
    class: 'Grade 8, 9, 10',
    section: 'A & B',
    periodsPerWeek: 30,
    duties: ['Robotics Club Advisor', 'Computer Lab Administrator', 'Portal Technical Liaison'],
    workloadStatus: 'Overloaded'
  }
];

export const MOCK_TIMETABLE: TimetableSchedule = {
  Monday: [
    { period: 1, time: '08:00 - 08:45 AM', subject: 'Mathematics', teacher: 'Engr. Haris Mumtaz', room: 'Room 204' },
    { period: 2, time: '08:45 - 09:30 AM', subject: 'Physics', teacher: 'Prof. Junaid Iqbal', room: 'Physics Lab A' },
    { period: 3, time: '09:30 - 10:15 AM', subject: 'English Literature', teacher: 'Ms. Ayesha Siddiqui', room: 'Room 204' },
    { period: 4, time: '10:45 - 11:30 AM', subject: 'Computer Science', teacher: 'Mr. Salman Qadir', room: 'Computer Lab 1' },
    { period: 5, time: '11:30 - 12:15 PM', subject: 'Chemistry', teacher: 'Dr. Nabila Bano', room: 'Chem Lab B' },
    { period: 6, time: '12:15 - 01:00 PM', subject: 'Pakistan Studies', teacher: 'Mrs. Tahira Naeem', room: 'Room 204' },
    { period: 7, time: '01:30 - 02:15 PM', subject: 'Sports / Physical Ed', teacher: 'Capt. (R) Waqar Hashmi', room: 'Sports Complex' }
  ],
  Tuesday: [
    { period: 1, time: '08:00 - 08:45 AM', subject: 'Chemistry Theory', teacher: 'Dr. Nabila Bano', room: 'Room 204' },
    { period: 2, time: '08:45 - 09:30 AM', subject: 'Mathematics', teacher: 'Engr. Haris Mumtaz', room: 'Room 204' },
    { period: 3, time: '09:30 - 10:15 AM', subject: 'Physics Practical', teacher: 'Prof. Junaid Iqbal', room: 'Physics Lab A' },
    { period: 4, time: '10:45 - 11:30 AM', subject: 'Urdu Literature', teacher: 'Mr. Asif Raza', room: 'Room 204' },
    { period: 5, time: '11:30 - 12:15 PM', subject: 'Islamiyat', teacher: 'Qari Abdul Rasheed', room: 'Room 204' },
    { period: 6, time: '12:15 - 01:00 PM', subject: 'Computer Science', teacher: 'Mr. Salman Qadir', room: 'Computer Lab 1' },
    { period: 7, time: '01:30 - 02:15 PM', subject: 'Library & Research', teacher: 'Mrs. Salma Parveen', room: 'Central Library' }
  ],
  Wednesday: [
    { period: 1, time: '08:00 - 08:45 AM', subject: 'English Grammar', teacher: 'Ms. Ayesha Siddiqui', room: 'Room 204' },
    { period: 2, time: '08:45 - 09:30 AM', subject: 'Mathematics', teacher: 'Engr. Haris Mumtaz', room: 'Room 204' },
    { period: 3, time: '09:30 - 10:15 AM', subject: 'Physics', teacher: 'Prof. Junaid Iqbal', room: 'Room 204' },
    { period: 4, time: '10:45 - 11:30 AM', subject: 'Chemistry Practical', teacher: 'Dr. Nabila Bano', room: 'Chem Lab B' },
    { period: 5, time: '11:30 - 12:15 PM', subject: 'Computer Science', teacher: 'Mr. Salman Qadir', room: 'Computer Lab 1' },
    { period: 6, time: '12:15 - 01:00 PM', subject: 'Robotics & AI Club', teacher: 'Mr. Salman Qadir', room: 'Innovation Hub' },
    { period: 7, time: '01:30 - 02:15 PM', subject: 'Art & Design', teacher: 'Ms. Hira Tareen', room: 'Art Studio' }
  ],
  Thursday: [
    { period: 1, time: '08:00 - 08:45 AM', subject: 'Mathematics', teacher: 'Engr. Haris Mumtaz', room: 'Room 204' },
    { period: 2, time: '08:45 - 09:30 AM', subject: 'English Composition', teacher: 'Ms. Ayesha Siddiqui', room: 'Room 204' },
    { period: 3, time: '09:30 - 10:15 AM', subject: 'Pakistan Studies', teacher: 'Mrs. Tahira Naeem', room: 'Room 204' },
    { period: 4, time: '10:45 - 11:30 AM', subject: 'Physics', teacher: 'Prof. Junaid Iqbal', room: 'Physics Lab A' },
    { period: 5, time: '11:30 - 12:15 PM', subject: 'Chemistry', teacher: 'Dr. Nabila Bano', room: 'Room 204' },
    { period: 6, time: '12:15 - 01:00 PM', subject: 'Urdu', teacher: 'Mr. Asif Raza', room: 'Room 204' },
    { period: 7, time: '01:30 - 02:15 PM', subject: 'Counseling & Mentorship', teacher: 'Dr. Shahbaz Alam', room: 'Auditorium' }
  ],
  Friday: [
    { period: 1, time: '08:00 - 08:45 AM', subject: 'Biology / Comp Sc.', teacher: 'Mr. Salman Qadir', room: 'Computer Lab 1' },
    { period: 2, time: '08:45 - 09:30 AM', subject: 'Mathematics Quiz', teacher: 'Engr. Haris Mumtaz', room: 'Room 204' },
    { period: 3, time: '09:30 - 10:15 AM', subject: 'Physics Seminar', teacher: 'Prof. Junaid Iqbal', room: 'Auditorium' },
    { period: 4, time: '10:45 - 11:30 AM', subject: 'Islamiyat & Ethics', teacher: 'Qari Abdul Rasheed', room: 'Room 204' },
    { period: 5, time: '11:30 - 12:15 PM', subject: 'Weekly Assembly & Awards', teacher: 'Principal & Faculty', room: 'Main Ground' },
    { period: 6, time: '12:15 - 01:00 PM', subject: 'Jummah Prayers & Dispersal', teacher: 'All Faculty', room: 'Campus Mosque' },
    { period: 7, time: '01:30 - 02:15 PM', subject: 'Co-Curricular / Clubs', teacher: 'House Masters', room: 'Activity Hall' }
  ],
  Saturday: [
    { period: 1, time: '08:30 - 09:30 AM', subject: 'Remedial Mathematics', teacher: 'Engr. Haris Mumtaz', room: 'Room 204' },
    { period: 2, time: '09:30 - 10:30 AM', subject: 'O/A Level Exam Preparation', teacher: 'Prof. Junaid Iqbal', room: 'Physics Lab A' },
    { period: 3, time: '11:00 - 12:30 PM', subject: 'Debate & MUN Club', teacher: 'Ms. Ayesha Siddiqui', room: 'Auditorium' },
    { period: 4, time: '12:30 - 01:30 PM', subject: 'Sports Practice (Cricket/Football)', teacher: 'Capt. (R) Waqar Hashmi', room: 'Main Ground' },
    { period: 5, time: '-', subject: '-', teacher: '-', room: '-' },
    { period: 6, time: '-', subject: '-', teacher: '-', room: '-' },
    { period: 7, time: '-', subject: '-', teacher: '-', room: '-' }
  ]
};

export const MOCK_FEE_VOUCHERS: FeeVoucher[] = [
  {
    voucherNo: 'BCA-VOUCH-2026-0901',
    studentId: 'STU-2026-001',
    studentName: 'Hamza Farooq',
    class: 'Grade 10',
    section: 'A',
    month: 'September 2026',
    tuitionFee: 26000,
    examFee: 2500,
    labFee: 2000,
    utilityCharges: 1500,
    fine: 0,
    totalAmount: 32000,
    dueDate: '2026-09-15',
    paidDate: '2026-09-03',
    status: 'Paid',
    paymentMethod: 'Online Gateway'
  },
  {
    voucherNo: 'BCA-VOUCH-2026-0902',
    studentId: 'STU-2026-002',
    studentName: 'Aiman Fatima',
    class: 'Grade 10',
    section: 'A',
    month: 'September 2026',
    tuitionFee: 26000,
    examFee: 2500,
    labFee: 4500,
    utilityCharges: 1500,
    fine: 0,
    totalAmount: 34500,
    dueDate: '2026-09-15',
    paidDate: '2026-09-02',
    status: 'Paid',
    paymentMethod: 'Bank Transfer'
  },
  {
    voucherNo: 'BCA-VOUCH-2026-0903',
    studentId: 'STU-2026-003',
    studentName: 'Bilal Hassan Cheema',
    class: 'Grade 10',
    section: 'B',
    month: 'September 2026',
    tuitionFee: 26000,
    examFee: 2500,
    labFee: 2000,
    utilityCharges: 1500,
    fine: 0,
    totalAmount: 32000,
    dueDate: '2026-09-15',
    status: 'Pending'
  },
  {
    voucherNo: 'BCA-VOUCH-2026-0904',
    studentId: 'STU-2026-004',
    studentName: 'Zainab Khurram',
    class: 'Grade 9',
    section: 'A',
    month: 'September 2026',
    tuitionFee: 23500,
    examFee: 2000,
    labFee: 1500,
    utilityCharges: 1500,
    fine: 0,
    totalAmount: 28500,
    dueDate: '2026-09-15',
    paidDate: '2026-09-01',
    status: 'Paid',
    paymentMethod: 'Cash'
  },
  {
    voucherNo: 'RAS-VOUCH-2026-0805',
    studentId: 'STU-2026-005',
    studentName: 'Usman Ghani',
    class: 'Grade 10',
    section: 'B',
    month: 'August 2026',
    tuitionFee: 15000,
    examFee: 1500,
    labFee: 1000,
    utilityCharges: 500,
    fine: 500,
    totalAmount: 18500,
    dueDate: '2026-08-15',
    status: 'Overdue'
  },
  {
    voucherNo: 'RAS-VOUCH-2026-0906',
    studentId: 'STU-2026-006',
    studentName: 'Mahnoor Bilal',
    class: 'Grade 8',
    section: 'C',
    month: 'September 2026',
    tuitionFee: 13500,
    examFee: 1200,
    labFee: 800,
    utilityCharges: 500,
    fine: 0,
    totalAmount: 16000,
    dueDate: '2026-09-15',
    paidDate: '2026-09-04',
    status: 'Paid',
    paymentMethod: 'Bank Transfer'
  },
  {
    voucherNo: 'RAS-VOUCH-2026-0907',
    studentId: 'STU-2026-007',
    studentName: 'Danyal Rehan',
    class: 'Grade 10',
    section: 'A',
    month: 'September 2026',
    tuitionFee: 15000,
    examFee: 1500,
    labFee: 1000,
    utilityCharges: 500,
    fine: 0,
    totalAmount: 18000,
    dueDate: '2026-09-15',
    paidDate: '2026-09-02',
    status: 'Paid',
    paymentMethod: 'Online Gateway'
  }
];

export const MOCK_CLASSES = [
  { id: 'CLS-01', name: 'Playgroup', sections: ['A', 'B'], studentsCount: 42, classTeacher: 'Ms. Sadia Naveed', room: 'Block C-101' },
  { id: 'CLS-02', name: 'Nursery', sections: ['A', 'B', 'C'], studentsCount: 68, classTeacher: 'Ms. Fatima Noor', room: 'Block C-102' },
  { id: 'CLS-03', name: 'Prep / KG', sections: ['A', 'B', 'C'], studentsCount: 75, classTeacher: 'Ms. Rabia Anam', room: 'Block C-103' },
  { id: 'CLS-04', name: 'Grade 1', sections: ['A', 'B', 'C'], studentsCount: 88, classTeacher: 'Ms. Zainab Malik', room: 'Block B-101' },
  { id: 'CLS-05', name: 'Grade 2', sections: ['A', 'B', 'C'], studentsCount: 85, classTeacher: 'Ms. Sana Qasim', room: 'Block B-102' },
  { id: 'CLS-06', name: 'Grade 3', sections: ['A', 'B', 'C'], studentsCount: 92, classTeacher: 'Ms. Mariam Tariq', room: 'Block B-103' },
  { id: 'CLS-07', name: 'Grade 4', sections: ['A', 'B', 'C'], studentsCount: 89, classTeacher: 'Mr. Zafar Abbas', room: 'Block B-201' },
  { id: 'CLS-08', name: 'Grade 5', sections: ['A', 'B', 'C'], studentsCount: 94, classTeacher: 'Ms. Farzana Kausar', room: 'Block B-202' },
  { id: 'CLS-09', name: 'Grade 6', sections: ['A', 'B', 'C'], studentsCount: 96, classTeacher: 'Mr. Adnan Haider', room: 'Block A-101' },
  { id: 'CLS-10', name: 'Grade 7', sections: ['A', 'B', 'C'], studentsCount: 102, classTeacher: 'Ms. Saima Nawaz', room: 'Block A-102' },
  { id: 'CLS-11', name: 'Grade 8', sections: ['A', 'B', 'C'], studentsCount: 105, classTeacher: 'Mr. Asif Raza', room: 'Block A-103' },
  { id: 'CLS-12', name: 'Grade 9 (SSC-I)', sections: ['Science-Bio', 'Science-CS', 'General'], studentsCount: 112, classTeacher: 'Ms. Ayesha Siddiqui', room: 'Block A-201' },
  { id: 'CLS-13', name: 'Grade 10 (SSC-II)', sections: ['Science-Bio', 'Science-CS', 'General'], studentsCount: 98, classTeacher: 'Engr. Haris Mumtaz', room: 'Block A-204' }
];

export const MOCK_SUBJECTS = [
  { code: 'MATH-10', name: 'Mathematics (General & Science)', dept: 'Science & Math', classes: 'Grade 9 - 10', teachers: 'Engr. Haris Mumtaz, Mr. Zafar', weeklyPeriods: 6 },
  { code: 'PHY-10', name: 'Physics (Theory & Practical Lab)', dept: 'Science & Math', classes: 'Grade 9 - 10', teachers: 'Prof. Junaid Iqbal', weeklyPeriods: 6 },
  { code: 'CHEM-10', name: 'Chemistry (Theory & Practical Lab)', dept: 'Science & Math', classes: 'Grade 9 - 10', teachers: 'Dr. Nabila Bano', weeklyPeriods: 6 },
  { code: 'CS-10', name: 'Computer Science & ICT', dept: 'Technology', classes: 'Grade 6 - 10', teachers: 'Mr. Salman Qadir', weeklyPeriods: 5 },
  { code: 'ENG-10', name: 'English Language & Comp.', dept: 'Languages', classes: 'Grade 1 - 10', teachers: 'Ms. Ayesha Siddiqui, Ms. Sana', weeklyPeriods: 6 },
  { code: 'URD-10', name: 'Urdu Literature & Gram.', dept: 'Languages', classes: 'Grade 1 - 10', teachers: 'Mr. Asif Raza', weeklyPeriods: 5 },
  { code: 'PST-10', name: 'Pakistan Studies & History', dept: 'Social Sciences', classes: 'Grade 9 - 10', teachers: 'Mrs. Tahira Naeem', weeklyPeriods: 4 },
  { code: 'ISL-10', name: 'Islamiyat & Tarjuma-tul-Quran', dept: 'Humanities', classes: 'Grade 1 - 10', teachers: 'Qari Abdul Rasheed', weeklyPeriods: 4 },
  { code: 'BIO-10', name: 'Biology (Theory & Practical)', dept: 'Science & Math', classes: 'Grade 9 - 10', teachers: 'Dr. Faiza Anwar', weeklyPeriods: 6 },
  { code: 'ART-08', name: 'Fine Arts & Calligraphy', dept: 'Arts', classes: 'Grade 4 - 8', teachers: 'Ms. Hira Tareen', weeklyPeriods: 3 },
  { code: 'PE-01', name: 'Physical Education & Athletics', dept: 'Sports', classes: 'All Grades', teachers: 'Capt. (R) Waqar Hashmi', weeklyPeriods: 3 }
];

export const MOCK_EXAMS: Exam[] = [
  {
    id: 'EXAM-2026-F',
    name: 'First Term Assessment 2026',
    term: 'Term 1',
    startDate: '2026-10-12',
    endDate: '2026-10-24',
    classes: ['Grade 1 to 12'],
    status: 'Upcoming',
    totalStudents: 1248
  },
  {
    id: 'EXAM-2026-M',
    name: 'Mid-Term Examination 2026',
    term: 'Term 2',
    startDate: '2026-12-08',
    endDate: '2026-12-22',
    classes: ['Grade 1 to 12'],
    status: 'Upcoming',
    totalStudents: 1248
  },
  {
    id: 'EXAM-2026-PRE',
    name: 'Pre-Board Mock Examinations',
    term: 'Senior Mock',
    startDate: '2026-08-15',
    endDate: '2026-08-28',
    classes: ['Grade 9, 10, 11, 12'],
    status: 'Completed',
    totalStudents: 412
  }
];

export const MOCK_MARKS_ENTRY: MarksEntry[] = [
  { id: 'M-101', studentId: 'STU-2026-001', studentName: 'Hamza Farooq', rollNo: '10-A-01', subject: 'Mathematics', totalMarks: 100, obtainedMarks: 95, grade: 'A+', remarks: 'Exceptional analytical problem solving' },
  { id: 'M-102', studentId: 'STU-2026-002', studentName: 'Aiman Fatima', rollNo: '10-A-02', subject: 'Mathematics', totalMarks: 100, obtainedMarks: 98, grade: 'A+', remarks: 'Outstanding performance, highest in class' },
  { id: 'M-103', studentId: 'STU-2026-003', studentName: 'Bilal Hassan Cheema', rollNo: '10-B-05', subject: 'Mathematics', totalMarks: 100, obtainedMarks: 78, grade: 'B', remarks: 'Good grasp of algebra, needs geometry revision' },
  { id: 'M-104', studentId: 'STU-2026-004', studentName: 'Zainab Khurram', rollNo: '9-A-12', subject: 'Mathematics', totalMarks: 100, obtainedMarks: 88, grade: 'A', remarks: 'Consistent and dedicated approach' },
  { id: 'M-105', studentId: 'STU-2026-005', studentName: 'Usman Ghani', rollNo: '11-Sci-03', subject: 'Mathematics', totalMarks: 100, obtainedMarks: 61, grade: 'D', remarks: 'Needs remedial classes in trigonometry' },
  { id: 'M-106', studentId: 'STU-2026-006', studentName: 'Mahnoor Bilal', rollNo: '8-C-09', subject: 'Mathematics', totalMarks: 100, obtainedMarks: 93, grade: 'A+', remarks: 'Excellent precision and speed' },
  { id: 'M-107', studentId: 'STU-2026-007', studentName: 'Danyal Rehan', rollNo: '12-Sci-01', subject: 'Mathematics', totalMarks: 100, obtainedMarks: 97, grade: 'A+', remarks: 'Brilliant conceptual depth in Calculus' }
];

export const MOCK_HOMEWORK: HomeworkItem[] = [
  {
    id: 'HW-2026-081',
    title: 'Kinematics Equations & Graphical Derivations',
    subject: 'Physics',
    class: 'Grade 10',
    section: 'A',
    teacherName: 'Prof. Junaid Iqbal',
    assignedDate: '2026-09-06',
    dueDate: '2026-09-09',
    submissionCount: 38,
    totalStudents: 48,
    status: 'Active',
    description: 'Solve numerical problems #4.1 to 4.12 from Chapter 3 textbook. Plot velocity-time graphs on millimetric graph sheets.',
    attachmentName: 'physics_ch3_problem_set.pdf'
  },
  {
    id: 'HW-2026-082',
    title: 'Analytical Essay on Macbeth: Ambition & Downfall',
    subject: 'English Literature',
    class: 'Grade 10',
    section: 'A & B',
    teacherName: 'Ms. Ayesha Siddiqui',
    assignedDate: '2026-09-05',
    dueDate: '2026-09-11',
    submissionCount: 22,
    totalStudents: 98,
    status: 'Active',
    description: 'Write an 800-word critical essay examining the psychological trajectory of Macbeth from warrior to tyrant.',
    attachmentName: 'macbeth_act1_prompts.docx'
  },
  {
    id: 'HW-2026-083',
    title: 'Quadratic Equations & Roots Classification',
    subject: 'Mathematics',
    class: 'Grade 10',
    section: 'A',
    teacherName: 'Engr. Haris Mumtaz',
    assignedDate: '2026-09-04',
    dueDate: '2026-09-07',
    submissionCount: 46,
    totalStudents: 48,
    status: 'Completed',
    description: 'Exercise 2.4 - Discriminant and Nature of roots. Solve all 10 odd questions with neat working steps.',
    attachmentName: 'math_exercise_2_4.pdf'
  },
  {
    id: 'HW-2026-084',
    title: 'Python Object-Oriented Principles Implementation',
    subject: 'Computer Science',
    class: 'Grade 10',
    section: 'CS',
    teacherName: 'Mr. Salman Qadir',
    assignedDate: '2026-09-03',
    dueDate: '2026-09-10',
    submissionCount: 29,
    totalStudents: 35,
    status: 'Active',
    description: 'Create a simple banking simulation class with methods deposit(), withdraw(), check_balance() and transaction logs.'
  }
];

export const MOCK_NOTICES: Notice[] = [
  {
    id: 'NOT-2026-044',
    title: 'First Term Assessment 2026 - Schedule & Date Sheet Release',
    category: 'Academic',
    date: '2026-09-06',
    author: 'Controller of Examinations',
    audience: 'All',
    status: 'Published',
    priority: 'High',
    content: 'The date sheet for the First Term Assessments commencing from October 12, 2026 has been finalized. Students from Grade 1 to 12 are advised to collect their syllabus outlines from homeroom teachers or download from the portal.'
  },
  {
    id: 'NOT-2026-043',
    title: 'Annual Inter-School Sports Championship 2026 Trials',
    category: 'Event',
    date: '2026-09-04',
    author: 'Capt. (R) Waqar Hashmi (Director Sports)',
    audience: 'Students',
    status: 'Published',
    priority: 'Normal',
    content: 'Trials for Football, Basketball, Table Tennis, and Athletics will be conducted from September 15 to September 18 at the school sports pavilion starting 03:30 PM. Registered participants must report in school sports attire.'
  },
  {
    id: 'NOT-2026-042',
    title: 'Parent-Teacher Conference (PTC) for Term 1 Mid-Check',
    category: 'Administrative',
    date: '2026-09-02',
    author: 'Office of the Principal',
    audience: 'Parents',
    status: 'Published',
    priority: 'High',
    content: 'Parents and guardians are cordially invited to attend the first term PTC on Saturday, September 26, from 08:30 AM to 01:30 PM. Slots can be pre-booked via the portal to ensure one-on-one time with subject faculty.'
  },
  {
    id: 'NOT-2026-041',
    title: 'Fee Payment Deadline for September 2026 Extended',
    category: 'Urgent',
    date: '2026-09-01',
    author: 'Accounts & Finance Wing',
    audience: 'Parents',
    status: 'Published',
    priority: 'Urgent',
    content: 'In consideration of bank system maintenance over the weekend, the due date for September 2026 fee vouchers has been graciously extended to September 18, 2026 without late fee surcharge.'
  }
];

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: 'BLOG-01',
    title: 'Nurturing 21st-Century Problem Solvers: The Read Academy STEM Philosophy',
    slug: 'nurturing-21st-century-problem-solvers',
    excerpt: 'How our experiential laboratory approach and robotics curriculum empower young minds to tackle real-world global challenges with scientific rigor.',
    content: `In an era defined by rapid technological leaps, traditional rote learning is obsolete. At Read Academy Sahiwal, our STEM philosophy bridges the chasm between theoretical textbooks and tactile engineering. From Grade 4 upwards, students engage in hands-on robotics workshops, micro-controller programming, and inquiry-based physics labs.

Our state-of-the-art innovation lab encourages students to build solar-powered water filtration prototypes, write algorithmic solutions for environmental data collection, and compete at national Olympiads. By instilling the scientific method early, we don't just teach science — we sculpt the visionary innovators of tomorrow.`,
    category: 'Academic Innovation',
    tags: ['STEM', 'Robotics', 'Future Ready', 'Pedagogy'],
    author: 'Dr. Shahbaz Alam',
    authorRole: 'Principal & Executive Director',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    publishedDate: '2026-09-01',
    readTime: '4 min read',
    featuredImage: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format&fit=crop&q=80',
    status: 'Published',
    views: 1420,
    seoTitle: 'STEM Education Excellence at Read Academy Sahiwal',
    seoDescription: 'Discover how Read Academy Sahiwal leads 21st century STEM pedagogy with hands-on robotics, AI, and inquiry science.'
  },
  {
    id: 'BLOG-02',
    title: 'The Value of Character and Empathy: Beyond Textbooks and Report Cards',
    slug: 'value-of-character-and-empathy',
    excerpt: 'Academic brilliance shines brightest when paired with kindness, civic responsibility, and unshakeable ethical integrity.',
    content: `While board distinctions and high marks denote milestones, the true measure of an educated individual lies in their ethical compass. Our character development program integrates civic leadership, community outreach, and peer mentorship into the daily fabric of school life.

Every semester, our senior cohorts dedicate voluntary service hours to community welfare drives and literacy campaigns across Sahiwal. We nurture leaders who lead with empathy.`,
    category: 'Student Life',
    tags: ['Character Building', 'Civic Duty', 'Leadership', 'Empathy'],
    author: 'Mrs. Tahira Naeem',
    authorRole: 'Vice Principal',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    publishedDate: '2026-08-25',
    readTime: '3 min read',
    featuredImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    status: 'Published',
    views: 980,
    seoTitle: 'Character Building & Values at Read Academy Sahiwal',
    seoDescription: 'Learn how we foster empathy, moral courage, and public service alongside academic honors.'
  },
  {
    id: 'BLOG-03',
    title: 'Preparing for Cambridge O & A Level Success: A Guide for Parents and Students',
    slug: 'cambridge-success-guide',
    excerpt: 'Actionable revision strategies, past-paper dissection techniques, and stress management practices for high-stakes international examinations.',
    content: `The Cambridge International curriculum evaluates critical thinking and synthesis rather than memory recall. In this guide, our academic council shares four golden rules:
1. Master the command words in mark schemes (Evaluate vs Describe).
2. Establish a spaced-repetition revision timetable early.
3. Balance mental wellness with consistent sleep hygiene.
4. Utilize our teachers' weekly targeted feedback sessions.`,
    category: 'Guidance & Counseling',
    tags: ['Cambridge', 'Exams', 'Study Tips', 'Parents'],
    author: 'Prof. Junaid Iqbal',
    authorRole: 'Senior Academic Advisor',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    publishedDate: '2026-08-14',
    readTime: '5 min read',
    featuredImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    status: 'Published',
    views: 2150
  }
];

export const MOCK_GALLERY: GalleryAlbum[] = [
  {
    id: 'ALB-01',
    title: 'Annual Sports Day & Athletics Gala 2026',
    category: 'Sports',
    date: 'March 2026',
    coverImage: 'https://images.unsplash.com/photo-1576972405668-2d020a01cbfa?w=800&auto=format&fit=crop&q=80',
    photosCount: 28,
    images: [
      { url: 'https://images.unsplash.com/photo-1576972405668-2d020a01cbfa?w=800&auto=format&fit=crop&q=80', caption: 'Torch relay at the grand opening ceremony' },
      { url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80', caption: '100m Sprint Senior Boys Championship' },
      { url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80', caption: 'House march past and salute to the chief guest' }
    ]
  },
  {
    id: 'ALB-02',
    title: 'National STEM & Science Fair Showcase',
    category: 'Academic',
    date: 'May 2026',
    coverImage: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format&fit=crop&q=80',
    photosCount: 34,
    images: [
      { url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format&fit=crop&q=80', caption: 'Autonomous rover demonstrated by Grade 11 robotics cohort' },
      { url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80', caption: 'Chemical reaction and spectrometry display' }
    ]
  },
  {
    id: 'ALB-03',
    title: 'Annual Graduation Gala & Alumni Banquet',
    category: 'Ceremony',
    date: 'June 2026',
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    photosCount: 45,
    images: [
      { url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80', caption: 'Class of 2026 throwing graduation mortarboards' },
      { url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80', caption: 'Valedictorian speech delivered in the auditorium' }
    ]
  },
  {
    id: 'ALB-04',
    title: 'Art, Calligraphy & Cultural Exhibition',
    category: 'Cultural',
    date: 'April 2026',
    coverImage: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=80',
    photosCount: 22,
    images: [
      { url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=80', caption: 'Traditional Islamic calligraphy and oil paintings gallery' },
      { url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80', caption: 'Live clay sculpting workshop with guest artists' }
    ]
  }
];

export const MOCK_EVENTS: SchoolEvent[] = [
  {
    id: 'EVT-01',
    title: 'Inter-School Debating & Model United Nations (BCAMUN 2026)',
    date: '2026-10-18',
    time: '09:00 AM - 05:00 PM',
    location: 'Sir Syed Auditorium & Conference Wings',
    category: 'Academic',
    description: 'Over 40 leading schools participating across 6 simulated UN committees addressing climate resilience and geopolitical diplomacy.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    status: 'Upcoming',
    registeredCount: 320,
    organizer: 'Debating Society & Social Sciences Dept'
  },
  {
    id: 'EVT-02',
    title: 'Annual Science & Artificial Intelligence Expo 2026',
    date: '2026-11-05',
    time: '10:00 AM - 04:00 PM',
    location: 'Open Pavilion & STEM Research Labs',
    category: 'Workshops',
    description: 'Student-led innovations featuring neural network simulations, solar clean energy models, and drone mapping demos.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    status: 'Upcoming',
    registeredCount: 450,
    organizer: 'Innovation Hub'
  },
  {
    id: 'EVT-03',
    title: 'Grand Parents & Alumni Homecoming Gala',
    date: '2026-11-20',
    time: '06:00 PM - 10:00 PM',
    location: 'BCA Central Grounds & Amphitheater',
    category: 'Cultural',
    description: 'An evening celebrating our 28-year legacy with musical performances, awards, networking, and culinary stalls.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    status: 'Upcoming',
    registeredCount: 680,
    organizer: 'Alumni Association & BCA Board'
  },
  {
    id: 'EVT-04',
    title: 'Independence Day National Flag Hoisting Ceremony',
    date: '2026-08-14',
    time: '08:00 AM - 11:00 AM',
    location: 'Main Flagpole Courtyard',
    category: 'Ceremony',
    description: 'Commemorating Independence Day with national songs, parade, speeches, and inter-house tree plantation drive.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    status: 'Completed',
    registeredCount: 1100,
    organizer: 'Discipline & Welfare Council'
  }
];

export const MOCK_PAYROLL: PayrollRecord[] = [
  {
    id: 'PAY-2026-08-01',
    empId: 'EMP-9801',
    employeeName: 'Prof. Junaid Iqbal',
    role: 'Senior Physics Faculty',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    month: 'August 2026',
    basicSalary: 140000,
    allowances: 25000,
    deductions: 8000,
    tax: 7000,
    netSalary: 150000,
    paymentDate: '2026-08-31',
    status: 'Paid',
    accountNo: 'HBL-0192-882910-01'
  },
  {
    id: 'PAY-2026-08-02',
    empId: 'EMP-9804',
    employeeName: 'Ms. Ayesha Siddiqui',
    role: 'Head of English Dept',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    month: 'August 2026',
    basicSalary: 115000,
    allowances: 20000,
    deductions: 6000,
    tax: 5500,
    netSalary: 123500,
    paymentDate: '2026-08-31',
    status: 'Paid',
    accountNo: 'UBL-5541-002914-03'
  },
  {
    id: 'PAY-2026-08-03',
    empId: 'EMP-9812',
    employeeName: 'Engr. Haris Mumtaz',
    role: 'Senior Math Faculty',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    month: 'August 2026',
    basicSalary: 120000,
    allowances: 25000,
    deductions: 5000,
    tax: 6000,
    netSalary: 134000,
    paymentDate: '2026-08-31',
    status: 'Paid',
    accountNo: 'MCB-9988-123456-02'
  },
  {
    id: 'PAY-2026-08-04',
    empId: 'EMP-9799',
    employeeName: 'Dr. Nabila Bano',
    role: 'HOD Chemistry & Science',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
    month: 'August 2026',
    basicSalary: 155000,
    allowances: 30000,
    deductions: 10000,
    tax: 8500,
    netSalary: 166500,
    paymentDate: '2026-08-31',
    status: 'Paid',
    accountNo: 'Meezan-0210-994820-01'
  },
  {
    id: 'PAY-2026-08-05',
    empId: 'EMP-9825',
    employeeName: 'Mr. Salman Qadir',
    role: 'CS Faculty & Lab Lead',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    month: 'August 2026',
    basicSalary: 110000,
    allowances: 20000,
    deductions: 4000,
    tax: 5000,
    netSalary: 121000,
    paymentDate: '2026-08-31',
    status: 'Paid',
    accountNo: 'BankAlfalah-1002-394810-04'
  },
  {
    id: 'PAY-2026-08-06',
    empId: 'EMP-9800',
    employeeName: 'Capt. (R) Waqar Hashmi',
    role: 'Director Physical Education',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    month: 'August 2026',
    basicSalary: 120000,
    allowances: 20000,
    deductions: 5000,
    tax: 6000,
    netSalary: 129000,
    paymentDate: '2026-08-31',
    status: 'Paid',
    accountNo: 'Askari-3829-110293-01'
  }
];

export const MOCK_FINANCIAL_SUMMARY: FinancialSummary = {
  totalIncome: 34800000, // PKR 34.8M
  totalExpenses: 21000000, // PKR 21.0M
  netProfit: 13800000, // PKR 13.8M
  netLoss: 0,
  thisMonthIncome: 2450000, // PKR 2.45M
  thisMonthExpenses: 1620000, // PKR 1.62M
  incomeCategories: [
    { name: 'Student Tuition Fees', category: 'Student Tuition Fees', amount: 26800000, percentage: 77 },
    { name: 'New Admission Charges & Enrolment', category: 'New Admission Charges & Enrolment', amount: 4200000, percentage: 12 },
    { name: 'School Transport Services', category: 'School Transport Services', amount: 2100000, percentage: 6 },
    { name: 'Examination & Board Fees', category: 'Examination & Board Fees', amount: 1100000, percentage: 3 },
    { name: 'Cafeteria, Uniform & Bookshop Franchise', category: 'Cafeteria, Uniform & Bookshop Franchise', amount: 600000, percentage: 2 }
  ],
  expenseCategories: [
    { name: 'Faculty & Staff Salaries (Payroll)', category: 'Faculty & Staff Salaries (Payroll)', amount: 12600000, percentage: 60 },
    { name: 'Campus Lease & Facility Maintenance', category: 'Campus Lease & Facility Maintenance', amount: 3360000, percentage: 16 },
    { name: 'Electricity, Gas & Solar Utility Bills', category: 'Electricity, Gas & Solar Utility Bills', amount: 1890000, percentage: 9 },
    { name: 'Laboratories, Science & IT Equipment', category: 'Laboratories, Science & IT Equipment', amount: 1260000, percentage: 6 },
    { name: 'Transport Fleet Fuel & Maintenance', category: 'Transport Fleet Fuel & Maintenance', amount: 840000, percentage: 4 },
    { name: 'Annual Events, Sports & Co-Curricular', category: 'Annual Events, Sports & Co-Curricular', amount: 630000, percentage: 3 },
    { name: 'Stationery, Printing & Exams Material', category: 'Stationery, Printing & Exams Material', amount: 420000, percentage: 2 }
  ]
};

export const MOCK_REPORTS_LIST = [
  { id: 'REP-01', name: 'Student Enrollment & Demographics Report', type: 'Students', frequency: 'Monthly / Term', desc: 'Breakdown of active, new admissions, and alumni across all grades.' },
  { id: 'REP-02', name: 'Comprehensive Attendance Analytics Report', type: 'Attendance', frequency: 'Daily / Weekly / Monthly', desc: 'Student and faculty presence rate, leaves, late arrivals, and chronic absenteeism.' },
  { id: 'REP-03', name: 'Fee Collection & Defaulters Statement', type: 'Fees', frequency: 'Monthly', desc: 'Voucher recovery metrics, outstanding dues, concession audits, and bank reconciliations.' },
  { id: 'REP-04', name: 'Admission Pipeline & Conversion Audit', type: 'Admissions', frequency: 'Seasonal / Annual', desc: 'Status of application forms from inquiry to test, interview, and enrollment.' },
  { id: 'REP-05', name: 'Faculty Workload & Performance Summary', type: 'Staff', frequency: 'Term Wise', desc: 'Period allocation, teaching hours, extracurricular duties, and student satisfaction.' },
  { id: 'REP-06', name: 'Institutional Payroll & Tax Deduction Report', type: 'Payroll', frequency: 'Monthly', desc: 'Gross salaries, provident fund contributions, tax withholdings, and bank transfers.' },
  { id: 'REP-07', name: 'Academic Results & Class Grading Distribution', type: 'Exams', frequency: 'Term Wise', desc: 'Grade boundaries, class GPA averages, subject pass rates, and top merit ranks.' },
  { id: 'REP-08', name: 'Individual Student Growth & Progress Audit', type: 'Progress', frequency: 'Continuous', desc: 'Longitudinal learning curves, subject-wise improvements, and behavioral remarks.' },
  { id: 'REP-09', name: 'Institutional Revenue & Income Streams Report', type: 'Accounts', frequency: 'Monthly / Quarterly', desc: 'Tuition, admissions, transport, exam fees, and miscellaneous receipts.' },
  { id: 'REP-10', name: 'Operational Expenditure & Expense Voucher Audit', type: 'Accounts', frequency: 'Monthly', desc: 'Detailed breakdown of payroll, utilities, maintenance, and capital expenditures.' },
  { id: 'REP-11', name: 'Executive Profit & Loss (P&L) Fiscal Statement', type: 'Financial', frequency: 'Quarterly / Annual', desc: 'Formal financial balance sheet reflecting gross surplus, EBITDA, and net reserves.' }
];

export const MOCK_SETTINGS = {
  schoolName: 'Read Academy Sahiwal',
  tagline: 'Read To Lead • Since 2018',
  registrationNo: 'FBR/ICT/EDU-2018-0482',
  academicYear: '2026-2027',
  currentTerm: 'Term 1 (Autumn 2026)',
  workingDays: 'Monday to Friday (Saturday Half-Day for Seniors)',
  gradingSystem: [
    { grade: 'A+', minMarks: 90, maxMarks: 100, gpa: 4.0, description: 'Outstanding Academic Distinction' },
    { grade: 'A', minMarks: 80, maxMarks: 89, gpa: 3.7, description: 'Excellent Comprehension' },
    { grade: 'B', minMarks: 70, maxMarks: 79, gpa: 3.0, description: 'Good Performance' },
    { grade: 'C', minMarks: 60, maxMarks: 69, gpa: 2.0, description: 'Satisfactory Passing' },
    { grade: 'D', minMarks: 50, maxMarks: 59, gpa: 1.0, description: 'Conditional Pass' },
    { grade: 'F', minMarks: 0, maxMarks: 49, gpa: 0.0, description: 'Fail / Needs Remedial Retake' }
  ],
  feeDueDay: 15,
  lateFeePerDay: 50,
  currencySymbol: 'Rs.',
  currencyCode: 'PKR',
  notificationPreferences: {
    smsAlerts: true,
    emailReceipts: true,
    feeReminders: true,
    attendanceSms: true,
    examScheduleAlert: true
  }
};

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Dr. Kamran Qureshi',
    role: 'Parent of Grade 10 Matriculation Scholar',
    content: 'Enrolling our children at Read Academy Sahiwal has been our best parenting decision. The faculty combines rigorous academic standards with individualized mentorship that unlocked our son’s passion for science and research.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5
  },
  {
    id: 'test-2',
    name: 'Mrs. Fatima Al-Zahra',
    role: 'Parent of Grade 4 & 7 Students',
    content: 'The values-centric culture, pastoral guidance, and real-time parent portal make managing school life effortless. The teachers at Read Academy truly care about character development alongside academic excellence.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 5
  },
  {
    id: 'test-3',
    name: 'Daniyal Tariq',
    role: 'Alumnus (Class of 2023) • Now at Top University',
    content: 'The experiential science labs and debate societies at Read Academy Sahiwal gave me the analytical confidence to lead student bodies and secure competitive academic honors.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 5
  }
];

export const MOCK_DATE_SHEET: DateSheetItem[] = [
  { id: 'DS-1', examId: 'EXAM-2026-F', date: '2026-10-12', day: 'Monday', time: '08:30 AM - 11:30 AM', class: 'Grade 10', subject: 'Mathematics (Paper 1 & 2)', room: 'Hall A (Exam Wing)' },
  { id: 'DS-2', examId: 'EXAM-2026-F', date: '2026-10-14', day: 'Wednesday', time: '08:30 AM - 11:30 AM', class: 'Grade 10', subject: 'Physics (Theory)', room: 'Hall A (Exam Wing)' },
  { id: 'DS-3', examId: 'EXAM-2026-F', date: '2026-10-16', day: 'Friday', time: '08:30 AM - 11:00 AM', class: 'Grade 10', subject: 'English Language & Comp.', room: 'Hall B' },
  { id: 'DS-4', examId: 'EXAM-2026-F', date: '2026-10-19', day: 'Monday', time: '08:30 AM - 11:30 AM', class: 'Grade 10', subject: 'Chemistry (Theory & Lab)', room: 'Hall A & Lab 2' },
  { id: 'DS-5', examId: 'EXAM-2026-F', date: '2026-10-21', day: 'Wednesday', time: '08:30 AM - 11:30 AM', class: 'Grade 10', subject: 'Computer Science / Biology', room: 'Hall A & CS Lab' },
  { id: 'DS-6', examId: 'EXAM-2026-F', date: '2026-10-23', day: 'Friday', time: '08:30 AM - 10:30 AM', class: 'Grade 10', subject: 'Pakistan Studies & Islamiyat', room: 'Hall B' }
];
