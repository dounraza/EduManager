import React, { useEffect, useState } from 'react';
import { backend } from '../../data/mockBackend';
import { Mail, Phone, Loader2, X, Trash2 } from 'lucide-react';
import type { Student, SchoolClass } from '../../data/mockData';

const StudentsList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    classId: '',
    parentName: '',
    parentPhone: '',
    parentEmail: ''
  });

  const fetchData = async () => {
    try {
      const [s, c] = await Promise.all([backend.getStudents(), backend.getClasses()]);
      // Only show active students in the main list
      const activeStudents = (s || []).filter((student: any) => student.status === 'active');
      setStudents(activeStudents);
      setClasses(c || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await backend.addStudent({
        ...newStudent,
        parentEmail: newStudent.parentEmail || undefined,
        status: 'active' // Admin added students are active immediately
      });
      setShowModal(false);
      setNewStudent({ firstName: '', lastName: '', classId: '', parentName: '', parentPhone: '', parentEmail: '' });
      fetchData(); // Refresh list
    } catch (e) {
      alert('Erreur lors de l\'ajout');
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Loader2 className="animate-spin" size={48} color="var(--primary)" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Gestion des Élèves</h1>
          <p style={{ color: 'var(--text-muted)' }}>Liste totale des élèves inscrits cette année.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Nouvel Élève</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Élève</th>
              <th>Classe / Variance</th>
              <th>Contact Parent</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => {
              const studentClass = classes.find(c => c.id === student.classId);
              return (
                <tr key={student.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img 
                        src={student.photoUrl} 
                        alt={student.lastName} 
                        style={{ width: '45px', height: '45px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #f1f5f9' }} 
                      />
                      <div>
                        <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>{student.lastName} {student.firstName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: #{student.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '600' }}>{studentClass?.level}</span>
                      <span style={{ padding: '2px 8px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '800' }}>
                        {studentClass?.variance}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{student.parentName}</div>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                        <span title={student.parentPhone} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <Phone size={14} /> {student.parentPhone}
                        </span>
                        {student.parentEmail && (
                          <span title={student.parentEmail} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <Mail size={14} /> Email
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.75rem', 
                      fontWeight: '700',
                      background: student.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: student.status === 'active' ? '#10b981' : '#f59e0b',
                      textTransform: 'uppercase'
                    }}>
                      {student.status === 'active' ? 'Actif' : 'En attente'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="btn-icon btn-edit" title="Modifier">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button className="btn-icon btn-delete" title="Supprimer">
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Ajout Élève */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', color: 'var(--text-muted)' }}>
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: '20px' }}>Ajouter un élève</h2>
            <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input type="text" placeholder="Prénom" className="input-field" value={newStudent.firstName} onChange={e => setNewStudent({...newStudent, firstName: e.target.value})} required />
                <input type="text" placeholder="Nom" className="input-field" value={newStudent.lastName} onChange={e => setNewStudent({...newStudent, lastName: e.target.value})} required />
              </div>
              <select className="input-field" value={newStudent.classId} onChange={e => setNewStudent({...newStudent, classId: e.target.value})} required>
                <option value="">Sélectionner une classe</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.level} {c.variance}</option>)}
              </select>
              <input type="text" placeholder="Nom du parent" className="input-field" value={newStudent.parentName} onChange={e => setNewStudent({...newStudent, parentName: e.target.value})} required />
              <input type="tel" placeholder="Téléphone parent" className="input-field" value={newStudent.parentPhone} onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})} required />
              <input type="email" placeholder="Email parent (Optionnel)" className="input-field" value={newStudent.parentEmail} onChange={e => setNewStudent({...newStudent, parentEmail: e.target.value})} />
              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Enregistrer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsList;
