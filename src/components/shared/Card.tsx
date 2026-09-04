import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'glass' | 'elevated' | 'subtle';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  hoverEffect = false,
  className,
  ...props
}) => {
  const variantStyles = {
    glass: 'glass-panel rounded-2xl',
    elevated: 'glass-panel-elevated rounded-2xl',
    subtle: 'bg-zinc-900/40 border border-white/[0.05] rounded-2xl',
  };

  return (
    <div
      className={clsx(
        variantStyles[variant],
        hoverEffect && 'transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
