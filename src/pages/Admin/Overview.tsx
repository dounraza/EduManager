import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, Calendar, BookOpen, Loader2 } from 'lucide-react';
import { backend } from '../../data/mockBackend';
import { teachers } from '../../data/mockData';
import type { Student, SchoolClass } from '../../data/mockData';

const Overview = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, c] = await Promise.all([backend.getStudents(), backend.getClasses()]);
        setStudents(s || []);
        setClasses(c || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingCount = students.filter((s: any) => s.status === 'pending').length;
  const activeCount = students.filter((s: any) => s.status === 'active').length;

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Loader2 className="animate-spin" size={48} color="var(--primary)" /></div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px', fontWeight: '800' }}>Tableau de bord</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <StatCard icon={<Users color="#3b82f6" />} label="Élèves Actifs" value={activeCount.toString()} color="#dbeafe" />
        <StatCard icon={<GraduationCap color="#10b981" />} label="Classes Actives" value={classes.length.toString()} color="#d1fae5" />
        <StatCard icon={<Calendar color="#f59e0b" />} label="Profs" value="3" color="#fef3c7" />
        <StatCard icon={<BookOpen color="#ef4444" />} label="Demandes" value={pendingCount.toString()} color="#fee2e2" />
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '15px' }}>Activités Récentes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ActivityItem text="Nouvelle inscription : Tahina Andriana (6ème A)" time="Il y a 2h" />
          <ActivityItem text="Mise à jour emploi du temps : 5ème B" time="Il y a 5h" />
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ text, time }: { text: string, time: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
    <span style={{ fontSize: '0.9rem' }}>{text}</span>
    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{time}</span>
  </div>
);

const StatCard = ({ icon, label, value, color }: any) => (
  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
    <div style={{ padding: '15px', borderRadius: '12px', background: color }}>{icon}</div>
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>{label}</p>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{value}</h2>
    </div>
  </div>
);

export default Overview;
