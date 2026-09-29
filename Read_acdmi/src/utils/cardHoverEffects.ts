/**
 * Premium Card Hover Animation System
 * Read Academy Sahiwal
 *
 * Implements:
 * 1. 3D Tilt Effect (subtle mouse-following rotateX, rotateY with perspective)
 * 2. Cursor-Following Glow (soft radial glow following mouse coordinates)
 * 3. Smooth Reset Transitions (400-600ms cubic-bezier curve)
 * 4. Respects prefers-reduced-motion and touch-only devices
 */

const CARD_SELECTOR = '.bca-card, .card-interactive-lift, [data-interactive-card]';
const MAX_TILT_DEG = 4.5; // Restrained, subtle & premium angle

let isInitialized = false;
let activeCard: HTMLElement | null = null;
let rafId: number | null = null;

function resetCard(card: HTMLElement) {
  card.classList.remove('card-tilting');
  card.style.setProperty('--tilt-x', '0deg');
  card.style.setProperty('--tilt-y', '0deg');
  card.style.setProperty('--glow-opacity', '0');
  card.style.removeProperty('--mouse-x');
  card.style.removeProperty('--mouse-y');
}

export function initCardHoverEffects(): () => void {
  if (typeof window === 'undefined' || isInitialized) {
    return () => {};
  }

  // Accessibility: Respect reduced motion preference
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) {
    return () => {};
  }

  // Touch devices: Disable 3D mouse tracking
  const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!hoverQuery.matches) {
    return () => {};
  }

  isInitialized = true;

  const handlePointerMove = (e: PointerEvent) => {
    // Skip touch interactions
    if (e.pointerType === 'touch') return;

    const target = e.target as HTMLElement | null;
    if (!target) return;

    const card = target.closest<HTMLElement>(CARD_SELECTOR);

    if (activeCard && activeCard !== card) {
      resetCard(activeCard);
      activeCard = null;
    }

    if (!card) return;

    activeCard = card;

    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }

    rafId = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      // Compute normalized coordinates (0 to 1)
      const xRatio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const yRatio = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

      // 3D Tilt:
      // When cursor is top (yRatio < 0.5), top tilts towards user -> rotateX > 0
      // When cursor is bottom (yRatio > 0.5), bottom tilts towards user -> rotateX < 0
      const tiltX = (0.5 - yRatio) * MAX_TILT_DEG;
      // When cursor is right (xRatio > 0.5), right tilts towards user -> rotateY > 0
      // When cursor is left (xRatio < 0.5), left tilts towards user -> rotateY < 0
      const tiltY = (xRatio - 0.5) * MAX_TILT_DEG;

      card.classList.add('card-tilting');
      card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
      card.style.setProperty('--mouse-x', `${Math.round(clientX - rect.left)}px`);
      card.style.setProperty('--mouse-y', `${Math.round(clientY - rect.top)}px`);
      card.style.setProperty('--glow-opacity', '1');
    });
  };

  const handlePointerLeave = (e: PointerEvent) => {
    if (activeCard) {
      // Check if actually left the card
      const related = e.relatedTarget as HTMLElement | null;
      if (!related || !activeCard.contains(related)) {
        resetCard(activeCard);
        activeCard = null;
      }
    }
  };

  document.addEventListener('pointermove', handlePointerMove, { passive: true });
  document.addEventListener('pointerout', handlePointerLeave, { passive: true });

  return () => {
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerout', handlePointerLeave);
    if (activeCard) {
      resetCard(activeCard);
      activeCard = null;
    }
    isInitialized = false;
  };
}
