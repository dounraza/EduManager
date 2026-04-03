import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, Calendar, ArrowRight, ShieldCheck, Zap, Star, PlayCircle, User as UserIcon } from 'lucide-react';
import { useAuth } from '../data/AuthContext';
import { backend } from '../data/mockBackend';

const LandingPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ students: 0, classes: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, classes] = await Promise.all([
          backend.getStudents(),
          backend.getClasses()
        ]);
        setStats({ 
          students: (students || []).length, 
          classes: (classes || []).length 
        });
      } catch (e) {
        console.error("Erreur stats:", e);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="public-site">
      <nav style={{ 
        position: 'sticky', top: 0, zIndex: 100,
        padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        background: 'var(--nav-bg)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800', fontSize: '1.4rem', color: 'var(--text-dark)' }}>
          <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '10px', display: 'flex', color: 'white' }}>
            <GraduationCap size={24} />
          </div>
          <span style={{ letterSpacing: '-0.5px' }}>EduManager</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ background: 'var(--primary)', padding: '4px', borderRadius: '8px', color: 'white', display: 'flex' }}>
                <UserIcon size={16} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                Connecté : <strong style={{ color: 'white' }}>{user.email}</strong>
              </span>
            </div>
          ) : null}
          <Link to="/admin" style={{ fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.95rem', textDecoration: 'none' }}>Espace Admin</Link>
          <Link to="/enroll" className="btn btn-primary">Inscription Rapide</Link>
        </div>
      </nav>

      <header style={{ 
        position: 'relative', overflow: 'hidden',
        padding: '100px 0', background: 'radial-gradient(circle at top right, #1e1b4b, transparent), radial-gradient(circle at bottom left, #0f172a, transparent)' 
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '8px', 
                padding: '8px 16px', borderRadius: '20px', background: 'rgba(129, 140, 248, 0.1)', 
                color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem', marginBottom: '1.5rem'
              }}>
                <Zap size={16} /> Meilleure solution scolaire 2026
              </div>
              <h1 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem', color: 'var(--text-dark)', letterSpacing: '-2px' }}>
                L'éducation de demain, <br/> <span style={{ color: 'var(--primary)' }}>gérée aujourd'hui.</span>
              </h1>
              <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', lineHeight: '1.6' }}>
                Simplifiez la vie de vos élèves, parents et professeurs avec une plateforme intuitive, rapide et sécurisée.
              </p>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link to="/enroll" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                  Inscrire un élève <ArrowRight size={20} />
                </Link>
                <button className="btn" style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', color: 'var(--text-dark)', padding: '1rem 2rem' }}>
                  <PlayCircle size={20} /> Voir la vidéo
                </button>
              </div>
              
              <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex' }}>
                   {[1,2,3,4].map(i => (
                     <img key={i} src={`https://i.pravatar.cc/40?img=${i+10}`} alt="user" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--bg-main)', marginLeft: i > 1 ? '-10px' : '0' }} />
                   ))}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', color: '#f59e0b' }}><Star size={14} fill="#f59e0b" /> <Star size={14} fill="#f59e0b" /> <Star size={14} fill="#f59e0b" /> <Star size={14} fill="#f59e0b" /> <Star size={14} fill="#f59e0b" /></div>
                  <strong>+{stats.students} parents</strong> nous font confiance
                </div>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ 
                borderRadius: '30px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
                transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
                border: '8px solid var(--bg-white)'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" 
                  alt="Étudiants" 
                  style={{ width: '100%', display: 'block', opacity: 0.8 }}
                />
              </div>
              <div className="card glass" style={{ position: 'absolute', top: '20%', left: '-10%', padding: '15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px', width: '200px' }}>
                <div style={{ background: 'var(--secondary)', color: 'white', padding: '8px', borderRadius: '12px' }}><Users size={20} /></div>
                <div><p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{stats.classes} Classes</p><p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Actives</p></div>
              </div>
              <div className="card glass" style={{ position: 'absolute', bottom: '10%', right: '-5%', padding: '15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px', width: '220px' }}>
                <div style={{ background: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '12px' }}><Calendar size={20} /></div>
                <div><p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Planning A/B</p><p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Optimisé</p></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Des outils puissants pour votre école</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Une gestion fluide pour une meilleure réussite scolaire.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <FeatureCard 
              icon={<Users size={28} color="white" />} 
              bgColor="var(--primary)"
              title="Inscription Intuitive" 
              desc="Un formulaire d'inscription en ligne simple pour les parents, avec validation instantanée." 
            />
            <FeatureCard 
              icon={<Calendar size={28} color="white" />} 
              bgColor="var(--secondary)"
              title="Classes Variances (A/B)" 
              desc="Gérez facilement les divisions de classes avec des emplois du temps uniques par variance." 
            />
            <FeatureCard 
              icon={<ShieldCheck size={28} color="white" />} 
              bgColor="#f43f5e"
              title="Suivi Académique" 
              desc="Accédez aux notes, absences et comportements en quelques clics." 
            />
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--bg-white)', borderRadius: '40px', margin: '0 2rem 4rem', position: 'relative', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem' }}>Rejoignez les meilleures institutions</h2>
          <Link to="/enroll" className="btn btn-primary" style={{ padding: '1rem 3rem' }}>Commencer l'aventure</Link>
        </div>
      </section>

      <footer style={{ padding: '60px 0', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800', fontSize: '1.2rem' }}>
            <div style={{ background: 'var(--primary)', padding: '5px', borderRadius: '8px', display: 'flex', color: 'white' }}>
              <GraduationCap size={20} />
            </div>
            <span>EduManager</span>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>&copy; 2026 EduManager Inc. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, bgColor }: any) => (
  <div className="card" style={{ padding: '2.5rem' }}>
    <div style={{ 
      width: '56px', height: '56px', borderRadius: '16px', background: bgColor, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
      boxShadow: `0 8px 16px -4px ${bgColor}44`
    }}>{icon}</div>
    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{desc}</p>
  </div>
);

export default LandingPage;
