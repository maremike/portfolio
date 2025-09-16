export function initGalaxy() {
    const canvas = document.getElementById("starfield");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let stars = [];
    const numStars = 200;
    const meteors = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Create stars
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.2,
            speed: Math.random() * 0.05 + 0.02
        });
    }

    function spawnMeteor() {
        if (Math.random() < 0.02) { // 2% chance each frame
            meteors.push({
                x: Math.random() * canvas.width,
                y: -20,
                length: Math.random() * 80 + 50,
                speed: Math.random() * 6 + 4,
                opacity: 1
            });
        }
    }

    function drawStars() {
        ctx.fillStyle = "white";
        stars.forEach(star => {
            ctx.globalAlpha = 0.8 + Math.sin(Date.now() * 0.002 + star.x) * 0.2;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
            star.y += star.speed;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
        });
        ctx.globalAlpha = 1;
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

            if (m.opacity <= 0) {
                meteors.splice(i, 1);
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawStars();
        spawnMeteor();
        drawMeteors();
        requestAnimationFrame(animate);
    }

    animate();
}