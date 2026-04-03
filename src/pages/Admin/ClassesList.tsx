import { useEffect, useState, FormEvent } from 'react';
import { backend } from '../../data/mockBackend';
import { Loader2, X, Users, Calendar, ArrowLeft, Phone } from 'lucide-react';
import type { Student, SchoolClass, TimetableEntry } from '../../data/mockData';

const ClassesList = () => {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Drill-down state
  const [view, setView] = useState<'grid' | 'students' | 'timetable'>('grid');
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [classData, setClassData] = useState<{ students: Student[], timetable: TimetableEntry[] }>({ students: [], timetable: [] });
  const [dataLoading, setDataLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [newClass, setNewClass] = useState({ level: '', variance: '', teacherName: '' });

  const fetchData = async () => {
    try {
      const [c, s] = await Promise.all([backend.getClasses(), backend.getStudents()]);
      setClasses(c || []);
      setStudents(s || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDetail = async (cls: SchoolClass, type: 'students' | 'timetable') => {
    setSelectedClass(cls);
    setView(type);
    setDataLoading(true);
    try {
      if (type === 'students') {
        const allStudents = await backend.getStudents();
        const filtered = (allStudents || []).filter(s => s.classId === cls.id);
        setClassData(prev => ({ ...prev, students: filtered }));
      } else {
        const tt = await backend.getTimetablesByClass(cls.id);
        setClassData(prev => ({ ...prev, timetable: tt || [] }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDataLoading(false);
    }
  };

  const handleAddClass = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await backend.addClass(newClass);
      setShowModal(false);
      setNewClass({ level: '', variance: '', teacherName: '' });
      fetchData();
    } catch (e) {
      alert('Erreur lors de l\'ajout');
    }
  };

  const formatTime = (time: string) => {
    if (!time) return '00:00:00';
    if (time.split(':').length === 3) return time;
    if (time.split(':').length === 2) return `${time}:00`;
    return time;
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Loader2 className="animate-spin" size={48} color="var(--primary)" /></div>;

  // --- Sub-View: Student List for Class ---
  if (view === 'students' && selectedClass) {
    return (
      <div>
        <button onClick={() => setView('grid')} className="btn" style={{ marginBottom: '20px', background: 'white', border: '1px solid var(--border)' }}>
          <ArrowLeft size={18} /> Retour aux classes
        </button>
        <div className="card">
          <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontWeight: '800' }}>Élèves de {selectedClass.level} {selectedClass.variance}</h2>
            <div style={{ background: 'var(--primary)', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem' }}>
              {classData.students.length} Inscrits
            </div>
          </div>
          {dataLoading ? <Loader2 className="animate-spin" /> : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Nom & Prénom</th>
                    <th>Contact Parent</th>
                  </tr>
                </thead>
                <tbody>
                  {classData.students.map(s => (
                    <tr key={s.id}>
                      <td><img src={s.photoUrl} alt="student" style={{ width: '40px', height: '40px', borderRadius: '10px' }} /></td>
                      <td><strong>{s.lastName}</strong> {s.firstName}</td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          <div style={{ fontWeight: '600' }}>{s.parentName}</div>
                          <div style={{ color: 'var(--text-muted)' }}><Phone size={12} /> {s.parentPhone}</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {classData.students.length === 0 && <tr><td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Aucun élève dans cette classe.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Sub-View: Timetable for Class ---
  if (view === 'timetable' && selectedClass) {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    return (
      <div>
        <button onClick={() => setView('grid')} className="btn" style={{ marginBottom: '20px', background: 'white', border: '1px solid var(--border)' }}>
          <ArrowLeft size={18} /> Retour aux classes
        </button>
        <div className="card">
          <h2 style={{ marginBottom: '25px', fontWeight: '800' }}>Emploi du temps : {selectedClass.level} {selectedClass.variance}</h2>
          {dataLoading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}><Loader2 className="animate-spin" size={32} color="var(--primary)" /></div> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
              {days.map(day => (
                <div key={day}>
                  <h4 style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center', marginBottom: '15px', fontWeight: '700' }}>{day}</h4>
                  {classData.timetable
                    .filter(t => t.day === day)
                    .sort((a, b) => {
                      const timeA = (a as any).startTime || (a as any).start_time || '00:00';
                      const timeB = (b as any).startTime || (b as any).start_time || '00:00';
                      return timeA.localeCompare(timeB);
                    })
                    .map(entry => (
                    <div key={entry.id} style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '10px', background: 'white', borderLeft: '4px solid var(--primary)', position: 'relative' }}>
                      <p style={{ fontWeight: '800', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {formatTime((entry as any).startTime || (entry as any).start_time)} - {formatTime((entry as any).endTime || (entry as any).end_time)}
                      </p>
                      <p style={{ fontWeight: '700', margin: '4px 0' }}>{entry.subject || (entry as any).subjects?.name || 'Matière'}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{entry.teacher || (entry as any).teachers?.last_name || 'Prof'}</p>
                    </div>
                  ))}
                  {classData.timetable.filter(t => t.day === day).length === 0 && (
                    <div style={{ padding: '15px', textAlign: 'center', color: '#cbd5e1', fontStyle: 'italic', border: '1px dashed #e2e8f0', borderRadius: '12px', fontSize: '0.8rem' }}>
                      Repos
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Gestion des Classes</h1>
          <p style={{ color: 'var(--text-muted)' }}>Liste des sections et variances par niveau.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Nouvelle Classe</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {classes.map(cls => {
          const studentCount = students.filter(s => s.classId === cls.id).length;
          return (
            <div key={cls.id} className="card" style={{ borderLeft: '5px solid var(--primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{cls.level} <span style={{ color: 'var(--primary)' }}>{cls.variance}</span></h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Prof. Principal: <strong>{cls.teacherName}</strong></p>
                </div>
                <div style={{ background: 'var(--primary)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' }}>
                  {studentCount} Élèves
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button 
                  className="btn" 
                  onClick={() => handleOpenDetail(cls, 'timetable')}
                  style={{ flex: 1, padding: '8px', background: '#f8fafc', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                >
                  <Calendar size={14} /> Planning
                </button>
                <button 
                  className="btn" 
                  onClick={() => handleOpenDetail(cls, 'students')}
                  style={{ flex: 1, padding: '8px', background: '#f8fafc', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                >
                  <Users size={14} /> Élèves
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', color: 'var(--text-muted)' }}>
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: '20px' }}>Nouvelle Classe</h2>
            <form onSubmit={handleAddClass} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '5px' }}>Niveau</label>
                <input type="text" placeholder="Ex: 6ème, 5ème" className="input-field" value={newClass.level} onChange={e => setNewClass({...newClass, level: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '5px' }}>Variance (A, B, C...)</label>
                <input type="text" placeholder="Ex: A" className="input-field" value={newClass.variance} onChange={e => setNewClass({...newClass, variance: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '5px' }}>Professeur Principal</label>
                <input type="text" placeholder="Nom du professeur" className="input-field" value={newClass.teacherName} onChange={e => setNewClass({...newClass, teacherName: e.target.value})} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Créer la classe</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesList;
