import { getScaleFactor } from "../utility/view.js";

let spaceOverlay = {
    canvas: null,
    ctx: null,
    animationId: null,
    resizeHandler: null,
    scrollHandler: null
};

export function removeSpaceOverlay() {
    if (!spaceOverlay.canvas) return;

    cancelAnimationFrame(spaceOverlay.animationId);
    window.removeEventListener("resize", spaceOverlay.resizeHandler);
    window.removeEventListener("scroll", spaceOverlay.scrollHandler);

    spaceOverlay.ctx.clearRect(0, 0, spaceOverlay.canvas.width, spaceOverlay.canvas.height);
    spaceOverlay = { canvas: null, ctx: null, animationId: null, resizeHandler: null, scrollHandler: null };
}

export function initSpaceOverlay() {
    const scale = getScaleFactor();

    const CONFIG = {
        // Stars
        MAX_STARS: Math.floor(200 * scale * scale), // quadratic scaling for density
        STAR_COLORS: ["#ffffff", "#ffe9c4", "#c4e1ff", "#ffb6c1"],
        STAR_BRIGHTNESS: 0.9,
        STAR_ROAMING: 0.15 * scale,
        STAR_FADE_SPEED: 0.012,
        STAR_3D_DEPTH_MIN: 0.005,
        STAR_3D_DEPTH_MAX: 0.7,

        // Nebulas
        NUM_NEBULAS: Math.max(3, Math.floor(scale)),
        NUM_BLOBS: Math.max(3, Math.floor(scale)),
        NEBULA_SPREAD_X: 800 * scale,
        NEBULA_SPREAD_Y: 1000 * scale,
        NEBULA_BASE_RADIUS: 400 * scale,
        NEBULA_RADIUS_VARIANCE: 120 * scale,

        // Meteors
        MAX_METEORS: Math.floor(30 * scale),
        METEOR_CHANCE_IDLE: 0.012,
        METEOR_CHANCE_SCROLL: 0.1,
        METEOR_BRIGHTNESS: 1.0,
        METEOR_MIN_LENGTH: 50 * scale,
        METEOR_MAX_LENGTH: 130 * scale,
        METEOR_MIN_SPEED: 4 * scale,
        METEOR_MAX_SPEED: 10 * scale,

        // Warp & Parallax
        MAX_WARP: 200 * scale,
        SCROLL_MIN_DELTA: 30,
        WARP_LERP_SPEED: 0.11,
        PARALLAX_STRENGTH: 0.5 / scale
    };

    const canvas = document.getElementById("space");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const stars = [];
    const meteors = [];
    const nebulas = [];

    let warpFactor = 0;
    let lastScrollY = window.scrollY;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Scroll warp + parallax
    window.addEventListener("scroll", () => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY;

        let targetWarp = 0;
        if (Math.abs(delta) > CONFIG.SCROLL_MIN_DELTA) {
            targetWarp = Math.min(Math.abs(delta - CONFIG.SCROLL_MIN_DELTA) * 0.01, CONFIG.MAX_WARP);
        }
        warpFactor += (targetWarp - warpFactor) * CONFIG.WARP_LERP_SPEED;

        stars.forEach(star => {
            star.y -= delta * star.parallax * CONFIG.PARALLAX_STRENGTH;
            if (star.y < 0) star.y += canvas.height;
            if (star.y > canvas.height) star.y -= canvas.height;
        });
        meteors.forEach(meteor => {
            meteor.y -= delta * meteor.parallax * CONFIG.PARALLAX_STRENGTH;
            if (meteor.y < 0) meteor.y += canvas.height;
            if (meteor.y > canvas.height) meteor.y -= canvas.height;
        });

        lastScrollY = currentY;
    }, { passive: true });

    // Nebulas
    for (let i = 0; i < CONFIG.NUM_NEBULAS; i++) {
        const nebula = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            blobs: []
        };

        for (let j = 0; j < CONFIG.NUM_BLOBS; j++) {
            nebula.blobs.push({
                x: nebula.x + (Math.random() - 0.5) * CONFIG.NEBULA_SPREAD_X,
                y: nebula.y + (Math.random() - 0.5) * CONFIG.NEBULA_SPREAD_Y,
                radius: CONFIG.NEBULA_BASE_RADIUS + Math.random() * CONFIG.NEBULA_RADIUS_VARIANCE,
                color: `rgba(${50 + Math.random() * 150}, ${Math.random() * 50}, ${100 + Math.random() * 155}, ${0.2 + Math.random() * 0.2})`
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
            parallax: CONFIG.STAR_3D_DEPTH_MIN + Math.random() * (CONFIG.STAR_3D_DEPTH_MAX - CONFIG.STAR_3D_DEPTH_MIN)
        });
    }

    function spawnMeteor() {
        if (meteors.length >= CONFIG.MAX_METEORS) return;
        if (Math.random() < CONFIG.METEOR_CHANCE_IDLE || warpFactor > CONFIG.METEOR_CHANCE_SCROLL) {
            meteors.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: CONFIG.METEOR_MIN_LENGTH + Math.random() * (CONFIG.METEOR_MAX_LENGTH - CONFIG.METEOR_MIN_LENGTH),
                speed: CONFIG.METEOR_MIN_SPEED + Math.random() * (CONFIG.METEOR_MAX_SPEED - CONFIG.METEOR_MIN_SPEED),
                opacity: CONFIG.METEOR_BRIGHTNESS,
                parallax: CONFIG.STAR_3D_DEPTH_MIN + Math.random() * (CONFIG.STAR_3D_DEPTH_MAX - CONFIG.STAR_3D_DEPTH_MIN)
            });
        }
    }

    function drawStars() {
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

    function drawMeteors() {
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

    function drawNebula() {
        nebulas.forEach(nebula => {
            nebula.blobs.forEach(b => {
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
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);       
        drawStars();
        drawNebula();
        spawnMeteor();
        drawMeteors();
        requestAnimationFrame(animate);
    }

    animate();
}