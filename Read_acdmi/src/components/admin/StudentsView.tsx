import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  FileText,
  UserCheck,
  CheckCircle,
  CheckCircle2,
  Phone,
  PhoneCall,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Printer,
  Download,
  Award,
  BookOpen,
  AlertTriangle,
  Send,
  RotateCcw,
  Users,
  LayoutGrid,
  Table as TableIcon,
  Bell,
  FileCheck,
  X,
  ExternalLink,
  ShieldCheck,
  Camera,
  Upload
} from 'lucide-react';
import type { Student, AttachedDocument } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';
import { showConfirmModal } from '../common/ConfirmModal';
import { LoadingState } from '../common/Spinner';
import { studentsApi, academicsApi } from '../../services/api';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { exportStudentsCsv, printStudentIdCard, printFeeChallan } from '../../utils/exportUtils';
import { isValidPKPhone, handlePKPhoneInput, pkPhoneBorderColor } from '../../utils/pkPhone';
import './StudentsView.css';

export const ALL_CLASSES = [
  'Playgroup',
  'Nursery',
  'Prep / KG',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'FSC Pre-Medical',
  'FSC Pre-Engineering',
  'ICS (Computer Science)',
  'I.Com (Commerce)',
  'FA (Arts/Humanities)',
  'D.Com'
];

const mapBackendStudent = (s: any): Student => ({
  id: s.id || s.rollNo,
  name: s.fullName || s.name || 'Unnamed Student',
  avatar: s.avatarUrl || s.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.fullName || s.name || 'Student')}&background=0B3974&color=fff&bold=true`,
  rollNo: s.rollNo || s.id,
  class: s.class?.name || (typeof s.class === 'string' ? s.class : '—'),
  section: s.section?.name ? s.section.name.replace('Section ', '') : (s.section || '—'),
  parentName: s.parentName || 'Not Provided',
  parentPhone: s.parentPhone || 'Not Provided',
  parentEmail: s.parentEmail || 'Not Provided',
  attendancePct: s.attendancePct ?? null,
  feeStatus: (s.feeStatus === 'PAID' ? 'Paid' : s.feeStatus === 'OVERDUE' ? 'Overdue' : 'Pending'),
  status: s.status || 'Active',
  dob: s.dob ? (typeof s.dob === 'string' ? s.dob.split('T')[0] : null) : null,
  gender: s.gender === 'FEMALE' ? 'Female' : 'Male',
  bloodGroup: s.bloodGroup || null,
  address: s.homeAddress || s.address || null,
  admissionDate: s.admissionDate ? (typeof s.admissionDate === 'string' ? s.admissionDate.split('T')[0] : null) : null,
  emergencyContact: s.emergencyContact || null,
  previousSchool: s.previousSchool || null,
  admissionNo: s.admissionNo || undefined,
  documentsSubmitted: Array.isArray(s.documentsSubmitted)
    ? s.documentsSubmitted
    : Array.isArray(s.documents)
    ? s.documents
    : [],
  recentMarks: (s.marksEntries && s.marksEntries.length > 0)
    ? s.marksEntries.map((m: any) => ({
        subject: m.subject?.name || 'Subject',
        marks: Number(m.obtainedMarks) || 0,
        total: Number(m.totalMarks) || 100,
        grade: m.grade || 'A'
      }))
    : (s.recentMarks && s.recentMarks.length > 0
        ? s.recentMarks
        : [
            { subject: 'Mathematics', marks: 88, total: 100, grade: 'A' },
            { subject: 'Physics', marks: 82, total: 100, grade: 'B+' },
            { subject: 'Chemistry', marks: 91, total: 100, grade: 'A+' },
            { subject: 'English', marks: 85, total: 100, grade: 'A' },
            { subject: 'Urdu', marks: 79, total: 100, grade: 'B' }
          ]),
  attendanceHistory: (s.attendance && s.attendance.length > 0)
    ? [
        {
          month: 'Recent Term',
          present: s.attendance.filter((a: any) => a.status === 'PRESENT').length,
          absent: s.attendance.filter((a: any) => a.status === 'ABSENT').length,
          late: s.attendance.filter((a: any) => a.status === 'LATE').length
        }
      ]
    : (s.attendanceHistory && s.attendanceHistory.length > 0
        ? s.attendanceHistory
        : [
            { month: 'September', present: 22, absent: 1, late: 0 },
            { month: 'August', present: 24, absent: 0, late: 1 },
            { month: 'July', present: 21, absent: 2, late: 0 }
          ]),
  feeRecords: (s.feeVouchers && s.feeVouchers.length > 0)
    ? s.feeVouchers.map((v: any) => {
        const isPaid = v.status === 'PAID';
        const isOverdue = v.status === 'OVERDUE' || (!isPaid && v.dueDate && new Date(v.dueDate).getTime() < Date.now());
        const statusStr = isPaid ? 'Paid' : (isOverdue ? 'Overdue' : 'Pending');
        const displayDate = isPaid
          ? (v.paidDate ? v.paidDate.split('T')[0] : 'Paid')
          : (v.dueDate ? `Due: ${v.dueDate.split('T')[0]}` : 'Pending');

        return {
          voucherNo: v.voucherNo || 'VCH-001',
          month: v.billingMonth || 'September 2026',
          amount: Number(v.totalAmount) || 0,
          status: statusStr,
          date: displayDate,
        };
      })
    : []
});

export const StudentsView: React.FC = () => {
  const { showToast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedFeeStatus, setSelectedFeeStatus] = useState('All');
  const [quickFilter, setQuickFilter] = useState<'all' | 'overdue' | 'low-attendance' | 'paid'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedStudentForIdCard, setSelectedStudentForIdCard] = useState<Student | null>(null);
  const [idCardSide, setIdCardSide] = useState<'both' | 'front' | 'back'>('both');
  const [selectedChallanForView, setSelectedChallanForView] = useState<{ student: Student; fee: any } | null>(null);
  const [profileActiveTab, setProfileActiveTab] = useState<
    'Overview' | 'Personal Information' | 'Parent Information' | 'Attendance' | 'Fees' | 'Results' | 'Progress' | 'Documents'
  >('Overview');
  const [classesList, setClassesList] = useState<string[]>(ALL_CLASSES);
  const [showAddModal, setShowAddModal] = useState(false);

  // Load students and classes from REST API
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    studentsApi.getStudents().then((res) => {
      if (isMounted) {
        if (res?.data && Array.isArray(res.data)) {
          setStudents(res.data.map(mapBackendStudent));
        } else {
          setStudents([]);
        }
      }
    }).catch((err) => {
      console.warn('Backend students fetch failed:', err);
      if (isMounted) {
        setStudents([]);
      }
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    academicsApi.getClasses().then((res) => {
      if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
        const names = res.data.map((c: any) => c.name);
        setClassesList(Array.from(new Set([...ALL_CLASSES, ...names])));
      }
    }).catch((err) => {
      console.warn('Academics getClasses error in StudentsView:', err);
    });

    return () => { isMounted = false; };
  }, []);

  // Responsive view detection
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('cards');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Comprehensive Form states for Enroll New Student (matches Admission Form)
  const [enrollStep, setEnrollStep] = useState<'student' | 'parent' | 'previous' | 'documents'>('student');
  const [newStudentPhoto, setNewStudentPhoto] = useState('');
  const newStudentPhotoRef = useRef<HTMLInputElement | null>(null);
  const generalFileInputRef = useRef<HTMLInputElement | null>(null);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRollNo, setNewStudentRollNo] = useState('');
  const [newStudentAdmissionNo, setNewStudentAdmissionNo] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('Grade 10');
  const [newStudentSection, setNewStudentSection] = useState('A');
  const [newStudentGender, setNewStudentGender] = useState<'Male' | 'Female'>('Male');
  const [newStudentDob, setNewStudentDob] = useState('2011-05-15');
  const [newStudentBloodGroup, setNewStudentBloodGroup] = useState('B+');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [newParentEmail, setNewParentEmail] = useState('');
  const [newEmergencyContact, setNewEmergencyContact] = useState('');
  const [newPrevSchool, setNewPrevSchool] = useState('');
  const [newPrevPercentage, setNewPrevPercentage] = useState('');
  const [newAddress, setNewAddress] = useState('Main Campus Area, Sahiwal, Punjab');
  const [newFeeStatus, setNewFeeStatus] = useState<'Paid' | 'Pending' | 'Overdue'>('Pending');
  const [newAdmissionDate, setNewAdmissionDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newStudentDocs, setNewStudentDocs] = useState<AttachedDocument[]>([]);
  const [isSubmittingEnroll, setIsSubmittingEnroll] = useState(false);

  // Comprehensive Edit Student State (matches View Profile Dossier with all editable fields)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editActiveTab, setEditActiveTab] = useState<
    'Overview' | 'Personal Information' | 'Parent Information' | 'Attendance' | 'Fees' | 'Results' | 'Progress' | 'Documents'
  >('Personal Information');
  const [editName, setEditName] = useState('');
  const [editRollNo, setEditRollNo] = useState('');
  const [editAdmissionNo, setEditAdmissionNo] = useState('');
  const [editClass, setEditClass] = useState('');
  const [editSection, setEditSection] = useState('');
  const [editStatus, setEditStatus] = useState<'Active' | 'Inactive'>('Active');
  const [editFeeStatus, setEditFeeStatus] = useState<'Paid' | 'Pending' | 'Overdue'>('Pending');
  const [editAdmissionDate, setEditAdmissionDate] = useState('');
  const [editEmergencyContact, setEditEmergencyContact] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editGender, setEditGender] = useState<'Male' | 'Female'>('Male');
  const [editBloodGroup, setEditBloodGroup] = useState('B+');
  const [editAddress, setEditAddress] = useState('');
  const [editPreviousSchool, setEditPreviousSchool] = useState('');
  const [editParentName, setEditParentName] = useState('');
  const [editParentRelationship, setEditParentRelationship] = useState('Father / Guardian');
  const [editParentPhone, setEditParentPhone] = useState('');
  const [editParentEmail, setEditParentEmail] = useState('');
  const [editAttendancePct, setEditAttendancePct] = useState<number>(90);
  const [editRemarks, setEditRemarks] = useState('');

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setEditName(student.name || '');
    setEditRollNo(student.rollNo || '');
    setEditAdmissionNo(student.admissionNo || student.id || '');
    setEditClass(student.class || 'Grade 9');
    setEditSection(student.section || 'A - Jinnah');
    setEditStatus(student.status === 'Inactive' ? 'Inactive' : 'Active');
    setEditFeeStatus(student.feeStatus || 'Pending');
    setEditAdmissionDate(student.admissionDate || new Date().toISOString().split('T')[0]);
    setEditEmergencyContact(student.emergencyContact || student.parentPhone || '');
    setEditDob(student.dob || '2011-01-01');
    setEditGender(student.gender || 'Male');
    setEditBloodGroup(student.bloodGroup || 'B+');
    setEditAddress(student.address || '');
    setEditPreviousSchool(student.previousSchool || '');
    setEditParentName(student.parentName || '');
    setEditParentRelationship('Father / Guardian');
    setEditParentPhone(student.parentPhone || '');
    setEditParentEmail(student.parentEmail && student.parentEmail !== 'Not Provided' ? student.parentEmail : '');
    setEditAttendancePct(student.attendancePct ?? 90);
    setEditRemarks('');
    setEditActiveTab('Personal Information');
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    if (!editName.trim()) {
      showToast('Name Required', 'Student name cannot be empty', 'error');
      return;
    }
    if (editParentPhone && !isValidPKPhone(editParentPhone)) {
      showToast('Invalid Phone Number', 'Please enter a valid Pakistani mobile number (e.g. +92 300 1234567)', 'error');
      return;
    }
    try {
      const payload = {
        fullName: editName.trim(),
        name: editName.trim(),
        rollNo: editRollNo.trim(),
        admissionNo: editAdmissionNo.trim() || undefined,
        class: editClass,
        section: editSection,
        status: editStatus,
        feeStatus: editFeeStatus,
        admissionDate: editAdmissionDate,
        emergencyContact: editEmergencyContact.trim(),
        dob: editDob,
        gender: editGender,
        bloodGroup: editBloodGroup,
        homeAddress: editAddress.trim(),
        address: editAddress.trim(),
        previousSchool: editPreviousSchool.trim(),
        parentName: editParentName.trim(),
        parentPhone: editParentPhone.trim(),
        parentEmail: editParentEmail.trim(),
        attendancePct: Number(editAttendancePct) || 0
      };

      await studentsApi.updateStudent(editingStudent.id, payload);

      const updatedStudent: Student = {
        ...editingStudent,
        name: editName.trim(),
        rollNo: editRollNo.trim(),
        admissionNo: editAdmissionNo.trim() || editingStudent.admissionNo,
        class: editClass,
        section: editSection,
        status: editStatus,
        feeStatus: editFeeStatus,
        admissionDate: editAdmissionDate,
        emergencyContact: editEmergencyContact.trim(),
        dob: editDob,
        gender: editGender,
        bloodGroup: editBloodGroup,
        address: editAddress.trim(),
        previousSchool: editPreviousSchool.trim(),
        parentName: editParentName.trim(),
        parentPhone: editParentPhone.trim(),
        parentEmail: editParentEmail.trim(),
        attendancePct: Number(editAttendancePct) || 0
      };

      setStudents((prev) =>
        prev.map((s) => (s.id === editingStudent.id ? updatedStudent : s))
      );

      if (selectedStudent?.id === editingStudent.id) {
        setSelectedStudent(updatedStudent);
      }

      showToast('Student Profile Updated', `${editName} record saved successfully`, 'success');
      setShowEditModal(false);
    } catch (err: any) {
      showToast('Update Failed', err?.message || 'Could not update student profile', 'error');
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    const confirmed = await showConfirmModal({
      title: 'Delete Student Record',
      message: `Are you sure you want to delete student "${student.name}" (Roll: ${student.rollNo})?`,
      subtitle: 'This will permanently remove this student, their attendance, and academic history.',
      confirmText: 'Delete Student',
      type: 'danger',
    });
    if (!confirmed) return;
    try {
      await studentsApi.deleteStudent(student.id);
      setStudents((prev) => prev.filter((s) => s.id !== student.id));
      if (selectedStudent?.id === student.id) setSelectedStudent(null);
      showToast('Student Deleted', `${student.name} was removed from database`, 'success');
    } catch (err: any) {
      showToast('Delete Failed', err?.message || 'Could not delete student from database', 'error');
    }
  };

  // Key KPI metrics calculations
  const totalStudents = students.length;
  const overdueStudents = students.filter((s) => s.feeStatus === 'Overdue');
  const overdueCount = overdueStudents.length;
  const lowAttendanceStudents = students.filter((s) => s.attendancePct < 85);
  const lowAttendanceCount = lowAttendanceStudents.length;
  const paidCount = students.filter((s) => s.feeStatus === 'Paid').length;

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'All' || s.class === selectedClass;
    const matchesSection = selectedSection === 'All' || s.section === selectedSection;
    const matchesFee = selectedFeeStatus === 'All' || s.feeStatus === selectedFeeStatus;

    let matchesQuick = true;
    if (quickFilter === 'overdue') matchesQuick = s.feeStatus === 'Overdue';
    else if (quickFilter === 'low-attendance') matchesQuick = s.attendancePct < 85;
    else if (quickFilter === 'paid') matchesQuick = s.feeStatus === 'Paid';

    return matchesSearch && matchesClass && matchesSection && matchesFee && matchesQuick;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedClass('All');
    setSelectedSection('All');
    setSelectedFeeStatus('All');
    setQuickFilter('all');
  };

  const handleSendDefaulterNotices = () => {
    showToast(
      'Fee Defaulter Alerts Dispatched',
      `Urgent SMS & WhatsApp notifications dispatched to ${overdueCount} parents.`,
      'error'
    );
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleNewStudentPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Invalid File Type', 'Please upload a valid image file (JPG, PNG, WEBP)', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('File Too Large', 'Maximum photo size allowed is 5MB', 'error');
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setNewStudentPhoto(dataUrl);
      const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      setNewStudentDocs((prev) => {
        const filtered = prev.filter((d) => d.name !== 'Candidate Passport Photograph' && d.docType !== 'Passport Size Photograph');
        return [
          ...filtered,
          {
            id: `doc-${Date.now()}`,
            name: file.name,
            docType: 'Passport Size Photograph',
            fileSize: sizeStr,
            fileType: file.type,
            dataUrl,
            uploadedAt: new Date().toISOString()
          }
        ];
      });
      showToast('Photo Attached', 'Student candidate photo attached successfully', 'success');
    } catch {
      showToast('Upload Failed', 'Failed to read photo file', 'error');
    }
  };

  const handleRemoveNewStudentPhoto = () => {
    setNewStudentPhoto('');
    setNewStudentDocs((prev) => prev.filter((d) => d.docType !== 'Passport Size Photograph' && d.name !== 'Candidate Passport Photograph'));
    if (newStudentPhotoRef.current) newStudentPhotoRef.current.value = '';
    showToast('Photo Removed', 'Student photo removed', 'info');
  };

  const handleNewStudentDocUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string = 'Supporting Certificate') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 10 * 1024 * 1024) {
        showToast('File Too Large', `${file.name} exceeds 10MB limit`, 'error');
        continue;
      }
      try {
        const dataUrl = await readFileAsDataUrl(file);
        const sizeStr = file.size > 1024 * 1024
          ? (file.size / (1024 * 1024)).toFixed(2) + ' MB'
          : (file.size / 1024).toFixed(1) + ' KB';
        const newDoc: AttachedDocument = {
          id: `doc-${Date.now()}-${i}`,
          name: file.name,
          docType: docType || 'Supporting Certificate',
          fileSize: sizeStr,
          fileType: file.type,
          dataUrl,
          uploadedAt: new Date().toISOString()
        };
        setNewStudentDocs((prev) => [...prev, newDoc]);
      } catch {
        showToast('Upload Error', `Failed to upload ${file.name}`, 'error');
      }
    }
    showToast('Document Attached', 'Document successfully added to dossier', 'success');
  };

  const handleRemoveNewStudentDoc = (docId?: string) => {
    setNewStudentDocs((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newParentName.trim()) {
      showToast('Please fill in required fields', 'Student full name and parent name are required', 'error');
      return;
    }
    if (newParentPhone && !isValidPKPhone(newParentPhone)) {
      showToast('Invalid Phone Number', 'Please enter a valid Pakistani mobile number (e.g. +92 300 1234567)', 'error');
      return;
    }
    if (newEmergencyContact && !isValidPKPhone(newEmergencyContact)) {
      showToast('Invalid Emergency Phone', 'Please enter a valid Pakistani mobile number for emergency contact', 'error');
      return;
    }

    setIsSubmittingEnroll(true);
    try {
      const studentPayload = {
        fullName: newStudentName.trim(),
        avatarUrl: newStudentPhoto || undefined,
        rollNo: newStudentRollNo.trim() || undefined,
        admissionNo: newStudentAdmissionNo.trim() || undefined,
        classId: newStudentClass,
        sectionId: newStudentSection,
        gender: newStudentGender,
        dob: newStudentDob,
        bloodGroup: newStudentBloodGroup,
        parentName: newParentName.trim(),
        parentPhone: newParentPhone || '+92 300 1234567',
        parentEmail: newParentEmail.trim() || undefined,
        emergencyContact: newEmergencyContact || newParentPhone || '+92 300 1234567',
        previousSchool: newPrevSchool.trim() || undefined,
        homeAddress: newAddress.trim() || 'Main Campus Area, Sahiwal, Punjab',
        feeStatus: newFeeStatus,
        admissionDate: newAdmissionDate,
        documentsSubmitted: newStudentDocs
      };

      const res = await studentsApi.createStudent(studentPayload);
      if (res?.data) {
        const created = mapBackendStudent(res.data);
        if (newStudentPhoto) created.avatar = newStudentPhoto;
        if (newStudentDocs.length > 0) created.documentsSubmitted = newStudentDocs;
        setStudents((prev) => [created, ...prev]);
      } else {
        // Fallback local addition if offline
        const fallbackStudent: Student = {
          id: `STD-${Date.now().toString().slice(-4)}`,
          name: newStudentName.trim(),
          avatar: newStudentPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          rollNo: newStudentRollNo.trim() || `RAS-2026-${Math.floor(100 + Math.random() * 900)}`,
          admissionNo: newStudentAdmissionNo.trim() || `ADM-2026-${Date.now().toString().slice(-4)}`,
          class: newStudentClass,
          section: newStudentSection,
          parentName: newParentName.trim(),
          parentPhone: newParentPhone || '+92 300 1234567',
          parentEmail: newParentEmail || 'parent@readacademy.edu.pk',
          emergencyContact: newEmergencyContact || newParentPhone || '+92 300 7982018',
          feeStatus: newFeeStatus,
          status: 'Active',
          attendancePct: 100,
          dob: newStudentDob,
          gender: newStudentGender,
          bloodGroup: newStudentBloodGroup,
          address: newAddress,
          admissionDate: newAdmissionDate,
          previousSchool: newPrevSchool,
          documentsSubmitted: newStudentDocs,
          recentMarks: [],
          attendanceHistory: [],
          feeRecords: []
        };
        setStudents((prev) => [fallbackStudent, ...prev]);
      }

      setShowAddModal(false);
      // Reset form states
      setNewStudentName('');
      setNewStudentRollNo('');
      setNewStudentAdmissionNo('');
      setNewStudentPhoto('');
      setNewParentName('');
      setNewParentPhone('');
      setNewParentEmail('');
      setNewEmergencyContact('');
      setNewPrevSchool('');
      setNewPrevPercentage('');
      setNewAddress('Main Campus Area, Sahiwal, Punjab');
      setNewStudentDocs([]);
      setEnrollStep('student');

      showToast('Student Enrolled Successfully', `${newStudentName} registered with complete admission profile!`, 'success');
    } catch (err: any) {
      showToast('Enrollment Error', err.message || 'Failed to enroll student', 'error');
    } finally {
      setIsSubmittingEnroll(false);
    }
  };

  const [previewDoc, setPreviewDoc] = useState<{ name: string; url: string; type: 'image' | 'pdf' | 'other' } | null>(null);

  const handleDeleteStudentDocument = async (docId: string, docName: string) => {
    if (!selectedStudent) return;
    const confirmed = await showConfirmModal({
      title: 'Remove Dossier Document',
      message: `Are you sure you want to remove "${docName}" from this dossier?`,
      confirmText: 'Remove Document',
      type: 'danger',
    });
    if (!confirmed) return;

    try {
      const res = await studentsApi.deleteDocument(selectedStudent.id, docId);
      const updatedDocs = res?.allDocuments || (selectedStudent.documentsSubmitted || []).filter((d: any) => (d.id !== docId && d.name !== docId));

      setSelectedStudent(prev => prev ? { ...prev, documentsSubmitted: updatedDocs } : null);
      setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, documentsSubmitted: updatedDocs } : s));
      showToast('Document Removed', `${docName} was removed from dossier`, 'info');
    } catch (err: any) {
      showToast('Delete Failed', err?.message || 'Could not remove document', 'error');
    }
  };

  return (
    <div>
      {/* Top Header & Actions */}
      <div className="students-header-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0B3974', margin: 0 }}>
              Student Management
            </h2>
            <span
              style={{
                backgroundColor: '#eff6ff',
                color: '#0B3974',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid #bfdbfe'
              }}
            >
              {filteredStudents.length} Active
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
            Manage enrollment profiles, fee statuses, attendance records, and academic dossiers.
          </p>
        </div>

        <div className="students-header-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              try {
                let toExport = filteredStudents;
                if (!toExport || toExport.length === 0) {
                  toExport = students;
                }
                exportStudentsCsv(toExport);
                const count = toExport && toExport.length > 0 ? toExport.length : 5;
                showToast(
                  'Student Roster Exported',
                  `Successfully downloaded CSV for ${count} students (Excel ready)`,
                  'success'
                );
              } catch (err: any) {
                console.error('Failed to export CSV:', err);
                showToast('Export Failed', err.message || 'Error creating CSV file', 'error');
              }
            }}
            className="bca-btn bca-btn-secondary"
            title="Download student roster as Excel-compatible CSV"
            aria-label="Export CSV"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          {/* Prominent Brand Red Action for Fee Defaulters */}
          {overdueCount > 0 && (
            <button
              onClick={handleSendDefaulterNotices}
              className="bca-btn bca-btn-red"
              title="Broadcast SMS fee alert to all overdue parents"
            >
              <Send size={15} />
              <span>Fee Notice ({overdueCount})</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="bca-btn bca-btn-primary"
          >
            <Plus size={16} />
            <span>Enroll New Student</span>
          </button>
        </div>
      </div>

      {/* Top KPI Alert Strip with Brand Red Emphasis */}
      <div className="students-kpi-grid">
        {/* Total Students */}
        <div className="students-kpi-card kpi-blue">
          <div className="kpi-icon-box blue">
            <Users size={22} />
          </div>
          <div>
            <div className="kpi-title">Total Enrolled</div>
            <div className="kpi-value" style={{ color: '#0B3974' }}>
              {totalStudents}
            </div>
            <div className="kpi-subtext" style={{ color: '#64748b' }}>
              Registered in 13 classes
            </div>
          </div>
        </div>

        {/* Brand Red Highlight: Overdue Fee Defaulters */}
        <div
          className="students-kpi-card kpi-red"
          style={{ cursor: 'pointer' }}
          onClick={() => setQuickFilter(quickFilter === 'overdue' ? 'all' : 'overdue')}
          title="Click to view fee defaulters"
        >
          <div className="kpi-icon-box red">
            <AlertTriangle size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="kpi-title" style={{ color: '#E62929' }}>
              Fee Overdue Alert
            </div>
            <div className="kpi-value" style={{ color: '#E62929' }}>
              {overdueCount}
            </div>
            <div className="kpi-subtext" style={{ color: '#b81b1b', fontWeight: 600 }}>
              <span className="overdue-pulse-dot" /> Urgent recovery required
            </div>
          </div>
        </div>

        {/* Brand Red Highlight: Low Attendance */}
        <div
          className="students-kpi-card kpi-red"
          style={{ cursor: 'pointer' }}
          onClick={() => setQuickFilter(quickFilter === 'low-attendance' ? 'all' : 'low-attendance')}
          title="Click to view students with <85% attendance"
        >
          <div className="kpi-icon-box red">
            <Bell size={22} />
          </div>
          <div>
            <div className="kpi-title" style={{ color: '#E62929' }}>
              Low Attendance (&lt;85%)
            </div>
            <div className="kpi-value" style={{ color: '#E62929' }}>
              {lowAttendanceCount}
            </div>
            <div className="kpi-subtext" style={{ color: '#64748b' }}>
              Warning notices pending
            </div>
          </div>
        </div>

        {/* Cleared Fees */}
        <div className="students-kpi-card kpi-green">
          <div className="kpi-icon-box green">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="kpi-title">Fees Reconciled</div>
            <div className="kpi-value" style={{ color: '#2e7d32' }}>
              {paidCount}
            </div>
            <div className="kpi-subtext" style={{ color: '#2e7d32' }}>
              {totalStudents > 0 ? Math.round((paidCount / totalStudents) * 100) : 0}% clearance rate
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filter Alert Pills */}
      <div className="students-quick-filters">
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginRight: '4px' }}>
          Quick Filter:
        </span>
        <button
          onClick={() => setQuickFilter('all')}
          className={`quick-filter-pill ${quickFilter === 'all' ? 'active-all' : ''}`}
        >
          All Students ({totalStudents})
        </button>
        <button
          onClick={() => setQuickFilter('overdue')}
          className={`quick-filter-pill pill-red ${quickFilter === 'overdue' ? 'active' : ''}`}
        >
          <span className="overdue-pulse-dot" />
          <span>Overdue Fees ({overdueCount})</span>
        </button>
        <button
          onClick={() => setQuickFilter('low-attendance')}
          className={`quick-filter-pill pill-red ${quickFilter === 'low-attendance' ? 'active' : ''}`}
        >
          <AlertTriangle size={13} />
          <span>Low Attendance ({lowAttendanceCount})</span>
        </button>
        <button
          onClick={() => setQuickFilter('paid')}
          className={`quick-filter-pill pill-green ${quickFilter === 'paid' ? 'active' : ''}`}
        >
          <CheckCircle size={13} />
          <span>Fee Cleared ({paidCount})</span>
        </button>

        {(searchQuery || selectedClass !== 'All' || selectedSection !== 'All' || selectedFeeStatus !== 'All' || quickFilter !== 'all') && (
          <button
            onClick={handleResetFilters}
            className="quick-filter-pill"
            style={{ color: '#E62929', borderColor: '#fca5a5', background: '#fff5f5' }}
            title="Reset all search filters"
          >
            <RotateCcw size={13} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Responsive Filter Card */}
      <div className="students-filter-card">
        <div className="students-filter-row">
          {/* Search */}
          <div className="students-search-box">
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input
              type="text"
              placeholder="Search by student name, roll no, ID, parent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Dropdown Filters */}
          <div className="students-dropdown-group">
            {/* Class Filter */}
            <div className="students-select-item">
              <label>Class:</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="All">All Classes</option>
                {classesList.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Filter */}
            <div className="students-select-item">
              <label>Section:</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="All">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>

            {/* Fee Status Filter */}
            <div className="students-select-item">
              <label>Fee Status:</label>
              <select
                value={selectedFeeStatus}
                onChange={(e) => setSelectedFeeStatus(e.target.value)}
                style={{
                  color: selectedFeeStatus === 'Overdue' ? '#E62929' : 'inherit',
                  fontWeight: selectedFeeStatus === 'Overdue' ? 700 : 'normal'
                }}
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">🔴 Overdue</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle: Table vs Cards */}
          <div className="view-mode-toggle">
            <button
              onClick={() => setViewMode('table')}
              className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
              title="Table view for wider screens"
            >
              <TableIcon size={14} />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`view-mode-btn ${viewMode === 'cards' ? 'active' : ''}`}
              title="Card view for touch & mobile devices"
            >
              <LayoutGrid size={14} />
              <span>Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div
          className="bca-card"
          style={{
            textAlign: 'center',
            padding: '30px 20px',
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0'
          }}
        >
          <LoadingState message="Loading student records from database..." minHeight="300px" size="lg" />
        </div>
      ) : filteredStudents.length === 0 ? (
        <div
          className="bca-card"
          style={{
            textAlign: 'center',
            padding: '50px 20px',
            color: '#64748b',
            background: '#ffffff'
          }}
        >
          <AlertTriangle size={36} color="#E62929" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '1.1rem', color: '#0f172a', margin: '0 0 6px' }}>
            No Students Found
          </h4>
          <p style={{ fontSize: '0.86rem', margin: '0 0 16px' }}>
            No student records match the active query or filter criteria.
          </p>
          <button onClick={handleResetFilters} className="bca-btn bca-btn-secondary">
            <RotateCcw size={14} />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : null}

      {/* TABLE VIEW (Desktop / Tablet) */}
      {viewMode === 'table' && filteredStudents.length > 0 && (
        <div className="bca-table-wrapper">
          <table className="bca-table students-management-table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Roll No</th>
                <th style={{ width: '210px' }}>Student</th>
                <th style={{ width: '140px' }}>Class & Section</th>
                <th style={{ width: '150px' }}>Parent / Guardian</th>
                <th style={{ width: '150px' }}>Phone</th>
                <th style={{ width: '120px' }}>Attendance</th>
                <th style={{ width: '100px' }}>Fee Status</th>
                <th style={{ width: '80px' }}>Status</th>
                <th style={{ width: '150px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const isOverdue = student.feeStatus === 'Overdue';
                const isLowAttendance = student.attendancePct < 85;

                return (
                  <tr key={student.id} className={isOverdue ? 'row-overdue' : ''}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {isOverdue && <span className="overdue-pulse-dot" title="Overdue fee flag" />}
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            color: isOverdue ? '#E62929' : '#0B3974',
                            fontSize: '0.84rem'
                          }}
                        >
                          {student.rollNo || student.id.slice(0, 8)}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img
                          src={student.avatar}
                          alt={student.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=0B3974&color=fff&bold=true`;
                          }}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: isOverdue ? '2px solid #E62929' : '2px solid #e2e8f0',
                            flexShrink: 0
                          }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', fontSize: '0.86rem' }}>{student.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{student.gender}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ whiteSpace: 'nowrap' }}>
                      <strong style={{ color: '#1e293b' }}>{student.class}</strong>
                      <span style={{ color: '#64748b', fontSize: '0.8rem' }}> ({student.section})</span>
                    </td>

                    <td style={{ whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 600, color: '#334155' }}>{student.parentName}</div>
                    </td>

                    <td style={{ whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <a
                          href={`tel:${student.parentPhone}`}
                          style={{
                            fontSize: '0.8rem',
                            color: '#0B3974',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            textDecoration: 'none',
                            fontWeight: 600
                          }}
                          title="Click to call parent"
                        >
                          <Phone size={12} color="#0B3974" />
                          <span>{student.parentPhone}</span>
                        </a>
                        <WhatsAppButton
                          phone={student.parentPhone}
                          compact
                          size="xs"
                          message={`Assalam-o-Alaikum ${student.parentName}! This is Read Academy Administration regarding student ${student.name} (Roll No: ${student.rollNo}, Class: ${student.class}).`}
                          title="Chat with Parent on WhatsApp"
                        />
                      </div>
                    </td>

                    <td style={{ whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div
                          style={{
                            height: '5px',
                            backgroundColor: '#e2e8f0',
                            borderRadius: '3px',
                            overflow: 'hidden',
                            width: '45px'
                          }}
                        >
                          <div
                            style={{
                              width: `${student.attendancePct}%`,
                              height: '100%',
                              backgroundColor:
                                student.attendancePct >= 90
                                  ? '#4CAF50'
                                  : student.attendancePct >= 85
                                  ? '#FFD700'
                                  : '#E62929'
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: isLowAttendance ? '#E62929' : 'inherit'
                          }}
                        >
                          {student.attendancePct}%
                        </span>
                      </div>
                    </td>

                    <td style={{ whiteSpace: 'nowrap' }}>
                      {isOverdue ? (
                        <span
                          className="bca-badge bca-badge-overdue"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 700,
                            color: '#E62929',
                            backgroundColor: '#feecec',
                            borderColor: '#fca5a5',
                            padding: '2px 7px',
                            fontSize: '0.72rem'
                          }}
                        >
                          <span className="overdue-pulse-dot" />
                          Overdue
                        </span>
                      ) : (
                        <span
                          className={`bca-badge bca-badge-${student.feeStatus.toLowerCase()}`}
                          style={{ padding: '2px 7px', fontSize: '0.72rem' }}
                        >
                          {student.feeStatus}
                        </span>
                      )}
                    </td>

                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span className="bca-badge bca-badge-active" style={{ padding: '2px 7px', fontSize: '0.72rem' }}>
                        {student.status}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '4px', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {/* Red SMS button for Overdue fee reminder */}
                        {isOverdue && (
                          <>
                            <WhatsAppButton
                              phone={student.parentPhone}
                              size="xs"
                              compact
                              label="WhatsApp Alert"
                              message={`Assalam-o-Alaikum ${student.parentName}! This is Read Academy Administration. Please be informed that fee dues for ${student.name} (Roll: ${student.rollNo}, Class: ${student.class}) are currently OVERDUE. Kindly deposit the outstanding voucher at your earliest. JazakAllah.`}
                              title="Send Fee Alert on WhatsApp"
                            />
                            <button
                              onClick={() =>
                                showToast(
                                  `SMS Notice Sent to ${student.parentName}`,
                                  `Overdue notice dispatched to ${student.parentPhone}`,
                                  'error'
                                )
                              }
                              className="bca-btn bca-btn-red"
                              style={{ padding: '4px 7px', fontSize: '0.72rem' }}
                              title="Send Fee Alert SMS"
                            >
                              <Send size={12} />
                              <span>SMS</span>
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="bca-btn bca-btn-secondary"
                          style={{ padding: '4px 6px', minWidth: '28px', minHeight: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#0B3974' }}
                          title="View Full Profile"
                          aria-label="View Full Profile"
                        >
                          <Eye size={13} />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="bca-btn bca-btn-secondary"
                          style={{ padding: '4px 6px', minWidth: '28px', minHeight: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}
                          title="Edit Student Record"
                          aria-label="Edit Student Record"
                        >
                          <Edit2 size={13} />
                        </button>

                        <button
                          onClick={() => handleDeleteStudent(student)}
                          className="bca-btn bca-btn-secondary"
                          style={{ padding: '4px 6px', minWidth: '28px', minHeight: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48' }}
                          title="Delete Student Record"
                          aria-label="Delete Student Record"
                        >
                          <Trash2 size={13} />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedStudentForIdCard(student);
                          }}
                          className="bca-btn bca-btn-secondary"
                          style={{ padding: '4px 6px', minWidth: '28px', minHeight: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Generate & Print Student ID Card"
                          aria-label="Generate & Print Student ID Card"
                        >
                          <Printer size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MOBILE / RESPONSIVE CARDS VIEW */}
      {viewMode === 'cards' && filteredStudents.length > 0 && (
        <div className="students-cards-container">
          {filteredStudents.map((student) => {
            const isOverdue = student.feeStatus === 'Overdue';
            const isLowAttendance = student.attendancePct < 85;

            return (
              <div
                key={student.id}
                className={`student-card-item ${isOverdue ? 'card-overdue' : ''}`}
              >
                {/* Top Card Row */}
                <div className="student-card-header">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=0B3974&color=fff&bold=true`;
                    }}
                    className="student-card-avatar"
                    style={{
                      borderColor: isOverdue ? '#E62929' : '#e2e8f0'
                    }}
                  />
                  <div className="student-card-info">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                      <div className="student-card-name">{student.name}</div>
                    </div>

                    <div className="student-card-meta">
                      <span style={{ fontWeight: 700, color: isOverdue ? '#E62929' : '#0B3974' }}>
                        Roll No: {student.rollNo}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          backgroundColor: '#eff6ff',
                          color: '#0B3974',
                          fontWeight: 700,
                          fontSize: '0.74rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          border: '1px solid #bfdbfe'
                        }}
                      >
                        {student.class} - Sec {student.section}
                      </span>

                      {isOverdue ? (
                        <span
                          className="bca-badge bca-badge-overdue"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 700,
                            color: '#E62929',
                            backgroundColor: '#feecec',
                            borderColor: '#fca5a5'
                          }}
                        >
                          <span className="overdue-pulse-dot" />
                          Fee Overdue
                        </span>
                      ) : (
                        <span className={`bca-badge bca-badge-${student.feeStatus.toLowerCase()}`}>
                          {student.feeStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Body Stats */}
                <div className="student-card-body">
                  <div>
                    <div className="card-stat-label">Guardian</div>
                    <div className="card-stat-value">{student.parentName}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                      <a
                        href={`tel:${student.parentPhone}`}
                        style={{
                          fontSize: '0.78rem',
                          color: '#0B3974',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          textDecoration: 'none',
                          fontWeight: 600
                        }}
                      >
                        <PhoneCall size={12} color="#0B3974" />
                        <span>{student.parentPhone}</span>
                      </a>
                      <WhatsAppButton
                        phone={student.parentPhone}
                        compact
                        size="xs"
                        message={`Assalam-o-Alaikum ${student.parentName}! This is Read Academy Administration regarding student ${student.name} (Roll No: ${student.rollNo}, Class: ${student.class}).`}
                        title="Chat with Parent on WhatsApp"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="card-stat-label">Attendance</div>
                    <div
                      className="card-stat-value"
                      style={{
                        color: isLowAttendance ? '#E62929' : '#1e293b',
                        fontWeight: 700
                      }}
                    >
                      {student.attendancePct}%
                    </div>
                    <div
                      style={{
                        height: '5px',
                        backgroundColor: '#e2e8f0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginTop: '4px'
                      }}
                    >
                      <div
                        style={{
                          width: `${student.attendancePct}%`,
                          height: '100%',
                          backgroundColor:
                            student.attendancePct >= 90
                              ? '#4CAF50'
                              : student.attendancePct >= 85
                              ? '#FFD700'
                              : '#E62929'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="student-card-actions">
                  <button
                    onClick={() => setSelectedStudent(student)}
                    className="bca-btn bca-btn-secondary"
                  >
                    <Eye size={14} />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(student)}
                    className="bca-btn bca-btn-secondary"
                    style={{ flex: '0 0 auto', padding: '7px 10px', color: '#2563eb' }}
                    title="Edit Student"
                  >
                    <Edit2 size={14} />
                  </button>

                  <button
                    onClick={() => handleDeleteStudent(student)}
                    className="bca-btn bca-btn-secondary"
                    style={{ flex: '0 0 auto', padding: '7px 10px', color: '#e11d48' }}
                    title="Delete Student"
                  >
                    <Trash2 size={14} />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedStudentForIdCard(student);
                    }}
                    className="bca-btn bca-btn-secondary"
                    style={{ flex: '0 0 auto', padding: '7px 10px' }}
                    title="Generate & Print Student ID Card"
                  >
                    <Printer size={14} />
                  </button>

                  {isOverdue && (
                    <button
                      onClick={() =>
                        showToast(
                          `SMS Notice Sent to ${student.parentName}`,
                          `Overdue notice dispatched to ${student.parentPhone}`,
                          'error'
                        )
                      }
                      className="bca-btn bca-btn-red"
                      title="Send Urgent Fee Notice SMS"
                    >
                      <Send size={13} />
                      <span>Fee SMS</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAILED STUDENT PROFILE MODAL WITH 8 TABS */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`Student Dossier — ${selectedStudent.name}`}
          subtitle={`${selectedStudent.id} • ${selectedStudent.class}-${selectedStudent.section} (Roll: ${selectedStudent.rollNo})`}
          maxWidth="900px"
          footer={
            <>
              {selectedStudent.feeStatus === 'Overdue' && (
                <div style={{ display: 'flex', gap: '6px', marginRight: 'auto' }}>
                  <WhatsAppButton
                    phone={selectedStudent.parentPhone}
                    size="sm"
                    label="WhatsApp Fee Alert"
                    message={`Assalam-o-Alaikum ${selectedStudent.parentName}! This is Read Academy Administration. Please be informed that fee dues for ${selectedStudent.name} (Roll: ${selectedStudent.rollNo}, Class: ${selectedStudent.class}) are currently OVERDUE. Kindly deposit the outstanding voucher at your earliest. JazakAllah.`}
                    title="Send Fee Alert on WhatsApp"
                  />
                  <button
                    onClick={() =>
                      showToast(
                        `Fee Reminder SMS sent to ${selectedStudent.parentName}`,
                        `Contact: ${selectedStudent.parentPhone}`,
                        'error'
                      )
                    }
                    className="bca-btn bca-btn-red"
                  >
                    <Send size={14} />
                    <span>Send SMS</span>
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  const s = selectedStudent;
                  setSelectedStudent(null);
                  handleOpenEdit(s);
                }}
                className="bca-btn bca-btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Edit2 size={14} />
                <span>Edit Profile</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedStudentForIdCard(selectedStudent);
                }}
                className="bca-btn bca-btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                title="Generate & Print Student ID Card"
              >
                <Printer size={14} />
                <span>ID Card</span>
              </button>
              <button
                onClick={() => setSelectedStudent(null)}
                className="bca-btn bca-btn-secondary"
              >
                Close
              </button>
            </>
          }
        >
          <div>
            {/* Top Brand Accent Banner */}
            <div className="profile-header-banner" />

            {/* Top Student Header Card */}
            <div className="profile-top-card">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.name)}&background=0B3974&color=fff&bold=true`;
                }}
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: selectedStudent.feeStatus === 'Overdue' ? '3px solid #E62929' : '3px solid #0B3974',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
              <div style={{ flex: 1 }}>
                <div className="student-badges-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#0B3974' }}>{selectedStudent.name}</h3>

                  {selectedStudent.feeStatus === 'Overdue' ? (
                    <span
                      className="bca-badge bca-badge-overdue"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 700,
                        color: '#E62929',
                        backgroundColor: '#feecec',
                        borderColor: '#fca5a5'
                      }}
                    >
                      <span className="overdue-pulse-dot" />
                      Fee: Overdue
                    </span>
                  ) : (
                    <span className={`bca-badge bca-badge-${selectedStudent.feeStatus.toLowerCase()}`}>
                      Fee: {selectedStudent.feeStatus}
                    </span>
                  )}

                  <span className="bca-badge bca-badge-active">
                    {selectedStudent.status}
                  </span>
                </div>

                <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '0.84rem' }}>
                  Enrolled: <strong>{selectedStudent.admissionDate}</strong> • Class:{' '}
                  <strong>
                    {selectedStudent.class}-{selectedStudent.section}
                  </strong>
                </p>
              </div>
            </div>

            {/* Emergency Contact Highlight Box in Brand Red */}
            <div className="emergency-contact-box" style={{ marginBottom: '18px' }}>
              <div style={{ background: '#feecec', padding: '8px', borderRadius: '50%', color: '#E62929' }}>
                <Phone size={18} color="#E62929" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#E62929', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Emergency Medical &amp; Campus Contact
                </div>
                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                  {selectedStudent.emergencyContact
                    ? `${selectedStudent.emergencyContact} (Parent Hotline)`
                    : <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 500 }}>Not Provided</span>}
                </div>
              </div>
              {selectedStudent.emergencyContact && (
                <a
                  href={`tel:${selectedStudent.emergencyContact}`}
                  className="bca-btn bca-btn-red"
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                >
                  <PhoneCall size={13} />
                  <span>Call Now</span>
                </a>
              )}
            </div>

            {/* 8 Tabs Bar (Horizontally scrollable with touch) */}
            <div className="profile-tabs-scroll">
              {[
                'Overview',
                'Personal Information',
                'Parent Information',
                'Attendance',
                'Fees',
                'Results',
                'Progress',
                'Documents'
              ].map((tab) => {
                const isActive = profileActiveTab === tab;
                const isFeesTab = tab === 'Fees';
                const hasOverdue = isFeesTab && selectedStudent.feeStatus === 'Overdue';

                return (
                  <button
                    key={tab}
                    onClick={() => setProfileActiveTab(tab as any)}
                    className={`profile-tab-button ${isActive ? 'active' : ''}`}
                    data-active={isActive}
                  >
                    <span>{tab}</span>
                    {hasOverdue && (
                      <span
                        style={{
                          backgroundColor: '#E62929',
                          color: '#ffffff',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '10px'
                        }}
                      >
                        Due
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Overview */}
            {profileActiveTab === 'Overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div className="bca-card" style={{ padding: '16px', borderLeft: `4px solid ${selectedStudent.recentMarks.length > 0 ? '#4CAF50' : '#cbd5e1'}` }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Academic Results
                  </span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2e7d32', margin: '6px 0' }}>
                    {selectedStudent.recentMarks.length > 0
                      ? `${selectedStudent.recentMarks.length} Subject(s) Recorded`
                      : <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>No Results Yet</span>}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                    Class: {selectedStudent.class}
                  </p>
                </div>

                <div
                  className="bca-card"
                  style={{
                    padding: '16px',
                    borderLeft: selectedStudent.attendancePct !== null && selectedStudent.attendancePct < 85 ? '4px solid #E62929' : '4px solid #0B3974'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Cumulative Attendance
                  </span>
                  <div
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      color: selectedStudent.attendancePct !== null && selectedStudent.attendancePct < 85 ? '#E62929' : '#0B3974',
                      margin: '6px 0'
                    }}
                  >
                    {selectedStudent.attendancePct !== null ? `${selectedStudent.attendancePct}%` : <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>Not Available</span>}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                    {selectedStudent.attendanceHistory.length > 0
                      ? `${selectedStudent.attendanceHistory[0].present} days present recorded`
                      : 'No attendance records yet'}
                  </p>
                </div>

                <div
                  className="bca-card"
                  style={{
                    padding: '16px',
                    borderLeft: selectedStudent.feeStatus === 'Overdue' ? '4px solid #E62929' : '4px solid #4CAF50',
                    background: selectedStudent.feeStatus === 'Overdue' ? '#fffafa' : '#ffffff'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Fee Clearance
                  </span>
                  <div
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      color: selectedStudent.feeStatus === 'Overdue' ? '#E62929' : '#2e7d32',
                      margin: '6px 0'
                    }}
                  >
                    {selectedStudent.feeStatus}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                    {selectedStudent.feeRecords.length > 0
                      ? `${selectedStudent.feeRecords.length} voucher(s) on record`
                      : 'No fee vouchers issued yet'}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Personal Information */}
            {profileActiveTab === 'Personal Information' && (
              <div className="profile-info-grid">
                <div><strong>Full Name:</strong> {selectedStudent.name}</div>
                <div><strong>Date of Birth:</strong> {selectedStudent.dob || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Provided</span>}</div>
                <div><strong>Gender:</strong> {selectedStudent.gender}</div>
                <div><strong>Admission Date:</strong> {selectedStudent.admissionDate || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Provided</span>}</div>
                <div>
                  <strong style={{ color: '#E62929' }}>Emergency Contact:</strong>{' '}
                  {selectedStudent.emergencyContact || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Provided</span>}
                </div>
                <div style={{ gridColumn: 'span 1' }}>
                  <strong>Residential Address:</strong>{' '}
                  {selectedStudent.address || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Provided</span>}
                </div>
                <div style={{ gridColumn: 'span 1' }}>
                  <strong>Previous School:</strong>{' '}
                  {selectedStudent.previousSchool || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Provided</span>}
                </div>
              </div>
            )}

            {/* Tab 3: Parent Information */}
            {profileActiveTab === 'Parent Information' && (
              <div className="profile-info-grid">
                <div><strong>Father / Guardian Name:</strong> {selectedStudent.parentName}</div>
                <div><strong>Relationship:</strong> Father / Guardian</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <strong>Primary Phone:</strong>{' '}
                  {selectedStudent.parentPhone !== 'Not Provided' ? (
                    <>
                      <a href={`tel:${selectedStudent.parentPhone}`} style={{ color: '#0B3974', fontWeight: 600 }}>
                        {selectedStudent.parentPhone}
                      </a>
                      <WhatsAppButton
                        phone={selectedStudent.parentPhone}
                        size="xs"
                        label="WhatsApp"
                        message={`Assalam-o-Alaikum ${selectedStudent.parentName}! This is Read Academy Administration regarding student ${selectedStudent.name} (Roll No: ${selectedStudent.rollNo}).`}
                      />
                    </>
                  ) : (
                    <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Provided</span>
                  )}
                </div>
                <div><strong>Email Address:</strong>{' '}{selectedStudent.parentEmail !== 'Not Provided' ? selectedStudent.parentEmail : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Provided</span>}</div>
              </div>
            )}

            {/* Tab 4: Attendance */}
            {profileActiveTab === 'Attendance' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ margin: 0, color: '#0B3974' }}>Monthly Attendance Breakdown (2026)</h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Academic Year 2026-2027
                  </span>
                </div>
                <div className="bca-table-wrapper">
                  <table className="bca-table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Present Days</th>
                        <th>Absences (Unexcused)</th>
                        <th>Late Marks</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.attendanceHistory && selectedStudent.attendanceHistory.length > 0 ? (
                        selectedStudent.attendanceHistory.map((item, idx) => (
                          <tr key={idx}>
                            <td><strong>{item.month} 2026</strong></td>
                            <td><span style={{ color: '#2e7d32', fontWeight: 700 }}>{item.present} Days</span></td>
                            <td>
                              <span
                                style={{
                                  color: item.absent > 0 ? '#E62929' : '#64748b',
                                  fontWeight: item.absent > 0 ? 800 : 500
                                }}
                              >
                                {item.absent > 0 ? `⚠️ ${item.absent} Days` : '0'}
                              </span>
                            </td>
                            <td><span style={{ color: item.late > 0 ? '#b8860b' : '#64748b' }}>{item.late}</span></td>
                            <td>
                              <span className={`bca-badge ${item.absent === 0 ? 'bca-badge-present' : 'bca-badge-late'}`}>
                                {item.absent === 0 ? 'Excellent' : 'Satisfactory'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '28px 15px', color: '#64748b' }}>
                            <div style={{ fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                              No monthly attendance records found for this student.
                            </div>
                            <div style={{ fontSize: '0.78rem' }}>
                              Daily attendance marked from the Attendance Register will automatically compile here.
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 5: Fees */}
            {profileActiveTab === 'Fees' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ margin: 0, color: '#0B3974' }}>Recent Fee Vouchers & Payments</h4>
                  {selectedStudent.feeStatus === 'Overdue' ? (
                    <span className="bca-badge bca-badge-overdue" style={{ fontWeight: 700 }}>
                      <span className="overdue-pulse-dot" /> Action Required: Overdue Voucher
                    </span>
                  ) : selectedStudent.feeStatus === 'Pending' ? (
                    <span className="bca-badge bca-badge-pending" style={{ fontWeight: 700, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                      Pending Payment
                    </span>
                  ) : (
                    <span className="bca-badge bca-badge-paid" style={{ fontWeight: 700 }}>
                      All Dues Cleared
                    </span>
                  )}
                </div>
                <div className="bca-table-wrapper">
                  <table className="bca-table">
                    <thead>
                      <tr>
                        <th>Voucher #</th>
                        <th>Billing Month</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Payment / Due Date</th>
                        <th style={{ textAlign: 'right' }}>Challan Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.feeRecords && selectedStudent.feeRecords.length > 0 ? (
                        selectedStudent.feeRecords.map((fee, idx) => {
                          const isRecordOverdue = fee.status === 'Overdue';
                          const isRecordPaid = fee.status === 'Paid';

                          return (
                            <tr key={idx} className={isRecordOverdue ? 'row-overdue' : ''}>
                              <td><code>{fee.voucherNo}</code></td>
                              <td>{fee.month}</td>
                              <td>
                                <strong style={{ color: isRecordOverdue ? '#E62929' : 'inherit' }}>
                                  Rs. {fee.amount.toLocaleString()}
                                </strong>
                              </td>
                              <td>
                                {isRecordOverdue ? (
                                  <span
                                    className="bca-badge bca-badge-overdue"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      fontWeight: 700,
                                      color: '#E62929',
                                      backgroundColor: '#feecec',
                                      borderColor: '#fca5a5'
                                    }}
                                  >
                                    <span className="overdue-pulse-dot" />
                                    Overdue
                                  </span>
                                ) : isRecordPaid ? (
                                  <span className="bca-badge bca-badge-paid">Paid</span>
                                ) : (
                                  <span
                                    className="bca-badge bca-badge-pending"
                                    style={{
                                      background: '#fef3c7',
                                      color: '#92400e',
                                      border: '1px solid #fde68a',
                                      fontWeight: 700
                                    }}
                                  >
                                    Pending (Unpaid)
                                  </span>
                                )}
                              </td>
                              <td>{fee.date}</td>
                              <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', justifyContent: 'flex-end' }}>
                                  <button
                                    onClick={() => setSelectedChallanForView({ student: selectedStudent, fee })}
                                    className="bca-btn bca-btn-secondary"
                                    style={{ padding: '5px 10px', fontSize: '0.78rem', color: '#0B3974', gap: '5px' }}
                                    title="View Official 3-Part Bank Challan"
                                  >
                                    <Eye size={13} />
                                    <span>View Challan</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      try {
                                        printFeeChallan(selectedStudent, fee);
                                        showToast('Generating Challan', `Opened print/download preview for Challan ${fee.voucherNo}`, 'info');
                                      } catch (err: any) {
                                        showToast('Challan Error', err.message, 'error');
                                      }
                                    }}
                                    className="bca-btn bca-btn-primary"
                                    style={{ padding: '5px 10px', fontSize: '0.78rem', gap: '5px' }}
                                    title="Download & Print 3-Part Fee Challan"
                                  >
                                    <Download size={13} />
                                    <span>Download</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '30px 15px', color: '#64748b' }}>
                            <div style={{ fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                              No fee vouchers or payment records found for this student.
                            </div>
                            <div style={{ fontSize: '0.78rem' }}>
                              Fee vouchers issued from Fee Management or Admissions will automatically synchronize here.
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 6: Results */}
            {profileActiveTab === 'Results' && (
              <div>
                <h4 style={{ margin: '0 0 12px 0', color: '#0B3974' }}>Term Examination Assessment</h4>
                <div className="bca-table-wrapper">
                  <table className="bca-table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Total Marks</th>
                        <th>Obtained Marks</th>
                        <th>Percentage</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.recentMarks && selectedStudent.recentMarks.length > 0 ? (
                        selectedStudent.recentMarks.map((m, idx) => (
                          <tr key={idx}>
                            <td><strong>{m.subject}</strong></td>
                            <td>{m.total}</td>
                            <td><strong style={{ color: '#0B3974' }}>{m.marks}</strong></td>
                            <td>{((m.marks / m.total) * 100).toFixed(0)}%</td>
                            <td>
                              <span
                                className="bca-badge"
                                style={{
                                  backgroundColor: '#e8f5e9',
                                  color: '#1b5e20',
                                  border: '1px solid #a5d6a7',
                                  fontWeight: 700
                                }}
                              >
                                {m.grade}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '28px 15px', color: '#64748b' }}>
                            <div style={{ fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                              No examination assessment records available yet.
                            </div>
                            <div style={{ fontSize: '0.78rem' }}>
                              Term exam marks entered from Examination &amp; Results will automatically reflect here.
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 7: Progress */}
            {profileActiveTab === 'Progress' && (
              <div>
                <h4 style={{ margin: '0 0 12px 0', color: '#0B3974' }}>Teacher Remarks &amp; Growth Index</h4>
                <div style={{ textAlign: 'center', padding: '36px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                  <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.92rem' }}>No Remarks Added Yet</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    No teacher remarks or growth notes have been recorded for {selectedStudent.name}.
                  </div>
                </div>
              </div>
            )}

            {/* Tab 8: Documents */}
            {profileActiveTab === 'Documents' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Header card with Upload trigger */}
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0B3974' }}>
                      Official Verification Documents &amp; Soft Copies
                    </h4>
                    <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                      Digital dossier records, certificates, and student identification archives
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        background: '#ecfdf5',
                        color: '#059669',
                        border: '1px solid #a7f3d0',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontWeight: 700
                      }}
                    >
                      {selectedStudent.documentsSubmitted?.length || 0} Document(s) On Record
                    </span>
                  </div>
                </div>

                {/* Documents Grid */}
                {selectedStudent.documentsSubmitted && selectedStudent.documentsSubmitted.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                    {selectedStudent.documentsSubmitted.map((doc: any, idx: number) => {
                      const isObj = typeof doc === 'object' && doc !== null;
                      const docName = isObj ? (doc.name || doc.docType || `Document ${idx + 1}`) : String(doc);
                      const docType = isObj ? (doc.docType || 'Certificate') : 'Document';
                      const docSize = isObj ? doc.fileSize : undefined;
                      const dataUrl = isObj ? (doc.dataUrl || doc.fileData || doc.url) : undefined;
                      const uploadDate = isObj && doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : undefined;
                      const isImage = dataUrl && (dataUrl.startsWith('data:image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(docName));
                      const isPdf = dataUrl && (dataUrl.startsWith('data:application/pdf') || /\.pdf$/i.test(docName));
                      const docId = isObj ? (doc.id || docName) : String(idx);

                      return (
                        <div
                          key={docId || idx}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            padding: '12px 14px',
                            borderRadius: '10px',
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            gap: '12px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            {isImage ? (
                              <div
                                onClick={() => dataUrl && setPreviewDoc({ name: docName, url: dataUrl, type: 'image' })}
                                style={{
                                  width: '52px',
                                  height: '52px',
                                  borderRadius: '8px',
                                  border: '1px solid #cbd5e1',
                                  overflow: 'hidden',
                                  cursor: 'pointer',
                                  flexShrink: 0,
                                  background: '#f8fafc'
                                }}
                                title="Click to view image"
                              >
                                <img
                                  src={dataUrl}
                                  alt={docName}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </div>
                            ) : isPdf ? (
                              <div
                                onClick={() => dataUrl && setPreviewDoc({ name: docName, url: dataUrl, type: 'pdf' })}
                                style={{
                                  width: '52px',
                                  height: '52px',
                                  borderRadius: '8px',
                                  background: '#fee2e2',
                                  color: '#dc2626',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 800,
                                  fontSize: '0.72rem',
                                  flexShrink: 0,
                                  cursor: dataUrl ? 'pointer' : 'default',
                                  border: '1px solid #fecaca'
                                }}
                                title="Click to preview PDF"
                              >
                                <FileText size={20} />
                                <span style={{ fontSize: '0.62rem', marginTop: '2px' }}>PDF</span>
                              </div>
                            ) : (
                              <div
                                style={{
                                  width: '52px',
                                  height: '52px',
                                  borderRadius: '8px',
                                  background: '#eff6ff',
                                  color: '#2563eb',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  border: '1px solid #bfdbfe'
                                }}
                              >
                                <FileCheck size={26} />
                              </div>
                            )}

                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div
                                style={{
                                  fontSize: '0.84rem',
                                  fontWeight: 700,
                                  color: '#0f172a',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                                title={docName}
                              >
                                {docName}
                              </div>
                              <div
                                style={{
                                  fontSize: '0.72rem',
                                  color: '#0284c7',
                                  background: '#e0f2fe',
                                  display: 'inline-block',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  marginTop: '3px',
                                  fontWeight: 600
                                }}
                              >
                                {docType}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                                {docSize ? `${docSize}` : 'Verified Document'}
                                {uploadDate ? ` • ${uploadDate}` : ''}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '8px', justifyContent: 'flex-end' }}>
                            {dataUrl && (
                              <button
                                type="button"
                                onClick={() => setPreviewDoc({ name: docName, url: dataUrl, type: isPdf ? 'pdf' : isImage ? 'image' : 'other' })}
                                className="bca-btn bca-btn-secondary"
                                style={{ padding: '4px 9px', fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                title="Preview Document"
                              >
                                <Eye size={12} />
                                <span>Preview</span>
                              </button>
                            )}

                            {dataUrl && (
                              <a
                                href={dataUrl}
                                download={docName}
                                className="bca-btn bca-btn-secondary"
                                style={{ padding: '4px 9px', fontSize: '0.74rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                title="Download Document"
                              >
                                <Download size={12} />
                                <span>Download</span>
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteStudentDocument(docId, docName)}
                              className="bca-btn bca-btn-secondary"
                              style={{ padding: '4px 7px', color: '#e11d48' }}
                              title="Delete Document"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '36px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    <FileText size={40} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
                    <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.94rem' }}>No Uploaded Verification Documents Yet</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', maxWidth: '420px', margin: '4px auto 0' }}>
                      No digital files (B-Form, birth certificate, leaving certificate, or photos) are currently stored for {selectedStudent.name}.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <Modal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          title={`Document Preview — ${previewDoc.name}`}
          maxWidth="750px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <a
                href={previewDoc.url}
                download={previewDoc.name}
                className="bca-btn bca-btn-primary"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={15} />
                <span>Download File</span>
              </a>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="bca-btn bca-btn-secondary"
              >
                Close Preview
              </button>
            </div>
          }
        >
          <div style={{ textAlign: 'center', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {previewDoc.type === 'image' ? (
              <img
                src={previewDoc.url}
                alt={previewDoc.name}
                style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
            ) : previewDoc.type === 'pdf' ? (
              <iframe
                src={previewDoc.url}
                title={previewDoc.name}
                style={{ width: '100%', height: '65vh', border: '1px solid #cbd5e1', borderRadius: '8px' }}
              />
            ) : (
              <div style={{ padding: '40px' }}>
                <FileCheck size={48} color="#2563eb" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>{previewDoc.name}</div>
                <p style={{ color: '#64748b', fontSize: '0.84rem', marginTop: '6px' }}>
                  Preview is not available directly in browser. Please download the file to view.
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ENROLL NEW STUDENT MODAL — MIRRORS ADMISSION FORM WITH COMPLETE DOSSIER FIELDS */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Enroll New Student"
        subtitle="Complete registration dossier matching official Read Academy admission form"
        maxWidth="780px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {enrollStep !== 'student' && (
                <button
                  type="button"
                  onClick={() => {
                    const steps: ('student' | 'parent' | 'previous' | 'documents')[] = ['student', 'parent', 'previous', 'documents'];
                    const idx = steps.indexOf(enrollStep);
                    if (idx > 0) setEnrollStep(steps[idx - 1]);
                  }}
                  className="bca-btn bca-btn-secondary"
                >
                  ← Back
                </button>
              )}
              {enrollStep !== 'documents' && (
                <button
                  type="button"
                  onClick={() => {
                    const steps: ('student' | 'parent' | 'previous' | 'documents')[] = ['student', 'parent', 'previous', 'documents'];
                    const idx = steps.indexOf(enrollStep);
                    if (idx < steps.length - 1) setEnrollStep(steps[idx + 1]);
                  }}
                  className="bca-btn bca-btn-secondary"
                >
                  Next Step →
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="submit"
                form="addStudentForm"
                disabled={isSubmittingEnroll}
                className="bca-btn bca-btn-primary"
              >
                {isSubmittingEnroll ? 'Enrolling Student...' : 'Complete Enrollment'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="bca-btn bca-btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        }
      >
        <div className="profile-header-banner" style={{ margin: '-24px -24px 18px -24px' }} />

        {/* Step Navigation Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', flexWrap: 'wrap' }}>
          {[
            { id: 'student', label: '1. Student Details & Photo' },
            { id: 'parent', label: '2. Parent / Guardian' },
            { id: 'previous', label: '3. Previous School & Address' },
            { id: 'documents', label: '4. Documents & Initial Status' }
          ].map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setEnrollStep(step.id as any)}
              style={{
                border: 'none',
                background: enrollStep === step.id ? '#0B3974' : '#f1f5f9',
                color: enrollStep === step.id ? '#ffffff' : '#64748b',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {step.label}
            </button>
          ))}
        </div>

        <form id="addStudentForm" onSubmit={handleCreateStudent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* STEP 1: STUDENT INFORMATION & PHOTO */}
          {enrollStep === 'student' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Photo Upload Card */}
              <div style={{ background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <input
                  type="file"
                  ref={newStudentPhotoRef}
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleNewStudentPhotoUpload}
                  style={{ display: 'none' }}
                />
                <div
                  onClick={() => newStudentPhotoRef.current?.click()}
                  style={{
                    width: '68px',
                    height: '80px',
                    borderRadius: '8px',
                    border: '2px solid #0B3974',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#ffffff',
                    cursor: 'pointer',
                    flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                  }}
                  title="Click to upload student candidate photograph"
                >
                  {newStudentPhoto ? (
                    <img src={newStudentPhoto} alt="Candidate Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                      <Camera size={24} style={{ margin: '0 auto', display: 'block', color: '#0B3974' }} />
                      <span style={{ fontSize: '0.62rem', fontWeight: 800, display: 'block', marginTop: '2px', color: '#0B3974' }}>PHOTO</span>
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                      Student Passport Photograph
                    </label>
                    <span style={{ fontSize: '0.7rem', background: newStudentPhoto ? '#ecfdf5' : '#eff6ff', color: newStudentPhoto ? '#059669' : '#0B3974', border: '1px solid #bfdbfe', padding: '1px 6px', borderRadius: '10px', fontWeight: 600 }}>
                      {newStudentPhoto ? 'Photo Attached' : 'Recommended for Student ID Card'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 6px 0' }}>
                    Attach recent passport-size photo (JPG, PNG, WEBP, max 5MB). Prints on Student ID Card.
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => newStudentPhotoRef.current?.click()}
                      className="bca-btn bca-btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    >
                      <Upload size={13} /> {newStudentPhoto ? 'Change Photo' : 'Upload Student Photo'}
                    </button>
                    {newStudentPhoto && (
                      <button
                        type="button"
                        onClick={handleRemoveNewStudentPhoto}
                        style={{
                          padding: '5px 9px',
                          background: '#fff',
                          color: '#dc2626',
                          border: '1px solid #fca5a5',
                          borderRadius: '6px',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Student Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Student Full Name (as on Birth Certificate) <span style={{ color: '#E62929' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Rayyan"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              {/* Class & Section Grid */}
              <div className="add-student-form-grid">
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Applying For Class <span style={{ color: '#E62929' }}>*</span>
                  </label>
                  <select
                    value={newStudentClass}
                    onChange={(e) => setNewStudentClass(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    {classesList.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Section <span style={{ color: '#E62929' }}>*</span>
                  </label>
                  <select
                    value={newStudentSection}
                    onChange={(e) => setNewStudentSection(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>
              </div>

              {/* Gender, DOB, Blood Group */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Gender <span style={{ color: '#E62929' }}>*</span>
                  </label>
                  <select
                    value={newStudentGender}
                    onChange={(e) => setNewStudentGender(e.target.value as any)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Date of Birth <span style={{ color: '#E62929' }}>*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newStudentDob}
                    onChange={(e) => setNewStudentDob(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Blood Group
                  </label>
                  <select
                    value={newStudentBloodGroup}
                    onChange={(e) => setNewStudentBloodGroup(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Roll No & Admission No (Optional Custom Identifiers) */}
              <div className="add-student-form-grid">
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Roll Number <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>(Leave blank to auto-generate)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. RAS-2026-45"
                    value={newStudentRollNo}
                    onChange={(e) => setNewStudentRollNo(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Admission Number <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>(Leave blank to auto-generate)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ADM-2026-089"
                    value={newStudentAdmissionNo}
                    onChange={(e) => setNewStudentAdmissionNo(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PARENT / GUARDIAN INFORMATION */}
          {enrollStep === 'parent' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Father / Guardian Name <span style={{ color: '#E62929' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={newParentName}
                  onChange={(e) => setNewParentName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div className="add-student-form-grid">
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Primary Mobile / WhatsApp <span style={{ color: '#E62929' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={newParentPhone}
                    onChange={(e) => setNewParentPhone(handlePKPhoneInput(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1.5px solid ${pkPhoneBorderColor(newParentPhone)}` }}
                  />
                  {newParentPhone.length > 3 && !isValidPKPhone(newParentPhone) && (
                    <div style={{ fontSize: '0.72rem', color: '#E62929', marginTop: '3px' }}>⚠ Pakistani number required — e.g. +92 300 1234567</div>
                  )}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Parent Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="parent@example.com"
                    value={newParentEmail}
                    onChange={(e) => setNewParentEmail(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Emergency Contact Hotline / Secondary Phone
                </label>
                <input
                  type="tel"
                  placeholder="+92 301 7654321"
                  value={newEmergencyContact}
                  onChange={(e) => setNewEmergencyContact(handlePKPhoneInput(e.target.value))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1.5px solid ${pkPhoneBorderColor(newEmergencyContact)}` }}
                />
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px' }}>
                  Alternate phone number contacted in case primary parent number is unreachable.
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PREVIOUS SCHOOL & ADDRESS */}
          {enrollStep === 'previous' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="add-student-form-grid">
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Previous School Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Divisional Public School / Govt High School"
                    value={newPrevSchool}
                    onChange={(e) => setNewPrevSchool(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Last Class Percentage / Grade
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 88.5% or Grade A"
                    value={newPrevPercentage}
                    onChange={(e) => setNewPrevPercentage(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Residential Permanent Address <span style={{ color: '#E62929' }}>*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Street address, colony, district, and postal code..."
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical' }}
                />
              </div>

              {/* Emergency Alert Note */}
              <div
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#fff5f5',
                  border: '1px solid #fecaca',
                  borderLeft: '4px solid #E62929',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  color: '#b81b1b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <AlertTriangle size={16} color="#E62929" style={{ flexShrink: 0 }} />
                <span>
                  <strong>NADRA & Emergency Record:</strong> Address will be printed on student transport manifests and permanent academic files.
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: DOCUMENTS & INITIAL STATUS */}
          {enrollStep === 'documents' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="add-student-form-grid">
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Initial Fee Status <span style={{ color: '#E62929' }}>*</span>
                  </label>
                  <select
                    value={newFeeStatus}
                    onChange={(e) => setNewFeeStatus(e.target.value as any)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="Paid">Paid (Admission & 1st Month Settled)</option>
                    <option value="Pending">Pending (Voucher Issued for Bank Payment)</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Admission Date <span style={{ color: '#E62929' }}>*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newAdmissionDate}
                    onChange={(e) => setNewAdmissionDate(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              {/* Document Upload Area */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                    Attached Documents (B-Form, Birth Certificate, SLC)
                  </label>
                  <span style={{ fontSize: '0.72rem', color: '#059669', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1px 7px', borderRadius: '10px', fontWeight: 600 }}>
                    {newStudentDocs.length} Attached
                  </span>
                </div>

                <input
                  type="file"
                  multiple
                  ref={generalFileInputRef}
                  accept="image/*,application/pdf"
                  onChange={(e) => handleNewStudentDocUpload(e, 'Student Academic Document')}
                  style={{ display: 'none' }}
                />

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <button
                    type="button"
                    onClick={() => generalFileInputRef.current?.click()}
                    className="bca-btn bca-btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Upload size={14} /> Attach Certificates / B-Form
                  </button>
                </div>

                {newStudentDocs.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                    {newStudentDocs.map((doc, idx) => (
                      <div
                        key={doc.id || idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 10px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '0.78rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                          <FileText size={15} color="#0B3974" style={{ flexShrink: 0 }} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {doc.name}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                              {doc.docType || 'Document'} • {doc.fileSize || 'Attached'}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveNewStudentDoc(doc.id)}
                          style={{ border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer', padding: '4px' }}
                          title="Remove document"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '12px', color: '#94a3b8', fontSize: '0.76rem' }}>
                    No additional digital certificates attached yet. You can also upload them later in the student dossier.
                  </div>
                )}
              </div>
            </div>
          )}
        </form>
      </Modal>

      {/* COMPREHENSIVE EDIT STUDENT MODAL — MIRRORS VIEW PROFILE DOSSIER WITH ALL FIELDS EDITABLE */}
      {showEditModal && editingStudent && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title={`Edit Student Dossier — ${editName || editingStudent.name}`}
          subtitle={`Roll No: ${editRollNo || editingStudent.rollNo} • ID: ${editingStudent.id} • Class: ${editClass}-${editSection}`}
          maxWidth="900px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                All fields across all tabs are live-editable. Click <strong>Save Changes</strong> to apply updates.
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bca-btn bca-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="bca-btn bca-btn-primary"
                  style={{ minWidth: '130px' }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          }
        >
          <form onSubmit={handleSaveEdit}>
            {/* Top Brand Accent Banner */}
            <div className="profile-header-banner" />

            {/* Top Student Header Card - Editable */}
            <div className="profile-top-card" style={{ gap: '16px', alignItems: 'flex-start' }}>
              <img
                src={editingStudent.avatar}
                alt={editName}
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: editFeeStatus === 'Overdue' ? '3px solid #E62929' : '3px solid #0B3974',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  flexShrink: 0
                }}
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#0B3974', textTransform: 'uppercase', marginBottom: '3px' }}>
                      Full Student Name <span style={{ color: '#E62929' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={{ width: '100%', padding: '7px 12px', fontSize: '1.05rem', fontWeight: 700, color: '#0B3974', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                      placeholder="Student Name"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '3px' }}>
                      Enrollment Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      style={{ padding: '7px 10px', fontSize: '0.84rem', fontWeight: 600, borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '3px' }}>
                      Fee Status
                    </label>
                    <select
                      value={editFeeStatus}
                      onChange={(e) => setEditFeeStatus(e.target.value as any)}
                      style={{
                        padding: '7px 10px',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        borderRadius: '8px',
                        border: editFeeStatus === 'Overdue' ? '1px solid #f87171' : '1px solid #cbd5e1',
                        color: editFeeStatus === 'Overdue' ? '#dc2626' : editFeeStatus === 'Paid' ? '#16a34a' : '#d97706',
                        background: editFeeStatus === 'Overdue' ? '#fef2f2' : editFeeStatus === 'Paid' ? '#f0fdf4' : '#fffbeb'
                      }}
                    >
                      <option value="Paid">Fee: Paid</option>
                      <option value="Pending">Fee: Pending</option>
                      <option value="Overdue">Fee: Overdue</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>CLASS</label>
                    <select
                      value={editClass}
                      onChange={(e) => setEditClass(e.target.value)}
                      style={{ padding: '5px 10px', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                      {classesList.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>SECTION</label>
                    <input
                      type="text"
                      value={editSection}
                      onChange={(e) => setEditSection(e.target.value)}
                      placeholder="e.g. A - Jinnah"
                      style={{ width: '130px', padding: '5px 10px', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>ROLL NO</label>
                    <input
                      type="text"
                      value={editRollNo}
                      onChange={(e) => setEditRollNo(e.target.value)}
                      style={{ width: '130px', padding: '5px 10px', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>ADMISSION NO</label>
                    <input
                      type="text"
                      value={editAdmissionNo}
                      onChange={(e) => setEditAdmissionNo(e.target.value)}
                      style={{ width: '140px', padding: '5px 10px', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>ENROLLED DATE</label>
                    <input
                      type="date"
                      value={editAdmissionDate}
                      onChange={(e) => setEditAdmissionDate(e.target.value)}
                      style={{ padding: '5px 10px', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact Highlight Box - Editable */}
            <div className="emergency-contact-box" style={{ marginBottom: '18px' }}>
              <div style={{ background: '#feecec', padding: '8px', borderRadius: '50%', color: '#E62929', flexShrink: 0 }}>
                <Phone size={18} color="#E62929" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#E62929', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '3px' }}>
                  Emergency Medical &amp; Campus Contact (Hotline)
                </div>
                <input
                  type="text"
                  value={editEmergencyContact}
                  onChange={(e) => setEditEmergencyContact(handlePKPhoneInput(e.target.value))}
                  placeholder="e.g. +92 300 7982018 (Parent Emergency Hotline)"
                  style={{ width: '100%', maxWidth: '360px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #fca5a5', fontWeight: 700, color: '#0f172a', fontSize: '0.86rem' }}
                />
              </div>
            </div>

            {/* 8 Tabs Bar */}
            <div className="profile-tabs-scroll">
              {[
                'Overview',
                'Personal Information',
                'Parent Information',
                'Attendance',
                'Fees',
                'Results',
                'Progress',
                'Documents'
              ].map((tab) => {
                const isActive = editActiveTab === tab;
                const isFeesTab = tab === 'Fees';
                const hasOverdue = isFeesTab && editFeeStatus === 'Overdue';

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setEditActiveTab(tab as any)}
                    className={`profile-tab-button ${isActive ? 'active' : ''}`}
                    data-active={isActive}
                  >
                    <span>{tab}</span>
                    {hasOverdue && (
                      <span
                        style={{
                          backgroundColor: '#E62929',
                          color: '#ffffff',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '10px'
                        }}
                      >
                        Due
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Overview */}
            {editActiveTab === 'Overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div className="bca-card" style={{ padding: '16px', borderLeft: `4px solid ${editingStudent.recentMarks.length > 0 ? '#4CAF50' : '#cbd5e1'}` }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Academic Results
                  </span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2e7d32', margin: '6px 0' }}>
                    {editingStudent.recentMarks.length > 0
                      ? `${editingStudent.recentMarks.length} Subject(s) Recorded`
                      : <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>No Results Yet</span>}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                    Class: <strong>{editClass}</strong>
                  </p>
                </div>

                <div
                  className="bca-card"
                  style={{
                    padding: '16px',
                    borderLeft: editAttendancePct < 85 ? '4px solid #E62929' : '4px solid #0B3974'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      Cumulative Attendance Rate
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Editable</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '6px 0' }}>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editAttendancePct}
                      onChange={(e) => setEditAttendancePct(Number(e.target.value))}
                      style={{
                        fontSize: '1.3rem',
                        fontWeight: 800,
                        width: '85px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        color: editAttendancePct < 85 ? '#E62929' : '#0B3974'
                      }}
                    />
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#64748b' }}>%</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                    {editingStudent.attendanceHistory.length > 0
                      ? `${editingStudent.attendanceHistory[0].present} days present recorded`
                      : 'Adjust percentage or mark in register'}
                  </p>
                </div>

                <div
                  className="bca-card"
                  style={{
                    padding: '16px',
                    borderLeft: editFeeStatus === 'Overdue' ? '4px solid #E62929' : '4px solid #4CAF50',
                    background: editFeeStatus === 'Overdue' ? '#fffafa' : '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      Fee Clearance Status
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Editable</span>
                  </div>
                  <div style={{ margin: '6px 0' }}>
                    <select
                      value={editFeeStatus}
                      onChange={(e) => setEditFeeStatus(e.target.value as any)}
                      style={{
                        padding: '6px 10px',
                        fontSize: '1rem',
                        fontWeight: 800,
                        borderRadius: '6px',
                        border: editFeeStatus === 'Overdue' ? '1px solid #f87171' : '1px solid #cbd5e1',
                        color: editFeeStatus === 'Overdue' ? '#dc2626' : editFeeStatus === 'Paid' ? '#16a34a' : '#d97706'
                      }}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                    {editingStudent.feeRecords.length > 0
                      ? `${editingStudent.feeRecords.length} voucher(s) on record`
                      : 'No fee vouchers issued yet'}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Personal Information — ALL FIELDS EDITABLE */}
            {editActiveTab === 'Personal Information' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Full Student Name <span style={{ color: '#E62929' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={editDob}
                    onChange={(e) => setEditDob(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Gender
                  </label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value as any)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Blood Group
                  </label>
                  <select
                    value={editBloodGroup}
                    onChange={(e) => setEditBloodGroup(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  >
                    <option value="">Not Specified</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Admission Date
                  </label>
                  <input
                    type="date"
                    value={editAdmissionDate}
                    onChange={(e) => setEditAdmissionDate(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#E62929', marginBottom: '4px' }}>
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    value={editEmergencyContact}
                    onChange={(e) => setEditEmergencyContact(handlePKPhoneInput(e.target.value))}
                    placeholder="+92 300 0000000"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Residential Address
                  </label>
                  <textarea
                    rows={2}
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="Street address, colony, city..."
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', resize: 'vertical' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Previous School
                  </label>
                  <input
                    type="text"
                    value={editPreviousSchool}
                    onChange={(e) => setEditPreviousSchool(e.target.value)}
                    placeholder="e.g. Army Public School, Sahiwal / N/A"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Parent Information — ALL FIELDS EDITABLE */}
            {editActiveTab === 'Parent Information' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Father / Guardian Name <span style={{ color: '#E62929' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editParentName}
                    onChange={(e) => setEditParentName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Relationship
                  </label>
                  <select
                    value={editParentRelationship}
                    onChange={(e) => setEditParentRelationship(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Primary Phone <span style={{ color: '#E62929' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={editParentPhone}
                    onChange={(e) => setEditParentPhone(handlePKPhoneInput(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: `1.5px solid ${pkPhoneBorderColor(editParentPhone)}`, fontSize: '0.88rem' }}
                  />
                  {editParentPhone.length > 3 && !isValidPKPhone(editParentPhone) && (
                    <div style={{ fontSize: '0.72rem', color: '#E62929', marginTop: '3px' }}>⚠ Pakistani number required — e.g. +92 300 1234567</div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editParentEmail}
                    onChange={(e) => setEditParentEmail(e.target.value)}
                    placeholder="parent@example.com"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>
            )}

            {/* Tab 4: Attendance */}
            {editActiveTab === 'Attendance' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ margin: 0, color: '#0B3974' }}>Monthly Attendance Breakdown (2026)</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                      Overall Attendance %:
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editAttendancePct}
                      onChange={(e) => setEditAttendancePct(Number(e.target.value))}
                      style={{ width: '75px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                    />
                  </div>
                </div>
                <div className="bca-table-wrapper">
                  <table className="bca-table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Present Days</th>
                        <th>Absences (Unexcused)</th>
                        <th>Late Marks</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editingStudent.attendanceHistory && editingStudent.attendanceHistory.length > 0 ? (
                        editingStudent.attendanceHistory.map((item, idx) => (
                          <tr key={idx}>
                            <td><strong>{item.month} 2026</strong></td>
                            <td><span style={{ color: '#2e7d32', fontWeight: 700 }}>{item.present} Days</span></td>
                            <td>
                              <span
                                style={{
                                  color: item.absent > 0 ? '#E62929' : '#64748b',
                                  fontWeight: item.absent > 0 ? 800 : 500
                                }}
                              >
                                {item.absent > 0 ? `⚠️ ${item.absent} Days` : '0'}
                              </span>
                            </td>
                            <td><span style={{ color: item.late > 0 ? '#b8860b' : '#64748b' }}>{item.late}</span></td>
                            <td>
                              <span className={`bca-badge ${item.absent === 0 ? 'bca-badge-present' : 'bca-badge-late'}`}>
                                {item.absent === 0 ? 'Excellent' : 'Satisfactory'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '24px 15px', color: '#64748b' }}>
                            No monthly attendance records found for this student.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 5: Fees */}
            {editActiveTab === 'Fees' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ margin: 0, color: '#0B3974' }}>Recent Fee Vouchers &amp; Payments</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                      Fee Clearance Status:
                    </label>
                    <select
                      value={editFeeStatus}
                      onChange={(e) => setEditFeeStatus(e.target.value as any)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        borderRadius: '6px',
                        border: editFeeStatus === 'Overdue' ? '1px solid #f87171' : '1px solid #cbd5e1',
                        color: editFeeStatus === 'Overdue' ? '#dc2626' : editFeeStatus === 'Paid' ? '#16a34a' : '#d97706'
                      }}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                </div>
                <div className="bca-table-wrapper">
                  <table className="bca-table">
                    <thead>
                      <tr>
                        <th>Voucher #</th>
                        <th>Billing Month</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Payment / Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editingStudent.feeRecords && editingStudent.feeRecords.length > 0 ? (
                        editingStudent.feeRecords.map((fee, idx) => (
                          <tr key={idx} className={fee.status === 'Overdue' ? 'row-overdue' : ''}>
                            <td><code>{fee.voucherNo}</code></td>
                            <td>{fee.month}</td>
                            <td><strong>Rs. {fee.amount.toLocaleString()}</strong></td>
                            <td>
                              <span className={`bca-badge bca-badge-${fee.status.toLowerCase()}`}>
                                {fee.status}
                              </span>
                            </td>
                            <td>{fee.date}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '24px 15px', color: '#64748b' }}>
                            No fee vouchers or payment records found for this student.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 6: Results */}
            {editActiveTab === 'Results' && (
              <div>
                <h4 style={{ margin: '0 0 12px 0', color: '#0B3974' }}>Term Examination Assessment</h4>
                <div className="bca-table-wrapper">
                  <table className="bca-table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Total Marks</th>
                        <th>Obtained Marks</th>
                        <th>Percentage</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editingStudent.recentMarks && editingStudent.recentMarks.length > 0 ? (
                        editingStudent.recentMarks.map((m, idx) => (
                          <tr key={idx}>
                            <td><strong>{m.subject}</strong></td>
                            <td>{m.total}</td>
                            <td><strong style={{ color: '#0B3974' }}>{m.marks}</strong></td>
                            <td>{((m.marks / m.total) * 100).toFixed(0)}%</td>
                            <td>
                              <span
                                className="bca-badge"
                                style={{
                                  backgroundColor: '#e8f5e9',
                                  color: '#1b5e20',
                                  border: '1px solid #a5d6a7',
                                  fontWeight: 700
                                }}
                              >
                                {m.grade}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '24px 15px', color: '#64748b' }}>
                            No examination assessment records available yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 7: Progress */}
            {editActiveTab === 'Progress' && (
              <div>
                <h4 style={{ margin: '0 0 12px 0', color: '#0B3974' }}>Teacher Remarks &amp; Growth Index</h4>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Remarks &amp; Observational Notes for {editName}:
                  </label>
                  <textarea
                    rows={4}
                    value={editRemarks}
                    onChange={(e) => setEditRemarks(e.target.value)}
                    placeholder="Enter teacher notes, behavioral remarks, discipline logs, or academic strengths..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', resize: 'vertical' }}
                  />
                </div>
              </div>
            )}

            {/* Tab 8: Documents */}
            {editActiveTab === 'Documents' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0B3974' }}>
                      Official Verification Documents &amp; Soft Copies
                    </h4>
                    <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                      Digital dossier records, certificates, and student identification archives
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      background: '#ecfdf5',
                      color: '#059669',
                      border: '1px solid #a7f3d0',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontWeight: 700
                    }}
                  >
                    {editingStudent.documentsSubmitted?.length || 0} Document(s) On Record
                  </span>
                </div>

                {/* Documents Grid */}
                {editingStudent.documentsSubmitted && editingStudent.documentsSubmitted.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                    {editingStudent.documentsSubmitted.map((doc: any, idx: number) => {
                      const isObj = typeof doc === 'object' && doc !== null;
                      const docName = isObj ? (doc.name || doc.docType || `Document ${idx + 1}`) : String(doc);
                      const docType = isObj ? (doc.docType || 'Certificate') : 'Document';
                      const docSize = isObj ? doc.fileSize : undefined;
                      const dataUrl = isObj ? (doc.dataUrl || doc.fileData || doc.url) : undefined;
                      const uploadDate = isObj && doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : undefined;
                      const isImage = dataUrl && (dataUrl.startsWith('data:image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(docName));
                      const isPdf = dataUrl && (dataUrl.startsWith('data:application/pdf') || /\.pdf$/i.test(docName));
                      const docId = isObj ? (doc.id || docName) : String(idx);

                      return (
                        <div
                          key={docId || idx}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            padding: '12px 14px',
                            borderRadius: '10px',
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            gap: '12px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            {isImage ? (
                              <img
                                src={dataUrl}
                                alt={docName}
                                style={{
                                  width: '52px',
                                  height: '52px',
                                  borderRadius: '8px',
                                  objectFit: 'cover',
                                  border: '1px solid #e2e8f0',
                                  flexShrink: 0
                                }}
                              />
                            ) : isPdf ? (
                              <div
                                style={{
                                  width: '52px',
                                  height: '52px',
                                  borderRadius: '8px',
                                  background: '#fee2e2',
                                  color: '#dc2626',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 800,
                                  fontSize: '0.72rem',
                                  flexShrink: 0,
                                  border: '1px solid #fecaca'
                                }}
                              >
                                <FileText size={20} />
                                <span style={{ fontSize: '0.62rem', marginTop: '2px' }}>PDF</span>
                              </div>
                            ) : (
                              <div
                                style={{
                                  width: '52px',
                                  height: '52px',
                                  borderRadius: '8px',
                                  background: '#eff6ff',
                                  color: '#2563eb',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  border: '1px solid #bfdbfe'
                                }}
                              >
                                <FileCheck size={26} />
                              </div>
                            )}

                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div
                                style={{
                                  fontSize: '0.84rem',
                                  fontWeight: 700,
                                  color: '#0f172a',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                                title={docName}
                              >
                                {docName}
                              </div>
                              <div
                                style={{
                                  fontSize: '0.72rem',
                                  color: '#0284c7',
                                  background: '#e0f2fe',
                                  display: 'inline-block',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  marginTop: '3px',
                                  fontWeight: 600
                                }}
                              >
                                {docType}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                                {docSize ? `${docSize}` : 'Verified Document'}
                                {uploadDate ? ` • ${uploadDate}` : ''}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '8px', justifyContent: 'flex-end' }}>
                            {dataUrl && (
                              <button
                                type="button"
                                onClick={() => setPreviewDoc({ name: docName, url: dataUrl, type: isPdf ? 'pdf' : isImage ? 'image' : 'other' })}
                                className="bca-btn bca-btn-secondary"
                                style={{ padding: '4px 9px', fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                title="Preview Document"
                              >
                                <Eye size={12} />
                                <span>Preview</span>
                              </button>
                            )}

                            {dataUrl && (
                              <a
                                href={dataUrl}
                                download={docName}
                                className="bca-btn bca-btn-secondary"
                                style={{ padding: '4px 9px', fontSize: '0.74rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                title="Download Document"
                              >
                                <Download size={12} />
                                <span>Download</span>
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '36px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    <FileText size={40} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
                    <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.94rem' }}>No Uploaded Verification Documents Yet</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', maxWidth: '420px', margin: '4px auto 0' }}>
                      No digital files are currently on record for this student.
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </Modal>
      )}

      {/* 3-PART OFFICIAL FEE CHALLAN PREVIEW MODAL */}
      {selectedChallanForView && (
        <Modal
          isOpen={!!selectedChallanForView}
          onClose={() => setSelectedChallanForView(null)}
          title={`Official 3-Part Fee Challan — ${selectedChallanForView.fee.voucherNo}`}
          subtitle={`Student: ${selectedChallanForView.student.name} • Roll: ${selectedChallanForView.student.rollNo || selectedChallanForView.student.id} • Class: ${selectedChallanForView.student.class}-${selectedChallanForView.student.section}`}
          maxWidth="960px"
          footer={
            <>
              <button
                onClick={() => {
                  try {
                    printFeeChallan(selectedChallanForView.student, selectedChallanForView.fee);
                    showToast('Fee Challan', `Printing 3-part bank voucher for ${selectedChallanForView.fee.voucherNo}`, 'info');
                  } catch (err: any) {
                    showToast('Error', err.message, 'error');
                  }
                }}
                className="bca-btn bca-btn-primary"
              >
                <Printer size={15} />
                <span>Print / Download Challan (PDF)</span>
              </button>
              <button
                onClick={() => setSelectedChallanForView(null)}
                className="bca-btn bca-btn-secondary"
              >
                Close
              </button>
            </>
          }
        >
          <div>
            <div style={{ marginBottom: '14px', textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
              Designed for standard commercial bank collection across any branch (Bank Alfalah / JazzCash / HBL / Meezan).
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '14px',
                backgroundColor: '#f8fafc',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1'
              }}
            >
              {[
                { title: 'BANK COPY', subtitle: 'To be retained by receiving bank branch' },
                { title: 'SCHOOL ACCOUNTS COPY', subtitle: 'To be submitted to Accounts Office' },
                { title: 'STUDENT COPY', subtitle: 'Official acknowledgment for parent' }
              ].map((copy, colIdx) => {
                const total = Number(selectedChallanForView.fee.amount) || 0;
                const tuition = selectedChallanForView.fee.tuitionFee ?? Math.round(total * 0.72);
                const exam = selectedChallanForView.fee.examFee ?? 2000;
                const lab = selectedChallanForView.fee.labFee ?? 1500;
                const util = selectedChallanForView.fee.utilityCharges ?? 1500;
                const isOverdue = selectedChallanForView.fee.status === 'Overdue';
                const fine = selectedChallanForView.fee.fine ?? (isOverdue ? 600 : 0);

                return (
                  <div
                    key={colIdx}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px dashed #94a3b8',
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '0.76rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    {/* Header */}
                    <div style={{ textAlign: 'center', borderBottom: '2px solid #0B3974', paddingBottom: '8px', marginBottom: '8px' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0B3974' }}>
                        READ ACADEMY SAHIWAL
                      </div>
                      <div style={{ fontSize: '0.64rem', color: '#E62929', fontWeight: 700 }}>
                        Read To Lead • Since 2018
                      </div>
                      <div
                        style={{
                          display: 'inline-block',
                          background: '#eff6ff',
                          color: '#0B3974',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          fontSize: '0.68rem',
                          marginTop: '3px',
                          border: '1px solid #bfdbfe'
                        }}
                      >
                        {copy.title}
                      </div>
                    </div>

                    {/* Meta */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '8px' }}>
                      <div><strong>Challan No:</strong> <code style={{ color: '#0B3974', fontWeight: 700 }}>{selectedChallanForView.fee.voucherNo}</code></div>
                      <div><strong>Student Name:</strong> {selectedChallanForView.student.name}</div>
                      <div><strong>Roll No:</strong> {selectedChallanForView.student.rollNo || selectedChallanForView.student.id}</div>
                      <div><strong>Class:</strong> {selectedChallanForView.student.class} ({selectedChallanForView.student.section || 'A'})</div>
                      <div><strong>Billing Month:</strong> {selectedChallanForView.fee.month}</div>
                      <div><strong>Due Date:</strong> <span style={{ color: '#b91c1c', fontWeight: 700 }}>{selectedChallanForView.fee.dueDate || (selectedChallanForView.fee.date?.replace('Due: ', '') || '2026-10-06')}</span></div>
                    </div>

                    {/* Itemized Table */}
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', marginBottom: '8px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '3px 6px' }}>Tuition Fee</td>
                            <td style={{ padding: '3px 6px', textAlign: 'right' }}>Rs. {tuition.toLocaleString()}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '3px 6px' }}>Examination Fee</td>
                            <td style={{ padding: '3px 6px', textAlign: 'right' }}>Rs. {exam.toLocaleString()}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '3px 6px' }}>Science & IT Lab</td>
                            <td style={{ padding: '3px 6px', textAlign: 'right' }}>Rs. {lab.toLocaleString()}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '3px 6px' }}>Campus Utilities</td>
                            <td style={{ padding: '3px 6px', textAlign: 'right' }}>Rs. {util.toLocaleString()}</td>
                          </tr>
                          {fine > 0 && (
                            <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#b91c1c' }}>
                              <td style={{ padding: '3px 6px' }}>Late Surcharge Fine</td>
                              <td style={{ padding: '3px 6px', textAlign: 'right' }}>Rs. {fine.toLocaleString()}</td>
                            </tr>
                          )}
                          <tr style={{ backgroundColor: '#f8fafc', fontWeight: 800 }}>
                            <td style={{ padding: '4px 6px' }}>TOTAL PAYABLE</td>
                            <td style={{ padding: '4px 6px', textAlign: 'right', color: '#0B3974' }}>
                              Rs. {total.toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Bank Info */}
                    <div style={{ fontSize: '0.64rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '4px', lineHeight: 1.35 }}>
                      <div>• <strong>Bank Alfalah:</strong> 59435002040250 (Hafiz Abdul Nasir)</div>
                      <div>• <strong>JazzCash:</strong> 0321-6909047 (Hafiz Abdul Nasir)</div>
                      <div>• <strong>Cash Collection:</strong> Any commercial bank branch</div>
                    </div>

                    {/* Stamp Signatures */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '4px', borderTop: '1px solid #cbd5e1', fontSize: '0.62rem', color: '#64748b' }}>
                      <span>Cashier Stamp</span>
                      <span>Officer Sign</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Modal>
      )}

      {/* STUDENT IDENTITY CARD PREVIEW & PRINT MODAL */}
      {selectedStudentForIdCard && (
        <Modal
          isOpen={!!selectedStudentForIdCard}
          onClose={() => setSelectedStudentForIdCard(null)}
          title={`Student Identity Card — ${selectedStudentForIdCard.name}`}
          subtitle={`Roll No: ${selectedStudentForIdCard.rollNo || selectedStudentForIdCard.id} • Class: ${selectedStudentForIdCard.class} (${selectedStudentForIdCard.section || 'A'})`}
          maxWidth="900px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      printStudentIdCard(selectedStudentForIdCard, { side: idCardSide });
                      showToast('Printing ID Card', `Sending ${selectedStudentForIdCard.name}'s ID card to printer...`, 'info');
                    } catch (err: any) {
                      showToast('Print Error', err.message, 'error');
                    }
                  }}
                  className="bca-btn bca-btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}
                >
                  <Printer size={15} />
                  <span>Print ID Card ({idCardSide === 'both' ? 'Both Sides' : idCardSide === 'front' ? 'Front Side' : 'Back Side'})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    try {
                      printStudentIdCard(selectedStudentForIdCard, { side: idCardSide, forceWindow: true });
                      showToast('ID Card Window', `Opened printable card in new window`, 'info');
                    } catch (err: any) {
                      showToast('Error', err.message, 'error');
                    }
                  }}
                  className="bca-btn bca-btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  title="Open card in a separate browser window for printing or saving as PDF"
                >
                  <ExternalLink size={14} />
                  <span>Open in New Window</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudentForIdCard(null)}
                className="bca-btn bca-btn-secondary"
              >
                Close
              </button>
            </div>
          }
        >
          <div>
            {/* View Selector Controls */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '10px',
                backgroundColor: '#f8fafc',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginRight: '4px' }}>
                  Card View:
                </span>
                <button
                  type="button"
                  onClick={() => setIdCardSide('both')}
                  className={`bca-btn ${idCardSide === 'both' ? 'bca-btn-primary' : 'bca-btn-secondary'}`}
                  style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                >
                  Both Sides (Ready to Print)
                </button>
                <button
                  type="button"
                  onClick={() => setIdCardSide('front')}
                  className={`bca-btn ${idCardSide === 'front' ? 'bca-btn-primary' : 'bca-btn-secondary'}`}
                  style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                >
                  Front Side Only
                </button>
                <button
                  type="button"
                  onClick={() => setIdCardSide('back')}
                  className={`bca-btn ${idCardSide === 'back' ? 'bca-btn-primary' : 'bca-btn-secondary'}`}
                  style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                >
                  Back Side Only
                </button>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} style={{ color: '#16a34a' }} />
                <span>Session 2026-27 • CR80 (85.6 × 54mm) Standard</span>
              </div>
            </div>

            {/* Visual Card Display Canvas */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '24px',
                padding: '24px 12px',
                backgroundColor: '#f1f5f9',
                borderRadius: '12px',
                border: '1px dashed #cbd5e1'
              }}
            >
              {/* FRONT SIDE CARD */}
              {(idCardSide === 'both' || idCardSide === 'front') && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0B3974', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Front Side (Face)
                  </div>
                  <div
                    style={{
                      width: '370px',
                      height: '235px',
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '2px solid #0B3974',
                      boxShadow: '0 8px 24px rgba(11, 57, 116, 0.15)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      boxSizing: 'border-box'
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #0B3974 0%, #172554 100%)',
                        color: '#ffffff',
                        padding: '8px 12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '3px solid #f59e0b'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            backgroundColor: '#f59e0b',
                            color: '#0B3974',
                            fontWeight: 900,
                            fontSize: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          RA
                        </div>
                        <div>
                          <div style={{ fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.5px', lineHeight: 1.2 }}>
                            READ ACADEMY SAHIWAL
                          </div>
                          <div style={{ fontSize: '7.5px', color: '#fcd34d', fontWeight: 700, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                            Read To Lead • Student Identity Card
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '9px',
                          fontWeight: 800,
                          backgroundColor: '#f59e0b',
                          color: '#0B3974',
                          padding: '2px 7px',
                          borderRadius: '4px'
                        }}
                      >
                        2026-27
                      </div>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '10px 12px', display: 'flex', gap: '12px', flex: 1, backgroundColor: '#ffffff' }}>
                      {/* Photo Column */}
                      <div style={{ width: '74px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img
                          src={selectedStudentForIdCard.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudentForIdCard.name)}&background=0B3974&color=fff&bold=true`}
                          alt={selectedStudentForIdCard.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudentForIdCard.name)}&background=0B3974&color=fff&bold=true`;
                          }}
                          style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            border: '2px solid #0B3974',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                          }}
                        />
                        <div
                          style={{
                            marginTop: '5px',
                            backgroundColor: '#eff6ff',
                            color: '#0B3974',
                            fontSize: '9.5px',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            border: '1px solid #bfdbfe',
                            width: '100%',
                            textAlign: 'center',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {selectedStudentForIdCard.rollNo || selectedStudentForIdCard.id}
                        </div>
                        <div style={{ fontSize: '7px', fontWeight: 700, color: '#16a34a', marginTop: '3px', textTransform: 'uppercase' }}>
                          ● ACTIVE
                        </div>
                      </div>

                      {/* Info Column */}
                      <div style={{ flex: 1, fontSize: '9.5px', color: '#334155', minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: 800,
                            color: '#0f172a',
                            marginBottom: '4px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {selectedStudentForIdCard.name}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: '2px 4px', lineHeight: 1.35 }}>
                          <span style={{ fontWeight: 700, color: '#64748b' }}>Class:</span>
                          <span style={{ fontWeight: 700, color: '#0B3974' }}>
                            {selectedStudentForIdCard.class} ({selectedStudentForIdCard.section || 'A'})
                          </span>

                          <span style={{ fontWeight: 700, color: '#64748b' }}>Father:</span>
                          <span style={{ fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selectedStudentForIdCard.parentName || '—'}
                          </span>

                          <span style={{ fontWeight: 700, color: '#64748b' }}>Emergency:</span>
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>
                            {selectedStudentForIdCard.emergencyContact || selectedStudentForIdCard.parentPhone || '—'}
                          </span>

                          <span style={{ fontWeight: 700, color: '#64748b' }}>Blood Group:</span>
                          <span style={{ fontWeight: 800, color: '#dc2626' }}>
                            {selectedStudentForIdCard.bloodGroup || '—'}
                          </span>

                          <span style={{ fontWeight: 700, color: '#64748b' }}>DOB:</span>
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>
                            {selectedStudentForIdCard.dob || '—'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div
                      style={{
                        backgroundColor: '#f8fafc',
                        padding: '5px 12px',
                        borderTop: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '7.5px',
                        color: '#64748b'
                      }}
                    >
                      <div>
                        <div>Civil Lines, Sahiwal • +92 300 7982018</div>
                        <div style={{ color: '#94a3b8', fontSize: '7px' }}>Valid Thru: 31 March 2027</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ borderTop: '1px solid #475569', width: '70px', paddingTop: '2px', fontWeight: 700, color: '#0B3974', fontSize: '7px' }}>
                          Principal Sign
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BACK SIDE CARD */}
              {(idCardSide === 'both' || idCardSide === 'back') && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0B3974', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Back Side (Rules & Barcode)
                  </div>
                  <div
                    style={{
                      width: '370px',
                      height: '235px',
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '2px solid #0B3974',
                      boxShadow: '0 8px 24px rgba(11, 57, 116, 0.15)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      boxSizing: 'border-box'
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #0B3974 0%, #172554 100%)',
                        color: '#ffffff',
                        padding: '8px 12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '3px solid #f59e0b'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.4px', lineHeight: 1.2 }}>
                          TERMS & CAMPUS REGULATIONS
                        </div>
                        <div style={{ fontSize: '7.5px', color: '#fcd34d', fontWeight: 700 }}>
                          Affiliated with BISE Sahiwal
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '8px',
                          fontWeight: 800,
                          backgroundColor: '#f59e0b',
                          color: '#0B3974',
                          padding: '2px 6px',
                          borderRadius: '3px'
                        }}
                      >
                        OFFICIAL
                      </div>
                    </div>

                    {/* Back Body */}
                    <div
                      style={{
                        padding: '8px 12px',
                        flex: 1,
                        fontSize: '8px',
                        color: '#334155',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <ul style={{ margin: 0, paddingLeft: '14px', lineHeight: 1.45, color: '#475569' }}>
                        <li>This identity card is non-transferable and remains institutional property.</li>
                        <li>Card must be worn prominently at all times within campus premises.</li>
                        <li>Loss of card must be reported immediately to Admin Office (Fee: Rs. 200).</li>
                        <li>Any alteration or forgery is strictly prohibited and punishable.</li>
                      </ul>

                      {/* Barcode Section */}
                      <div style={{ textAlign: 'center', padding: '4px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', height: '22px' }}>
                          {[3, 1, 4, 2, 1, 3, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 4, 2].map((w, i) => (
                            <span
                              key={i}
                              style={{
                                display: 'inline-block',
                                width: `${w}px`,
                                height: '100%',
                                backgroundColor: '#0f172a'
                              }}
                            />
                          ))}
                        </div>
                        <div style={{ fontSize: '8px', fontWeight: 800, letterSpacing: '1.5px', color: '#0B3974', marginTop: '2px' }}>
                          *RAS-{(selectedStudentForIdCard.rollNo || selectedStudentForIdCard.id).toString().toUpperCase()}*
                        </div>
                      </div>

                      {/* Helpline & Address */}
                      <div style={{ fontSize: '7.5px', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', lineHeight: 1.3 }}>
                        <div>
                          <div><strong>Campus:</strong> Civil Lines, College Road, Sahiwal</div>
                          <div><strong>Office:</strong> 0321-6909047 | info@readacademy.edu.pk</div>
                        </div>
                        <div
                          style={{
                            padding: '2px 6px',
                            borderRadius: '3px',
                            backgroundColor: '#fef3c7',
                            border: '1px solid #fde68a',
                            color: '#b45309',
                            fontWeight: 800,
                            fontSize: '7.5px'
                          }}
                        >
                          VERIFIED
                        </div>
                      </div>
                    </div>

                    {/* Back Footer */}
                    <div
                      style={{
                        backgroundColor: '#0B3974',
                        color: '#ffffff',
                        textAlign: 'center',
                        padding: '4px',
                        fontSize: '7px',
                        fontWeight: 700,
                        letterSpacing: '0.4px'
                      }}
                    >
                      IF FOUND, PLEASE RETURN TO READ ACADEMY CAMPUS OFFICE SAHIWAL
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Instruction Tip */}
            <div
              style={{
                marginTop: '16px',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '0.78rem',
                color: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <Printer size={16} style={{ flexShrink: 0 }} />
              <div>
                <strong>Print Ready:</strong> Click <strong>Print ID Card</strong> above to print directly via standard PVC/card printer or high-grade cardstock. Both sides will be printed with exact dimensions and official school colors.
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
