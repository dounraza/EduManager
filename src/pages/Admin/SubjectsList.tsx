import React, { useEffect, useState } from 'react';
import { backend } from '../../data/mockBackend';
import { Loader2, Trash2 } from 'lucide-react';

const SubjectsList = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');

  const fetchData = async () => {
    try { setSubjects(await backend.getSubjects()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    await backend.addSubject(newName);
    setNewName('');
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cette matière ?')) {
      await backend.deleteSubject(id);
      fetchData();
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Loader2 className="animate-spin" size={48} color="var(--primary)" /></div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px', fontWeight: '800' }}>Gestion des Matières</h1>
      
      <div className="card" style={{ marginBottom: '30px' }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '15px' }}>
          <input type="text" placeholder="Nouvelle matière (ex: Physique-Chimie)" className="input-field" value={newName} onChange={e => setNewName(e.target.value)} required />
          <button type="submit" className="btn btn-primary">Ajouter</button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
        {subjects.map(s => (
          <div key={s.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}>
            <span style={{ fontWeight: '600' }}>{s.name}</span>
            <button onClick={() => handleDelete(s.id)} style={{ color: 'var(--accent)', background: 'none' }}><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectsList;
