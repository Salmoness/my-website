/**
 * Home process section: turns the four server-rendered steps into a click-to-discover stepper.
 * Without JavaScript every step stays visible as a stacked card and the track links jump to
 * them. With it, the track becomes a tab list, one card shows at a time, the next stop pulses,
 * and reaching the launch step sets off a one-time confetti burst (skipped with reduced motion).
 */
const CONFETTI_COLORS = [
  'var(--color-coral-signal)',
  'var(--color-azul-electric)',
  'var(--color-cloud-white)',
  'var(--color-azul-mist)',
  'var(--color-signal-verified)',
];

const journeyMotionOff = (): boolean =>
  document.documentElement.dataset.motion === 'off' ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initJourney(root: HTMLElement): void {
  const track = root.querySelector<HTMLElement>('.journey__track');
  const deck = root.querySelector<HTMLElement>('[data-journey-deck]');
  const tabs = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-journey-tab]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-journey-panel]'));
  if (!track || !deck || tabs.length < 2 || tabs.length !== panels.length) return;

  const last = tabs.length - 1;
  let active = 0;
  let celebrateTimer = 0;

  track.setAttribute('role', 'tablist');
  for (const item of track.querySelectorAll('li')) item.setAttribute('role', 'presentation');

  tabs.forEach((tab, index) => {
    const panel = panels[index];
    if (!panel) return;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = -1;

    tab.addEventListener('click', (event) => {
      event.preventDefault();
      select(index);
    });

    tab.addEventListener('keydown', (event) => {
      if (event.key === ' ') {
        event.preventDefault();
        select(index);
        return;
      }
      const keys: Record<string, number> = {
        ArrowRight: index + 1,
        ArrowLeft: index - 1,
        Home: 0,
        End: last,
      };
      const target = keys[event.key];
      if (target === undefined) return;
      event.preventDefault();
      const next = (target + tabs.length) % tabs.length;
      select(next);
      tabs[next]?.focus();
    });
  });

  for (const link of root.querySelectorAll<HTMLAnchorElement>('[data-journey-go]')) {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = Number(link.dataset.journeyGo);
      if (!Number.isInteger(target) || target < 0 || target > last) return;
      select(target);
      keepInView();
      // Wait a frame so the card is visible before focus moves onto it.
      window.setTimeout(() => panels[target]?.focus({ preventScroll: true }), 40);
    });
  }

  function select(index: number, celebrate = true): void {
    const previous = active;
    active = index;
    root.dataset.step = String(index);
    root.style.setProperty('--journey-progress', String(index / last));
    deck?.setAttribute('data-remaining', String(Math.min(2, last - index)));

    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      tab.classList.toggle('is-active', selected);
      tab.classList.toggle('is-done', tabIndex < index);
      tab.classList.toggle('is-next', tabIndex === index + 1);
    });

    panels.forEach((panel, panelIndex) => {
      panel.dataset.state =
        panelIndex === index ? 'active' : panelIndex < index ? 'past' : 'future';
    });

    if (celebrate && index === last && previous !== last) launch();
  }

  /** After a "Next" press lower on the card, bring the track back into view if it scrolled away. */
  function keepInView(): void {
    const header = document.querySelector<HTMLElement>('.site-header');
    const offset = (header?.offsetHeight ?? 0) + 16;
    if (root.getBoundingClientRect().top < offset) {
      root.scrollIntoView({ behavior: journeyMotionOff() ? 'auto' : 'smooth', block: 'start' });
    }
  }

  function launch(): void {
    root.classList.remove('is-celebrating');
    window.clearTimeout(celebrateTimer);
    // Restart the one-shot finale animations.
    void root.offsetWidth;
    root.classList.add('is-celebrating');
    celebrateTimer = window.setTimeout(() => root.classList.remove('is-celebrating'), 1800);
    if (journeyMotionOff()) return;

    const node = tabs[last]?.querySelector<HTMLElement>('.journey__node');
    if (!node) return;
    const rootBox = root.getBoundingClientRect();
    const nodeBox = node.getBoundingClientRect();
    const layer = document.createElement('div');
    layer.className = 'journey__confetti';
    layer.setAttribute('aria-hidden', 'true');
    layer.style.left = `${nodeBox.left + nodeBox.width / 2 - rootBox.left}px`;
    layer.style.top = `${nodeBox.top + nodeBox.height / 2 - rootBox.top}px`;

    const spread = Math.min(320, window.innerWidth * 0.42);
    for (let index = 0; index < 56; index += 1) {
      const piece = document.createElement('i');
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3;
      const distance = 70 + Math.random() * spread * 0.75;
      piece.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
      piece.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
      piece.style.setProperty('--fall', `${140 + Math.random() * 240}px`);
      piece.style.setProperty('--spin', `${(Math.random() - 0.5) * 900}deg`);
      piece.style.setProperty('--delay', `${Math.round(Math.random() * 140)}ms`);
      piece.style.background = CONFETTI_COLORS[index % CONFETTI_COLORS.length] ?? '';
      if (index % 3 === 0) piece.className = 'is-round';
      layer.append(piece);
    }

    root.append(layer);
    window.setTimeout(() => layer.remove(), 2000);
  }

  select(0, false);
  root.classList.add('is-ready');
}

for (const root of document.querySelectorAll<HTMLElement>('[data-journey]')) initJourney(root);
