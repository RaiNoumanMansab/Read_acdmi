// ==============================================================================
// READ ACADEMY CENTRAL REST API SERVICE
// Connects frontend React components directly to Node.js + PostgreSQL Backend
// Base URL: http://localhost:5000/api
// ==============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getToken = (): string | null => {
  return localStorage.getItem('read_academy_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('read_academy_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('read_academy_token');
};

export const getCurrentUser = () => {
  const userJson = localStorage.getItem('read_academy_user');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: unknown): void => {
  localStorage.setItem('read_academy_user', JSON.stringify(user));
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

// ==============================================================================
// 1. AUTHENTICATION API
// ==============================================================================
export const authApi = {
  login: async (credentials: { email: string; password: string; role?: string }) => {
    const res = await apiRequest<{ status: string; message: string; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.token) {
      setToken(res.token);
      setCurrentUser(res.user);
    }
    return res;
  },

  register: async (data: { fullName: string; email: string; phone?: string; password: string; role?: string }) => {
    return apiRequest<{ status: string; message: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMe: async () => {
    return apiRequest<{ status: string; user: any }>('/auth/me');
  },

  updateProfile: async (data: any) => {
    return apiRequest<{ status: string; message: string; user: any }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  logout: () => {
    removeToken();
    localStorage.removeItem('read_academy_user');
  },
};

// ==============================================================================
// 2. ADMIN DASHBOARD & REPORTS API
// ==============================================================================
export const adminApi = {
  getDashboard: async () => {
    return apiRequest<{ status: string; data: any }>('/admin/dashboard');
  },

  getReports: async () => {
    return apiRequest<{ status: string; data: any }>('/admin/reports');
  },
};

// ==============================================================================
// 3. STUDENTS API
// ==============================================================================
export const studentsApi = {
  getStudents: async (params?: { classId?: string; sectionId?: string; feeStatus?: string; q?: string }) => {
    const query = new URLSearchParams();
    if (params?.classId) query.append('classId', params.classId);
    if (params?.sectionId) query.append('sectionId', params.sectionId);
    if (params?.feeStatus) query.append('feeStatus', params.feeStatus);
    if (params?.q) query.append('q', params.q);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<{ status: string; count: number; data: any[] }>(`/students${qs}`);
  },

  getStudentById: async (idOrRoll: string) => {
    return apiRequest<{ status: string; data: any }>(`/students/${idOrRoll}`);
  },

  createStudent: async (studentData: any) => {
    return apiRequest<{ status: string; message: string; data: any }>('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },

  updateStudent: async (id: string, updateData: any) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  deleteStudent: async (id: string) => {
    return apiRequest<{ status: string; message: string }>(`/students/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==============================================================================
// 4. ADMISSIONS API
// ==============================================================================
export const admissionsApi = {
  getAdmissions: async (params?: { status?: string; classId?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.classId) query.append('classId', params.classId);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<{ status: string; count: number; data: any[] }>(`/admissions${qs}`);
  },

  submitAdmission: async (applicationData: any) => {
    return apiRequest<{ status: string; message: string; data: any }>('/admissions', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  },

  updateStatus: async (
    id: string,
    status: string,
    adminNotes?: string,
    feeDetails?: {
      tuitionFee?: number;
      admissionFee?: number;
      examFee?: number;
      labFee?: number;
      utilityCharges?: number;
      dueDate?: string;
    }
  ) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/admissions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, adminNotes, ...(feeDetails || {}) }),
    });
  },

  deleteAdmission: async (id: string) => {
    return apiRequest<{ status: string; message: string }>(`/admissions/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==============================================================================
// 5. TEACHERS & FACULTY API
// ==============================================================================
export const teachersApi = {
  getTeachers: async (params?: { department?: string; status?: string; q?: string }) => {
    const query = new URLSearchParams();
    if (params?.department) query.append('department', params.department);
    if (params?.status) query.append('status', params.status);
    if (params?.q) query.append('q', params.q);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<{ status: string; count: number; data: any[] }>(`/teachers${qs}`);
  },

  getTeacherById: async (id: string) => {
    return apiRequest<{ status: string; data: any }>(`/teachers/${id}`);
  },

  createTeacher: async (teacherData: any) => {
    return apiRequest<{ status: string; message: string; data: any }>('/teachers', {
      method: 'POST',
      body: JSON.stringify(teacherData),
    });
  },

  updateTeacher: async (id: string, updateData: any) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  deleteTeacher: async (id: string) => {
    return apiRequest<{ status: string; message: string }>(`/teachers/${id}`, {
      method: 'DELETE',
    });
  },

  assignDuty: async (teacherId: string, dutyData: { dutyTitle: string; description?: string }) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/teachers/${teacherId}/duties`, {
      method: 'POST',
      body: JSON.stringify(dutyData),
    });
  },

  updateDuty: async (dutyId: string, dutyData: any) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/teachers/duties/${dutyId}`, {
      method: 'PATCH',
      body: JSON.stringify(dutyData),
    });
  },

  deleteDuty: async (dutyId: string) => {
    return apiRequest<{ status: string; message: string }>(`/teachers/duties/${dutyId}`, {
      method: 'DELETE',
    });
  },

  createPayroll: async (teacherId: string, payrollData: any) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/teachers/${teacherId}/payroll`, {
      method: 'POST',
      body: JSON.stringify(payrollData),
    });
  },

  updatePayroll: async (payrollId: string, payrollData: any) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/teachers/payroll/${payrollId}`, {
      method: 'PATCH',
      body: JSON.stringify(payrollData),
    });
  },

  deletePayroll: async (payrollId: string) => {
    return apiRequest<{ status: string; message: string }>(`/teachers/payroll/${payrollId}`, {
      method: 'DELETE',
    });
  },
};

// ==============================================================================
// 6. ACADEMICS API (Classes, Sections, Subjects, Timetable)
// ==============================================================================
export const academicsApi = {
  getClasses: async () => {
    return apiRequest<{ status: string; count: number; data: any[] }>('/academics/classes');
  },

  createClass: async (data: { name: string; numericLevel: number; capacity?: number }) => {
    return apiRequest<{ status: string; message: string; data: any }>('/academics/classes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getSections: async (classId?: string) => {
    const qs = classId ? `?classId=${classId}` : '';
    return apiRequest<{ status: string; count: number; data: any[] }>(`/academics/sections${qs}`);
  },

  createSection: async (data: { classId: string; name: string; roomNumber?: string; classTeacherId?: string }) => {
    return apiRequest<{ status: string; message: string; data: any }>('/academics/sections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getSubjects: async () => {
    return apiRequest<{ status: string; count: number; data: any[] }>('/academics/subjects');
  },

  createSubject: async (data: { code: string; name: string; department: string; weeklyPeriods?: number }) => {
    return apiRequest<{ status: string; message: string; data: any }>('/academics/subjects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getClassSubjects: async (params?: { classId?: string; sectionId?: string; teacherId?: string }) => {
    const query = new URLSearchParams();
    if (params?.classId) query.append('classId', params.classId);
    if (params?.sectionId) query.append('sectionId', params.sectionId);
    if (params?.teacherId) query.append('teacherId', params.teacherId);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<{ status: string; count: number; data: any[] }>(`/academics/class-subjects${qs}`);
  },

  assignClassSubject: async (data: { classId: string; sectionId: string; subjectId: string; teacherId: string; weeklyPeriods?: number }) => {
    return apiRequest<{ status: string; message: string; data: any }>('/academics/class-subjects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getTimetable: async (params?: { classId?: string; sectionId?: string; dayOfWeek?: string }) => {
    const query = new URLSearchParams();
    if (params?.classId) query.append('classId', params.classId);
    if (params?.sectionId) query.append('sectionId', params.sectionId);
    if (params?.dayOfWeek) query.append('dayOfWeek', params.dayOfWeek);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<{ status: string; count: number; data: any[] }>(`/academics/timetable${qs}`);
  },

  saveTimetableSlot: async (slotData: any) => {
    return apiRequest<{ status: string; message: string; data: any }>('/academics/timetable', {
      method: 'POST',
      body: JSON.stringify(slotData),
    });
  },

  deleteTimetableSlot: async (id: string) => {
    return apiRequest<{ status: string; message: string }>(`/academics/timetable/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==============================================================================
// 7. ATTENDANCE API
// ==============================================================================
export const attendanceApi = {
  getStudentAttendance: async (params?: { date?: string; classId?: string; sectionId?: string }) => {
    const query = new URLSearchParams();
    if (params?.date) query.append('date', params.date);
    if (params?.classId) query.append('classId', params.classId);
    if (params?.sectionId) query.append('sectionId', params.sectionId);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<{ status: string; count: number; date: string; data: any[] }>(`/attendance/students${qs}`);
  },

  markBulkAttendance: async (date: string, records: Array<{ studentId: string; status: string; remarks?: string }>) => {
    return apiRequest<{ status: string; message: string; date: string }>('/attendance/students/bulk', {
      method: 'POST',
      body: JSON.stringify({ date, records }),
    });
  },

  getTeacherAttendance: async (date?: string) => {
    const qs = date ? `?date=${date}` : '';
    return apiRequest<{ status: string; count: number; date: string; data: any[] }>(`/attendance/teachers${qs}`);
  },

  markTeacherAttendance: async (data: { teacherId: string; date?: string; status?: string; checkIn?: string; checkOut?: string }) => {
    return apiRequest<{ status: string; message: string; data: any }>('/attendance/teachers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ==============================================================================
// 8. EXAMINATIONS & MARKS API
// ==============================================================================
export const examsApi = {
  getExams: async () => {
    return apiRequest<{ status: string; count: number; data: any[] }>('/exams');
  },

  createExam: async (examData: { title: string; term: string; academicYear: string; startDate: string; endDate: string; status?: string }) => {
    return apiRequest<{ status: string; message: string; data: any }>('/exams', {
      method: 'POST',
      body: JSON.stringify(examData),
    });
  },

  getDatesheet: async (examId: string, classId?: string) => {
    const qs = classId ? `?classId=${classId}` : '';
    return apiRequest<{ status: string; count: number; data: any[] }>(`/exams/${examId}/datesheet${qs}`);
  },

  addDatesheetItem: async (examId: string, itemData: any) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/exams/${examId}/datesheet`, {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  getMarks: async (examId: string, params?: { subjectId?: string; classId?: string; studentId?: string }) => {
    const query = new URLSearchParams();
    if (params?.subjectId) query.append('subjectId', params.subjectId);
    if (params?.classId) query.append('classId', params.classId);
    if (params?.studentId) query.append('studentId', params.studentId);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<{ status: string; count: number; data: any[] }>(`/exams/${examId}/marks${qs}`);
  },

  submitBulkMarks: async (examId: string, payload: { subjectId: string; totalMarks?: number; entries: Array<{ studentId: string; obtainedMarks: number; remarks?: string }> }) => {
    return apiRequest<{ status: string; message: string }>(`/exams/${examId}/marks/bulk`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateExam: async (id: string, data: any) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/exams/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteExam: async (id: string) => {
    return apiRequest<{ status: string; message: string }>(`/exams/${id}`, {
      method: 'DELETE',
    });
  },

  updateDatesheetItem: async (examId: string, itemId: string, data: any) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/exams/${examId}/datesheet/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteDatesheetItem: async (examId: string, itemId: string) => {
    return apiRequest<{ status: string; message: string }>(`/exams/${examId}/datesheet/${itemId}`, {
      method: 'DELETE',
    });
  },
};

// ==============================================================================
// 9. HOMEWORK API
// ==============================================================================
export const homeworkApi = {
  getHomework: async (params?: { classId?: string; sectionId?: string; subjectId?: string; teacherId?: string }) => {
    const query = new URLSearchParams();
    if (params?.classId) query.append('classId', params.classId);
    if (params?.sectionId) query.append('sectionId', params.sectionId);
    if (params?.subjectId) query.append('subjectId', params.subjectId);
    if (params?.teacherId) query.append('teacherId', params.teacherId);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<{ status: string; count: number; data: any[] }>(`/homework${qs}`);
  },

  createHomework: async (homeworkData: any) => {
    return apiRequest<{ status: string; message: string; data: any }>('/homework', {
      method: 'POST',
      body: JSON.stringify(homeworkData),
    });
  },

  getSubmissions: async (homeworkId: string) => {
    return apiRequest<{ status: string; count: number; data: any[] }>(`/homework/${homeworkId}/submissions`);
  },

  submitHomework: async (homeworkId: string, data: { studentId: string; submissionText?: string; attachmentUrl?: string }) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/homework/${homeworkId}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  gradeSubmission: async (submissionId: string, data: { teacherFeedback?: string; marksObtained?: number }) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/homework/submissions/${submissionId}/grade`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  updateHomework: async (id: string, data: any) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/homework/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteHomework: async (id: string) => {
    return apiRequest<{ status: string; message: string }>(`/homework/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==============================================================================
// 10. FEES & ACCOUNTS API
// ==============================================================================
export const feesApi = {
  getVouchers: async (params?: { billingMonth?: string; status?: string; studentId?: string; classId?: string }) => {
    const query = new URLSearchParams();
    if (params?.billingMonth) query.append('billingMonth', params.billingMonth);
    if (params?.status) query.append('status', params.status);
    if (params?.studentId) query.append('studentId', params.studentId);
    if (params?.classId) query.append('classId', params.classId);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<{ status: string; count: number; data: any[] }>(`/fees/vouchers${qs}`);
  },

  getVoucherById: async (idOrVoucher: string) => {
    return apiRequest<{ status: string; data: any }>(`/fees/vouchers/${idOrVoucher}`);
  },

  createVoucher: async (data: {
    studentId: string;
    billingMonth?: string;
    tuitionFee: number;
    admissionFee?: number;
    examFee?: number;
    labFee?: number;
    utilityCharges?: number;
    lateFine?: number;
    dueDate?: string;
  }) => {
    return apiRequest<{ status: string; message: string; data: any }>('/fees/vouchers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  generateClassVouchers: async (data: { classId: string; billingMonth: string; tuitionFee: number; examFee?: number; labFee?: number; utilityCharges?: number; dueDate: string }) => {
    return apiRequest<{ status: string; message: string; data: any[] }>('/fees/vouchers/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  payVoucher: async (voucherId: string, data?: { paymentMethod?: string; paidDate?: string }) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/fees/vouchers/${voucherId}/pay`, {
      method: 'PATCH',
      body: JSON.stringify(data || {}),
    });
  },

  getTransactions: async (params?: { type?: string; category?: string }) => {
    const query = new URLSearchParams();
    if (params?.type) query.append('type', params.type);
    if (params?.category) query.append('category', params.category);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<{ status: string; count: number; data: any[] }>(`/fees/transactions${qs}`);
  },

  recordTransaction: async (data: { title: string; type: string; category: string; amount: number; referenceNo?: string; transactionDate?: string }) => {
    return apiRequest<{ status: string; message: string; data: any }>('/fees/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateTransaction: async (id: string, data: any) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/fees/transactions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteTransaction: async (id: string) => {
    return apiRequest<{ status: string; message: string }>(`/fees/transactions/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==============================================================================
// 11. CMS & WEBSITE API (Notices, Blogs, Gallery, Events, Contact)
// ==============================================================================
export const cmsApi = {
  getNotices: async (params?: { priority?: string; audience?: string }) => {
    const query = new URLSearchParams();
    if (params?.priority) query.append('priority', params.priority);
    if (params?.audience) query.append('audience', params.audience);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<{ status: string; count: number; data: any[] }>(`/cms/notices${qs}`);
  },

  publishNotice: async (data: { title: string; content: string; category: string; priority?: string; audience?: string; pinned?: boolean }) => {
    return apiRequest<{ status: string; message: string; data: any }>('/cms/notices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateNotice: async (id: string, data: any) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/cms/notices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteNotice: async (id: string) => {
    return apiRequest<{ status: string; message: string }>(`/cms/notices/${id}`, {
      method: 'DELETE',
    });
  },

  getBlogs: async () => {
    return apiRequest<{ status: string; count: number; data: any[] }>('/cms/blogs');
  },

  getBlogBySlug: async (slug: string) => {
    return apiRequest<{ status: string; data: any }>(`/cms/blogs/${slug}`);
  },

  publishBlog: async (data: { title: string; excerpt?: string; content: string; category: string; tags?: string[]; featuredImage?: string }) => {
    return apiRequest<{ status: string; message: string; data: any }>('/cms/blogs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateBlog: async (id: string, data: any) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/cms/blogs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteBlog: async (id: string) => {
    return apiRequest<{ status: string; message: string }>(`/cms/blogs/${id}`, {
      method: 'DELETE',
    });
  },

  getGallery: async () => {
    return apiRequest<{ status: string; count: number; data: any[] }>('/cms/gallery');
  },

  createAlbum: async (data: { title: string; category: string; coverUrl?: string; eventDate?: string }) => {
    return apiRequest<{ status: string; message: string; data: any }>('/cms/gallery/albums', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateAlbum: async (id: string, data: any) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/cms/gallery/albums/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteAlbum: async (id: string) => {
    return apiRequest<{ status: string; message: string }>(`/cms/gallery/albums/${id}`, {
      method: 'DELETE',
    });
  },

  addImageToAlbum: async (albumId: string, data: { imageUrl: string; caption?: string; sortOrder?: number }) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/cms/gallery/albums/${albumId}/images`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getEvents: async () => {
    return apiRequest<{ status: string; count: number; data: any[] }>('/cms/events');
  },

  scheduleEvent: async (data: { title: string; category: string; eventDate: string; eventTime?: string; location?: string; description?: string; bannerImage?: string; isPublic?: boolean }) => {
    return apiRequest<{ status: string; message: string; data: any }>('/cms/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateEvent: async (id: string, data: any) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/cms/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteEvent: async (id: string) => {
    return apiRequest<{ status: string; message: string }>(`/cms/events/${id}`, {
      method: 'DELETE',
    });
  },

  submitContact: async (data: { fullName: string; email: string; phone?: string; subject?: string; message: string }) => {
    return apiRequest<{ status: string; message: string; data: any }>('/cms/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getContactInquiries: async () => {
    return apiRequest<{ status: string; count: number; data: any[] }>('/cms/contact');
  },
};

// ==============================================================================
// 14. CAREERS & JOBS API
// ==============================================================================
export const jobsApi = {
  getJobs: async (params?: { department?: string; jobType?: string; status?: string; publicOnly?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.department) query.append('department', params.department);
    if (params?.jobType) query.append('jobType', params.jobType);
    if (params?.status) query.append('status', params.status);
    if (params?.publicOnly !== undefined) query.append('publicOnly', String(params.publicOnly));

    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<{ status: string; count: number; data: any[] }>(`/jobs${qs}`);
  },

  getJobById: async (id: string) => {
    return apiRequest<{ status: string; data: any }>(`/jobs/${id}`);
  },

  createJob: async (data: any) => {
    return apiRequest<{ status: string; message: string; data: any }>('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateJob: async (id: string, data: any) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteJob: async (id: string) => {
    return apiRequest<{ status: string; message: string }>(`/jobs/${id}`, {
      method: 'DELETE',
    });
  },

  applyForJob: async (data: any) => {
    return apiRequest<{ status: string; message: string; data: any }>('/jobs/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getApplications: async (params?: { status?: string; jobId?: string; q?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.jobId) query.append('jobId', params.jobId);
    if (params?.q) query.append('q', params.q);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<{ status: string; count: number; data: any[] }>(`/jobs/applications/all${qs}`);
  },

  updateApplicationStatus: async (id: string, data: { status: string; interviewDate?: string; adminNotes?: string; enrollAsTeacher?: boolean; basicSalary?: number }) => {
    return apiRequest<{ status: string; message: string; data: any }>(`/jobs/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteApplication: async (id: string) => {
    return apiRequest<{ status: string; message: string }>(`/jobs/applications/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==============================================================================
// 14. INSTITUTIONAL SETTINGS & TESTIMONIALS API
// ==============================================================================
export const settingsApi = {
  getSettings: async () => {
    return apiRequest<{ status: string; data: Record<string, string> }>('/settings');
  },

  updateSettings: async (settings: Record<string, string>) => {
    return apiRequest<{ status: string; message: string; data: Record<string, string> }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  getTestimonials: async () => {
    return apiRequest<{ status: string; data: any[] }>('/settings/testimonials');
  },

  createTestimonial: async (data: { name: string; role: string; content: string; avatar?: string; rating?: number }) => {
    return apiRequest<{ status: string; message: string; data: any }>('/settings/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

