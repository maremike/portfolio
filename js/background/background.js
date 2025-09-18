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
