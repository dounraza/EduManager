import React, { useEffect, useState } from 'react';
import { backend } from '../../data/mockBackend';
import { Loader2, Trash2, X } from 'lucide-react';

const TimetablePage = () => {
  const [classes, setClasses] = useState<any[]>([]);
  
  const formatTime = (time: string) => {
    if (!time) return '00:00:00';
    // If format is already HH:MM:SS
    if (time.split(':').length === 3) return time;
    // If format is HH:MM, append :00
    if (time.split(':').length === 2) return `${time}:00`;
    return time;
  };
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [timetables, setTimetables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [formData, setFormData] = useState({ day: 'Lundi', startTime: '', endTime: '', subjectId: '', teacherId: '' });

  const fetchData = async () => {
    try {
      const [c, s, t] = await Promise.all([backend.getClasses(), backend.getSubjects(), backend.getTeachers()]);
      setClasses(c); setSubjects(s); setTeachers(t);
      if (c.length > 0 && !selectedClassId) setSelectedClassId(c[0].id);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchTimetable = async () => {
    if (!selectedClassId) return;
    const data = await backend.getTimetablesByClass(selectedClassId);
    setTimetables(data || []);
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { fetchTimetable(); }, [selectedClassId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEntry) {
      await backend.updateTimetableEntry(editingEntry.id, formData);
    } else {
      await backend.addTimetableEntry({ ...formData, classId: selectedClassId });
    }
    setShowModal(false);
    setEditingEntry(null);
    setFormData({ day: 'Lundi', startTime: '', endTime: '', subjectId: '', teacherId: '' });
    fetchTimetable();
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setFormData({
      day: entry.day,
      startTime: entry.start_time?.substring(0, 5) || entry.startTime || '',
      endTime: entry.end_time?.substring(0, 5) || entry.endTime || '',
      subjectId: entry.subject_id || entry.subjectId || '',
      teacherId: entry.teacher_id || entry.teacherId || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer ce cours ?')) {
      await backend.deleteTimetableEntry(id);
      fetchTimetable();
    }
  };

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Loader2 className="animate-spin" size={48} color="var(--primary)" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontWeight: '800' }}>Emploi du Temps</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} className="input-field" style={{ width: 'auto' }}>
            {classes.map(c => <option key={c.id} value={c.id}>{c.level} {c.variance}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => { setEditingEntry(null); setFormData({ day: 'Lundi', startTime: '', endTime: '', subjectId: '', teacherId: '' }); setShowModal(true); }}>+ Ajouter un cours</button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
          {days.map(day => (
            <div key={day}>
              <h3 style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center', marginBottom: '15px', fontWeight: '700' }}>{day}</h3>
              {timetables
                .filter(t => t.day === day)
                .sort((a, b) => {
                  const timeA = a.start_time || a.startTime || '00:00';
                  const timeB = b.start_time || b.startTime || '00:00';
                  return timeA.localeCompare(timeB);
                })
                .map(entry => (
                <div key={entry.id} style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '10px', background: 'white', borderLeft: '4px solid var(--primary)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '6px' }}>
                    <button onClick={() => handleEdit(entry)} className="btn-icon btn-edit" title="Modifier">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(entry.id)} className="btn-icon btn-delete" title="Supprimer">
                      <Trash2 size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                  <p style={{ fontWeight: '800', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {formatTime(entry.start_time || entry.startTime)} - {formatTime(entry.end_time || entry.endTime)}
                  </p>
                  <p style={{ fontWeight: '700' }}>{entry.subjects?.name || subjects.find(s => s.id === (entry.subject_id || entry.subjectId))?.name || 'Matière'}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{entry.teachers?.last_name || teachers.find(t => t.id === (entry.teacher_id || entry.teacherId))?.lastName || 'Prof'}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '450px', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none' }}><X size={24} /></button>
            <h2 style={{ marginBottom: '20px' }}>{editingEntry ? 'Modifier le Cours' : 'Nouveau Cours'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <select className="input-field" value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})}>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input type="time" className="input-field" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} required />
                <input type="time" className="input-field" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} required />
              </div>
              <select className="input-field" value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})} required>
                <option value="">Matière</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select className="input-field" value={formData.teacherId} onChange={e => setFormData({...formData, teacherId: e.target.value})} required>
                <option value="">Professeur</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.last_name || t.lastName} {t.first_name || t.firstName}</option>)}
              </select>
              <button type="submit" className="btn btn-primary">{editingEntry ? 'Enregistrer les modifications' : 'Ajouter au planning'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetablePage;
