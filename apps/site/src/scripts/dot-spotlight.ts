/**
 * Dot-grid cards (the Home hero card and every `.dot-card`): while a mouse or pen is over a
 * card, a soft spotlight of the loading screen's dot grid follows it, trailing slightly
 * behind. Touch screens keep the static corner field; with reduced motion the spotlight
 * tracks the pointer without the trail.
 */
const dotSpotlightCards = document.querySelectorAll<HTMLElement>('.hero-card, .dot-card');
const dotSpotlightPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const dotSpotlightTrail =
  document.documentElement.dataset.motion === 'off' ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 1
    : 0.2;

function followPointer(card: HTMLElement): void {
  let targetX = 0;
  let targetY = 0;
  let x = 0;
  let y = 0;
  let frame = 0;

  const paint = (): void => {
    card.style.setProperty('--dots-x', `${x.toFixed(1)}px`);
    card.style.setProperty('--dots-y', `${y.toFixed(1)}px`);
  };

  const step = (): void => {
    frame = 0;
    x += (targetX - x) * dotSpotlightTrail;
    y += (targetY - y) * dotSpotlightTrail;
    paint();
    if (Math.abs(targetX - x) > 0.4 || Math.abs(targetY - y) > 0.4) {
      frame = window.requestAnimationFrame(step);
    }
  };

  const aim = (event: PointerEvent): void => {
    const box = card.getBoundingClientRect();
    targetX = event.clientX - box.left;
    targetY = event.clientY - box.top;
  };

  card.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'touch') return;
    aim(event);
    // Start where the pointer entered rather than sliding in from a corner.
    x = targetX;
    y = targetY;
    paint();
    card.classList.add('is-spotlit');
  });

  card.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    aim(event);
    if (!frame) frame = window.requestAnimationFrame(step);
  });

  card.addEventListener('pointerleave', () => {
    card.classList.remove('is-spotlit');
  });
}

if (dotSpotlightPointer.matches) dotSpotlightCards.forEach(followPointer);
