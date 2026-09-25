export interface SchoolInfo {
  name: string;
  shortName: string;
  acronym: string;
  tagline: string;
  motto: string;
  levels: string;
  code: string;
  established: string;
  affiliation: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  admissionsEmail: string;
  hours: string;
  principal: string;
  vicePrincipal: string;
  campusArea: string;
  studentTeacherRatio: string;
  logo: string;
}

export const SCHOOL_INFO: SchoolInfo = {
  name: 'Read Academy Sahiwal',
  shortName: 'Read Academy',
  acronym: 'RA',
  tagline: 'Read To Lead',
  motto: 'Read To Lead',
  levels: 'Nursery to Matriculation, FA, FSC, ICS, I.Com & D.Com',
  code: 'RAS-SWL-2018',
  established: '2018',
  affiliation: 'BISE Sahiwal & Federal Board Curriculum',
  address: 'Main Campus, Sahiwal, Punjab, Pakistan',
  phone: '+92 (40) 446-2810 / 0321-6909047',
  whatsapp: '0321-6909047',
  email: 'info@readacademy.edu.pk',
  admissionsEmail: 'admissions@readacademy.edu.pk',
  hours: 'Mon - Fri: 07:30 AM - 02:30 PM | Sat: 08:00 AM - 12:30 PM',
  principal: 'Chaudhry Muhammad Aslam, M.Sc., M.Ed.',
  vicePrincipal: 'Mrs. Tahira Naeem, M.A. English',
  campusArea: '6 Acres',
  studentTeacherRatio: '15:1',
  logo: '/logo.png'
};

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}
