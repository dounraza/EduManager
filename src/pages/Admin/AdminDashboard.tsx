import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, Calendar, BookOpen, GraduationCap, Home, Bell, Search, Settings, FileText, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { useAuth } from '../../data/AuthContext';
import { backend } from '../../data/mockBackend';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const students = await backend.getStudents();
        const count = (students || []).filter((s: any) => s.status === 'pending').length;
        setPendingCount(count);
      } catch (e) {
        console.error(e);
      }
    };
    fetchPending();
    // Refresh every minute
    const interval = setInterval(fetchPending, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <FileText size={20} />, label: 'Demandes', path: '/admin/requests', badge: pendingCount },
    { icon: <Users size={20} />, label: 'Élèves', path: '/admin/students' },
    { icon: <GraduationCap size={20} />, label: 'Classes', path: '/admin/classes' },
    { icon: <Calendar size={20} />, label: 'Emploi du Temps', path: '/admin/timetable' },
    { icon: <UserCheck size={20} />, label: 'Professeurs', path: '/admin/teachers' },
    { icon: <BookOpen size={20} />, label: 'Matières', path: '/admin/subjects' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: 'var(--sidebar-width)', 
        background: '#0f172a', 
        color: 'white', 
        padding: '1.5rem',
        position: 'fixed',
        height: '100vh',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem', padding: '0.5rem' }}>
          <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={24} />
          </div>
          <span style={{ fontWeight: '800', fontSize: '1.3rem', letterSpacing: '-0.5px' }}>EduAdmin</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
                style={{ position: 'relative' }}
              >
                {item.icon}
                <span style={{ fontSize: '0.95rem' }}>{item.label}</span>
                {item.badge > 0 && (
                  <span style={{ 
                    position: 'absolute', right: '12px', background: 'var(--accent)', 
                    color: 'white', fontSize: '0.7rem', padding: '2px 6px', 
                    borderRadius: '10px', fontWeight: 'bold' 
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Connecté en tant que</p>
            <p style={{ fontSize: '0.85rem', fontWeight: '600', wordBreak: 'break-all' }}>{user?.email || 'Admin'}</p>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="nav-link" 
            style={{ 
              width: '100%', 
              background: 'none', 
              border: 'none', 
              color: '#f87171', 
              cursor: 'pointer',
              marginBottom: '0.5rem',
              textAlign: 'left'
            }}
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>

          <Link to="/" className="nav-link" style={{ color: '#94a3b8' }}>
            <Home size={20} />
            <span>Site Public</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: 'var(--sidebar-width)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <header style={{ 
          height: '70px', background: 'white', borderBottom: '1px solid var(--border)', 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem',
          position: 'sticky', top: 0, zIndex: 40
        }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              style={{ width: '100%', padding: '8px 12px 8px 40px', borderRadius: '10px', border: '1px solid var(--border)', background: '#f8fafc', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link to="/admin/requests" style={{ position: 'relative', background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex' }}>
              <Bell size={22} />
              {pendingCount > 0 && (
                <span style={{ 
                  position: 'absolute', top: '-4px', right: '-4px', minWidth: '18px', height: '18px', 
                  background: 'var(--accent)', color: 'white', borderRadius: '50%', border: '2px solid white',
                  fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {pendingCount}
                </span>
              )}
            </Link>
            
            {/* Profile Dropdown */}
            <div style={{ position: 'relative' }} ref={menuRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', 
                  cursor: 'pointer', padding: '4px', borderRadius: '12px', transition: 'background 0.2s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
              >
                <div style={{ 
                  width: '38px', height: '38px', borderRadius: '12px', background: 'var(--primary)', 
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
                }}>
                  {user?.email?.[0].toUpperCase() || 'A'}
                </div>
                <ChevronDown size={16} color="var(--text-muted)" style={{ transform: showProfileMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {showProfileMenu && (
                <div style={{ 
                  position: 'absolute', top: '100%', right: 0, marginTop: '10px', width: '200px', 
                  background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', 
                  border: '1px solid var(--border)', overflow: 'hidden', zIndex: 100,
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <div style={{ padding: '15px', borderBottom: '1px solid var(--border)', background: '#f8fafc' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)' }}>Admin</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>{user?.email}</p>
                  </div>
                  <div style={{ padding: '8px' }}>
                    <button style={dropdownItemStyle}>
                      <UserIcon size={16} /> Mon Profil
                    </button>
                    <button style={dropdownItemStyle}>
                      <Settings size={16} /> Paramètres
                    </button>
                    <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }}></div>
                    <button 
                      onClick={handleSignOut}
                      style={{ ...dropdownItemStyle, color: '#f43f5e' }}
                    >
                      <LogOut size={16} /> Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const dropdownItemStyle = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 12px',
  border: 'none',
  background: 'none',
  borderRadius: '8px',
  fontSize: '0.85rem',
  fontWeight: '600',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  transition: 'all 0.2s',
  textAlign: 'left' as const,
  // Hover effect added via JS in a real app or global CSS, here inline-simulated:
};

export default AdminDashboard;
