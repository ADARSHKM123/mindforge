import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrainCircuit, Home, Dumbbell, BookA, TrendingUp, User, Sparkles } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

const navItems = [
  { path: '/home', label: 'Today', icon: Home },
  { path: '/training', label: 'Train', icon: Dumbbell },
  { path: '/vocabulary', label: 'Words', icon: BookA },
  { path: '/progress', label: 'Progress', icon: TrendingUp },
  { path: '/profile', label: 'Profile', icon: User },
];

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark"><BrainCircuit size={18} /></span>
          MindForge
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              className={`nav-item ${isActive(path) ? 'active' : ''}`}
              onClick={() => navigate(path)}
            >
              <Icon size={18} strokeWidth={2} />
              {label === 'Today' ? 'Today' : label === 'Train' ? 'Training' : label === 'Words' ? 'Vocabulary' : label}
            </button>
          ))}
        </nav>
        <div style={{ marginTop: 'auto' }}>
          {!user.isPro && (
            <button
              className="nav-item"
              style={{ color: 'var(--warning)' }}
              onClick={() => navigate('/pro')}
            >
              <Sparkles size={18} strokeWidth={2} />
              Upgrade to Pro
            </button>
          )}
        </div>
      </aside>

      <main className="app-main">{children}</main>

      <nav className="bottom-nav">
        {navItems.map(({ path, label, icon: Icon }) => (
          <button
            key={path}
            className={`bottom-nav-item ${isActive(path) ? 'active' : ''}`}
            onClick={() => navigate(path)}
          >
            <Icon size={20} strokeWidth={2} />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AppShell;
