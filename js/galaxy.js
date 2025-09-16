export function initGalaxy() {
    const canvas = document.getElementById("starfield");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const stars = [];
    const numStars = 250;
    const meteors = [];
    let warpFactor = 0;
    let lastScrollY = window.scrollY;
    const maxWarp = 10;
    const minDelta = 20;
    const warpLerpSpeed = 0.05;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Scroll warp
    window.addEventListener("scroll", () => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY;

        let targetWarp = 0;
        if (Math.abs(delta) > minDelta) {
            targetWarp = Math.min(Math.abs(delta - minDelta) * 0.01, maxWarp);
        }
        warpFactor += (targetWarp - warpFactor) * warpLerpSpeed;
        lastScrollY = currentY;
    });

    const starColors = ["#ffffff", "#ffe9c4", "#c4e1ff", "#ffb6c1"];

    const nebula = [];
    for (let i = 0; i < 5; i++) {
        nebula.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 100 + Math.random() * 800,
            color: `rgba(${50 + Math.random() * 100}, ${0 + Math.random() * 50}, ${50 + Math.random() * 200}, 0.05)`
        });
    }

    // Initialize stars
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5,
            color: starColors[Math.floor(Math.random() * starColors.length)],
            alpha: Math.random(),
            alphaDir: Math.random() < 0.5 ? 0.01 : -0.01, // fade in/out
            dx: (Math.random() - 0.5) * 0.3, // small horizontal movement
            dy: (Math.random() - 0.5) * 0.3  // small vertical movement
        });
    }

    function spawnMeteor() {
        if (Math.random() < 0.02 || warpFactor > 0.5) {
            meteors.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 80 + 50,
                speed: Math.random() * 6 + 4,
                opacity: 1
            });
        }
    }

    function drawStars() {
        for (let i = stars.length - 1; i >= 0; i--) {
            const star = stars[i];

            // Update alpha (fade in/out)
            star.alpha += star.alphaDir;
            if (star.alpha >= 1) star.alphaDir = -Math.random() * 0.02;
            if (star.alpha <= 0) {
                // Respawn star
                star.x = Math.random() * canvas.width;
                star.y = Math.random() * canvas.height;
                star.alpha = 0;
                star.alphaDir = Math.random() * 0.02;
                star.dx = (Math.random() - 0.5) * 0.2;
                star.dy = (Math.random() - 0.5) * 0.2;
                star.color = starColors[Math.floor(Math.random() * starColors.length)];
            }

            ctx.globalAlpha = star.alpha;

            // Warp effect stretch based on scroll
            const stretch = warpFactor * 130;
            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.ellipse(star.x, star.y, star.radius, star.radius + stretch, 0, 0, Math.PI * 2);
            ctx.fill();

            // Move in small circular/random direction
            star.x += star.dx;
            star.y += star.dy;

            // Keep stars inside canvas
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
        nebula.forEach(n => {
            const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
            gradient.addColorStop(0, n.color);
            gradient.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
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
