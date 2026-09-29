import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  lift?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Reusable Card Component with premium 3D tilt, cursor glow, and light sweep.
 * Preserves existing design tokens and allows custom styling.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, lift = true, className = '', style = {}, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={`bca-card ${lift ? 'card-interactive-lift' : ''} ${className}`.trim()}
        style={style}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
