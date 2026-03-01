/* ============================================
   EduSpace – Premium Realistic Google-Style Space JS
   ============================================ */
(function () {
    'use strict';

    // ---- Interactive Starfield & Cosmic Dust ----
    const bgCanvas = document.getElementById('starfield');
    const bgCtx = bgCanvas.getContext('2d');
    const fgCanvas = document.getElementById('cosmic-dust');
    const fgCtx = fgCanvas.getContext('2d');

    let stars = [];
    let dust = [];
    // More realistic star count, extremely tiny
    const STAR_COUNT = 400;
    // Very subtle floating dust/atmosphere
    const DUST_COUNT = 40;

    function resize() {
        bgCanvas.width = fgCanvas.width = window.innerWidth;
        bgCanvas.height = fgCanvas.height = window.innerHeight;
    }

    function createParticles() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * bgCanvas.width,
                y: Math.random() * bgCanvas.height,
                r: Math.random() * 0.8 + 0.1, // Very tiny, realistic pinpoint stars
                alpha: Math.random() * 0.8 + 0.1,
                // Very slow twinkle
                dAlpha: (Math.random() * 0.003 + 0.0005) * (Math.random() < 0.5 ? 1 : -1)
            });
        }

        dust = [];
        for (let i = 0; i < DUST_COUNT; i++) {
            dust.push({
                x: Math.random() * fgCanvas.width,
                y: Math.random() * fgCanvas.height,
                r: Math.random() * 1.5 + 0.5,
                dx: (Math.random() - 0.5) * 0.15, // Extremely slow drift
                dy: (Math.random() - 0.5) * 0.15,
                hue: 220, // Clean cinematic blue/white hue for ambient depth
                alpha: Math.random() * 0.15 + 0.05, // Almost transparent
                dAlpha: (Math.random() * 0.001 + 0.0005) * (Math.random() < 0.5 ? 1 : -1)
            });
        }
    }

    function drawParticles() {
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        for (const s of stars) {
            s.alpha += s.dAlpha;
            if (s.alpha <= 0.05 || s.alpha >= 0.9) s.dAlpha *= -1;

            // Slightly pure white-blue tint
            bgCtx.fillStyle = `rgba(230, 240, 255, ${s.alpha.toFixed(2)})`;
            bgCtx.fillRect(s.x, s.y, s.r, s.r); // Rect is sharper/cleaner for tiny pinpoint stars
        }

        fgCtx.clearRect(0, 0, fgCanvas.width, fgCanvas.height);
        for (const d of dust) {
            d.x += d.dx; d.y += d.dy;
            if (d.x < 0) d.x += fgCanvas.width;
            if (d.x > fgCanvas.width) d.x -= fgCanvas.width;
            if (d.y < 0) d.y += fgCanvas.height;
            if (d.y > fgCanvas.height) d.y -= fgCanvas.height;

            d.alpha += d.dAlpha;
            if (d.alpha <= 0.01 || d.alpha >= 0.25) d.dAlpha *= -1;

            const gradient = fgCtx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 3);
            gradient.addColorStop(0, `hsla(${d.hue}, 40%, 80%, ${d.alpha})`);
            gradient.addColorStop(1, `hsla(${d.hue}, 40%, 80%, 0)`);

            fgCtx.beginPath();
            fgCtx.arc(d.x, d.y, d.r * 3, 0, Math.PI * 2);
            fgCtx.fillStyle = gradient;
            fgCtx.fill();
        }
        requestAnimationFrame(drawParticles);
    }

    window.addEventListener('resize', () => { resize(); createParticles(); });
    resize(); createParticles(); drawParticles();

    // ---- Cinematic Navigation Zoom ----
    const planetLinks = document.querySelectorAll('a.planet-group');
    const viewport = document.getElementById('space-viewport');

    planetLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');

            document.body.classList.add('navigating');
            this.classList.add('clicked');

            const rect = this.getBoundingClientRect();
            const clickX = rect.left + rect.width / 2;
            const clickY = rect.top + rect.height / 2;

            viewport.style.transformOrigin = `${clickX}px ${clickY}px`;

            // Professional cinematic push-in
            viewport.style.transform = `scale(5) translateZ(0)`;

            setTimeout(() => {
                window.location.href = href;
            }, 750);
        });
    });

    // ---- Floating Parallax Layer & Depth Calculation ----
    const planetGroups = document.querySelectorAll('.planet-group');

    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    // Cinematic 3D Depth
    const parallaxDepths = {
        'group-sun': 5,
        'group-earth': 25,
        'group-saturn': -12,
        'group-mars': 35,
        'group-moon': -20
    };

    document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        targetY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    });

    function updateParallax() {
        // Ultra smooth, heavy interpolation
        mouseX += (targetX - mouseX) * 0.015;
        mouseY += (targetY - mouseY) * 0.015;

        if (!document.body.classList.contains('navigating')) {

            planetGroups.forEach(group => {
                let depth = 5;
                for (const [className, weight] of Object.entries(parallaxDepths)) {
                    if (group.classList.contains(className)) {
                        depth = weight;
                    }
                }

                if (!group.dataset.initX) {
                    const match = group.style.transform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
                    group.dataset.initX = match ? match[1] : 0;
                    group.dataset.initY = match ? match[2] : 0;
                }

                const initX = parseFloat(group.dataset.initX);
                const initY = parseFloat(group.dataset.initY);

                // True 3D depth shift
                const shiftX = mouseX * depth;
                const shiftY = mouseY * depth;

                group.style.transform = `translate(${initX + shiftX}px, ${initY + shiftY}px)`;
            });

            let globalScale = window.innerWidth <= 600 ? 0.4 : window.innerWidth <= 900 ? 0.65 : 1;
            document.getElementById('solar-system').style.transform = `translate(-50%, -50%) scale(${globalScale})`;
        }

        requestAnimationFrame(updateParallax);
    }
    updateParallax();
})();
