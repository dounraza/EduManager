import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle, Camera, Loader2, PartyPopper, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { backend } from '../data/mockBackend';

const EnrollmentPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    classId: '',
    parentName: '',
    parentPhone: '',
    parentEmail: ''
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await backend.getClasses();
        setClasses(data || []);
      } catch (e) {
        console.error("Erreur lors du chargement des classes", e);
      }
    };
    fetchClasses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await backend.addStudent({
        firstName: formData.firstName,
        lastName: formData.lastName,
        classId: formData.classId,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        parentEmail: formData.parentEmail || undefined,
        status: 'pending'
      });
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      alert("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="public-site" style={{ 
        display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', 
        padding: '20px', background: 'radial-gradient(circle at top right, #1e1b4b, #0f172a)' 
      }}>
        {/* Animated background elements */}
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.1, borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '250px', height: '250px', background: 'var(--secondary)', filter: 'blur(150px)', opacity: 0.1, borderRadius: '50%' }}></div>

        <div className="card glass" style={{ 
          maxWidth: '600px', width: '100%', padding: '3.5rem', textAlign: 'center', 
          borderRadius: '40px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          position: 'relative', zIndex: 1
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
            color: 'white', width: '100px', height: '100px', borderRadius: '30px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            margin: '0 auto 30px', boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.4)',
            transform: 'rotate(-5deg)'
          }}>
            <PartyPopper size={50} strokeWidth={1.5} />
          </div>

          <h1 style={{ fontWeight: '900', fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-1.5px', color: 'white' }}>
            C'est officiel !
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            Bienvenue dans la famille <strong>EduManager</strong>. Le dossier de <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{formData.firstName}</span> est désormais entre les mains de notre équipe administrative.
          </p>

          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '25px', marginBottom: '30px', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary)', marginBottom: '15px', fontWeight: '800' }}>
              Prochaines étapes :
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '10px', color: 'var(--secondary)' }}><Clock size={18} /></div>
                <p style={{ fontSize: '0.95rem', color: '#cbd5e1' }}><strong>Validation :</strong> Notre équipe vérifiera les informations sous 24h à 48h.</p>
              </div>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '10px', color: 'var(--primary)' }}><ShieldCheck size={18} /></div>
                <p style={{ fontSize: '0.95rem', color: '#cbd5e1' }}><strong>Confirmation :</strong> Vous recevrez un SMS de confirmation au {formData.parentPhone}.</p>
              </div>
            </div>
          </div>

          <Link to="/" className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', borderRadius: '20px', boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.5)' }}>
            Retour à l'accueil <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="public-site" style={{ background: 'var(--bg-main)', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '20px', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
          <ChevronLeft size={20} /> Retour au site
        </Link>
        
        <div className="card" style={{ padding: '3.5rem', borderRadius: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px', letterSpacing: '-1px' }}>Rejoignez EduManager</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Inscrivez votre enfant en moins de 2 minutes.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
              <div style={{ 
                position: 'relative', width: '120px', height: '120px', background: 'var(--bg-white)', 
                borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                color: 'var(--text-muted)', border: '2px dashed var(--border)', transition: 'all 0.3s'
              }}>
                <Camera size={40} />
                <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '15px', border: '3px solid var(--bg-white)' }}>
                   <Camera size={14} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '35px' }}>
              <div>
                <label style={labelStyle}>Prénom de l'élève</label>
                <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="input-field" placeholder="Tahina" required />
              </div>
              <div>
                <label style={labelStyle}>Nom de l'élève</label>
                <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="input-field" placeholder="Andriana" required />
              </div>
              <div>
                <label style={labelStyle}>Date de naissance</label>
                <input name="birthDate" value={formData.birthDate} onChange={handleChange} type="date" className="input-field" required />
              </div>
              <div>
                <label style={labelStyle}>Classe souhaitée</label>
                <select name="classId" value={formData.classId} onChange={handleChange} className="input-field" required>
                  <option value="">Sélectionner...</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.level} {c.variance}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '35px', marginTop: '35px' }}>
              <h3 style={{ marginBottom: '25px', fontSize: '1.3rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Contact Parent</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '35px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Nom complet du tuteur</label>
                  <input name="parentName" value={formData.parentName} onChange={handleChange} type="text" className="input-field" placeholder="Jean Andriana" required />
                </div>
                <div>
                  <label style={labelStyle}>Téléphone</label>
                  <input name="parentPhone" value={formData.parentPhone} onChange={handleChange} type="tel" className="input-field" placeholder="034 00 000 00" required />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input name="parentEmail" value={formData.parentEmail} onChange={handleChange} type="email" className="input-field" placeholder="parent@mail.com" />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ 
              width: '100%', padding: '1.2rem', fontSize: '1.2rem', fontWeight: '800',
              borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
            }}>
              {loading ? <><Loader2 className="animate-spin" size={24} /> Envoi...</> : <><CheckCircle size={24} /> Finaliser l'inscription</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  marginBottom: '10px',
  fontSize: '0.95rem',
  fontWeight: '700',
  color: 'var(--text-dark)',
  opacity: 0.9
};

export default EnrollmentPage;
