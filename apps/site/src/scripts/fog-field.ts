type Point = {
  readonly x: number;
  readonly y: number;
};

type RoutePoint = Point & {
  readonly progress: number;
  readonly tangentX: number;
  readonly tangentY: number;
};

type Landmark = {
  readonly selector: string;
  readonly fraction: number;
};

const ROUTE_LANDMARKS: Readonly<Record<string, readonly Landmark[]>> = {
  '/': [
    { selector: '.problem-section', fraction: 0.62 },
    { selector: '.offers-section', fraction: 0.5 },
    { selector: '.process-section', fraction: 0.58 },
  ],
  '/services': [
    { selector: '.package-section', fraction: 0.48 },
    { selector: '.capability-section', fraction: 0.5 },
    { selector: '.faq-section', fraction: 0.62 },
  ],
  '/how-we-work': [
    { selector: '.work-route-section', fraction: 0.58 },
    { selector: '.timing-section', fraction: 0.56 },
  ],
  '/about': [
    { selector: '.founder-story', fraction: 0.5 },
    { selector: '.principles-section', fraction: 0.54 },
  ],
  '/privacy': [
    { selector: '.route-content--light', fraction: 0.38 },
    { selector: '.route-content--light', fraction: 0.76 },
  ],
};

const resolvedField = document.querySelector<HTMLElement>('[data-fog-field]');
const resolvedCanvas = resolvedField?.querySelector<HTMLCanvasElement>('[data-fog-canvas]');
const resolvedContext = resolvedCanvas?.getContext('2d', { alpha: true });

if (resolvedField && resolvedCanvas && resolvedContext) {
  const field = resolvedField;
  const canvas = resolvedCanvas;
  const context = resolvedContext;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compactViewport = window.matchMedia('(max-width: 767px)');
  const path = normalisePath(field.dataset.route ?? window.location.pathname);
  const landmarks = ROUTE_LANDMARKS[path] ?? defaultLandmarks(path);
  const mirrored = field.dataset.mirrored === 'true';
  const lightFog = createFogSprite(225, 239, 246, 0.42);
  const blueFog = createFogSprite(46, 116, 164, 0.38);
  const darkFog = createFogSprite(7, 26, 43, 0.28);
  const coralFog = createFogSprite(255, 111, 97, 0.58);

  let width = 1;
  let height = 1;
  let pixelRatio = 1;
  let route: RoutePoint[] = [];
  let crossingPositions: number[] = [];
  let frame: number | undefined;
  let lastFrameAt = performance.now();
  let lastScrollAt = -Infinity;
  let lastScrollY = window.scrollY;
  let inputEnergy = 0;
  let energy = 0;
  let flowDirection = 1;
  let flowPhase = 0;
  let bend = 0;
  let bendVelocity = 0;
  let engaged = false;

  const clamp = (value: number, min = 0, max = 1): number => Math.max(min, Math.min(max, value));

  function normalisePath(value: string): string {
    if (value === '/') return value;
    return value.replace(/\/$/, '');
  }

  function defaultLandmarks(value: string): readonly Landmark[] {
    const count = value.includes('work') || value.includes('about') ? 2 : 3;
    return Array.from({ length: count }, (_, index) => ({
      selector: `main > section:nth-of-type(${index + 2})`,
      fraction: 0.52,
    }));
  }

  function createFogSprite(
    red: number,
    green: number,
    blue: number,
    centreAlpha: number,
  ): HTMLCanvasElement {
    const sprite = document.createElement('canvas');
    const size = 128;
    const spriteContext = sprite.getContext('2d');
    sprite.width = size;
    sprite.height = size;
    if (!spriteContext) return sprite;

    const gradient = spriteContext.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    gradient.addColorStop(0, `rgba(${red}, ${green}, ${blue}, ${centreAlpha})`);
    gradient.addColorStop(0.28, `rgba(${red}, ${green}, ${blue}, ${centreAlpha * 0.7})`);
    gradient.addColorStop(0.64, `rgba(${red}, ${green}, ${blue}, ${centreAlpha * 0.2})`);
    gradient.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);
    spriteContext.fillStyle = gradient;
    spriteContext.fillRect(0, 0, size, size);
    return sprite;
  }

  function documentHeight(): number {
    return Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      window.innerHeight,
    );
  }

  function resolveCrossings(pageHeight: number): number[] {
    const resolved = landmarks
      .map(({ selector, fraction }) => {
        const element = document.querySelector<HTMLElement>(selector);
        if (!element) return undefined;
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY + rect.height * fraction;
      })
      .filter((value): value is number => value !== undefined)
      .map((value) => clamp(value, height * 0.78, pageHeight - height * 0.52))
      .sort((a, b) => a - b);

    if (resolved.length === landmarks.length) return resolved;

    return landmarks.map((_, index) => {
      const progress = (index + 1) / (landmarks.length + 1);
      return height * 0.72 + (pageHeight - height * 1.28) * progress;
    });
  }

  function edgeX(side: number): number {
    const inset = compactViewport.matches ? 0.025 : 0.055;
    return width * (side < 0 ? inset : 1 - inset);
  }

  function appendAnchor(anchors: Point[], point: Point): void {
    const previous = anchors.at(-1);
    const y = previous ? Math.max(point.y, previous.y + 24) : point.y;
    anchors.push({ x: point.x, y });
  }

  function buildAnchors(pageHeight: number, crossings: readonly number[]): Point[] {
    const anchors: Point[] = [];
    let side = mirrored ? 1 : -1;
    appendAnchor(anchors, { x: edgeX(side), y: -height * 0.16 });
    appendAnchor(anchors, { x: edgeX(side), y: height * 0.28 });

    crossings.forEach((crossing, index) => {
      const previousCrossing = crossings[index - 1] ?? height * 0.2;
      const nextCrossing = crossings[index + 1] ?? pageHeight - height * 0.25;
      const entryDistance = Math.min(
        height * 0.42,
        Math.max(170, (crossing - previousCrossing) * 0.3),
      );
      const exitDistance = Math.min(height * 0.34, Math.max(150, (nextCrossing - crossing) * 0.22));
      const centreDrift = Math.sin((index + 1) * 1.7) * width * 0.045;

      appendAnchor(anchors, { x: edgeX(side), y: crossing - entryDistance });
      appendAnchor(anchors, { x: width * 0.5 + centreDrift, y: crossing });
      side *= -1;
      appendAnchor(anchors, { x: edgeX(side), y: crossing + exitDistance });
    });

    appendAnchor(anchors, { x: edgeX(side), y: pageHeight - height * 0.32 });
    appendAnchor(anchors, {
      x: width * (mirrored ? 0.44 : 0.56),
      y: pageHeight + height * 0.14,
    });
    return anchors;
  }

  function catmullRom(
    point0: Point,
    point1: Point,
    point2: Point,
    point3: Point,
    position: number,
  ): Point {
    const squared = position * position;
    const cubed = squared * position;
    return {
      x:
        0.5 *
        (2 * point1.x +
          (-point0.x + point2.x) * position +
          (2 * point0.x - 5 * point1.x + 4 * point2.x - point3.x) * squared +
          (-point0.x + 3 * point1.x - 3 * point2.x + point3.x) * cubed),
      y:
        0.5 *
        (2 * point1.y +
          (-point0.y + point2.y) * position +
          (2 * point0.y - 5 * point1.y + 4 * point2.y - point3.y) * squared +
          (-point0.y + 3 * point1.y - 3 * point2.y + point3.y) * cubed),
    };
  }

  function sampleRoute(anchors: readonly Point[]): RoutePoint[] {
    const sampled: Point[] = [];

    for (let index = 0; index < anchors.length - 1; index += 1) {
      const point1 = anchors[index];
      const point2 = anchors[index + 1];
      if (!point1 || !point2) continue;
      const point0 = anchors[Math.max(0, index - 1)] ?? point1;
      const point3 = anchors[Math.min(anchors.length - 1, index + 2)] ?? point2;
      const distance = Math.hypot(point2.x - point1.x, point2.y - point1.y);
      const steps = Math.round(clamp(Math.ceil(distance / 22), 8, 96));

      for (let step = 0; step < steps; step += 1) {
        sampled.push(catmullRom(point0, point1, point2, point3, step / steps));
      }
    }
    sampled.push(anchors.at(-1) ?? { x: width / 2, y: documentHeight() });

    const distances = sampled.map(() => 0);
    for (let index = 1; index < sampled.length; index += 1) {
      const current = sampled[index];
      const previous = sampled[index - 1];
      if (!current || !previous) continue;
      distances[index] =
        (distances[index - 1] ?? 0) + Math.hypot(current.x - previous.x, current.y - previous.y);
    }
    const totalDistance = Math.max(1, distances.at(-1) ?? 1);

    return sampled.map((point, index) => {
      const previous = sampled[Math.max(0, index - 1)] ?? point;
      const next = sampled[Math.min(sampled.length - 1, index + 1)] ?? point;
      const tangentLength = Math.max(1, Math.hypot(next.x - previous.x, next.y - previous.y));
      return {
        ...point,
        progress: (distances[index] ?? 0) / totalDistance,
        tangentX: (next.x - previous.x) / tangentLength,
        tangentY: (next.y - previous.y) / tangentLength,
      };
    });
  }

  function rebuildRoute(): void {
    const pageHeight = documentHeight();
    crossingPositions = resolveCrossings(pageHeight);
    route = sampleRoute(buildAnchors(pageHeight, crossingPositions));
    field.dataset.routeProfile = `${mirrored ? 'mirrored' : 'standard'}-${crossingPositions.length}`;
  }

  function fogWidth(point: RoutePoint, phase: number): number {
    const base = compactViewport.matches
      ? clamp(width * 0.16, 50, 78)
      : clamp(width * 0.092, 96, 168);
    const expansion = 0.72 + Math.sin(point.progress * Math.PI * 3.3 + 0.4) ** 2 * 0.74;
    const breathing = 0.88 + Math.sin(point.progress * 41 + phase * 0.7) * 0.12;
    return base * expansion * breathing;
  }

  function animatedPoint(
    point: RoutePoint,
    phase: number,
    spring: number,
    activity: number,
  ): Point {
    const normalX = -point.tangentY;
    const normalY = point.tangentX;
    const widthAtPoint = fogWidth(point, phase);
    const eddy =
      Math.sin(point.progress * 52 + phase * 1.8) * widthAtPoint * (0.07 + activity * 0.08);
    const rubber = spring * Math.sin(point.progress * Math.PI * 6.5 + 0.6) * widthAtPoint * 0.34;
    const offset = eddy + rubber;
    return {
      x: point.x + normalX * offset,
      y: point.y - window.scrollY + normalY * offset,
    };
  }

  function drawSprite(
    sprite: HTMLCanvasElement,
    x: number,
    y: number,
    radius: number,
    opacity: number,
  ): void {
    context.globalAlpha = opacity;
    context.drawImage(sprite, x - radius, y - radius, radius * 2, radius * 2);
  }

  function drawVapourSprite(
    sprite: HTMLCanvasElement,
    point: RoutePoint,
    centre: Point,
    radius: number,
    opacity: number,
  ): void {
    context.save();
    context.globalAlpha = opacity;
    context.translate(centre.x, centre.y);
    context.rotate(Math.atan2(point.tangentY, point.tangentX));
    context.drawImage(sprite, -radius * 1.45, -radius * 0.74, radius * 2.9, radius * 1.48);
    context.restore();
  }

  function drawCoralSignals(phase: number, activity: number): void {
    crossingPositions.forEach((pageY, index) => {
      const screenY = pageY - window.scrollY;
      if (screenY < -100 || screenY > height + 100) return;
      const nearest = route.reduce((best, point) =>
        Math.abs(point.y - pageY) < Math.abs(best.y - pageY) ? point : best,
      );
      const centre = animatedPoint(nearest, phase, bend, activity);
      const pulse = 0.82 + Math.sin(phase * 2.4 + index * 1.9) * 0.18;
      const radius = (compactViewport.matches ? 20 : 30) * pulse;

      drawSprite(coralFog, centre.x, centre.y, radius, 0.34 + activity * 0.18);
      context.globalAlpha = 0.42 + activity * 0.24;
      context.strokeStyle = '#ff6f61';
      context.lineWidth = compactViewport.matches ? 1 : 1.4;
      context.beginPath();
      context.arc(centre.x, centre.y, radius * 0.72, -0.65 + phase * 0.08, 1.45 + phase * 0.08);
      context.stroke();

      for (let mote = 0; mote < 3; mote += 1) {
        const angle = phase * 0.45 + index + mote * 2.2;
        const distance = radius * (0.6 + mote * 0.22);
        drawSprite(
          coralFog,
          centre.x + Math.cos(angle) * distance,
          centre.y + Math.sin(angle) * distance,
          4 + mote * 1.5,
          0.42 + activity * 0.2,
        );
      }
    });
  }

  function draw(phase: number, spring: number, activity: number): void {
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);
    if (!engaged || route.length === 0) return;

    const margin = compactViewport.matches ? 130 : 260;
    const visible = route.filter((point) => {
      const screenY = point.y - window.scrollY;
      return screenY > -margin && screenY < height + margin;
    });
    if (visible.length < 2) return;

    context.save();
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.globalCompositeOperation = 'source-over';

    const animatedVisible = visible.map((point) => animatedPoint(point, phase, spring, activity));
    const averageWidth =
      visible.reduce((total, point) => total + fogWidth(point, phase), 0) / visible.length;

    context.beginPath();
    animatedVisible.forEach((point, index) => {
      if (index === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    });
    context.globalAlpha = 0.075 + activity * 0.02;
    context.strokeStyle = '#dcecf3';
    context.lineWidth = averageWidth * 0.68;
    context.stroke();

    context.globalAlpha = 0.055;
    context.strokeStyle = '#1f608d';
    context.lineWidth = averageWidth * 0.34;
    context.stroke();

    const stride = compactViewport.matches ? 3 : 2;
    visible.forEach((point, index) => {
      if (index % stride !== 0) return;
      const centre = animatedPoint(point, phase, spring, activity);
      const widthAtPoint = fogWidth(point, phase);
      const normalX = -point.tangentY;
      const normalY = point.tangentX;
      const drift =
        Math.sin(point.progress * 73 - phase * 2.1) * widthAtPoint * (0.2 + activity * 0.08);
      const vapourRadius = widthAtPoint * (0.58 + Math.sin(point.progress * 29 + 1.3) * 0.1);
      const sprite = index % 5 === 0 ? darkFog : index % 2 === 0 ? lightFog : blueFog;

      drawVapourSprite(sprite, point, centre, vapourRadius, 0.3 + activity * 0.06);
      if (index % (stride * 2) === 0) {
        drawVapourSprite(
          index % 4 === 0 ? blueFog : lightFog,
          point,
          {
            x: centre.x + normalX * drift,
            y: centre.y + normalY * drift,
          },
          vapourRadius * 0.72,
          0.22 + activity * 0.07,
        );
      }
    });

    drawCoralSignals(phase, activity);
    context.restore();
    context.globalAlpha = 1;
  }

  function resize(): void {
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    pixelRatio = Math.min(window.devicePixelRatio || 1, compactViewport.matches ? 1.15 : 1.45);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    rebuildRoute();
    if (engaged) draw(flowPhase, bend, energy);
  }

  function render(now: number): void {
    frame = undefined;
    const deltaSeconds = clamp((now - lastFrameAt) / 1000, 0.001, 0.05);
    lastFrameAt = now;
    const idleFor = now - lastScrollAt;
    const isReceivingScroll = idleFor < 90;
    const targetEnergy = isReceivingScroll ? inputEnergy : 0;
    const energyRate = isReceivingScroll ? 14 : 2.8;
    energy += (targetEnergy - energy) * (1 - Math.exp(-energyRate * deltaSeconds));

    const targetBend = isReceivingScroll ? clamp(inputEnergy * flowDirection, -1, 1) : 0;
    const springForce = (targetBend - bend) * 31;
    const springDamping = bendVelocity * (isReceivingScroll ? 8.2 : 4.6);
    bendVelocity += (springForce - springDamping) * deltaSeconds;
    bend += bendVelocity * deltaSeconds;

    flowPhase += deltaSeconds * (0.34 + energy * 2.7) * flowDirection;
    const decay = clamp(1 - idleFor / 2000);
    const activity = Math.max(energy, decay * 0.72);
    draw(flowPhase, bend, activity);

    if (idleFor < 2000 && !document.hidden) {
      field.dataset.state = isReceivingScroll ? 'moving' : 'settling';
      frame = window.requestAnimationFrame(render);
      return;
    }

    energy = 0;
    inputEnergy = 0;
    bend = 0;
    bendVelocity = 0;
    draw(flowPhase, 0, 0);
    field.dataset.state = 'settled';
  }

  function schedule(): void {
    const now = performance.now();
    const nextScrollY = window.scrollY;
    const delta = nextScrollY - lastScrollY;
    lastScrollY = nextScrollY;
    if (Math.abs(delta) < 0.5 || document.hidden) return;

    const elapsed = Math.max(8, now - Math.max(lastScrollAt, 0));
    const velocity = delta / elapsed;
    flowDirection = velocity >= 0 ? 1 : -1;
    inputEnergy = clamp(Math.abs(velocity) / 1.45, 0.24, 1);
    lastScrollAt = now;

    if (!engaged) {
      engaged = true;
      field.dataset.engaged = 'true';
    }
    field.dataset.state = 'moving';
    if (frame === undefined) {
      lastFrameAt = now;
      frame = window.requestAnimationFrame(render);
    }
  }

  function stopFrame(): void {
    if (frame !== undefined) window.cancelAnimationFrame(frame);
    frame = undefined;
  }

  function syncMotion(): void {
    const disabled = reducedMotion.matches || document.documentElement.dataset.motion === 'off';
    stopFrame();
    if (disabled) {
      delete field.dataset.ready;
      delete field.dataset.engaged;
      field.dataset.reduced = 'true';
      field.dataset.state = 'static';
      engaged = false;
      context.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    delete field.dataset.reduced;
    field.dataset.ready = 'true';
    field.dataset.state = engaged ? 'settled' : 'waiting';
    resize();
  }

  const resizeObserver = new ResizeObserver(() => {
    rebuildRoute();
    if (engaged && frame === undefined) draw(flowPhase, bend, energy);
  });

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopFrame();
      return;
    }
    if (engaged && performance.now() - lastScrollAt < 2000) {
      lastFrameAt = performance.now();
      frame = window.requestAnimationFrame(render);
    } else if (engaged) {
      draw(flowPhase, 0, 0);
      field.dataset.state = 'settled';
    }
  });
  reducedMotion.addEventListener('change', syncMotion);
  compactViewport.addEventListener('change', resize);
  resizeObserver.observe(document.body);
  syncMotion();
}

export {};
