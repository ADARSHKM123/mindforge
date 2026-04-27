import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  gradient?: string;
  padding?: string;
}

const Card: React.FC<CardProps> = ({ children, onClick, style, gradient, padding = '16px' }) => {
  const { colors } = useTheme();

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick(); } : undefined}
      style={{
        background: gradient || colors.card,
        borderRadius: '16px',
        padding,
        border: gradient ? 'none' : `1px solid ${colors.border}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: `0 2px 8px ${colors.shadow}`,
        ...(onClick ? { ':hover': { transform: 'translateY(-2px)' } } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Card;
