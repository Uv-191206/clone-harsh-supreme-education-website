/* ============================================
   Orbit Playlist – Interactivity
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

    // ---- YouTube URL parser ----
    function extractVideoId(url) {
        url = url.trim();
        // Standard watch URL
        let match = url.match(/(?:youtube\.com\/watch\?.*v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
        if (match) return match[1];
        // Raw video ID (11 chars)
        if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
        return null;
    }

    function getThumbnail(videoId) {
        return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }

    function getEmbedUrl(videoId) {
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    }

    // ---- State ----
    let playlist = [];
    let nowPlayingId = null;

    // Sample videos to start
    const sampleVideos = [
        { id: 'dQw4w9WgXcQ', title: 'JavaScript Full Course for Beginners' },
        { id: 'rfscVS0vtbw', title: 'Python Tutorial – Learn Python Programming' },
        { id: 'PkZNo7MFNFg', title: 'Learn JavaScript – Full Course for Beginners' },
    ];

    // Load from localStorage or use samples
    function loadPlaylist() {
        const saved = localStorage.getItem('eduspace_orbit_playlist');
        if (saved) {
            try { playlist = JSON.parse(saved); } catch { playlist = []; }
        }
        if (playlist.length === 0) {
            playlist = sampleVideos.map(v => ({ ...v }));
        }
    }

    function savePlaylist() {
        localStorage.setItem('eduspace_orbit_playlist', JSON.stringify(playlist));
    }

    // ---- DOM refs ----
    const ytInput = document.getElementById('yt-input');
    const addBtn = document.getElementById('add-btn');
    const inputHint = document.getElementById('input-hint');
    const videoGrid = document.getElementById('video-grid');
    const emptyOrbit = document.getElementById('empty-orbit');
    const playlistCount = document.getElementById('playlist-count');
    const clearBtn = document.getElementById('clear-btn');
    const nowPlayingSection = document.getElementById('now-playing');
    const playerFrame = document.getElementById('player-frame');
    const playerTitle = document.getElementById('player-title');
    const playerChannel = document.getElementById('player-channel');

    // ---- Render ----
    function renderPlaylist() {
        videoGrid.innerHTML = '';

        if (playlist.length === 0) {
            emptyOrbit.style.display = 'flex';
            clearBtn.style.display = 'none';
        } else {
            emptyOrbit.style.display = 'none';
            clearBtn.style.display = 'flex';
        }

        playlistCount.textContent = playlist.length;

        playlist.forEach((video, i) => {
            const card = document.createElement('div');
            card.className = 'video-card';
            card.style.transitionDelay = `${i * 0.06}s`;

            card.innerHTML = `
        <div class="video-card__thumb">
          <img src="${getThumbnail(video.id)}" alt="${video.title}" loading="lazy" />
          <div class="video-card__play-overlay">
            <div class="video-card__play-btn">
              <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          </div>
          <span class="video-card__number">${i + 1}</span>
        </div>
        <div class="video-card__body">
          <h3 class="video-card__title">${video.title}</h3>
          <div class="video-card__meta">
            <span class="video-card__id">${video.id}</span>
            <button class="video-card__remove" title="Remove">&times;</button>
          </div>
        </div>
      `;

            // Play on click
            card.addEventListener('click', (e) => {
                if (e.target.closest('.video-card__remove')) return;
                playVideo(video);
            });

            // Remove
            card.querySelector('.video-card__remove').addEventListener('click', (e) => {
                e.stopPropagation();
                card.style.transform = 'scale(0.92)';
                card.style.opacity = '0';
                setTimeout(() => {
                    playlist = playlist.filter(v => v !== video);
                    savePlaylist();
                    renderPlaylist();
                }, 280);
            });

            videoGrid.appendChild(card);
            requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('visible')));
        });
    }

    // ---- Play Video ----
    function playVideo(video) {
        nowPlayingId = video.id;
        nowPlayingSection.style.display = 'block';
        playerFrame.innerHTML = `<iframe src="${getEmbedUrl(video.id)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        playerTitle.textContent = video.title;
        playerChannel.textContent = `Video ID: ${video.id}`;
        nowPlayingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ---- Add Video ----
    function addVideo() {
        const input = ytInput.value.trim();
        if (!input) {
            showHint('Please paste a YouTube link or video ID.', 'error');
            return;
        }

        const videoId = extractVideoId(input);
        if (!videoId) {
            showHint('Invalid YouTube URL. Try pasting a valid link.', 'error');
            return;
        }

        // Check duplicate
        if (playlist.some(v => v.id === videoId)) {
            showHint('This video is already in your playlist!', 'error');
            return;
        }

        const newVideo = {
            id: videoId,
            title: `YouTube Video • ${videoId}`,
        };

        playlist.unshift(newVideo);
        savePlaylist();
        renderPlaylist();
        ytInput.value = '';
        showHint('Video added to your orbit! 🚀', 'success');

        // Scroll to grid
        setTimeout(() => {
            videoGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }

    function showHint(msg, type) {
        inputHint.textContent = msg;
        inputHint.className = 'add-card__hint ' + type;
        setTimeout(() => { inputHint.textContent = ''; inputHint.className = 'add-card__hint'; }, 3500);
    }

    addBtn.addEventListener('click', addVideo);
    ytInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addVideo();
    });

    // ---- Clear All ----
    clearBtn.addEventListener('click', () => {
        playlist = [];
        nowPlayingSection.style.display = 'none';
        playerFrame.innerHTML = '';
        savePlaylist();
        renderPlaylist();
    });

    // ---- Init ----
    loadPlaylist();
    renderPlaylist();

})();
