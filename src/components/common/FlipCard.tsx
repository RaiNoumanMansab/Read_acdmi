import React, { useState } from 'react';

export interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  minHeight?: string | number;
  style?: React.CSSProperties;
}

/**
 * 3D FlipCard Component
 * Flips 180° on hover (or tap on touch devices) to reveal back face with smooth fade
 */
export const FlipCard: React.FC<FlipCardProps> = ({
  front,
  back,
  className = '',
  minHeight = '430px',
  style = {}
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`bca-flip-card-wrapper ${className}`.trim()}
      style={{ minHeight, ...style }}
      onClick={() => setIsFlipped((prev) => !prev)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsFlipped((prev) => !prev);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="Interactive 3D flip card, click or hover to reveal details"
    >
      <div className={`bca-flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
        {/* FRONT FACE */}
        <div className="bca-flip-face bca-flip-front bca-card card-interactive-lift">
          {front}
        </div>

        {/* BACK FACE */}
        <div className="bca-flip-face bca-flip-back">
          {back}
        </div>
      </div>
    </div>
  );
};
