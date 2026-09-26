/**
 * How We Work: the sticky rail beside the four steps highlights the step crossing the reading
 * line and fills a progress line down to it. Without JavaScript the rail remains a plain list of
 * jump links and every step stays fully visible.
 */
const workSteps = document.querySelector<HTMLElement>('[data-work-steps]');

if (workSteps) {
  const links = Array.from(workSteps.querySelectorAll<HTMLAnchorElement>('[data-step-link]'));
  const stepEls = Array.from(workSteps.querySelectorAll<HTMLElement>('[data-step]'));
  const last = Math.max(stepEls.length - 1, 1);
  let current = -1;
  let frame = 0;

  const show = (index: number): void => {
    if (index === current) return;
    current = index;
    workSteps.style.setProperty('--work-progress', String(index / last));
    links.forEach((link, linkIndex) => {
      link.classList.toggle('is-current', linkIndex === index);
      link.classList.toggle('is-done', linkIndex < index);
      if (linkIndex === index) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
    stepEls.forEach((step, stepIndex) => {
      step.classList.toggle('is-current', stepIndex === index);
      step.classList.toggle('is-past', stepIndex < index);
      step.classList.toggle('is-future', stepIndex > index);
    });
  };

  const measure = (): void => {
    frame = 0;
    const line = window.innerHeight * 0.5;
    let index = 0;
    stepEls.forEach((step, stepIndex) => {
      if (step.getBoundingClientRect().top <= line) index = stepIndex;
    });
    show(index);
  };

  const schedule = (): void => {
    if (!frame) frame = window.requestAnimationFrame(measure);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  workSteps.classList.add('is-tracking');
  measure();
}
