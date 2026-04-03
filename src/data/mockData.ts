export interface SchoolClass {
  id: string;
  level: string;
  variance: string;
  teacherName: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  classId: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  photoUrl: string;
  status?: 'active' | 'pending' | 'rejected';
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
}

export interface TimetableEntry {
  id: string;
  classId: string;
  day: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi';
  time: string;
  subject: string;
  teacher: string;
}

export const initialClasses: SchoolClass[] = [
  { id: 'c1', level: '6ème', variance: 'A', teacherName: 'M. Rakoto' },
  { id: 'c2', level: '6ème', variance: 'B', teacherName: 'Mme. Rasoa' },
  { id: 'c3', level: '5ème', variance: 'A', teacherName: 'M. Jean' },
  { id: 'c4', level: '5ème', variance: 'B', teacherName: 'Mme. Marie' },
];

export const initialStudents: Student[] = [
  { 
    id: 's1', 
    firstName: 'Tahina', 
    lastName: 'Andriana', 
    classId: 'c1', 
    parentName: 'Jean Andriana', 
    parentPhone: '034 00 000 01',
    parentEmail: 'jean.andriana@mail.com',
    photoUrl: 'https://i.pravatar.cc/150?u=s1'
  },
  { 
    id: 's2', 
    firstName: 'Miora', 
    lastName: 'Randria', 
    classId: 'c1', 
    parentName: 'Paul Randria', 
    parentPhone: '034 00 000 02',
    photoUrl: 'https://i.pravatar.cc/150?u=s2'
  },
];

export const teachers: Teacher[] = [
  { id: 't1', name: 'M. Rakoto', subject: 'Mathématiques' },
  { id: 't2', name: 'Mme. Rasoa', subject: 'Français' },
];

export const initialTimetables: TimetableEntry[] = [
  { id: 'tt1', classId: 'c1', day: 'Lundi', time: '08:00 - 10:00', subject: 'Mathématiques', teacher: 'M. Rakoto' },
  { id: 'tt2', classId: 'c1', day: 'Lundi', time: '10:00 - 12:00', subject: 'Français', teacher: 'Mme. Rasoa' },
  { id: 'tt3', classId: 'c2', day: 'Lundi', time: '08:00 - 10:00', subject: 'Français', teacher: 'Mme. Rasoa' },
  { id: 'tt4', classId: 'c2', day: 'Lundi', time: '10:00 - 12:00', subject: 'Mathématiques', teacher: 'M. Rakoto' },
];
