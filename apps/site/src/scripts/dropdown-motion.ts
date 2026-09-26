const reducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  document.documentElement.dataset.motion === 'off';

document.querySelectorAll<HTMLDetailsElement>('[data-animated-disclosure]').forEach((details) => {
  const summary = details.querySelector<HTMLElement>('summary');
  const answer = details.querySelector<HTMLElement>('.faq-answer, [data-disclosure-body]');

  if (!summary || !answer) return;

  let animation: Animation | undefined;
  let desiredOpen = details.open;

  summary.addEventListener('click', (event) => {
    event.preventDefault();
    // Follow the element's real state when idle (a linked #hash may have opened it).
    const running = animation !== undefined;
    animation?.cancel();
    desiredOpen = running ? !desiredOpen : !details.open;

    if (reducedMotion()) {
      details.open = desiredOpen;
      return;
    }

    if (desiredOpen) {
      details.open = true;
      const targetHeight = answer.scrollHeight;
      animation = answer.animate(
        [
          { height: '0px', opacity: 0, transform: 'translateY(-0.4rem)' },
          { height: `${targetHeight}px`, opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 280, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'both' },
      );
    } else {
      animation = answer.animate(
        [
          { height: `${answer.getBoundingClientRect().height}px`, opacity: 1 },
          { height: '0px', opacity: 0 },
        ],
        { duration: 220, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'both' },
      );
    }

    const finishedAnimation = animation;
    animation.onfinish = () => {
      if (!desiredOpen) details.open = false;
      finishedAnimation.cancel();
      if (animation === finishedAnimation) animation = undefined;
    };
  });
});

document.querySelectorAll<HTMLSelectElement>('.select-field select').forEach((select) => {
  const field = select.closest<HTMLElement>('.select-field');
  if (!field) return;

  const syncValue = (): void => {
    field.dataset.hasValue = select.value ? 'true' : 'false';
  };

  select.addEventListener('change', () => {
    syncValue();
    if (reducedMotion()) return;

    select.animate(
      [
        { transform: 'translateY(0)', backgroundColor: 'var(--color-cloud-white)' },
        { transform: 'translateY(-2px)', backgroundColor: 'rgba(84, 167, 216, 0.14)' },
        { transform: 'translateY(0)', backgroundColor: 'var(--color-cloud-white)' },
      ],
      { duration: 300, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
    );
  });

  syncValue();
});
