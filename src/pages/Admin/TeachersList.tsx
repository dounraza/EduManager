import React, { useEffect, useState } from 'react';
import { backend } from '../../data/mockBackend';
import { Loader2, X, Trash2 } from 'lucide-react';

const TeachersList = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ firstName: '', lastName: '', subjectId: '', email: '', phone: '' });

  const fetchData = async () => {
    try {
      const [t, s] = await Promise.all([backend.getTeachers(), backend.getSubjects()]);
      setTeachers(t);
      setSubjects(s);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await backend.addTeacher(newTeacher);
    setShowModal(false);
    setNewTeacher({ firstName: '', lastName: '', subjectId: '', email: '', phone: '' });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer ce professeur ?')) {
      await backend.deleteTeacher(id);
      fetchData();
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Loader2 className="animate-spin" size={48} color="var(--primary)" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontWeight: '800' }}>Gestion des Professeurs</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Nouveau Professeur</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nom / Prénom</th>
              <th>Matière</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(t => (
              <tr key={t.id}>
                <td><strong>{t.last_name || t.lastName}</strong> {t.first_name || t.firstName}</td>
                <td>{subjects.find(s => s.id === t.subject_id || s.id === t.subjectId)?.name || 'N/A'}</td>
                <td>{t.email}</td>
                <td>
                  <button onClick={() => handleDelete(t.id)} style={{ color: 'var(--accent)', background: 'none' }}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none' }}><X size={24} /></button>
            <h2 style={{ marginBottom: '20px' }}>Ajouter un Professeur</h2>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Prénom" className="input-field" value={newTeacher.firstName} onChange={e => setNewTeacher({...newTeacher, firstName: e.target.value})} required />
              <input type="text" placeholder="Nom" className="input-field" value={newTeacher.lastName} onChange={e => setNewTeacher({...newTeacher, lastName: e.target.value})} required />
              <select className="input-field" value={newTeacher.subjectId} onChange={e => setNewTeacher({...newTeacher, subjectId: e.target.value})} required>
                <option value="">Sélectionner une matière</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input type="email" placeholder="Email" className="input-field" value={newTeacher.email} onChange={e => setNewTeacher({...newTeacher, email: e.target.value})} />
              <input type="tel" placeholder="Téléphone" className="input-field" value={newTeacher.phone} onChange={e => setNewTeacher({...newTeacher, phone: e.target.value})} />
              <button type="submit" className="btn btn-primary">Enregistrer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersList;
