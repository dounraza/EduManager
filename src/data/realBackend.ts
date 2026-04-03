import { supabase } from './supabaseClient';

export class RealBackend {
  // --- Generic Delete Helper ---
  private async deleteRecord(table: string, id: string) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  // --- Students ---
  async getStudents() {
    const { data, error } = await supabase.from('students').select('*, classes(*)');
    if (error) throw error;
    return data.map((s: any) => ({
      id: s.id, firstName: s.first_name, lastName: s.last_name, classId: s.class_id,
      parentName: s.parent_name, parentPhone: s.parent_phone, parentEmail: s.parent_email, 
      photoUrl: s.photo_url, status: s.enrollment_status || 'active'
    }));
  }

  async addStudent(student: any) {
    const { data, error } = await supabase.from('students').insert([{
      first_name: student.firstName, last_name: student.lastName, class_id: student.classId,
      parent_name: student.parentName, parent_phone: student.parentPhone, parent_email: student.parentEmail,
      photo_url: student.photo_url || `https://i.pravatar.cc/150?u=${Math.random()}`,
      enrollment_status: student.status || 'pending'
    }]).select();
    if (error) throw error;
    return data[0];
  }

  async deleteStudent(id: string) { return this.deleteRecord('students', id); }

  async updateStudentStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('students')
      .update({ enrollment_status: status })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  }

  // --- Classes ---
  async getClasses() {
    const { data, error } = await supabase.from('classes').select('*, teachers(*)');
    if (error) throw error;
    return data.map((c: any) => ({
      id: c.id, level: c.level, variance: c.variance, teacherName: c.teacher_name, teacherId: c.teacher_id
    }));
  }

  async addClass(newClass: any) {
    const { data, error } = await supabase.from('classes').insert([{
      level: newClass.level, variance: newClass.variance, teacher_name: newClass.teacherName, teacher_id: newClass.teacherId
    }]).select();
    if (error) throw error;
    return data[0];
  }

  async deleteClass(id: string) { return this.deleteRecord('classes', id); }

  // --- Teachers ---
  async getTeachers() {
    const { data, error } = await supabase.from('teachers').select('*, subjects(*)');
    if (error) throw error;
    return data;
  }

  async addTeacher(teacher: any) {
    const { data, error } = await supabase.from('teachers').insert([{
      first_name: teacher.firstName, last_name: teacher.lastName, 
      subject_id: teacher.subjectId, email: teacher.email, phone: teacher.phone
    }]).select();
    if (error) throw error;
    return data[0];
  }

  async deleteTeacher(id: string) { return this.deleteRecord('teachers', id); }

  // --- Subjects ---
  async getSubjects() {
    const { data, error } = await supabase.from('subjects').select('*');
    if (error) throw error;
    return data;
  }

  async addSubject(name: string) {
    const { data, error } = await supabase.from('subjects').insert([{ name }]).select();
    if (error) throw error;
    return data[0];
  }

  async deleteSubject(id: string) { return this.deleteRecord('subjects', id); }

  // --- Timetables ---
  async getTimetableByClass(classId: string) {
    const { data, error } = await supabase.from('timetables')
      .select('*, subjects(*), teachers(*)')
      .eq('class_id', classId);
    if (error) throw error;
    return data;
  }

  async addTimetableEntry(entry: any) {
    const { data, error } = await supabase.from('timetables').insert([{
      class_id: entry.classId, day: entry.day, start_time: entry.startTime, 
      end_time: entry.endTime, subject_id: entry.subjectId, teacher_id: entry.teacherId
    }]).select();
    if (error) throw error;
    return data[0];
  }

  async deleteTimetableEntry(id: string) { return this.deleteRecord('timetables', id); }

  async updateTimetableEntry(id: string, entry: any) {
    const { data, error } = await supabase.from('timetables').update({
      day: entry.day, start_time: entry.startTime, end_time: entry.endTime, 
      subject_id: entry.subjectId, teacher_id: entry.teacherId
    }).eq('id', id).select();
    if (error) throw error;
    return data[0];
  }
}

export const realBackend = new RealBackend();
