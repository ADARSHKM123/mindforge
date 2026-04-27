import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const navItems = [
  { path: '/home', label: 'Home', icon: '🏠' },
  { path: '/training', label: 'Training', icon: '🧠' },
  { path: '/vocabulary', label: 'Vocab', icon: '📚' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors } = useTheme();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: '70px',
      backgroundColor: colors.bgSecondary,
      borderTop: `1px solid ${colors.border}`,
      padding: '0 8px',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      zIndex: 1000,
      boxShadow: `0 -2px 10px ${colors.shadow}`,
    }}>
      {navItems.map(item => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              backgroundColor: isActive ? `${colors.primary}15` : 'transparent',
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
            }}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <span style={{ fontSize: '24px', lineHeight: 1 }}>{item.icon}</span>
            <span style={{
              fontSize: '11px',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? colors.primary : colors.textSecondary,
              letterSpacing: '0.3px',
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
