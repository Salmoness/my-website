/** One opt-in artwork; CSS consumes transform variables with resting-state fallbacks. */
export function initPortfolioMotion(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const art = document.querySelector<HTMLElement>('[data-scroll-art]');
  if (!art) return;

  const DESKTOP_MOTION = {
    entryY: 30,
    exitY: -24,
    entryRotation: -4.2,
    exitRotation: 0.6,
    entryScale: 1.115,
    settleStart: 0.18,
    settleEnd: 0.67,
    departureStart: 0.72,
  } as const;
  const MOBILE_MOTION = {
    entryY: 14,
    exitY: -10,
    entryRotation: -2.4,
    exitRotation: 0.3,
    entryScale: 1.095,
    settleStart: 0.08,
    settleEnd: 0.56,
    departureStart: 0.64,
  } as const;
  const RESTING_SCALE = 1.08;

  const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));
  const smoothstep = (start: number, end: number, value: number): number => {
    const progress = clamp01((value - start) / (end - start));
    return progress * progress * (3 - 2 * progress);
  };

  const isOwnerMotionOff =
    document.documentElement.dataset.motion === 'off' || art.dataset.motionEnabled === 'false';
  if (isOwnerMotionOff || typeof window.matchMedia !== 'function') {
    art.style.setProperty('--art-y', '0px');
    art.style.setProperty('--art-rotate', '0deg');
    art.style.setProperty('--art-scale', String(RESTING_SCALE));
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compactViewport = window.matchMedia('(max-width: 767px)');
  // Measure the still parent so transforming the artwork does not feed back into its position.
  const anchor = art.parentElement ?? art;
  let inView = typeof IntersectionObserver === 'undefined';
  let frame: number | undefined;

  function cancelFrame(): void {
    if (frame !== undefined) window.cancelAnimationFrame(frame);
    frame = undefined;
  }

  function setActive(isActive: boolean): void {
    if (!art) return;
    if (isActive) art.dataset.motionActive = 'true';
    else delete art.dataset.motionActive;
  }

  function renderRestingState(): void {
    art?.style.setProperty('--art-y', '0px');
    art?.style.setProperty('--art-rotate', '0deg');
    art?.style.setProperty('--art-scale', String(RESTING_SCALE));
  }

  function update(): void {
    frame = undefined;
    const motionDisabled =
      document.documentElement.dataset.motion === 'off' ||
      art?.dataset.motionEnabled === 'false' ||
      reducedMotion.matches;
    if (!art || motionDisabled || document.hidden || !inView) return;

    const bounds = anchor.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const travel = viewportHeight + bounds.height;
    if (travel <= 0) return;

    const progress = clamp01((viewportHeight - bounds.top) / travel);
    const limits = compactViewport.matches ? MOBILE_MOTION : DESKTOP_MOTION;
    const settle = smoothstep(limits.settleStart, limits.settleEnd, progress);
    const departure = smoothstep(limits.departureStart, 0.98, progress);
    const y = limits.entryY * (1 - settle) + limits.exitY * departure;
    const rotation = limits.entryRotation * (1 - settle) + limits.exitRotation * departure;
    const scale = RESTING_SCALE + (limits.entryScale - RESTING_SCALE) * (1 - settle);

    art.style.setProperty('--art-y', `${y.toFixed(2)}px`);
    art.style.setProperty('--art-rotate', `${rotation.toFixed(2)}deg`);
    art.style.setProperty('--art-scale', scale.toFixed(3));
  }

  function schedule(): void {
    const motionDisabled =
      document.documentElement.dataset.motion === 'off' ||
      art?.dataset.motionEnabled === 'false' ||
      reducedMotion.matches;
    if (frame === undefined && !motionDisabled && !document.hidden && inView) {
      setActive(true);
      frame = window.requestAnimationFrame(update);
    }
  }

  function syncPreference(): void {
    cancelFrame();
    const motionDisabled =
      document.documentElement.dataset.motion === 'off' ||
      art?.dataset.motionEnabled === 'false' ||
      reducedMotion.matches;
    if (motionDisabled) {
      setActive(false);
      renderRestingState();
    } else if (document.hidden) {
      setActive(false);
    } else {
      schedule();
    }
  }

  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
        if (inView) schedule();
        else {
          cancelFrame();
          setActive(false);
        }
      },
      { rootMargin: '8% 0px', threshold: 0.01 },
    );
    observer.observe(anchor);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  document.addEventListener('visibilitychange', syncPreference);
  reducedMotion.addEventListener('change', syncPreference);
  compactViewport.addEventListener('change', schedule);
  renderRestingState();
  syncPreference();
}

if (typeof window !== 'undefined') initPortfolioMotion();
