import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, action, noPadding = false }) => {
  return (
    <div className={`vintage-card overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[#14110F]">
          {title && <h3 className="font-heading tracking-widest text-lg text-[var(--accent-primary)] flex items-center gap-2">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};