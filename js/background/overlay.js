export function initSpace() {
    const canvas = document.getElementById("space");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const stars = [];
    const numStars = 250;
    const meteors = [];
    let warpFactor = 0;
    let lastScrollY = window.scrollY;
    const maxWarp = 10;
    const minDelta = 10;
    const warpLerpSpeed = 0.1;

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
        if (Math.abs(delta) > minDelta) {
            targetWarp = Math.min(Math.abs(delta - minDelta) * 0.01, maxWarp);
        }
        warpFactor += (targetWarp - warpFactor) * warpLerpSpeed;

        // Parallax (opposite of scroll)
        const parallaxStrength = 0.5; // smaller = slower movement
        stars.forEach(star => {
            star.y -= delta * star.parallax * parallaxStrength; 
            // wrap around so stars don’t vanish
            if (star.y < 0) star.y += canvas.height;
            if (star.y > canvas.height) star.y -= canvas.height;
        });
        meteors.forEach(meteor => {
            meteor.y -= delta * meteor.parallax * parallaxStrength;
            if (meteor.y < 0) meteor.y += canvas.height;
            if (meteor.y > canvas.height) meteor.y -= canvas.height;
        });

        lastScrollY = currentY;
    }, { passive: true });

    const starColors = ["#ffffff", "#ffe9c4", "#c4e1ff", "#ffb6c1"];

    const nebulas = [];
    for (let i = 0; i < 3; i++) {
        const nebula = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            blobs: []
        };

        const numBlobs = 3;
        for (let j = 0; j < numBlobs; j++) {
            nebula.blobs.push({
                x: nebula.x + (Math.random() - 0.5) * 600, // spread
                y: nebula.y + (Math.random() - 0.5) * 700,
                radius: 100 + Math.random() * 675,
                color: `rgba(${50 + Math.random() * 150}, ${0 + Math.random() * 50}, ${100 + Math.random() * 155}, ${0.2 + Math.random() * 0.002})`
            });
        }
        nebulas.push(nebula);
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
            dx: (Math.random() - 0.5) * 0.3, // small drift
            dy: (Math.random() - 0.5) * 0.3,
            parallax: 0.2 + Math.random() * 1.3 // depth factor (0.2 = far, 1.5 = close)
        });
    }

    function spawnMeteor() {
        if (Math.random() < 0.03 || warpFactor > 0.1) {
            meteors.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 80 + 50,
                speed: Math.random() * 6 + 4,
                opacity: 1,
                parallax: 0.2 + Math.random() * 1.3 // depth effect (0.5–1.0)
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
                star.parallax = 0.2 + Math.random() * 1.3;
            }

            ctx.globalAlpha = star.alpha;

            // Warp effect stretch based on scroll
            const stretch = warpFactor * 130 * star.parallax; // closer stars stretch more
            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.ellipse(star.x, star.y, star.radius, star.radius + stretch, 0, 0, Math.PI * 2);
            ctx.fill();

            // Random drift
            star.x += star.dx;
            star.y += star.dy;

            // Wrap around
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

export function initSky() {
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        requestAnimationFrame(animate);
    }

    animate();
}