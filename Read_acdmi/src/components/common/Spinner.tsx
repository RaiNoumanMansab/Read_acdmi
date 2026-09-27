import React from 'react';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | string;
export type SpinnerColor = 'primary' | 'red' | 'gold' | 'white' | string;

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  speed?: string;
  className?: string;
  style?: React.CSSProperties;
}

const resolveSize = (size?: SpinnerSize): string => {
  switch (size) {
    case 'xs':
      return '1rem';
    case 'sm':
      return '1.4rem';
    case 'md':
      return '2.4rem';
    case 'lg':
      return '3.4rem';
    default:
      return size || '2.4rem';
  }
};

const resolveColor = (color?: SpinnerColor): string => {
  switch (color) {
    case 'primary':
      return '#0B3974'; // Read Academy Navy
    case 'red':
      return '#E62929'; // Read Academy Crimson Red
    case 'gold':
      return '#D97706'; // Read Academy Accent Gold
    case 'white':
      return '#ffffff';
    default:
      return color || '#0B3974';
  }
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  speed = '.9s',
  className = '',
  style = {}
}) => {
  const actualSize = resolveSize(size);
  const actualColor = resolveColor(color);

  return (
    <div
      className={`dot-spinner ${className}`}
      style={
        {
          '--uib-size': actualSize,
          '--uib-color': actualColor,
          '--uib-speed': speed,
          ...style
        } as React.CSSProperties
      }
      role="status"
      aria-label="Loading"
    >
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
    </div>
  );
};

export interface LoadingStateProps {
  message?: string;
  size?: SpinnerSize;
  color?: SpinnerColor;
  minHeight?: string | number;
  inline?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  size = 'md',
  color = 'primary',
  minHeight = '180px',
  inline = false,
  className = '',
  style = {}
}) => {
  if (inline) {
    return (
      <div
        className={`loading-state-inline ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style
        }}
      >
        <Spinner size={size === 'md' ? 'sm' : size} color={color} />
      </div>
    );
  }

  return (
    <div
      className={`loading-state-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        padding: '36px 16px',
        textAlign: 'center',
        width: '100%',
        ...style
      }}
    >
      <Spinner size={size} color={color} />
    </div>
  );
};

export interface TableLoadingRowProps {
  colSpan: number;
  message?: string;
  color?: SpinnerColor;
}

export const TableLoadingRow: React.FC<TableLoadingRowProps> = ({
  colSpan,
  message = 'Loading records from database...',
  color = 'primary'
}) => {
  return (
    <tr>
      <td
        colSpan={colSpan}
        style={{
          textAlign: 'center',
          padding: '40px 16px',
          backgroundColor: '#fafbfc'
        }}
      >
        <LoadingState message={message} color={color} minHeight="120px" />
      </td>
    </tr>
  );
};

export const ButtonSpinner: React.FC<{ color?: SpinnerColor }> = ({ color = 'white' }) => {
  return <Spinner size="xs" color={color} speed=".75s" style={{ display: 'inline-flex' }} />;
};
