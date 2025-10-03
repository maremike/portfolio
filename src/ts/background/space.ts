import { getScaleFactor } from "../utility/view";

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

type Nullable<T> = T | null;

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

  const canvas = document.getElementById("space") as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  spaceOverlay.canvas = canvas;
  spaceOverlay.ctx = ctx;

  const stars: Star[] = [];
  const meteors: Meteor[] = [];
  const nebulas: Nebula[] = [];

  let warpFactor = 0;
  let lastScrollY = window.scrollY;

  const resizeCanvas: ResizeHandler = () => {
    spaceOverlay.canvas!.width = window.innerWidth;
    spaceOverlay.canvas!.height = window.innerHeight;
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
      if (star.y < 0) star.y += spaceOverlay.canvas!.height;
      if (star.y > spaceOverlay.canvas!.height) star.y -= spaceOverlay.canvas!.height;
    });
    meteors.forEach((meteor) => {
      meteor.y -= delta * meteor.parallax * CONFIG.PARALLAX_STRENGTH;
      if (meteor.y < 0) meteor.y += spaceOverlay.canvas!.height;
      if (meteor.y > spaceOverlay.canvas!.height) meteor.y -= spaceOverlay.canvas!.height;
    });

    lastScrollY = currentY;
  };
  window.addEventListener("scroll", scrollHandler, { passive: true });
  spaceOverlay.scrollHandler = scrollHandler;

  for (let i = 0; i < CONFIG.NUM_NEBULAS; i++) {
    const nebula: Nebula = {
      x: Math.random() * spaceOverlay.canvas!.width,
      y: Math.random() * spaceOverlay.canvas!.height,
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

  for (let i = 0; i < CONFIG.MAX_STARS; i++) {
    stars.push({
      x: Math.random() * spaceOverlay.canvas!.width,
      y: Math.random() * spaceOverlay.canvas!.height,
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
        x: Math.random() * spaceOverlay.canvas!.width,
        y: Math.random() * spaceOverlay.canvas!.height,
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
        star.x = Math.random() * spaceOverlay.canvas!.width;
        star.y = Math.random() * spaceOverlay.canvas!.height;
        star.alpha = 0;
        star.alphaDir = Math.random() * CONFIG.STAR_FADE_SPEED;
        star.dx = (Math.random() - 0.5) * CONFIG.STAR_ROAMING;
        star.dy = (Math.random() - 0.5) * CONFIG.STAR_ROAMING;
        star.color = CONFIG.STAR_COLORS[Math.floor(Math.random() * CONFIG.STAR_COLORS.length)];
        star.parallax = CONFIG.STAR_3D_DEPTH_MIN + Math.random() * (CONFIG.STAR_3D_DEPTH_MAX - CONFIG.STAR_3D_DEPTH_MIN);
      }

      spaceOverlay.ctx!.globalAlpha = star.alpha;
      const stretch = warpFactor * 130 * star.parallax;
      spaceOverlay.ctx!.fillStyle = star.color;
      spaceOverlay.ctx!.beginPath();
      spaceOverlay.ctx!.ellipse(star.x, star.y, star.radius, star.radius + stretch, 0, 0, Math.PI * 2);
      spaceOverlay.ctx!.fill();

      star.x += star.dx;
      star.y += star.dy;

      if (star.x < 0) star.x = spaceOverlay.canvas!.width;
      if (star.x > spaceOverlay.canvas!.width) star.x = 0;
      if (star.y < 0) star.y = spaceOverlay.canvas!.height;
      if (star.y > spaceOverlay.canvas!.height) star.y = 0;
    }

    spaceOverlay.ctx!.globalAlpha = 1;
    warpFactor *= 0.1;
  }

  function drawMeteors(): void {
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      spaceOverlay.ctx!.strokeStyle = `rgba(173,216,230,${m.opacity})`;
      spaceOverlay.ctx!.lineWidth = 2;
      spaceOverlay.ctx!.beginPath();
      spaceOverlay.ctx!.moveTo(m.x, m.y);
      spaceOverlay.ctx!.lineTo(m.x - m.length, m.y - m.length * 0.3);
      spaceOverlay.ctx!.stroke();

      m.x += m.speed;
      m.y += m.speed * 0.3;
      m.opacity -= 0.01;

      if (m.opacity <= 0) meteors.splice(i, 1);
    }
  }

  function drawNebula(): void {
    nebulas.forEach((nebula) => {
      nebula.blobs.forEach((b) => {
        const gradient = spaceOverlay.ctx!.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        gradient.addColorStop(0, b.color);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        spaceOverlay.ctx!.fillStyle = gradient;
        spaceOverlay.ctx!.beginPath();
        spaceOverlay.ctx!.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        spaceOverlay.ctx!.fill();
      });
    });
  }

  function animate(): void {
    spaceOverlay.ctx!.clearRect(0, 0, spaceOverlay.canvas!.width, spaceOverlay.canvas!.height);
    drawStars();
    drawNebula();
    spawnMeteor();
    drawMeteors();
    spaceOverlay.animationId = requestAnimationFrame(animate);
  }

  animate();
}