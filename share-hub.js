/* ============================================
   Share Hub – Interactivity
   ============================================ */
(function () {
    'use strict';

    // ---- Cinematic Starfield & Cosmic Dust ----
    const bgCanvas = document.getElementById('starfield');
    const bgCtx = bgCanvas.getContext('2d');
    const fgCanvas = document.getElementById('cosmic-dust');
    const fgCtx = fgCanvas.getContext('2d');

    let stars = [];
    let dust = [];
    const STAR_COUNT = 400;
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
                r: Math.random() * 0.8 + 0.1,
                alpha: Math.random() * 0.8 + 0.1,
                dAlpha: (Math.random() * 0.003 + 0.0005) * (Math.random() < 0.5 ? 1 : -1)
            });
        }

        dust = [];
        for (let i = 0; i < DUST_COUNT; i++) {
            dust.push({
                x: Math.random() * fgCanvas.width,
                y: Math.random() * fgCanvas.height,
                r: Math.random() * 1.5 + 0.5,
                dx: (Math.random() - 0.5) * 0.15,
                dy: (Math.random() - 0.5) * 0.15,
                hue: 220,
                alpha: Math.random() * 0.15 + 0.05,
                dAlpha: (Math.random() * 0.001 + 0.0005) * (Math.random() < 0.5 ? 1 : -1)
            });
        }
    }

    function drawParticles() {
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        for (const s of stars) {
            s.alpha += s.dAlpha;
            if (s.alpha <= 0.05 || s.alpha >= 0.9) s.dAlpha *= -1;

            bgCtx.fillStyle = `rgba(230, 240, 255, ${s.alpha.toFixed(2)})`;
            bgCtx.fillRect(s.x, s.y, s.r, s.r);
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

    // ---- Navbar scroll ----
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // ---- Hamburger ----
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.navbar__links');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('.navbar__link').forEach(l => {
        l.addEventListener('click', () => { hamburger.classList.remove('active'); navLinks.classList.remove('open'); });
    });

    // ---- Generate Link & Copy ----
    const generateBtn = document.getElementById('generate-btn');
    const linkResultSection = document.getElementById('link-result');
    const copyBtn = document.getElementById('copy-btn');
    const shareLinkInput = document.getElementById('share-link-input');
    const copyMsg = document.getElementById('copy-msg');

    // Simulated link generation
    generateBtn.addEventListener('click', () => {
        // Hide previous if clicking again
        linkResultSection.classList.remove('visible');

        // Set loading state
        generateBtn.classList.add('loading');

        // Simulate API delay
        setTimeout(() => {
            generateBtn.classList.remove('loading');

            // Generate a random unique looking hash for the URL
            const hash = Math.random().toString(36).substring(2, 10);
            const url = `https://eduspace.app/u/cadet-explorer-${hash}`;

            shareLinkInput.value = url;
            linkResultSection.style.display = 'block';

            // Small delay to allow display flex to apply before transitioning opacity
            requestAnimationFrame(() => requestAnimationFrame(() => {
                linkResultSection.classList.add('visible');
            }));

        }, 1200);
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        // Select text
        shareLinkInput.select();
        shareLinkInput.setSelectionRange(0, 99999); // For mobile devices

        try {
            // Execute copy
            navigator.clipboard.writeText(shareLinkInput.value).then(() => {
                // Show success message
                copyMsg.classList.add('show');

                // Hide after 2 seconds
                setTimeout(() => {
                    copyMsg.classList.remove('show');
                }, 2000);
            });
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    });

})();
