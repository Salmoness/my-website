const path = document.querySelector<HTMLOListElement>('.capability-path__steps');

if (path) {
  const steps = Array.from(path.querySelectorAll<HTMLElement>('.capability-path__step'));
  const markers = steps.map((step) => step.querySelector<HTMLElement>('.capability-path__number'));
  let frame = 0;
  let currentIndex = -1;

  const update = (): void => {
    frame = 0;
    const pathRect = path.getBoundingClientRect();
    const readingLine = window.innerHeight * 0.56;
    const progress = Math.max(0, Math.min(1, (readingLine - pathRect.top) / pathRect.height));
    path.style.setProperty('--capability-progress', progress.toFixed(4));

    let reachedIndex = -1;
    markers.forEach((marker, index) => {
      if (marker && marker.getBoundingClientRect().top + marker.offsetHeight / 2 <= readingLine) {
        reachedIndex = index;
      }
    });

    if (reachedIndex === currentIndex) return;
    currentIndex = reachedIndex;
    steps.forEach((step, index) => {
      step.classList.toggle('is-past', index < reachedIndex);
      step.classList.toggle('is-current', index === reachedIndex);
    });
  };

  const queueUpdate = (): void => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  window.addEventListener('scroll', queueUpdate, { passive: true });
  window.addEventListener('resize', queueUpdate);
  window.addEventListener('load', queueUpdate, { once: true });
  queueUpdate();
}
