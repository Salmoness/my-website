/**
 * Home-page loading screen. The boot script in RootLayout adds `is-loading` to <html>
 * before first paint on every Home load; this module animates progress from real page-load
 * signals, holds for at least MIN_DURATION, then removes the overlay. Without JavaScript
 * nothing is shown.
 */
const MIN_DURATION = 1000;
const MAX_DURATION = 4000;
const EXIT_DURATION = 420;

const root = document.documentElement;
const loader = document.querySelector<HTMLElement>('[data-site-loader]');

if (loader && root.classList.contains('is-loading')) {
  runLoader(loader);
} else {
  loader?.remove();
}

function runLoader(element: HTMLElement): void {
  const reduced =
    root.dataset.motion === 'off' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const value = element.querySelector<HTMLElement>('[data-loader-value]');
  const status = element.querySelector<HTMLElement>('[data-loader-status]');
  const start = performance.now();
  let pageReady = false;
  let shown = 0;

  const windowLoaded = new Promise<void>((resolve) => {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', () => resolve(), { once: true });
  });
  void Promise.all([windowLoaded, document.fonts.ready]).then(() => {
    pageReady = true;
  });

  const render = (percent: number): void => {
    element.style.setProperty('--loader-progress', String(percent / 100));
    if (value) value.textContent = `${percent}%`;
    if (status)
      status.textContent = percent >= 100 ? 'Ready' : percent >= 60 ? 'Almost ready' : 'Loading';
  };

  const finish = (): void => {
    window.setTimeout(() => {
      element.classList.add('is-leaving');
      window.setTimeout(() => {
        root.classList.remove('is-loading');
        element.remove();
      }, EXIT_DURATION);
    }, 120);
  };

  const frame = (now: number): void => {
    const elapsed = now - start;
    const complete = (pageReady && elapsed >= MIN_DURATION) || elapsed >= MAX_DURATION;
    // Ease toward 90% while waiting; only real readiness (or the time cap) reaches 100%.
    const waiting = 90 * (1 - Math.pow(1 - Math.min(elapsed / (MIN_DURATION * 1.4), 1), 3));
    const target = complete ? 100 : Math.min(pageReady ? 95 : 90, waiting);
    shown += (target - shown) * (reduced || complete ? 0.35 : 0.14);
    if (complete && target - shown < 0.6) shown = 100;

    render(Math.round(shown));
    if (shown >= 100) finish();
    else window.requestAnimationFrame(frame);
  };

  window.requestAnimationFrame(frame);
}
