import React, { useEffect, useState } from 'react';
import { backend } from '../../data/mockBackend';
import { Loader2, CheckCircle, XCircle, Phone, Mail } from 'lucide-react';

const EnrollmentRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [allStudents, allClasses] = await Promise.all([backend.getStudents(), backend.getClasses()]);
      // Filter pending requests
      const pending = (allStudents || []).filter((s: any) => s.status === 'pending');
      setRequests(pending);
      setClasses(allClasses || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAction = async (id: string, newStatus: 'active' | 'rejected') => {
    if (confirm(`Voulez-vous ${newStatus === 'active' ? 'valider' : 'rejeter'} cette inscription ?`)) {
      await backend.updateStudentStatus(id, newStatus);
      fetchData();
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Loader2 className="animate-spin" size={48} color="var(--primary)" /></div>;

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontWeight: '800' }}>Demandes d'Inscription</h1>
        <p style={{ color: 'var(--text-muted)' }}>Inscriptions en ligne en attente de validation.</p>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Élève</th>
              <th>Classe Demandée</th>
              <th>Contact Parent</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => {
              const cls = classes.find(c => c.id === req.classId);
              return (
                <tr key={req.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img src={req.photoUrl} alt="" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
                      <div style={{ fontWeight: '700' }}>{req.lastName} {req.firstName}</div>
                    </div>
                  </td>
                  <td>{cls?.level} {cls?.variance}</td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: '600' }}>{req.parentName}</div>
                      <div style={{ color: 'var(--text-muted)' }}><Phone size={12} /> {req.parentPhone}</div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '0.7rem', 
                      fontWeight: '700',
                      background: 'rgba(245, 158, 11, 0.1)',
                      color: '#f59e0b',
                      textTransform: 'uppercase'
                    }}>
                      En attente
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleAction(req.id, 'active')} className="btn-icon btn-success" title="Valider">
                        <CheckCircle size={18} strokeWidth={2.5} />
                      </button>
                      <button onClick={() => handleAction(req.id, 'rejected')} className="btn-icon btn-delete" title="Rejeter">
                        <XCircle size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {requests.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Aucune demande en attente.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnrollmentRequests;
