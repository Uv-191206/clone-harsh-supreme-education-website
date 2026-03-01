/* ================================================
   EduSpace – SPA Application
   ================================================ */
(function () {
    'use strict';

    // ---- State ----
    const state = {
        certs: [
            { id: 1, title: 'Cosmic JavaScript', issuer: 'Nebular Camp', icon: 'fa-brands fa-js', previewClass: 'cert-card__preview--js', verified: true, date: '2026-01-15' },
            { id: 2, title: 'Python Data Orbits', issuer: 'AstroCode Academy', icon: 'fa-brands fa-python', previewClass: 'cert-card__preview--py', verified: true, date: '2025-11-20' },
            { id: 3, title: 'React Nebula', issuer: 'StarForge Dev', icon: 'fa-brands fa-react', previewClass: 'cert-card__preview--react', verified: true, date: '2025-09-08' },
        ],
        videos: [
            { id: 'dQw4w9WgXcQ', title: 'Learning Resource 1' },
            { id: 'jfKfPfyJRdk', title: 'Learning Resource 2' },
        ],
        codeBlocks: [
            { id: 1, name: 'Orbital Velocity', time: '2 hours ago', code: 'function calculateOrbit(mass, radius) {\n    const G = 6.67430e-11;\n    let velocity = Math.sqrt((G * mass) / radius);\n    return {\n        escapeVelocity: velocity * Math.sqrt(2),\n        orbitalVelocity: velocity,\n        status: "Stable"\n    };\n}\nconsole.log(calculateOrbit(5.972e24, 6371000));' },
        ],
        resources: [
            { id: 1, url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
            { id: 2, url: 'https://react.dev/learn' },
        ],
        currentVideo: '',
        nextCertId: 4,
        nextBlockId: 2,
        nextResId: 3,
    };

    // ---- View Templates ----
    function homeView() {
        return `
        <div class="view-header anim-in">
            <h1 class="view-header__title"><i class="fa-solid fa-satellite-dish"></i> Command Center</h1>
            <p class="view-header__sub">Welcome aboard, Cadet Explorer. Here is your universe overview.</p>
        </div>

        <div class="hero-banner anim-in anim-in-delay-1">
            <div class="hero-banner__content">
                <div class="hero-banner__greeting">✦ MISSION CONTROL</div>
                <h2 class="hero-banner__title">Navigate Your<br><span>Learning Universe</span></h2>
                <p class="hero-banner__desc">Blast off into an immersive galaxy of knowledge. Learn, create, share, and grow — across every orbit of education.</p>
                <div class="hero-banner__actions">
                    <a href="#vault" class="btn btn--glow"><i class="fa-solid fa-rocket"></i> Start Exploring</a>
                    <a href="#about" class="btn btn--outline"><i class="fa-solid fa-info-circle"></i> Learn More</a>
                </div>
            </div>
            <div class="hero-banner__orbit">
                <div class="orbit-ring orbit-ring--1"></div>
                <div class="orbit-ring orbit-ring--2"></div>
                <div class="orbit-ring orbit-ring--3"></div>
                <div class="orbit-planet"></div>
                <div class="orbit-planet orbit-planet--2"></div>
            </div>
        </div>

        <div class="stats-row anim-in anim-in-delay-2">
            <div class="glass-card stat-widget stat-widget--cyan">
                <div class="stat-widget__icon"><i class="fa-solid fa-shield-halved"></i></div>
                <div class="stat-widget__value">${state.certs.length}</div>
                <div class="stat-widget__label">Certificates Earned</div>
            </div>
            <div class="glass-card stat-widget stat-widget--purple">
                <div class="stat-widget__icon"><i class="fa-solid fa-play-circle"></i></div>
                <div class="stat-widget__value">${state.videos.length}</div>
                <div class="stat-widget__label">Videos Queued</div>
            </div>
            <div class="glass-card stat-widget stat-widget--green">
                <div class="stat-widget__icon"><i class="fa-solid fa-code"></i></div>
                <div class="stat-widget__value">${state.codeBlocks.length}</div>
                <div class="stat-widget__label">Code Blocks Saved</div>
            </div>
            <div class="glass-card stat-widget stat-widget--orange">
                <div class="stat-widget__icon"><i class="fa-solid fa-fire"></i></div>
                <div class="stat-widget__value">12</div>
                <div class="stat-widget__label">Day Streak</div>
            </div>
        </div>

        <div class="glass-card objectives-card anim-in anim-in-delay-3">
            <div class="objectives-card__title"><i class="fa-solid fa-bullseye"></i> Next Objectives</div>
            <div class="objective-item objective-item--cyan">
                <span class="objective-item__text">Complete React Gravity Module</span>
                <span class="objective-badge objective-badge--pending">Pending</span>
            </div>
            <div class="objective-item objective-item--purple">
                <span class="objective-item__text">Upload Machine Learning Certificate</span>
                <span class="objective-badge objective-badge--action">Action Req</span>
            </div>
            <div class="objective-item objective-item--pink">
                <span class="objective-item__text">Share Python tutorial with squad</span>
                <span class="objective-badge objective-badge--review">Review</span>
            </div>
        </div>
        `;
    }

    function vaultView() {
        const certsHTML = state.certs.map(c => `
            <div class="glass-card cert-card" data-cert-id="${c.id}">
                <div class="cert-card__preview ${c.previewClass}">
                    <i class="${c.icon}"></i>
                </div>
                <div class="cert-card__body">
                    <div class="cert-card__title">${c.title}</div>
                    <div class="cert-card__issuer">Issued by ${c.issuer}</div>
                    <span class="cert-card__badge"><i class="fa-solid fa-circle-check"></i> ${c.verified ? 'Verified' : 'Pending'}</span>
                    <div class="cert-card__actions">
                        <button class="btn btn--outline btn--small" onclick="EduApp.viewCert(${c.id})"><i class="fa-solid fa-eye"></i> View</button>
                        <button class="btn btn--danger btn--small" onclick="EduApp.removeCert(${c.id})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `).join('');

        return `
        <div class="view-header anim-in">
            <h1 class="view-header__title"><i class="fa-solid fa-shield-halved"></i> Galaxy Vault</h1>
            <p class="view-header__sub">Store and display your hard-earned credentials and certificates.</p>
        </div>

        <div class="glass-card vault-upload anim-in anim-in-delay-1">
            <input type="text" class="input-field" id="cert-name-input" placeholder="Certificate name (e.g., AWS Cloud Practitioner)">
            <select class="input-field" id="cert-category" style="max-width:180px;">
                <option value="js">JavaScript</option>
                <option value="py">Python</option>
                <option value="react">React</option>
                <option value="cloud">Cloud</option>
            </select>
            <button class="btn btn--glow" onclick="EduApp.addCert()"><i class="fa-solid fa-upload"></i> Upload</button>
        </div>

        <div class="cert-grid anim-in anim-in-delay-2">
            ${certsHTML}
            <div class="cert-add-card" onclick="document.getElementById('cert-name-input').focus()">
                <i class="fa-solid fa-plus"></i>
                <span>Add Certificate</span>
            </div>
        </div>
        `;
    }

    function playlistView() {
        const videoCards = state.videos.map((v, i) => `
            <div class="video-thumb-card" onclick="EduApp.playVideo('${v.id}')">
                <img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg" alt="Video thumbnail" loading="lazy">
                <div class="video-thumb-card__play"><i class="fa-solid fa-play"></i></div>
                <button class="video-thumb-card__remove" onclick="event.stopPropagation(); EduApp.removeVideo(${i})" title="Remove">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `).join('');

        const playerContent = state.currentVideo
            ? `<iframe src="https://www.youtube.com/embed/${state.currentVideo}?autoplay=1" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
            : (state.videos.length > 0
                ? `<iframe src="https://www.youtube.com/embed/${state.videos[0].id}" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                : `<div class="player-area__empty"><i class="fa-solid fa-film"></i><span>Add a video to start watching</span></div>`);

        return `
        <div class="view-header anim-in">
            <h1 class="view-header__title"><i class="fa-brands fa-youtube"></i> Orbit Playlist</h1>
            <p class="view-header__sub">Your curated educational video frequency streams.</p>
        </div>

        <div class="glass-card playlist-input-bar anim-in anim-in-delay-1">
            <input type="text" class="input-field" id="yt-link-input" placeholder="Paste YouTube link here (e.g., https://youtu.be/dQw4w9WgXcQ)">
            <button class="btn btn--glow" onclick="EduApp.addVideo()"><i class="fa-solid fa-plus"></i> Add to Orbit</button>
        </div>

        <div class="player-area anim-in anim-in-delay-2">
            ${playerContent}
        </div>

        <div class="anim-in anim-in-delay-3">
            <div class="queue-section__title"><i class="fa-solid fa-list"></i> Saved Frequencies (${state.videos.length})</div>
            <div class="video-queue-grid">
                ${videoCards || '<p style="color:var(--text-3)">No videos yet. Paste a YouTube link above.</p>'}
            </div>
        </div>
        `;
    }

    function codeView() {
        const savedHTML = state.codeBlocks.map(b => `
            <div class="saved-block">
                <div class="saved-block__header">
                    <span class="saved-block__name"><i class="fa-solid fa-file-code" style="color:var(--neon-green);margin-right:0.4rem;"></i>${b.name}</span>
                    <div style="display:flex;gap:0.4rem;align-items:center;">
                        <span class="saved-block__time">${b.time}</span>
                        <button class="btn btn--danger btn--small" onclick="EduApp.deleteBlock(${b.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
                <div class="saved-block__code">${escapeHtml(b.code)}</div>
            </div>
        `).join('');

        return `
        <div class="view-header anim-in">
            <h1 class="view-header__title"><i class="fa-solid fa-terminal"></i> Code Station</h1>
            <p class="view-header__sub">Experiment with logic sequences in the quantum terminal.</p>
        </div>

        <div class="terminal-shell anim-in anim-in-delay-1">
            <div class="terminal-shell__bar">
                <div class="term-dot term-dot--red"></div>
                <div class="term-dot term-dot--yellow"></div>
                <div class="term-dot term-dot--green"></div>
                <span class="terminal-shell__title">guest@eduspace: ~/projects/quantum-logic</span>
            </div>
            <div class="terminal-shell__editor">
                <textarea class="code-textarea" id="code-editor" spellcheck="false" placeholder="// Write your code here...">// Initiating quantum sequence
function calculateOrbit(mass, radius) {
    const G = 6.67430e-11; // Gravitational constant
    let velocity = Math.sqrt((G * mass) / radius);

    return {
        escapeVelocity: velocity * Math.sqrt(2),
        orbitalVelocity: velocity,
        status: "Stable"
    };
}

console.log(calculateOrbit(5.972e24, 6371000));
// Output stream ready...</textarea>
            </div>
        </div>

        <div class="code-actions anim-in anim-in-delay-2">
            <button class="btn btn--glow" onclick="EduApp.saveCode()"><i class="fa-solid fa-floppy-disk"></i> Save Block</button>
            <button class="btn btn--outline" onclick="EduApp.clearEditor()"><i class="fa-solid fa-eraser"></i> Clear</button>
        </div>

        <div class="anim-in anim-in-delay-3" style="margin-top:2rem;">
            <div class="saved-blocks__title"><i class="fa-solid fa-database"></i> Saved Blocks (${state.codeBlocks.length})</div>
            <div class="saved-blocks-list" id="saved-blocks-list">
                ${savedHTML || '<p style="color:var(--text-3)">No saved blocks yet. Write some code and hit Save.</p>'}
            </div>
        </div>
        `;
    }

    function shareView() {
        const resHTML = state.resources.map(r => `
            <div class="resource-item">
                <span class="resource-item__link" title="${escapeHtml(r.url)}">${escapeHtml(r.url)}</span>
                <div class="resource-item__actions">
                    <button class="btn btn--outline btn--small" onclick="EduApp.copyText('${escapeHtml(r.url)}')"><i class="fa-solid fa-copy"></i></button>
                    <button class="btn btn--danger btn--small" onclick="EduApp.removeResource(${r.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `).join('');

        return `
        <div class="view-header anim-in">
            <h1 class="view-header__title"><i class="fa-solid fa-share-nodes"></i> Share Hub</h1>
            <p class="view-header__sub">Transmit your learning modules to other cadets.</p>
        </div>

        <div class="share-hub-center anim-in anim-in-delay-1">
            <div class="share-hub__icon"><i class="fa-solid fa-satellite-dish"></i></div>
            <h2 class="share-hub__heading">Generate Transmission Link</h2>
            <p class="share-hub__desc">Share your profile, vault, and playlists with one click.</p>

            <div class="share-link-row">
                <input type="text" class="input-field" id="profile-link" value="https://eduspace.app/u/cadet-explorer" readonly>
                <button class="btn btn--glow" onclick="EduApp.copyProfileLink()"><i class="fa-solid fa-copy"></i> Copy</button>
            </div>
            <div class="share-success" id="copy-msg"><i class="fa-solid fa-check-circle"></i> Link copied to clipboard!</div>

            <div class="share-resources">
                <div class="share-resources__title">Shared Resources</div>
                <div class="share-add-row">
                    <input type="text" class="input-field" id="resource-url-input" placeholder="Paste a resource URL to share">
                    <button class="btn btn--glow" onclick="EduApp.addResource()"><i class="fa-solid fa-plus"></i> Add</button>
                </div>
                <div class="resource-list" id="resource-list">
                    ${resHTML || '<p style="color:var(--text-3)">No shared resources. Add one above.</p>'}
                </div>
            </div>
        </div>
        `;
    }

    function aboutView() {
        return `
        <div class="view-header anim-in">
            <h1 class="view-header__title"><i class="fa-solid fa-satellite"></i> About Mission</h1>
            <p class="view-header__sub">The story behind the EduSpace initiative.</p>
        </div>

        <div class="about-content">
            <div class="glass-card about-card anim-in anim-in-delay-1">
                <span class="about-card__badge">Mission Briefing</span>
                <h2 class="about-card__heading">Navigating the Cosmos of Knowledge</h2>
                <p>EduSpace was created with a singular vision: to make learning not just a task, but an intergalactic adventure. We believe that the environment dictates the experience, and what's more awe-inspiring than the cosmos?</p>
                <p>This platform is designed for students seeking a sanctuary to organize their knowledge universe. From tracking your completed modules to hoarding certificates in your Vault, curating educational playlists in Orbit, and experimenting in the Code Station — EduSpace is your all-in-one learning command center.</p>
                <p>Every feature has been carefully crafted with a futuristic aesthetic to keep you motivated and engaged as you chart your path through the stars of education.</p>
            </div>

            <div class="about-features anim-in anim-in-delay-2">
                <div class="glass-card about-feature about-feature--cyan">
                    <div class="about-feature__icon"><i class="fa-solid fa-shield-halved"></i></div>
                    <div class="about-feature__title">Galaxy Vault</div>
                    <div class="about-feature__text">Secure certificate storage</div>
                </div>
                <div class="glass-card about-feature about-feature--purple">
                    <div class="about-feature__icon"><i class="fa-brands fa-youtube"></i></div>
                    <div class="about-feature__title">Orbit Playlist</div>
                    <div class="about-feature__text">Video learning streams</div>
                </div>
                <div class="glass-card about-feature about-feature--green">
                    <div class="about-feature__icon"><i class="fa-solid fa-terminal"></i></div>
                    <div class="about-feature__title">Code Station</div>
                    <div class="about-feature__text">Quantum code editor</div>
                </div>
                <div class="glass-card about-feature about-feature--pink">
                    <div class="about-feature__icon"><i class="fa-solid fa-share-nodes"></i></div>
                    <div class="about-feature__title">Share Hub</div>
                    <div class="about-feature__text">Knowledge transmission</div>
                </div>
            </div>

            <div class="glass-card about-card anim-in anim-in-delay-3">
                <div class="about-stats-row">
                    <div>
                        <div class="about-stat__label">Version</div>
                        <div class="about-stat__value">v1.0.0 (Orion Release)</div>
                    </div>
                    <div>
                        <div class="about-stat__label">System Status</div>
                        <div class="about-stat__value about-stat__value--green"><i class="fa-solid fa-circle" style="font-size:0.5rem;vertical-align:middle;margin-right:0.3rem;"></i> Operational</div>
                    </div>
                    <div>
                        <div class="about-stat__label">Last Updated</div>
                        <div class="about-stat__value">Feb 2026</div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    // ---- Helpers ----
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function showToast(message) {
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // ---- Router ----
    const routes = {
        home: homeView,
        vault: vaultView,
        playlist: playlistView,
        code: codeView,
        share: shareView,
        about: aboutView,
    };

    function navigate(route) {
        if (!routes[route]) route = 'home';
        const main = document.getElementById('main-content');
        main.scrollTop = 0;
        main.innerHTML = routes[route]();

        // Update active nav
        document.querySelectorAll('.nav-item').forEach(a => {
            a.classList.toggle('active', a.dataset.route === route);
        });

        window.location.hash = route;

        // Close mobile sidebar
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').classList.remove('open');
    }

    // ---- Init ----
    document.addEventListener('DOMContentLoaded', () => {
        const initial = window.location.hash.replace('#', '') || 'home';
        navigate(initial);

        window.addEventListener('hashchange', () => {
            navigate(window.location.hash.replace('#', '') || 'home');
        });

        // Nav clicks
        document.querySelectorAll('.nav-item').forEach(a => {
            a.addEventListener('click', e => {
                e.preventDefault();
                navigate(a.dataset.route);
            });
        });

        // Mobile toggle
        document.getElementById('menu-toggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
            document.getElementById('sidebar-overlay').classList.toggle('open');
        });

        document.getElementById('sidebar-overlay').addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('sidebar-overlay').classList.remove('open');
        });

        // Hero buttons (in-content nav links)
        document.getElementById('main-content').addEventListener('click', e => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const route = link.getAttribute('href').replace('#', '');
                if (routes[route]) navigate(route);
            }
        });
    });

    // ---- Public API for inline handlers ----
    window.EduApp = {
        // -- Vault --
        addCert() {
            const nameEl = document.getElementById('cert-name-input');
            const catEl = document.getElementById('cert-category');
            const name = nameEl.value.trim();
            if (!name) { nameEl.focus(); return showToast('Please enter a certificate name'); }

            const catMap = {
                js: { icon: 'fa-brands fa-js', previewClass: 'cert-card__preview--js', issuer: 'Code Galaxy' },
                py: { icon: 'fa-brands fa-python', previewClass: 'cert-card__preview--py', issuer: 'AstroCode' },
                react: { icon: 'fa-brands fa-react', previewClass: 'cert-card__preview--react', issuer: 'StarForge Dev' },
                cloud: { icon: 'fa-solid fa-cloud', previewClass: 'cert-card__preview--cloud', issuer: 'CloudNebula' },
            };
            const cat = catMap[catEl.value] || catMap.js;

            state.certs.push({
                id: state.nextCertId++,
                title: name,
                issuer: cat.issuer,
                icon: cat.icon,
                previewClass: cat.previewClass,
                verified: true,
                date: new Date().toISOString().slice(0, 10),
            });

            navigate('vault');
            showToast('Certificate archived successfully!');
        },

        removeCert(id) {
            state.certs = state.certs.filter(c => c.id !== id);
            navigate('vault');
            showToast('Certificate removed');
        },

        viewCert(id) {
            const c = state.certs.find(cert => cert.id === id);
            if (c) showToast(`Viewing: ${c.title} — Issued by ${c.issuer}`);
        },

        // -- Playlist --
        addVideo() {
            const input = document.getElementById('yt-link-input');
            const url = input.value.trim();
            const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\s]{11})/);

            if (match && match[1]) {
                const vidId = match[1];
                if (state.videos.some(v => v.id === vidId)) {
                    return showToast('Video already in your orbit!');
                }
                state.videos.push({ id: vidId, title: 'Video' });
                state.currentVideo = vidId;
                navigate('playlist');
                showToast('Video added to orbit!');
            } else {
                showToast('Invalid YouTube URL. Please transmit a valid frequency link.');
            }
        },

        playVideo(id) {
            state.currentVideo = id;
            navigate('playlist');
        },

        removeVideo(index) {
            state.videos.splice(index, 1);
            if (state.currentVideo === state.videos[index]?.id) state.currentVideo = '';
            navigate('playlist');
            showToast('Video removed from orbit');
        },

        // -- Code Station --
        saveCode() {
            const editor = document.getElementById('code-editor');
            const code = editor.value.trim();
            if (!code) return showToast('Write some code before saving!');

            state.codeBlocks.unshift({
                id: state.nextBlockId++,
                name: `Block #${state.codeBlocks.length + 1}`,
                time: 'Just now',
                code: code,
            });
            navigate('code');
            showToast('Code block saved to station!');
        },

        clearEditor() {
            const editor = document.getElementById('code-editor');
            if (editor) editor.value = '';
        },

        deleteBlock(id) {
            state.codeBlocks = state.codeBlocks.filter(b => b.id !== id);
            navigate('code');
            showToast('Block deleted');
        },

        // -- Share Hub --
        copyProfileLink() {
            const input = document.getElementById('profile-link');
            input.select();
            navigator.clipboard.writeText(input.value).catch(() => document.execCommand('copy'));
            const msg = document.getElementById('copy-msg');
            msg.classList.add('visible');
            setTimeout(() => msg.classList.remove('visible'), 3000);
            showToast('Profile link copied!');
        },

        copyText(text) {
            navigator.clipboard.writeText(text).catch(() => { });
            showToast('Copied to clipboard!');
        },

        addResource() {
            const input = document.getElementById('resource-url-input');
            const url = input.value.trim();
            if (!url) { input.focus(); return showToast('Please enter a URL'); }
            try { new URL(url); } catch { return showToast('Please enter a valid URL'); }

            state.resources.push({ id: state.nextResId++, url });
            navigate('share');
            showToast('Resource shared!');
        },

        removeResource(id) {
            state.resources = state.resources.filter(r => r.id !== id);
            navigate('share');
            showToast('Resource removed');
        },
    };

})();
