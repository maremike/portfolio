import { getScaleFactor } from "../utility/view.js";
import { getTimeFactor } from "../utility/time.js";

// Factor to stretch the gradient beyond canvas width
const GRADIENT_STRETCH_FACTOR = 1000; 

// Rotation in degrees (0 = horizontal left→right)
const GRADIENT_ROTATION = 0;

// Define colors and weights (how much of the gradient each color occupies)
const daySegments = [
    { color: 'rgba(37, 70, 161, 0.7)', weight: 6 },     // night
    { color: 'rgba(255, 162, 100, 0.7)', weight: 3 },    // sunrise
    { color: 'rgba(135, 206, 250, 0.7)', weight: 3 },  // morning
    { color: 'rgba(178, 235, 243, 0.7)', weight: 3 },  // noon
    { color: 'rgba(135, 206, 250, 0.7)', weight: 3 },  // afternoon
    { color: 'rgba(255, 162, 100, 0.7)', weight: 3 },    // sunset
    { color: 'rgba(37, 70, 161, 0.7)', weight: 3 }      // night
];

let skyOverlay = {
    canvas: null,
    ctx: null,
    animationId: null,
    resizeHandler: null,
    startTime: null
};

let cloudOverlay = {
    canvas: null,
    ctx: null,
    animationId: null,
    resizeHandler: null,
    scrollHandler: null
};

function getSkyGradient(ctx, width, height) {
    const t = getTimeFactor(); // 0..1 over the day

    // Gradient vector
    const angleRad = (GRADIENT_ROTATION * Math.PI) / 180;
    const dx = Math.cos(angleRad);
    const dy = Math.sin(angleRad);

    const length = Math.max(width, height) * GRADIENT_STRETCH_FACTOR;

    const x0 = 0;
    const y0 = 0;
    const x1 = dx * length;
    const y1 = dy * length;

    const gradient = ctx.createLinearGradient(x0, y0, x1, y1);

    // Calculate cumulative stops with weights
    const totalWeight = daySegments.reduce((sum, seg) => sum + seg.weight, 0);
    let cumulative = 0;

    daySegments.forEach(seg => {
        // Shift stops based on time t
        let stop = cumulative / totalWeight - t;
        stop = Math.min(Math.max(stop, 0), 1); // clamp 0..1
        gradient.addColorStop(stop, seg.color);
        cumulative += seg.weight;
    });

    return gradient;
}


function getCloudColor(baseColor) {
    const t = getTimeFactor();
    const r = Math.floor(baseColor.r + 50 * Math.sin(t * 2 * Math.PI));
    const g = Math.floor(baseColor.g + 50 * Math.sin(t * 2 * Math.PI + 1));
    const b = Math.floor(baseColor.b + 50 * Math.sin(t * 2 * Math.PI + 2));
    return `rgba(${r}, ${g}, ${b}, ${baseColor.a})`;
}

export function initSkyBackground() {
    const canvas = document.getElementById("light");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function animateSky() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gradient = getSkyGradient(ctx, canvas.width, canvas.height);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        requestAnimationFrame(animateSky);
    }

    animateSky();
}

export function removeSkyBackground() {
    if (!skyOverlay.canvas) return;

    cancelAnimationFrame(skyOverlay.animationId);
    window.removeEventListener("resize", skyOverlay.resizeHandler);

    skyOverlay.ctx.clearRect(0, 0, skyOverlay.canvas.width, skyOverlay.canvas.height);

    skyOverlay = { canvas: null, ctx: null, animationId: null, resizeHandler: null };
}

export function removeCloudOverlay() {
    if (!cloudOverlay.canvas) return;

    cancelAnimationFrame(cloudOverlay.animationId);
    window.removeEventListener("resize", cloudOverlay.resizeHandler);
    window.removeEventListener("scroll", cloudOverlay.scrollHandler);

    cloudOverlay.ctx.clearRect(0, 0, cloudOverlay.canvas.width, cloudOverlay.canvas.height);
    cloudOverlay = { canvas: null, ctx: null, animationId: null, resizeHandler: null, scrollHandler: null };
}

export function initCloudOverlay() {
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

        GRADIENT_STRETCH_FACTOR: 10000
    };

    const canvas = document.getElementById('clouds');
    const ctx = canvas.getContext('2d');

    const clouds = [];
    let windDirection = Math.random() * Math.PI * 2;

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
            baseColor: { r: 240, g: 240, b: 240, a: 0.4 },
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
        { color: 'rgba(50, 90, 180, 1)', weight: 6 },
        { color: 'rgba(255, 216, 180, 1)', weight: 3 },
        { color: 'rgba(217, 234, 255, 1)', weight: 3 },
        { color: 'rgba(255, 255, 255, 1)', weight: 3 },
        { color: 'rgba(217, 234, 255, 1)', weight: 3 },
        { color: 'rgba(255, 216, 180, 1)', weight: 3 },
        { color: 'rgba(50, 90, 180, 1)', weight: 3 }
    ];

    function getCloudColor() {
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
                const localT = (t - start) / (end - start);

                const colorA = seg.color.match(/\d+/g).map(Number);
                const colorB = nextSeg.color.match(/\d+/g).map(Number);

                const r = Math.floor(colorA[0] + (colorB[0] - colorA[0]) * localT);
                const g = Math.floor(colorA[1] + (colorB[1] - colorA[1]) * localT);
                const b = Math.floor(colorA[2] + (colorB[2] - colorA[2]) * localT);

                return `rgb(${r},${g},${b})`;
            }
        }
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