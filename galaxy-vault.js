/* ============================================
   Galaxy Vault – Interactivity
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

    // ---- Sample Certificate Data ----
    const glowColors = ['blue', 'purple', 'green', 'pink', 'gold'];
    const categories = ['coding', 'design', 'data', 'cloud'];
    const sampleCerts = [
        { title: 'Advanced JavaScript Mastery', issuer: 'Udemy', date: '2026-01-15', category: 'coding', glow: 'blue' },
        { title: 'UI/UX Design Fundamentals', issuer: 'Coursera', date: '2025-12-02', category: 'design', glow: 'pink' },
        { title: 'Python for Data Science', issuer: 'DataCamp', date: '2026-02-10', category: 'data', glow: 'green' },
        { title: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: '2025-11-20', category: 'cloud', glow: 'purple' },
        { title: 'React & Next.js Pro', issuer: 'Frontend Masters', date: '2026-02-25', category: 'coding', glow: 'blue' },
        { title: 'Machine Learning Specialization', issuer: 'Stanford Online', date: '2025-10-08', category: 'data', glow: 'gold' },
    ];

    let certificates = [...sampleCerts];
    let activeFilter = 'all';

    // ---- DOM refs ----
    const grid = document.getElementById('cert-grid');
    const emptyState = document.getElementById('empty-state');
    const statTotal = document.getElementById('stat-total');
    const statRecent = document.getElementById('stat-recent');
    const statCategories = document.getElementById('stat-categories');
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalIssuer = document.getElementById('modal-issuer');
    const modalDate = document.getElementById('modal-date');
    const modalCategory = document.getElementById('modal-category');
    const modalPreview = document.getElementById('modal-preview');

    // ---- Render ----
    function updateStats() {
        statTotal.textContent = certificates.length;
        const now = new Date();
        const thisMonth = certificates.filter(c => {
            const d = new Date(c.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;
        statRecent.textContent = thisMonth;
        statCategories.textContent = new Set(certificates.map(c => c.category)).size;
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function renderCards() {
        const filtered = activeFilter === 'all'
            ? certificates
            : certificates.filter(c => c.category === activeFilter);

        grid.innerHTML = '';

        if (filtered.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        emptyState.style.display = 'none';

        filtered.forEach((cert, i) => {
            const card = document.createElement('div');
            card.className = 'cert-card';
            card.setAttribute('data-glow', cert.glow);
            card.style.transitionDelay = `${i * 0.07}s`;

            card.innerHTML = `
        <div class="cert-card__preview">
          <div class="cert-card__preview-placeholder">
            <svg viewBox="0 0 64 64" fill="none"><rect x="12" y="8" width="40" height="48" rx="4" stroke="currentColor" stroke-width="1.8"/><path d="M22 22h20M22 30h20M22 38h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M38 50l6-6-6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span style="font-size:.72rem">Certificate</span>
          </div>
          <span class="cert-card__badge" style="color:var(--accent)">${cert.glow.toUpperCase()}</span>
        </div>
        <button class="cert-card__delete" title="Remove certificate">&times;</button>
        <div class="cert-card__body">
          <h3 class="cert-card__title">${cert.title}</h3>
          <p class="cert-card__issuer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            ${cert.issuer}
          </p>
          <div class="cert-card__meta">
            <span class="cert-card__date">${formatDate(cert.date)}</span>
            <span class="cert-card__category cert-card__category--${cert.category}">${cert.category}</span>
          </div>
        </div>
      `;

            // Click to open modal
            card.addEventListener('click', (e) => {
                if (e.target.closest('.cert-card__delete')) return;
                openModal(cert);
            });

            // Delete
            card.querySelector('.cert-card__delete').addEventListener('click', (e) => {
                e.stopPropagation();
                card.style.transform = 'scale(0.9)';
                card.style.opacity = '0';
                setTimeout(() => {
                    certificates = certificates.filter(c => c !== cert);
                    renderCards();
                    updateStats();
                }, 300);
            });

            grid.appendChild(card);

            // Trigger reveal
            requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('visible')));
        });
    }

    // ---- Shimmer angle rotation ----
    let shimmerAngle = 0;
    function animateShimmer() {
        shimmerAngle = (shimmerAngle + 0.6) % 360;
        document.documentElement.style.setProperty('--shimmer-angle', shimmerAngle + 'deg');
        requestAnimationFrame(animateShimmer);
    }
    animateShimmer();

    // ---- Filter buttons ----
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
            btn.classList.add('filter-btn--active');
            activeFilter = btn.dataset.filter;
            renderCards();
        });
    });

    // ---- Upload handling ----
    ['dragenter', 'dragover'].forEach(evt => {
        uploadZone.addEventListener(evt, e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
    });
    ['dragleave', 'drop'].forEach(evt => {
        uploadZone.addEventListener(evt, e => { e.preventDefault(); uploadZone.classList.remove('drag-over'); });
    });

    uploadZone.addEventListener('drop', (e) => { handleFiles(e.dataTransfer.files); });
    fileInput.addEventListener('change', () => { handleFiles(fileInput.files); fileInput.value = ''; });

    function handleFiles(files) {
        if (!files.length) return;

        Array.from(files).forEach(file => {
            const newCert = {
                title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
                issuer: 'Uploaded',
                date: new Date().toISOString().slice(0, 10),
                category: categories[Math.floor(Math.random() * categories.length)],
                glow: glowColors[Math.floor(Math.random() * glowColors.length)],
            };
            certificates.unshift(newCert);
        });

        // Flash success
        uploadZone.classList.add('upload-success');
        setTimeout(() => uploadZone.classList.remove('upload-success'), 1200);

        activeFilter = 'all';
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
        document.querySelector('.filter-btn[data-filter="all"]').classList.add('filter-btn--active');

        renderCards();
        updateStats();

        // Scroll to grid
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ---- Modal ----
    function openModal(cert) {
        modalTitle.textContent = cert.title;
        modalIssuer.textContent = 'Issued by: ' + cert.issuer;
        modalDate.textContent = 'Date: ' + formatDate(cert.date);
        modalCategory.textContent = cert.category;
        modalCategory.style.background = `rgba(0,212,255,0.12)`;
        modalCategory.style.color = `var(--neon-blue)`;
        modalPreview.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:.5rem;color:var(--text-secondary)">
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none"><rect x="12" y="8" width="40" height="48" rx="4" stroke="currentColor" stroke-width="1.8"/><path d="M22 22h20M22 30h20M22 38h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <span style="font-size:.85rem">${cert.title}</span>
      </div>
    `;
        modalOverlay.classList.add('open');
    }

    modalClose.addEventListener('click', () => modalOverlay.classList.remove('open'));
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.remove('open');
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') modalOverlay.classList.remove('open');
    });

    // ---- Init ----
    updateStats();
    renderCards();

})();
