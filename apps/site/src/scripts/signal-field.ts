const field = document.querySelector<HTMLElement>('[data-signal-field]');
const canvas = field?.querySelector<HTMLCanvasElement>('[data-signal-canvas]');
const context = canvas?.getContext('2d', { alpha: true });

if (field && canvas && context) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compactViewport = window.matchMedia('(max-width: 767px)');
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let frame: number | undefined;
  let currentProgress = 0;
  let targetProgress = 0;

  const clamp = (value: number, min = 0, max = 1): number => Math.max(min, Math.min(max, value));

  const pageProgress = (): number => {
    const hero = field.getBoundingClientRect();
    return clamp(-hero.top / Math.max(hero.height, 1));
  };

  const pointOnCubic = (
    start: readonly [number, number],
    controlA: readonly [number, number],
    controlB: readonly [number, number],
    end: readonly [number, number],
    position: number,
  ): readonly [number, number] => {
    const inverse = 1 - position;
    const x =
      inverse ** 3 * start[0] +
      3 * inverse ** 2 * position * controlA[0] +
      3 * inverse * position ** 2 * controlB[0] +
      position ** 3 * end[0];
    const y =
      inverse ** 3 * start[1] +
      3 * inverse ** 2 * position * controlA[1] +
      3 * inverse * position ** 2 * controlB[1] +
      position ** 3 * end[1];
    return [x, y];
  };

  const draw = (progress: number): void => {
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);

    const density = compactViewport.matches ? 5 : 8;
    const hubX = width * (compactViewport.matches ? 0.72 : 0.76);
    const hubY = height * (0.34 + progress * 0.18);

    context.save();
    context.lineCap = 'round';

    for (let index = 0; index < density; index += 1) {
      const lane = (index + 0.75) / density;
      const baseY = lane * height;
      const amplitude = height * (0.07 + (index % 3) * 0.022);
      const phase = progress * Math.PI * 1.65 + index * 0.72;
      const start: readonly [number, number] = [-width * 0.08, baseY];
      const controlA: readonly [number, number] = [
        width * 0.29,
        baseY + Math.sin(phase) * amplitude,
      ];
      const controlB: readonly [number, number] = [
        width * 0.66,
        baseY - Math.cos(phase * 0.86) * amplitude * 1.35,
      ];
      const end: readonly [number, number] = [width * 1.08, baseY + Math.sin(phase) * 18];

      context.beginPath();
      context.moveTo(start[0], start[1]);
      context.bezierCurveTo(controlA[0], controlA[1], controlB[0], controlB[1], end[0], end[1]);
      context.strokeStyle =
        index % 3 === 0 ? 'rgba(84, 167, 216, 0.28)' : 'rgba(168, 200, 217, 0.14)';
      context.lineWidth = index % 3 === 0 ? 1.4 : 0.85;
      context.stroke();

      if (index % 3 === 0) {
        const pulsePosition = (progress * 0.78 + index * 0.19 + 0.16) % 1;
        const [pulseX, pulseY] = pointOnCubic(start, controlA, controlB, end, pulsePosition);
        context.beginPath();
        context.arc(pulseX, pulseY, compactViewport.matches ? 2.6 : 3.5, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255, 111, 97, 0.94)';
        context.shadowColor = 'rgba(255, 111, 97, 0.55)';
        context.shadowBlur = 14;
        context.fill();
        context.shadowBlur = 0;
      }
    }

    for (let ring = 1; ring <= (compactViewport.matches ? 2 : 4); ring += 1) {
      context.beginPath();
      context.arc(
        hubX,
        hubY,
        ring * Math.min(width, height) * 0.085,
        -Math.PI * (0.15 + progress * 0.18),
        Math.PI * (1.15 + progress * 0.22),
      );
      context.strokeStyle = `rgba(84, 167, 216, ${0.19 - ring * 0.025})`;
      context.lineWidth = ring === 1 ? 1.5 : 0.8;
      context.stroke();
    }

    context.beginPath();
    context.arc(hubX, hubY, compactViewport.matches ? 4 : 5.5, 0, Math.PI * 2);
    context.fillStyle = '#ff6f61';
    context.fill();
    context.restore();
  };

  const resize = (): void => {
    width = Math.max(1, field.clientWidth);
    height = Math.max(1, field.clientHeight);
    pixelRatio = Math.min(window.devicePixelRatio || 1, compactViewport.matches ? 1.25 : 1.6);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    draw(currentProgress);
  };

  const render = (): void => {
    frame = undefined;
    currentProgress += (targetProgress - currentProgress) * 0.12;
    draw(currentProgress);
    if (Math.abs(targetProgress - currentProgress) > 0.0005) {
      frame = window.requestAnimationFrame(render);
    }
  };

  const schedule = (): void => {
    targetProgress = pageProgress();
    if (frame === undefined && !document.hidden) frame = window.requestAnimationFrame(render);
  };

  const syncMotion = (): void => {
    const disabled = reducedMotion.matches || document.documentElement.dataset.motion === 'off';
    if (frame !== undefined) window.cancelAnimationFrame(frame);
    frame = undefined;
    if (disabled) {
      delete field.dataset.active;
      context.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    field.dataset.active = 'true';
    currentProgress = pageProgress();
    targetProgress = currentProgress;
    resize();
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) schedule();
  });
  reducedMotion.addEventListener('change', syncMotion);
  compactViewport.addEventListener('change', resize);
  syncMotion();
}
