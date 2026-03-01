// Main SPA Application Logic

// Define HTML content for each view
const views = {
    home: `
        <div class="page-header fade-in">
            <h2 class="page-title"><i class="fa-solid fa-satellite-dish glow-text"></i> Command Center</h2>
            <p class="page-subtitle">Welcome aboard, Cadet Explorer. Here is your universe overview.</p>
        </div>
        
        <div class="dashboard-grid fade-in" style="animation-delay: 0.1s;">
            <div class="glass-panel widget-card">
                <i class="fa-solid fa-book-journal-whills widget-icon"></i>
                <h3 style="color: var(--text-secondary)">Missions Completed</h3>
                <div class="widget-value">24</div>
                <button class="btn-secondary" style="margin-top: auto">View Log</button>
            </div>
            
            <div class="glass-panel widget-card" style="background: linear-gradient(145deg, rgba(20,20,45,0.4), rgba(0,243,255,0.05));">
                <i class="fa-solid fa-user-graduate widget-icon" style="color: var(--neon-blue)"></i>
                <h3 style="color: var(--text-secondary)">Experience Points</h3>
                <div class="widget-value glow-text" style="color: var(--neon-blue)">9,402 XP</div>
                <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-top: 1rem;">
                    <div style="width: 75%; height: 100%; background: var(--neon-blue); border-radius: 3px; box-shadow: 0 0 10px var(--neon-blue);"></div>
                </div>
            </div>
            
            <div class="glass-panel widget-card">
                <i class="fa-solid fa-fire-flame-curved widget-icon" style="color: #ff5f56"></i>
                <h3 style="color: var(--text-secondary)">Current Streak</h3>
                <div class="widget-value" style="color: #ff5f56">12 Days</div>
            </div>
        </div>
        
        <div class="glass-panel fade-in" style="margin-top: 2rem; padding: 2rem; animation-delay: 0.2s;">
            <h3><i class="fa-solid fa-rocket"></i> Next Objectives</h3>
            <ul style="list-style: none; margin-top: 1rem; display: flex; flex-direction: column; gap: 1rem;">
                <li style="padding: 1rem; background: rgba(0,0,0,0.3); border-left: 2px solid var(--neon-purple); border-radius: 4px; display: flex; justify-content: space-between;">
                    <span>Complete React Gravity Module</span>
                    <span style="color: var(--neon-purple)">Pending</span>
                </li>
                <li style="padding: 1rem; background: rgba(0,0,0,0.3); border-left: 2px solid var(--neon-blue); border-radius: 4px; display: flex; justify-content: space-between;">
                    <span>Upload Machine Learning Certificate</span>
                    <span style="color: var(--neon-blue)">Action Req</span>
                </li>
            </ul>
        </div>
    `,
    vault: `
        <div class="page-header fade-in">
            <h2 class="page-title"><i class="fa-solid fa-gem glow-text" style="color: var(--neon-purple)"></i> Galaxy Vault</h2>
            <p class="page-subtitle">Store and display your hard-earned credentials and certificates.</p>
        </div>
        
        <div class="glass-panel fade-in" style="padding: 1.5rem; margin-bottom: 2rem; display: flex; gap: 1rem; align-items: center; animation-delay: 0.1s;">
            <input type="text" class="form-input" placeholder="Enter Certificate URL to Archive...">
            <button class="btn-primary"><i class="fa-solid fa-upload"></i> Upload</button>
        </div>

        <div class="vault-grid fade-in" style="animation-delay: 0.2s;">
            <div class="glass-panel cert-card">
                <div class="cert-image"><i class="fa-brands fa-js"></i></div>
                <div class="cert-info">
                    <h3 class="cert-title">Cosmic JavaScript</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">Issued by Nebular Camp</p>
                    <p style="color: var(--neon-blue); font-size: 0.8rem; margin-top: 0.5rem;">Verified ✓</p>
                </div>
            </div>
            <div class="glass-panel cert-card">
                <div class="cert-image"><i class="fa-brands fa-python"></i></div>
                <div class="cert-info">
                    <h3 class="cert-title">Python Data Orbits</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">Issued by AstroCode</p>
                    <p style="color: var(--neon-blue); font-size: 0.8rem; margin-top: 0.5rem;">Verified ✓</p>
                </div>
            </div>
            <div class="glass-panel cert-card" style="border: 1px dashed var(--text-secondary); background: transparent;">
                <div class="cert-image" style="background: transparent;"><i class="fa-solid fa-plus"></i></div>
                <div class="cert-info" style="text-align: center;">
                    <h3 style="color: var(--text-secondary)">Add New</h3>
                </div>
            </div>
        </div>
    `,
    playlist: `
        <div class="page-header fade-in">
            <h2 class="page-title"><i class="fa-solid fa-tv glow-text" style="color: #ff5f56"></i> Orbit Playlist</h2>
            <p class="page-subtitle">Your curated educational video frequency streams.</p>
        </div>
        
        <div class="glass-panel fade-in" style="padding: 1.5rem; margin-bottom: 2rem; display: flex; gap: 1rem; animation-delay: 0.1s;">
            <input type="text" id="yt-link" class="form-input" placeholder="Paste YouTube link here (e.g., https://youtu.be/...)">
            <button class="btn-primary" onclick="addVideo()"><i class="fa-solid fa-plus"></i> Add to Orbit</button>
        </div>

        <div class="playlist-container fade-in" style="animation-delay: 0.2s;">
            <div class="video-player">
                <iframe id="main-player" width="100%" height="100%" src="https://www.youtube.com/embed/jfKfPfyJRdk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            
            <h3 style="margin-top: 1rem;">Saved Frequencies</h3>
            <div class="video-grid" id="video-queue">
                <div class="video-thumb" onclick="playVideo('jfKfPfyJRdk')">
                    <img src="https://img.youtube.com/vi/jfKfPfyJRdk/maxresdefault.jpg" style="width:100%; height:100%; object-fit:cover; opacity: 0.7;">
                    <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:white; font-size:2rem;"><i class="fa-solid fa-play"></i></div>
                </div>
                <div class="video-thumb" onclick="playVideo('WsyUsZ281l8')">
                    <img src="https://img.youtube.com/vi/WsyUsZ281l8/hqdefault.jpg" style="width:100%; height:100%; object-fit:cover; opacity: 0.7;">
                    <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:white; font-size:2rem;"><i class="fa-solid fa-play"></i></div>
                </div>
            </div>
        </div>
    `,
    code: `
        <div class="page-header fade-in">
            <h2 class="page-title"><i class="fa-solid fa-laptop-code glow-text" style="color: #27c93f"></i> Code Station</h2>
            <p class="page-subtitle">Experiment with logic sequences in the quantum terminal.</p>
        </div>
        
        <div class="terminal-window fade-in" style="animation-delay: 0.1s;">
            <div class="terminal-header">
                <div class="terminal-dot dot-red"></div>
                <div class="terminal-dot dot-yellow"></div>
                <div class="terminal-dot dot-green"></div>
                <div class="terminal-title">guest@eduspace: ~/projects/quantum-logic</div>
                <button class="btn-secondary" style="padding: 0.3rem 0.8rem; font-size: 0.8rem;" onclick="saveCode()"><i class="fa-solid fa-floppy-disk"></i> Save</button>
            </div>
            <div class="terminal-body">
                <textarea class="code-editor" id="code-area" spellcheck="false">
// Initiating quantum sequence
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
// Output stream ready...
                </textarea>
            </div>
        </div>
    `,
    share: `
        <div class="page-header fade-in">
            <h2 class="page-title"><i class="fa-solid fa-link glow-text"></i> Share Hub</h2>
            <p class="page-subtitle">Transmit your learning modules to other cadets.</p>
        </div>
        
        <div class="share-container fade-in" style="animation-delay: 0.1s;">
            <div class="glass-panel" style="padding: 3rem; display: inline-block;">
                <div style="font-size: 4rem; color: var(--neon-blue); margin-bottom: 1rem;">
                    <i class="fa-solid fa-satellite-dish"></i>
                </div>
                <h2>Generate Transmission Link</h2>
                <p style="color: var(--text-secondary); margin-top: 1rem;">Share your profile, vault, and playlists in one click.</p>
                
                <div class="share-link-box">
                    <input type="text" id="share-input" class="form-input" value="https://eduspace.app/u/cadet-explorer" readonly>
                    <button class="btn-primary" onclick="copyLink()"><i class="fa-solid fa-copy"></i> Copy</button>
                </div>
                <div id="copy-msg" style="color: var(--neon-blue); margin-top: 1rem; opacity: 0; transition: opacity 0.3s;">
                    Link copied to clipboard!
                </div>
            </div>
        </div>
    `,
    about: `
        <div class="page-header fade-in">
            <h2 class="page-title"><i class="fa-solid fa-meteor glow-text" style="color: var(--neon-purple)"></i> About Mission</h2>
            <p class="page-subtitle">The story behind the EduSpace initiative.</p>
        </div>
        
        <div class="glass-panel fade-in" style="padding: 2.5rem; max-width: 800px; animation-delay: 0.1s; line-height: 1.8; font-size: 1.1rem;">
            <h3 style="color: var(--neon-blue); margin-bottom: 1rem; font-size: 1.5rem;">Mission Briefing</h3>
            <p style="margin-bottom: 1.5rem;">
                EduSpace was created with a singular vision: to make learning not just a task, but an intergalactic adventure. We believe that the environment dictates the experience, and what's more awe-inspiring than the cosmos?
            </p>
            <p style="margin-bottom: 1.5rem;">
                This platform is designed for students seeking a sanctuary to organize their knowledge universe. From tracking your completed modules to hoarding certificates in your Vault, and experimenting in the Code Station.
            </p>
            <div style="display: flex; gap: 2rem; margin-top: 2rem; border-top: 1px solid var(--glass-border); padding-top: 2rem;">
                <div>
                    <h4 style="color: var(--text-secondary);">Current Version</h4>
                    <p style="font-family: var(--font-head); font-weight: 700;">v1.0.0 (Orion Release)</p>
                </div>
                <div>
                    <h4 style="color: var(--text-secondary);">System Status</h4>
                    <p style="color: #27c93f; font-family: var(--font-head); font-weight: 700;">Operational</p>
                </div>
            </div>
        </div>
    `
};

// Router Function
function loadView(route) {
    const container = document.getElementById('app-container');
    
    // Default to home if route not found
    if (!views[route]) route = 'home';
    
    // Inject HTML view
    container.innerHTML = views[route];
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.route === route) {
            link.classList.add('active');
        }
    });

    // Update URL hash without jumping
    window.location.hash = route;
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Check initial hash or default to home
    const initialRoute = window.location.hash.replace('#', '') || 'home';
    loadView(initialRoute);
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => {
        const route = window.location.hash.replace('#', '');
        loadView(route);
    });
});

// View Specific Functions

// Orbit Playlist Functions
window.addVideo = function() {
    const input = document.getElementById('yt-link');
    const queue = document.getElementById('video-queue');
    const url = input.value;
    
    // Extract video ID from common youtube url formats
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    
    if (match && match[1]) {
        const vidId = match[1];
        
        // Add thumbnail to queue
        const thumbHTML = \`
            <div class="video-thumb fade-in" onclick="playVideo('\${vidId}')">
                <img src="https://img.youtube.com/vi/\${vidId}/hqdefault.jpg" style="width:100%; height:100%; object-fit:cover; opacity: 0.7;">
                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:white; font-size:2rem;"><i class="fa-solid fa-play"></i></div>
            </div>
        \`;
        
        queue.insertAdjacentHTML('beforeend', thumbHTML);
        
        // Play the video and clear input
        playVideo(vidId);
        input.value = '';
    } else {
        alert('Invalid YouTube URL. Please transmit a valid frequency link.');
    }
};

window.playVideo = function(vidId) {
    const player = document.getElementById('main-player');
    if (player) {
        player.src = \`https://www.youtube.com/embed/\${vidId}?autoplay=1\`;
    }
};

// Code Station Functions
window.saveCode = function() {
    const btn = document.querySelector('.terminal-header .btn-secondary');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Saved';
    btn.style.color = '#27c93f';
    btn.style.borderColor = '#27c93f';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.color = '';
        btn.style.borderColor = '';
    }, 2000);
};

// Share Hub Functions
window.copyLink = function() {
    const input = document.getElementById('share-input');
    input.select();
    document.execCommand('copy');
    
    const msg = document.getElementById('copy-msg');
    msg.style.opacity = '1';
    
    setTimeout(() => {
        msg.style.opacity = '0';
    }, 3000);
};
