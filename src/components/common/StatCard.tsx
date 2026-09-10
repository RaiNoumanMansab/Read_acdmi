import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  trendText?: string;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  sparklineData?: number[];
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  isPositive = true,
  trendText = 'vs last month',
  icon,
  iconBg = '#eff6ff',
  iconColor = '#0B3974',
  sparklineData = [35, 45, 40, 55, 60, 58, 72],
  onClick
}) => {
  // Generate mini SVG path for sparkline
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;
  const width = 80;
  const height = 28;

  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div
      onClick={onClick}
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 1px 3px rgba(11, 57, 116, 0.05)',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(11, 57, 116, 0.1)';
        e.currentTarget.style.borderColor = '#0B3974';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(11, 57, 116, 0.05)';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: iconBg,
            color: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {icon}
        </div>

        {/* Mini Sparkline */}
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
          <polyline
            fill="none"
            stroke={isPositive ? '#4CAF50' : '#E62929'}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>

      <div>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </span>
        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 8px', letterSpacing: '-0.02em' }}>
          {value}
        </div>

        {change && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontWeight: 700,
                color: isPositive ? '#2e7d32' : '#c62828',
                backgroundColor: isPositive ? '#e8f5e9' : '#feecec',
                padding: '2px 6px',
                borderRadius: '6px'
              }}
            >
              {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {change}
            </span>
            <span style={{ color: '#94a3b8' }}>{trendText}</span>
          </div>
        )}
      </div>
    </div>
  );
};
