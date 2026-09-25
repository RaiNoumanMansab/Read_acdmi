import React from 'react';
import { openWhatsApp, formatWhatsAppNumber } from '../../utils/whatsapp';

export const WhatsAppIcon: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({
  size = 18,
  color = 'currentColor',
  style
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export interface WhatsAppButtonProps {
  phone: string;
  message?: string;
  label?: string;
  compact?: boolean;
  variant?: 'green' | 'outline' | 'subtle' | 'badge';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  title?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phone,
  message,
  label = 'Chat on WhatsApp',
  compact = false,
  variant = 'green',
  size = 'sm',
  title = 'Click to open WhatsApp chat',
  style,
  className = ''
}) => {
  const isAvailable = Boolean(formatWhatsAppNumber(phone));

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) return;
    openWhatsApp(phone, message);
  };

  const getPadding = () => {
    if (compact) {
      if (size === 'xs') return '3px';
      if (size === 'sm') return '5px';
      if (size === 'md') return '7px';
      return '9px';
    }
    if (size === 'xs') return '2px 6px';
    if (size === 'sm') return '4px 10px';
    if (size === 'md') return '6px 14px';
    return '10px 18px';
  };

  const getFontSize = () => {
    if (size === 'xs') return '0.72rem';
    if (size === 'sm') return '0.78rem';
    if (size === 'md') return '0.85rem';
    return '0.95rem';
  };

  const getIconSize = () => {
    if (size === 'xs') return 12;
    if (size === 'sm') return 14;
    if (size === 'md') return 16;
    return 20;
  };

  // Variant Styles
  let bg = '#25D366';
  let color = '#ffffff';
  let border = 'none';

  if (variant === 'outline') {
    bg = 'transparent';
    color = '#128C7E';
    border = '1px solid #25D366';
  } else if (variant === 'subtle') {
    bg = '#dcfce7';
    color = '#166534';
    border = '1px solid #bbf7d0';
  } else if (variant === 'badge') {
    bg = '#ecfdf5';
    color = '#059669';
    border = '1px solid #a7f3d0';
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isAvailable}
      title={isAvailable ? title : 'Phone number not available'}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: compact ? '0' : '6px',
        padding: getPadding(),
        fontSize: getFontSize(),
        fontWeight: 600,
        backgroundColor: isAvailable ? bg : '#f1f5f9',
        color: isAvailable ? color : '#94a3b8',
        border: isAvailable ? border : '1px solid #e2e8f0',
        borderRadius: compact ? '6px' : '8px',
        cursor: isAvailable ? 'pointer' : 'not-allowed',
        opacity: isAvailable ? 1 : 0.6,
        transition: 'all 0.15s ease',
        lineHeight: 1,
        ...style
      }}
      onMouseEnter={(e) => {
        if (!isAvailable) return;
        if (variant === 'green') {
          e.currentTarget.style.backgroundColor = '#1ebd59';
        } else if (variant === 'outline') {
          e.currentTarget.style.backgroundColor = '#f0fdf4';
        } else if (variant === 'subtle') {
          e.currentTarget.style.backgroundColor = '#bbf7d0';
        }
      }}
      onMouseLeave={(e) => {
        if (!isAvailable) return;
        if (variant === 'green') {
          e.currentTarget.style.backgroundColor = '#25D366';
        } else if (variant === 'outline') {
          e.currentTarget.style.backgroundColor = 'transparent';
        } else if (variant === 'subtle') {
          e.currentTarget.style.backgroundColor = '#dcfce7';
        }
      }}
    >
      <WhatsAppIcon
        size={getIconSize()}
        color={variant === 'green' ? '#ffffff' : '#25D366'}
      />
      {!compact && <span>{label}</span>}
    </button>
  );
};
