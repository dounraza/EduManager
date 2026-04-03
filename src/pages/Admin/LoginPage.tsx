import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '../../data/supabaseClient';
import { useAuth } from '../../data/AuthContext';
import { GraduationCap, Mail, Lock, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Identifiants incorrects. Veuillez réessayer.");
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '1.5rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        background: 'white', 
        padding: '2.5rem', 
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            background: 'var(--primary)', 
            padding: '12px', 
            borderRadius: '16px',
            marginBottom: '1rem'
          }}>
            <GraduationCap size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
            EduAdmin
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Accès réservé à l'administration
          </p>
        </div>

        {error && (
          <div style={{ 
            background: '#fee2e2', 
            color: '#ef4444', 
            padding: '12px 16px', 
            borderRadius: '12px', 
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ecole.com"
                style={{ 
                  width: '100%', 
                  padding: '12px 12px 12px 42px', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0',
                  outline: 'none',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ 
                  width: '100%', 
                  padding: '12px 12px 12px 42px', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0',
                  outline: 'none',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ 
              marginTop: '1rem',
              background: 'var(--primary)', 
              color: 'white', 
              padding: '14px', 
              borderRadius: '12px', 
              border: 'none', 
              fontWeight: '700', 
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'opacity 0.2s'
            }}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <a href="/" style={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none' }}>
            Retour au site public
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
