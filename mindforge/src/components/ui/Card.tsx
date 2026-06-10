import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

const Card: React.FC<CardProps> = ({ interactive = false, className = '', children, ...rest }) => (
  <div
    className={['card', interactive ? 'card-interactive' : '', className].filter(Boolean).join(' ')}
    {...rest}
  >
    {children}
  </div>
);

export default Card;
