import { getScaleFactor } from "../utility/view.js";
import { getTimeFactor } from "../utility/time.js";

export function initSpaceOverlay() {
    const scale = getScaleFactor();

    const CONFIG = {
        // Stars
        NUM_STARS: Math.floor(1000 * scale * scale), // quadratic scaling for density
        STAR_COLORS: ["#ffffff", "#ffe9c4", "#c4e1ff", "#ffb6c1"],
        STAR_BRIGHTNESS: 1.0,
        STAR_ROAMING: 0.15 * scale,
        STAR_FADE_SPEED: 0.02,
        STAR_3D_DEPTH_MIN: 0.005,
        STAR_3D_DEPTH_MAX: 0.5,

        // Nebulas
        NUM_NEBULAS: Math.max(2, Math.floor(2 * scale)),
        NUM_BLOBS: Math.max(3, Math.floor(2 * scale)),
        NEBULA_SPREAD_X: 1000 * scale,
        NEBULA_SPREAD_Y: 1200 * scale,
        NEBULA_BASE_RADIUS: 800 * scale,
        NEBULA_RADIUS_VARIANCE: 100 * scale,

        // Meteors
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
        WARP_LERP_SPEED: 0.14,
        PARALLAX_STRENGTH: 0.5 / scale // larger screens = faster parallax
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

        // Warp stretch
        let targetWarp = 0;
        if (Math.abs(delta) > CONFIG.SCROLL_MIN_DELTA) {
            targetWarp = Math.min(Math.abs(delta - CONFIG.SCROLL_MIN_DELTA) * 0.01, CONFIG.MAX_WARP);
        }
        warpFactor += (targetWarp - warpFactor) * CONFIG.WARP_LERP_SPEED;

        // Parallax
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
    for (let i = 0; i < CONFIG.NUM_STARS; i++) {
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

            // Update alpha
            star.alpha += star.alphaDir;
            if (star.alpha >= CONFIG.STAR_BRIGHTNESS) star.alphaDir = -Math.random() * CONFIG.STAR_FADE_SPEED;
            if (star.alpha <= 0) {
                // Respawn
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

            // Warp stretch
            const stretch = warpFactor * 130 * star.parallax;
            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.ellipse(star.x, star.y, star.radius, star.radius + stretch, 0, 0, Math.PI * 2);
            ctx.fill();

            // Drift
            star.x += star.dx;
            star.y += star.dy;

            // Wrap
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

export function initCloudOverlay() {
    const scale = getScaleFactor();

    const CONFIG = {
        MAX_CLOUDS: Math.floor(180 * scale * scale), // more clouds on bigger screens

        // Wind
        WIND_SPEED: 2.3 * scale,
        WIND_DIRECTION_CHANGE_PROB: 0.01,
        WIND_DIRECTION_CHANGE_DEGREES: 2,

        // Rotation
        ROTATION_FACTOR: 0.004 * scale,
        ROTATION_VARIANCE: 0.5,

        // Clouds
        BASE_CLOUD_SIZE: 100 * scale,
        SIZE_VARIANCE: 60 * scale,
        CLOUD_COLOR: "#f0f0f0",
        BASE_OPACITY: 0.4,
        OPACITY_VARIANCE: 0.4,

        // Parallax
        PARALLAX_MIN_DELTA: 0.0003,
        PARALLAX_SPEED: 0.0003 * scale,

        // Gradient
        GRADIENT_STRETCH_FACTOR: 1000
    };

    const canvas = document.getElementById('clouds');
    const ctx = canvas.getContext('2d');

    const clouds = [];
    let windDirection = Math.random() * Math.PI * 2;

    // Track scroll for parallax
    let lastScrollY = window.scrollY;
    let scrollY = window.scrollY;

    window.addEventListener("scroll", () => {
        scrollY = window.scrollY;
    });

    function createCloud(spawnOutside = false) {
        const size = CONFIG.BASE_CLOUD_SIZE + (Math.random() - 0.5) * 2 * CONFIG.SIZE_VARIANCE;
        const opacity = Math.max(0, CONFIG.BASE_OPACITY + (Math.random() - 0.5) * 2 * CONFIG.OPACITY_VARIANCE);

        let x, y;
        if (spawnOutside) {
            const edge = Math.floor(Math.random() * 4);
            switch(edge) {
                case 0: x = Math.random() * canvas.width; y = -size * 2; break;
                case 1: x = canvas.width + size * 2; y = Math.random() * canvas.height; break;
                case 2: x = Math.random() * canvas.width; y = canvas.height + size * 2; break;
                case 3: x = -size * 2; y = Math.random() * canvas.height; break;
            }
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
        }

        const puffCount = 5 + Math.floor(Math.random() * 6);
        const puffs = [];
        for (let i = 0; i < puffCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = (Math.random() * 0.6 + 0.2) * size;
            const radius = size * (0.3 + Math.random() * 0.5);
            puffs.push({ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, radius });
        }

        return {
            x, y, size, opacity,
            baseColor: { r: 240, g: 240, b: 240, a: 0.4 }, // <-- add base color
            speed: 0.3 + Math.random() * 0.5,
            speedFactor: 0.8 + Math.random() * 0.4,
            drift: (Math.random() - 0.5) * 0.1,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * CONFIG.ROTATION_FACTOR *
                        (1 - CONFIG.ROTATION_VARIANCE + Math.random() * CONFIG.ROTATION_VARIANCE * 2),
            growthRate: 0.02 + Math.random() * 0.03,
            puffs
        };
    }

    function drawCloud(cloud) {
        ctx.save();
        ctx.globalAlpha = cloud.opacity;
        ctx.fillStyle = getCloudColor(cloud.baseColor);

        ctx.translate(cloud.x, cloud.y);
        ctx.rotate(cloud.rotation);

        ctx.beginPath();
        cloud.puffs.forEach(p => {
            ctx.moveTo(p.x + p.radius, p.y);
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        });
        ctx.fill();

        ctx.restore();
    }

    function fluctuateWindDirection() {
        if (Math.random() < CONFIG.WIND_DIRECTION_CHANGE_PROB) {
            const maxChange = CONFIG.WIND_DIRECTION_CHANGE_DEGREES * Math.PI / 180;
            windDirection += (Math.random() - 0.5) * 2 * maxChange;
        }
    }

    function updateWindFromScroll() {
        const scrollDelta = scrollY - lastScrollY;
        if (scrollDelta !== 0) {
            const targetDirection = scrollDelta > 0 ? Math.PI / 2 : -Math.PI / 2;
            const diff = ((targetDirection - windDirection + Math.PI * 3) % (Math.PI * 2)) - Math.PI;

            const inertiaFactor = CONFIG.PARALLAX_MIN_DELTA + Math.min(Math.abs(scrollDelta) * CONFIG.PARALLAX_SPEED, 0.05);
            windDirection += diff * inertiaFactor;
        }
        lastScrollY = scrollY;
    }

    const cloudSegments = [
        { color: 'rgba(50, 90, 180, 1)', weight: 6 },    // night
        { color: 'rgba(255, 216, 180, 1)', weight: 3 },  // sunrise
        { color: 'rgba(217, 234, 255, 1)', weight: 3 },  // morning
        { color: 'rgba(255, 255, 255, 1)', weight: 3 },   // noon
        { color: 'rgba(217, 234, 255, 1)', weight: 3 },  // afternoon
        { color: 'rgba(255, 216, 180, 1)', weight: 3 },  // sunset
        { color: 'rgba(50, 90, 180, 1)', weight: 3 }      // night
    ];

    function getCloudColor() {
        const t = getTimeFactor(); // 0..1 over the day
        const totalWeight = cloudSegments.reduce((sum, seg) => sum + seg.weight, 0);
        let cumulative = 0;

        // Determine which segment t falls into
        for (let i = 0; i < cloudSegments.length; i++) {
            const seg = cloudSegments[i];
            const start = cumulative / totalWeight;
            cumulative += seg.weight;
            const end = cumulative / totalWeight;

            if (t >= start && t <= end) {
                // Interpolate color between this segment and the next
                const nextSeg = cloudSegments[(i + 1) % cloudSegments.length];
                const localT = (t - start) / (end - start);

                const colorA = seg.color.match(/\d+/g).map(Number);
                const colorB = nextSeg.color.match(/\d+/g).map(Number);

                const r = Math.floor(colorA[0] + (colorB[0] - colorA[0]) * localT);
                const g = Math.floor(colorA[1] + (colorB[1] - colorA[1]) * localT);
                const b = Math.floor(colorA[2] + (colorB[2] - colorA[2]) * localT);

                return `rgb(${r},${g},${b})`;
            }
        }

        // Fallback in case t somehow falls outside
        return cloudSegments[0].color;
    }

    function animate() {
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
            cloud.puffs.forEach(p => {
                p.x *= 1 + cloud.growthRate / cloud.size;
                p.y *= 1 + cloud.growthRate / cloud.size;
                p.radius *= 1 + cloud.growthRate / cloud.size;
            });

            const margin = cloud.size * 3;
            if (cloud.x < -margin || cloud.x > canvas.width + margin ||
                cloud.y < -margin || cloud.y > canvas.height + margin) {
                clouds.splice(i, 1);
                clouds.push(createCloud(true));
                continue;
            }

            drawCloud(cloud);
        }

        requestAnimationFrame(animate);
    }

    function handleResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function initClouds() {
        clouds.length = 0;
        for (let i = 0; i < CONFIG.MAX_CLOUDS; i++) clouds.push(createCloud(false));
    }

    handleResize();
    initClouds();
    window.addEventListener('resize', handleResize);

    animate();
}