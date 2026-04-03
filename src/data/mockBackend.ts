import type { SchoolClass, TimetableEntry } from './mockData';
import { initialStudents, initialClasses, initialTimetables } from './mockData';
import { realBackend } from './realBackend';

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return url && url !== 'YOUR_SUPABASE_URL' && key && key !== 'YOUR_SUPABASE_ANON_KEY';
};

class MockBackend {
  private students: any[] = [];
  private classes: SchoolClass[] = [];
  private timetables: TimetableEntry[] = [];
  private teachers: any[] = [];
  private subjects: any[] = [];

  constructor() {
    this.students = JSON.parse(localStorage.getItem('students') || JSON.stringify(initialStudents.map(s => ({ ...s, enrollment_status: 'active' }))));
    this.classes = JSON.parse(localStorage.getItem('classes') || JSON.stringify(initialClasses));
    this.timetables = JSON.parse(localStorage.getItem('timetables') || JSON.stringify(initialTimetables));
    this.teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    this.subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
  }

  private save() {
    localStorage.setItem('students', JSON.stringify(this.students));
    localStorage.setItem('classes', JSON.stringify(this.classes));
    localStorage.setItem('timetables', JSON.stringify(this.timetables));
    localStorage.setItem('teachers', JSON.stringify(this.teachers));
    localStorage.setItem('subjects', JSON.stringify(this.subjects));
  }

  async getStudents() {
    if (isSupabaseConfigured()) {
      return await realBackend.getStudents();
    }
    return this.students.map(s => ({ ...s, status: s.enrollment_status || 'active' }));
  }

  async addStudent(student: any) {
    if (isSupabaseConfigured()) return await realBackend.addStudent(student);
    const newStudent = { 
      ...student, 
      id: 's' + (this.students.length + 1), 
      photoUrl: `https://i.pravatar.cc/150?u=${Math.random()}`,
      enrollment_status: student.status || 'pending' 
    };
    this.students.push(newStudent); this.save(); return newStudent;
  }

  async updateStudentStatus(id: string, status: string) {
    if (isSupabaseConfigured()) return await realBackend.updateStudentStatus(id, status);
    const idx = this.students.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.students[idx].enrollment_status = status;
      this.save();
    }
    return true;
  }

  async deleteStudent(id: string) {
    if (isSupabaseConfigured()) return await realBackend.deleteStudent(id);
    this.students = this.students.filter(s => s.id !== id); this.save(); return true;
  }

  async getClasses() {
    if (isSupabaseConfigured()) return await realBackend.getClasses();
    return this.classes;
  }

  async addClass(newCls: any) {
    if (isSupabaseConfigured()) return await realBackend.addClass(newCls);
    const cls = { ...newCls, id: 'c' + (this.classes.length + 1) };
    this.classes.push(cls); this.save(); return cls;
  }

  async deleteClass(id: string) {
    if (isSupabaseConfigured()) return await realBackend.deleteClass(id);
    this.classes = this.classes.filter(c => c.id !== id); this.save(); return true;
  }

  async getTeachers() {
    if (isSupabaseConfigured()) return await realBackend.getTeachers();
    return this.teachers;
  }

  async addTeacher(teacher: any) {
    if (isSupabaseConfigured()) return await realBackend.addTeacher(teacher);
    const newTeacher = { ...teacher, id: 't' + (this.teachers.length + 1) };
    this.teachers.push(newTeacher); this.save(); return newTeacher;
  }

  async deleteTeacher(id: string) {
    if (isSupabaseConfigured()) return await realBackend.deleteTeacher(id);
    this.teachers = this.teachers.filter(t => t.id !== id); this.save(); return true;
  }

  async getSubjects() {
    if (isSupabaseConfigured()) return await realBackend.getSubjects();
    return this.subjects;
  }

  async addSubject(name: string) {
    if (isSupabaseConfigured()) return await realBackend.addSubject(name);
    const sub = { id: 'sub' + (this.subjects.length + 1), name };
    this.subjects.push(sub); this.save(); return sub;
  }

  async deleteSubject(id: string) {
    if (isSupabaseConfigured()) return await realBackend.deleteSubject(id);
    this.subjects = this.subjects.filter(s => s.id !== id); this.save(); return true;
  }

  async getTimetablesByClass(classId: string) {
    if (isSupabaseConfigured()) return await realBackend.getTimetableByClass(classId);
    return this.timetables.filter(t => t.classId === classId);
  }

  async addTimetableEntry(entry: any) {
    if (isSupabaseConfigured()) return await realBackend.addTimetableEntry(entry);
    const newEntry = { ...entry, id: 'tt' + (this.timetables.length + 1) };
    this.timetables.push(newEntry); this.save(); return newEntry;
  }

  async deleteTimetableEntry(id: string) {
    if (isSupabaseConfigured()) return await realBackend.deleteTimetableEntry(id);
    this.timetables = this.timetables.filter(t => t.id !== id); this.save(); return true;
  }

  async updateTimetableEntry(id: string, entry: any) {
    if (isSupabaseConfigured()) return await realBackend.updateTimetableEntry(id, entry);
    const idx = this.timetables.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.timetables[idx] = { ...this.timetables[idx], ...entry };
      this.save();
    }
    return true;
  }
}

export const backend = new MockBackend();
