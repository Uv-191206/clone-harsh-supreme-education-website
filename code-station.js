/* ============================================
   Code Station – Interactivity
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

    // ---- Line Numbers sync ----
    const codeEditor = document.getElementById('code-editor');
    const lineNumbers = document.getElementById('line-numbers');
    const updateLineNumbers = () => {
        const lines = codeEditor.value.split('\n').length;
        lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br/>');
    };
    codeEditor.addEventListener('input', updateLineNumbers);
    codeEditor.addEventListener('scroll', () => {
        lineNumbers.scrollTop = codeEditor.scrollTop;
    });
    updateLineNumbers();

    // Handle Tab key
    codeEditor.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;
            this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 2;
            updateLineNumbers();
        }
    });

    // ---- State Management ----
    let snippets = [];
    let currentId = null;

    const defaultSnippets = [
        {
            id: 's1',
            title: 'init_sequence',
            lang: 'javascript',
            code: `function initializeSector(sectorId) {\n  console.log(\`Scanning sector \${sectorId}...\`);\n  for(let i = 0; i < 5; i++) {\n    if(checkAnomalies(i)) {\n      return 'Warning: Anomaly detected';\n    }\n  }\n  return 'Sector clear';\n}\n\ninitializeSector('Alpha-7');`,
            updatedAt: new Date().toISOString()
        },
        {
            id: 's2',
            title: 'warp_drive.py',
            lang: 'python',
            code: `def calc_warp_speed(mass, energy):\n    """Calculate warp traversal velocity"""\n    light_speed = 299792458\n    velocity = (energy / mass) ** 0.5\n    if velocity > light_speed:\n        return "Maximum Warp Achieved!"\n    return f"Sub - light velocity: {velocity} m/s"\n\nprint(calc_warp_speed(1500, 9e18))`,
            updatedAt: new Date(Date.now() - 86400000).toISOString()
        }
    ];

    function loadSnippets() {
        const saved = localStorage.getItem('eduspace_code_station');
        if (saved) {
            try { snippets = JSON.parse(saved); } catch { snippets = []; }
        }
        if (snippets.length === 0) snippets = [...defaultSnippets];
    }

    function saveSnippets() {
        localStorage.setItem('eduspace_code_station', JSON.stringify(snippets));
    }

    // ---- DOM Refs ----
    const snippetList = document.getElementById('snippet-list');
    const searchInput = document.getElementById('search-input');
    const titleInput = document.getElementById('snippet-title');
    const langSelect = document.getElementById('lang-select');
    const saveBtn = document.getElementById('save-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const newBtn = document.getElementById('new-snippet-btn');
    const consoleOut = document.getElementById('console-output');
    const runBtn = document.getElementById('run-btn');

    // ---- Rendering ----
    function renderSidebar() {
        const query = searchInput.value.toLowerCase();
        const filtered = snippets.filter(s => s.title.toLowerCase().includes(query) || s.lang.toLowerCase().includes(query));

        // Sort by recent
        filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        snippetList.innerHTML = '';

        if (filtered.length === 0) {
            snippetList.innerHTML = `<li style="padding:1rem;color:var(--text-mutted);font-size:.8rem;text-align:center;">No sequences found.</li>`;
            return;
        }

        filtered.forEach(s => {
            const li = document.createElement('li');
            li.className = `snippet-item ${currentId === s.id ? 'active' : ''}`;

            const dateStr = new Date(s.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

            li.innerHTML = `
        <div class="snippet-item__title">${s.title}</div>
        <div class="snippet-item__meta">
          <span class="lang-badge">${s.lang}</span>
          <span>${dateStr}</span>
        </div>
      `;
            li.addEventListener('click', () => openSnippet(s.id));
            snippetList.appendChild(li);
        });
    }

    function openSnippet(id) {
        const s = snippets.find(x => x.id === id);
        if (!s) return;

        currentId = s.id;
        titleInput.value = s.title;
        langSelect.value = s.lang;
        codeEditor.value = s.code;
        deleteBtn.style.display = 'block';

        updateLineNumbers();
        renderSidebar();
        logConsole('Sequence loaded: ' + s.title, 'sys');
    }

    function newSnippet() {
        currentId = null;
        titleInput.value = 'Untitled_Sequence';
        langSelect.value = 'javascript';
        codeEditor.value = '';
        deleteBtn.style.display = 'none';
        updateLineNumbers();
        renderSidebar();
        codeEditor.focus();
        logConsole('New sequence initialized.', 'sys');
    }

    // ---- Actions ----
    saveBtn.addEventListener('click', () => {
        const title = titleInput.value.trim() || 'Untitled_Sequence';
        const lang = langSelect.value;
        const code = codeEditor.value;

        if (currentId) {
            const s = snippets.find(x => x.id === currentId);
            if (s) {
                s.title = title;
                s.lang = lang;
                s.code = code;
                s.updatedAt = new Date().toISOString();
                logConsole('Sequence updated successfully.', 'success');
            }
        } else {
            const newId = 's' + Date.now();
            snippets.push({ id: newId, title, lang, code, updatedAt: new Date().toISOString() });
            currentId = newId;
            deleteBtn.style.display = 'block';
            logConsole('New sequence saved to terminal core.', 'success');
        }

        saveSnippets();
        renderSidebar();
    });

    deleteBtn.addEventListener('click', () => {
        if (!currentId) return;
        if (confirm('Erase this sequence from the memory bank?')) {
            snippets = snippets.filter(s => s.id !== currentId);
            saveSnippets();
            newSnippet();
            logConsole('Sequence purged from memory.', 'err');
        }
    });

    searchInput.addEventListener('input', renderSidebar);
    newBtn.addEventListener('click', newSnippet);

    // ---- Fake Run Code ----
    function logConsole(msg, type = '') {
        const span = document.createElement('span');
        span.textContent = '> ' + msg;
        if (type === 'err') span.className = 'err-msg';
        else if (type === 'sys') span.className = 'sys-msg';
        else if (type === 'success') span.className = 'success-msg';

        consoleOut.appendChild(span);
        consoleOut.scrollTop = consoleOut.scrollHeight;
    }

    runBtn.addEventListener('click', () => {
        consoleOut.innerHTML = '';
        logConsole(`Executing sequence: ${titleInput.value}...`, 'sys');

        setTimeout(() => {
            if (codeEditor.value.trim() === '') {
                logConsole('Error: Sequence block is empty.', 'err');
                return;
            }
            logConsole('Compile status: OK', 'success');

            // Look for print/console logs roughly
            const lines = codeEditor.value.split('\n');
            let outputCount = 0;
            lines.forEach(l => {
                if (l.includes('console.log') || l.includes('print(')) {
                    const match = l.match(/['"\`](.*?)['"\`]/);
                    if (match) {
                        logConsole(match[1]);
                        outputCount++;
                    } else {
                        logConsole('[Object output]');
                        outputCount++;
                    }
                }
            });
            if (outputCount === 0) logConsole('Execution finished. (No output generated)', 'sys');
        }, 600);
    });

    // ---- Init ----
    loadSnippets();
    if (snippets.length > 0) openSnippet(snippets[0].id);
    else newSnippet();

})();
