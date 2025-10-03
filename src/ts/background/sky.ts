import { getScaleFactor } from "../utility/view";
import { getTimeFactor } from "../utility/time";

/* ---------------------------
   Shared utility types
   --------------------------- */
type Nullable<T> = T | null;

/* ---------------------------
   Space overlay types & impl
   (Converted from original JS)
   --------------------------- */
interface Star {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  alphaDir: number;
  dx: number;
  dy: number;
  parallax: number;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  parallax: number;
}

interface NebulaBlob {
  x: number;
  y: number;
  radius: number;
  color: string;
}

interface Nebula {
  x: number;
  y: number;
  blobs: NebulaBlob[];
}

type ResizeHandler = () => void;
type ScrollHandler = (this: Window, ev: Event) => any;

let spaceOverlay: {
  canvas: Nullable<HTMLCanvasElement>;
  ctx: Nullable<CanvasRenderingContext2D>;
  animationId: Nullable<number>;
  resizeHandler: Nullable<ResizeHandler>;
  scrollHandler: Nullable<ScrollHandler>;
} = {
  canvas: null,
  ctx: null,
  animationId: null,
  resizeHandler: null,
  scrollHandler: null,
};

export function removeSpaceOverlay(): void {
  if (!spaceOverlay.canvas || !spaceOverlay.ctx) return;

  if (spaceOverlay.animationId !== null) {
    cancelAnimationFrame(spaceOverlay.animationId);
  }
  if (spaceOverlay.resizeHandler) {
    window.removeEventListener("resize", spaceOverlay.resizeHandler);
  }
  if (spaceOverlay.scrollHandler) {
    window.removeEventListener("scroll", spaceOverlay.scrollHandler);
  }

  spaceOverlay.ctx.clearRect(0, 0, spaceOverlay.canvas.width, spaceOverlay.canvas.height);

  spaceOverlay = { canvas: null, ctx: null, animationId: null, resizeHandler: null, scrollHandler: null };
}

export function initSpaceOverlay(): void {
  const scale = getScaleFactor();

  const CONFIG = {
    MAX_STARS: Math.floor(200 * scale * scale),
    STAR_COLORS: ["#ffffff", "#ffe9c4", "#c4e1ff", "#ffb6c1"],
    STAR_BRIGHTNESS: 0.9,
    STAR_ROAMING: 0.15 * scale,
    STAR_FADE_SPEED: 0.012,
    STAR_3D_DEPTH_MIN: 0.005,
    STAR_3D_DEPTH_MAX: 0.7,

    NUM_NEBULAS: Math.max(3, Math.floor(scale)),
    NUM_BLOBS: Math.max(3, Math.floor(scale)),
    NEBULA_SPREAD_X: 800 * scale,
    NEBULA_SPREAD_Y: 1000 * scale,
    NEBULA_BASE_RADIUS: 400 * scale,
    NEBULA_RADIUS_VARIANCE: 120 * scale,

    MAX_METEORS: Math.floor(30 * scale),
    METEOR_CHANCE_IDLE: 0.012,
    METEOR_CHANCE_SCROLL: 0.1,
    METEOR_BRIGHTNESS: 1.0,
    METEOR_MIN_LENGTH: 50 * scale,
    METEOR_MAX_LENGTH: 130 * scale,
    METEOR_MIN_SPEED: 4 * scale,
    METEOR_MAX_SPEED: 10 * scale,

    MAX_WARP: 200 * scale,
    SCROLL_MIN_DELTA: 30,
    WARP_LERP_SPEED: 0.11,
    PARALLAX_STRENGTH: 0.5 / scale,
  };

  const canvasEl = document.getElementById("space") as HTMLCanvasElement | null;
  if (!canvasEl) return;
  const ctxEl = canvasEl.getContext("2d");
  if (!ctxEl) return;

  // store non-null locals for closures
  const canvas = canvasEl;
  const ctx = ctxEl;

  spaceOverlay.canvas = canvas;
  spaceOverlay.ctx = ctx;

  const stars: Star[] = [];
  const meteors: Meteor[] = [];
  const nebulas: Nebula[] = [];

  let warpFactor = 0;
  let lastScrollY = window.scrollY;

  const resizeCanvas: ResizeHandler = () => {
    // write to the stored canvas
    if (!spaceOverlay.canvas) return;
    spaceOverlay.canvas.width = window.innerWidth;
    spaceOverlay.canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", resizeCanvas);
  spaceOverlay.resizeHandler = resizeCanvas;
  resizeCanvas();

  const scrollHandler: ScrollHandler = () => {
    const currentY = window.scrollY;
    const delta = currentY - lastScrollY;

    let targetWarp = 0;
    if (Math.abs(delta) > CONFIG.SCROLL_MIN_DELTA) {
      targetWarp = Math.min(Math.abs(delta - CONFIG.SCROLL_MIN_DELTA) * 0.01, CONFIG.MAX_WARP);
    }
    warpFactor += (targetWarp - warpFactor) * CONFIG.WARP_LERP_SPEED;

    stars.forEach((star) => {
      star.y -= delta * star.parallax * CONFIG.PARALLAX_STRENGTH;
      if (!spaceOverlay.canvas) return;
      if (star.y < 0) star.y += spaceOverlay.canvas.height;
      if (star.y > spaceOverlay.canvas.height) star.y -= spaceOverlay.canvas.height;
    });
    meteors.forEach((meteor) => {
      meteor.y -= delta * meteor.parallax * CONFIG.PARALLAX_STRENGTH;
      if (!spaceOverlay.canvas) return;
      if (meteor.y < 0) meteor.y += spaceOverlay.canvas.height;
      if (meteor.y > spaceOverlay.canvas.height) meteor.y -= spaceOverlay.canvas.height;
    });

    lastScrollY = currentY;
  };
  window.addEventListener("scroll", scrollHandler, { passive: true });
  spaceOverlay.scrollHandler = scrollHandler;

  // Nebulas
  for (let i = 0; i < CONFIG.NUM_NEBULAS; i++) {
    const nebula: Nebula = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      blobs: [],
    };

    for (let j = 0; j < CONFIG.NUM_BLOBS; j++) {
      nebula.blobs.push({
        x: nebula.x + (Math.random() - 0.5) * CONFIG.NEBULA_SPREAD_X,
        y: nebula.y + (Math.random() - 0.5) * CONFIG.NEBULA_SPREAD_Y,
        radius: CONFIG.NEBULA_BASE_RADIUS + Math.random() * CONFIG.NEBULA_RADIUS_VARIANCE,
        color: `rgba(${50 + Math.random() * 150}, ${Math.random() * 50}, ${100 + Math.random() * 155}, ${
          0.2 + Math.random() * 0.2
        })`,
      });
    }
    nebulas.push(nebula);
  }

  // Stars
  for (let i = 0; i < CONFIG.MAX_STARS; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      color: CONFIG.STAR_COLORS[Math.floor(Math.random() * CONFIG.STAR_COLORS.length)],
      alpha: Math.random() * CONFIG.STAR_BRIGHTNESS,
      alphaDir: (Math.random() < 0.5 ? 1 : -1) * Math.random() * CONFIG.STAR_FADE_SPEED,
      dx: (Math.random() - 0.5) * CONFIG.STAR_ROAMING,
      dy: (Math.random() - 0.5) * CONFIG.STAR_ROAMING,
      parallax: CONFIG.STAR_3D_DEPTH_MIN + Math.random() * (CONFIG.STAR_3D_DEPTH_MAX - CONFIG.STAR_3D_DEPTH_MIN),
    });
  }

  function spawnMeteor(): void {
    if (meteors.length >= CONFIG.MAX_METEORS) return;
    if (Math.random() < CONFIG.METEOR_CHANCE_IDLE || warpFactor > CONFIG.METEOR_CHANCE_SCROLL) {
      meteors.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: CONFIG.METEOR_MIN_LENGTH + Math.random() * (CONFIG.METEOR_MAX_LENGTH - CONFIG.METEOR_MIN_LENGTH),
        speed: CONFIG.METEOR_MIN_SPEED + Math.random() * (CONFIG.METEOR_MAX_SPEED - CONFIG.METEOR_MIN_SPEED),
        opacity: CONFIG.METEOR_BRIGHTNESS,
        parallax: CONFIG.STAR_3D_DEPTH_MIN + Math.random() * (CONFIG.STAR_3D_DEPTH_MAX - CONFIG.STAR_3D_DEPTH_MIN),
      });
    }
  }

  function drawStars(): void {
    for (let i = stars.length - 1; i >= 0; i--) {
      const star = stars[i];

      star.alpha += star.alphaDir;
      if (star.alpha >= CONFIG.STAR_BRIGHTNESS) star.alphaDir = -Math.random() * CONFIG.STAR_FADE_SPEED;
      if (star.alpha <= 0) {
        star.x = Math.random() * canvas.width;
        star.y = Math.random() * canvas.height;
        star.alpha = 0;
        star.alphaDir = Math.random() * CONFIG.STAR_FADE_SPEED;
        star.dx = (Math.random() - 0.5) * CONFIG.STAR_ROAMING;
        star.dy = (Math.random() - 0.5) * CONFIG.STAR_ROAMING;
        star.color = CONFIG.STAR_COLORS[Math.floor(Math.random() * CONFIG.STAR_COLORS.length)];
        star.parallax = CONFIG.STAR_3D_DEPTH_MIN + Math.random() * (CONFIG.STAR_3D_DEPTH_MAX - CONFIG.STAR_3D_DEPTH_MIN);
      }

      ctx.globalAlpha = star.alpha;
      const stretch = warpFactor * 130 * star.parallax;
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.ellipse(star.x, star.y, star.radius, star.radius + stretch, 0, 0, Math.PI * 2);
      ctx.fill();

      star.x += star.dx;
      star.y += star.dy;

      if (star.x < 0) star.x = canvas.width;
      if (star.x > canvas.width) star.x = 0;
      if (star.y < 0) star.y = canvas.height;
      if (star.y > canvas.height) star.y = 0;
    }

    ctx.globalAlpha = 1;
    warpFactor *= 0.1;
  }

  function drawMeteors(): void {
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      ctx.strokeStyle = `rgba(173,216,230,${m.opacity})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.length, m.y - m.length * 0.3);
      ctx.stroke();

      m.x += m.speed;
      m.y += m.speed * 0.3;
      m.opacity -= 0.01;

      if (m.opacity <= 0) meteors.splice(i, 1);
    }
  }

  function drawNebula(): void {
    nebulas.forEach((nebula) => {
      nebula.blobs.forEach((b) => {
        const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        gradient.addColorStop(0, b.color);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  }

  function animate(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawNebula();
    spawnMeteor();
    drawMeteors();
    spaceOverlay.animationId = requestAnimationFrame(animate);
  }

  animate();
}

/* ---------------------------
   Sky background: typed + fixes
   --------------------------- */

const GRADIENT_STRETCH_FACTOR = 1000;
const GRADIENT_ROTATION = 0;

interface DaySegment {
  color: string;
  weight: number;
}

interface BaseColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

let skyOverlay: {
  canvas: Nullable<HTMLCanvasElement>;
  ctx: Nullable<CanvasRenderingContext2D>;
  animationId: Nullable<number>;
  resizeHandler: Nullable<ResizeHandler>;
  startTime: Nullable<number>;
} = {
  canvas: null,
  ctx: null,
  animationId: null,
  resizeHandler: null,
  startTime: null,
};

const daySegments: DaySegment[] = [
  { color: "rgba(37, 70, 161, 0.7)", weight: 6 },
  { color: "rgba(255, 162, 100, 0.7)", weight: 3 },
  { color: "rgba(135, 206, 250, 0.7)", weight: 3 },
  { color: "rgba(178, 235, 243, 0.7)", weight: 3 },
  { color: "rgba(135, 206, 250, 0.7)", weight: 3 },
  { color: "rgba(255, 162, 100, 0.7)", weight: 3 },
  { color: "rgba(37, 70, 161, 0.7)", weight: 3 },
];

function getSkyGradient(ctx: CanvasRenderingContext2D, width: number, height: number): CanvasGradient {
  const t = getTimeFactor(); // 0..1 over the day

  const angleRad = (GRADIENT_ROTATION * Math.PI) / 180;
  const dx = Math.cos(angleRad);
  const dy = Math.sin(angleRad);

  const length = Math.max(width, height) * GRADIENT_STRETCH_FACTOR;

  const x0 = 0;
  const y0 = 0;
  const x1 = dx * length;
  const y1 = dy * length;

  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);

  const totalWeight = daySegments.reduce((sum, seg) => sum + seg.weight, 0);
  let cumulative = 0;

  daySegments.forEach((seg) => {
    // Shift stops based on time t
    let stop = cumulative / totalWeight - t;
    stop = Math.min(Math.max(stop, 0), 1); // clamp 0..1
    gradient.addColorStop(stop, seg.color);
    cumulative += seg.weight;
  });

  return gradient;
}

function getCloudColor(baseColor: BaseColor): string {
  const t = getTimeFactor();
  const r = Math.floor(baseColor.r + 50 * Math.sin(t * 2 * Math.PI));
  const g = Math.floor(baseColor.g + 50 * Math.sin(t * 2 * Math.PI + 1));
  const b = Math.floor(baseColor.b + 50 * Math.sin(t * 2 * Math.PI + 2));
  return `rgba(${r}, ${g}, ${b}, ${baseColor.a})`;
}

export function initSkyBackground(): void {
  const canvasEl = document.getElementById("light") as HTMLCanvasElement | null;
  if (!canvasEl) return;
  const ctxEl = canvasEl.getContext("2d");
  if (!ctxEl) return;

  // store non-null locals for closures to satisfy strict null checks
  const canvas = canvasEl;
  const ctx = ctxEl;

  skyOverlay.canvas = canvas;
  skyOverlay.ctx = ctx;

  const handleResize: ResizeHandler = () => {
    if (!skyOverlay.canvas) return;
    skyOverlay.canvas.width = window.innerWidth;
    skyOverlay.canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", handleResize);
  skyOverlay.resizeHandler = handleResize;
  handleResize();

  function animateSky(): void {
    // Use the non-null locals (canvas, ctx)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = getSkyGradient(ctx, canvas.width, canvas.height);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    skyOverlay.animationId = requestAnimationFrame(animateSky);
  }

  animateSky();
}

export function removeSkyBackground(): void {
  if (!skyOverlay.canvas || !skyOverlay.ctx) return;

  if (skyOverlay.animationId !== null) {
    cancelAnimationFrame(skyOverlay.animationId);
  }
  if (skyOverlay.resizeHandler) {
    window.removeEventListener("resize", skyOverlay.resizeHandler);
  }

  skyOverlay.ctx.clearRect(0, 0, skyOverlay.canvas.width, skyOverlay.canvas.height);

  skyOverlay = { canvas: null, ctx: null, animationId: null, resizeHandler: null, startTime: null };
}

/* ---------------------------
   Cloud overlay: typed + fixes
   --------------------------- */

interface Puff {
  x: number;
  y: number;
  radius: number;
}

interface Cloud {
  x: number;
  y: number;
  size: number;
  opacity: number;
  baseColor: BaseColor;
  speed: number;
  speedFactor: number;
  drift: number;
  rotation: number;
  rotationSpeed: number;
  growthRate: number;
  puffs: Puff[];
}

let cloudOverlay: {
  canvas: Nullable<HTMLCanvasElement>;
  ctx: Nullable<CanvasRenderingContext2D>;
  animationId: Nullable<number>;
  resizeHandler: Nullable<ResizeHandler>;
  scrollHandler: Nullable<(this: Window, ev: Event) => any>;
} = {
  canvas: null,
  ctx: null,
  animationId: null,
  resizeHandler: null,
  scrollHandler: null,
};

export function removeCloudOverlay(): void {
  if (!cloudOverlay.canvas || !cloudOverlay.ctx) return;

  if (cloudOverlay.animationId !== null) {
    cancelAnimationFrame(cloudOverlay.animationId);
  }
  if (cloudOverlay.resizeHandler) {
    window.removeEventListener("resize", cloudOverlay.resizeHandler);
  }
  if (cloudOverlay.scrollHandler) {
    window.removeEventListener("scroll", cloudOverlay.scrollHandler);
  }

  cloudOverlay.ctx.clearRect(0, 0, cloudOverlay.canvas.width, cloudOverlay.canvas.height);

  cloudOverlay = { canvas: null, ctx: null, animationId: null, resizeHandler: null, scrollHandler: null };
}

export function initCloudOverlay(): void {
  const scale = getScaleFactor();

  const CONFIG = {
    MAX_CLOUDS: Math.floor(22 * scale * scale),
    WIND_SPEED: 1.1 * scale,
    WIND_DIRECTION_CHANGE_PROB: 1,
    WIND_DIRECTION_CHANGE_DEGREES: 2,
    ROTATION_FACTOR: 0.002 * scale,
    ROTATION_VARIANCE: 0.3,
    BASE_CLOUD_SIZE: 60 * scale,
    SIZE_VARIANCE: 20 * scale,
    CLOUD_COLOR: "#f0f0f0",
    BASE_OPACITY: 0.4,
    OPACITY_VARIANCE: 0.4,
    PARALLAX_MIN_DELTA: 0.0005,
    PARALLAX_SPEED: 0.0005 * scale,
    GRADIENT_STRETCH_FACTOR: 10000,
  };

  const canvasEl = document.getElementById("clouds") as HTMLCanvasElement | null;
  if (!canvasEl) return;
  const ctxEl = canvasEl.getContext("2d");
  if (!ctxEl) return;

  // local non-null references for closures
  const canvas = canvasEl;
  const ctx = ctxEl;

  cloudOverlay.canvas = canvas;
  cloudOverlay.ctx = ctx;

  const clouds: Cloud[] = [];
  let windDirection = Math.random() * Math.PI * 2;

  let lastScrollY = window.scrollY;
  let scrollY = window.scrollY;

  const scrollListener = () => {
    scrollY = window.scrollY;
  };
  window.addEventListener("scroll", scrollListener, { passive: true });
  cloudOverlay.scrollHandler = scrollListener;

  function createCloud(spawnOutside = false): Cloud {
    const size = CONFIG.BASE_CLOUD_SIZE + (Math.random() - 0.5) * 2 * CONFIG.SIZE_VARIANCE;
    const opacity = Math.max(0, CONFIG.BASE_OPACITY + (Math.random() - 0.5) * 2 * CONFIG.OPACITY_VARIANCE);

    let x: number, y: number;
    if (spawnOutside) {
      const edge = Math.floor(Math.random() * 4);
      switch (edge) {
        case 0:
          x = Math.random() * canvas.width;
          y = -size * 2;
          break;
        case 1:
          x = canvas.width + size * 2;
          y = Math.random() * canvas.height;
          break;
        case 2:
          x = Math.random() * canvas.width;
          y = canvas.height + size * 2;
          break;
        default:
          x = -size * 2;
          y = Math.random() * canvas.height;
          break;
      }
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() * canvas.height;
    }

    const puffCount = 5 + Math.floor(Math.random() * 6);
    const puffs: Puff[] = [];
    for (let i = 0; i < puffCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = (Math.random() * 0.6 + 0.2) * size;
      const radius = size * (0.3 + Math.random() * 0.5);
      puffs.push({ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, radius });
    }

    return {
      x,
      y,
      size,
      opacity,
      baseColor: { r: 240, g: 240, b: 240, a: 0.4 },
      speed: 0.3 + Math.random() * 0.5,
      speedFactor: 0.8 + Math.random() * 0.4,
      drift: (Math.random() - 0.5) * 0.1,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed:
        (Math.random() - 0.5) *
        CONFIG.ROTATION_FACTOR *
        (1 - CONFIG.ROTATION_VARIANCE + Math.random() * CONFIG.ROTATION_VARIANCE * 2),
      growthRate: 0.02 + Math.random() * 0.03,
      puffs,
    };
  }

  function drawCloud(cloud: Cloud): void {
    ctx.save();
    ctx.globalAlpha = cloud.opacity;
    ctx.fillStyle = getCloudColor(cloud.baseColor);

    ctx.translate(cloud.x, cloud.y);
    ctx.rotate(cloud.rotation);

    ctx.beginPath();
    cloud.puffs.forEach((p) => {
      ctx.moveTo(p.x + p.radius, p.y);
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    });
    ctx.fill();

    ctx.restore();
  }

  function fluctuateWindDirection(): void {
    if (Math.random() < CONFIG.WIND_DIRECTION_CHANGE_PROB) {
      const maxChange = (CONFIG.WIND_DIRECTION_CHANGE_DEGREES * Math.PI) / 180;
      windDirection += (Math.random() - 0.5) * 2 * maxChange;
    }
  }

  function updateWindFromScroll(): void {
    const scrollDelta = scrollY - lastScrollY;
    if (scrollDelta !== 0) {
      const targetDirection = scrollDelta > 0 ? Math.PI / 2 : -Math.PI / 2;
      // shortest difference
      const diff = ((targetDirection - windDirection + Math.PI * 3) % (Math.PI * 2)) - Math.PI;

      const inertiaFactor = CONFIG.PARALLAX_MIN_DELTA + Math.min(Math.abs(scrollDelta) * CONFIG.PARALLAX_SPEED, 0.05);
      windDirection += diff * inertiaFactor;
    }
    lastScrollY = scrollY;
  }

  const cloudSegments: DaySegment[] = [
    { color: "rgba(50, 90, 180, 1)", weight: 6 },
    { color: "rgba(255, 216, 180, 1)", weight: 3 },
    { color: "rgba(233, 243, 255, 1)", weight: 3 },
    { color: "rgba(255, 255, 255, 1)", weight: 3 },
    { color: "rgba(233, 243, 255, 1)", weight: 3 },
    { color: "rgba(255, 216, 180, 1)", weight: 3 },
    { color: "rgba(50, 90, 180, 1)", weight: 3 },
  ];

  function getCloudOverlayColor(): string {
    const t = getTimeFactor();
    const totalWeight = cloudSegments.reduce((sum, seg) => sum + seg.weight, 0);
    let cumulative = 0;

    for (let i = 0; i < cloudSegments.length; i++) {
      const seg = cloudSegments[i];
      const start = cumulative / totalWeight;
      cumulative += seg.weight;
      const end = cumulative / totalWeight;

      if (t >= start && t <= end) {
        const nextSeg = cloudSegments[(i + 1) % cloudSegments.length];

        const matchA = seg.color.match(/\d+/g);
        const matchB = nextSeg.color.match(/\d+/g);
        if (!matchA || !matchB) return seg.color;

        const colorA = matchA.map(Number);
        const colorB = matchB.map(Number);

        const localT = (t - start) / (end - start);
        const r = Math.floor(colorA[0] + (colorB[0] - colorA[0]) * localT);
        const g = Math.floor(colorA[1] + (colorB[1] - colorA[1]) * localT);
        const b = Math.floor(colorA[2] + (colorB[2] - colorA[2]) * localT);

        return `rgb(${r},${g},${b})`;
      }
    }
    return cloudSegments[0].color;
  }

  function animate(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fluctuateWindDirection();
    updateWindFromScroll();

    for (let i = clouds.length - 1; i >= 0; i--) {
      const cloud = clouds[i];
      const parallaxY = (scrollY / window.innerHeight) * 0.5;

      const cloudSpeed = cloud.speed * cloud.speedFactor;
      cloud.x += Math.cos(windDirection) * cloudSpeed * CONFIG.WIND_SPEED;
      cloud.y += Math.sin(windDirection) * cloudSpeed * CONFIG.WIND_SPEED + cloud.drift + parallaxY;
      cloud.rotation += cloud.rotationSpeed;

      // grow cloud
      cloud.size += cloud.growthRate;
      cloud.puffs.forEach((p) => {
        p.x *= 1 + cloud.growthRate / cloud.size;
        p.y *= 1 + cloud.growthRate / cloud.size;
        p.radius *= 1 + cloud.growthRate / cloud.size;
      });

      const margin = cloud.size * 3;
      if (cloud.x < -margin || cloud.x > canvas.width + margin || cloud.y < -margin || cloud.y > canvas.height + margin) {
        clouds.splice(i, 1);
        clouds.push(createCloud(true));
        continue;
      }

      drawCloud(cloud);
    }

    cloudOverlay.animationId = requestAnimationFrame(animate);
  }

  function handleResize(): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initClouds(): void {
    clouds.length = 0;
    for (let i = 0; i < CONFIG.MAX_CLOUDS; i++) clouds.push(createCloud(false));
  }

  handleResize();
  initClouds();
  window.addEventListener("resize", handleResize);
  cloudOverlay.resizeHandler = handleResize;

  animate();
}
