document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Simulation State
    const urlParams = new URLSearchParams(window.location.search);
    const language = urlParams.get('language') || 'es';

    // Apply Translations
    if (window.TRANSLATIONS && window.TRANSLATIONS[language]) {
        const t = window.TRANSLATIONS[language].live;

        const safeSetText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };
        const safeSetPlaceholder = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.placeholder = text;
        };

        safeSetText('live-badge', t.badge_live);
        safeSetText('mask-label', t.mask_label);
        safeSetText('end-stream-btn', t.btn_end);
        safeSetText('slow-mode-indicator', t.slow_mode);
        safeSetText('modal-title', t.modal_title);
        safeSetText('modal-desc', t.modal_desc);
        safeSetText('setup-title', t.setup_title);
        safeSetText('setup-desc', t.setup_desc);
        safeSetText('start-stream-btn', t.setup_btn);

        safeSetPlaceholder('chat-input', t.placeholder_chat);
        safeSetPlaceholder('username-input', t.setup_placeholder);
    }

    const simState = new SimState();
    const slowModeIndicator = document.querySelector('.slow-mode-indicator');

    simState.onChange((isSlowMode) => {
        if (slowModeIndicator) {
            slowModeIndicator.style.display = isSlowMode ? 'block' : 'none';
        }
    });

    // 2. Initialize Stats (Views, Timer, Hearts)
    const stats = new StreamStats(simState);

    // Register TikTok specific view elements
    const standardOverlayView = document.querySelector('.overlay span');
    const tiktokViewText = document.getElementById('view-count-text');
    stats.registerViewElement(standardOverlayView);
    stats.registerViewElement(tiktokViewText);

    // Register Heart Elements
    const standardHeartCounter = document.querySelector('.heart-counter');
    const tiktokLikes = document.querySelector('.tiktok-likes');

    // Custom updater for TikTok likes to handle "k" formatting specifically if needed, 
    // or just rely on the event if we want strict separation. 
    // For now, let's manually listen to the event for custom UI updates or just update text content here if simple.
    // Actually, let's use the event listener approach for cleaner separation in the future, 
    // but for now, we can just hook into the stats update if we exposed a callback?
    // The CommonJS StreamStats dispatches 'heartsUpdated'.
    document.addEventListener('heartsUpdated', (e) => {
        const { count, formatted } = e.detail;
        if (standardHeartCounter) standardHeartCounter.textContent = `${count} ❤️`;
        if (tiktokLikes) {
            // TikTok specific formatting often prefers "1.2k" style which 'formatted' provides
            tiktokLikes.textContent = `🤍 ${formatted}`;
        }
    });

    // 3. Initialize Camera
    const camera = new StreamCamera();
    window.switchCamera = () => camera.switchCamera();
    window.switchMask = () => camera.switchMask();

    // 4. Initialize Chat
    const category = urlParams.get('category') || 'general';
    const chat = new StreamChat(simState, language, category);

    // 5. Initialize Security Modal
    const security = new SecurityModal();
    window.confirmEndStream = () => security.open();
    window.closeSecurityModal = () => security.close();
    window.pressKey = (key) => security.handleKey(key);

    // 6. Setup Overlay (Start Stream) Logic
    const setupOverlay = document.getElementById('setup-overlay');
    const usernameInput = document.getElementById('username-input');
    const startStreamBtn = document.getElementById('start-stream-btn');
    const tiktokUsernameDisplay = document.querySelector('.tiktok-username');

    if (startStreamBtn && setupOverlay) {
        startStreamBtn.addEventListener('click', () => {
            // Attempt fullscreen
            const docEl = document.documentElement;
            if (docEl.requestFullscreen) docEl.requestFullscreen().catch(() => { });
            else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();

            // Set Name
            const name = usernameInput.value.trim() || "Streamer";
            if (tiktokUsernameDisplay) tiktokUsernameDisplay.textContent = name;

            // Hide Setup
            setupOverlay.style.display = 'none';

            // Start Camera
            camera.start();
        });
    }

    // Set Theme
    const template = urlParams.get('template') || 'tiktok';
    document.body.classList.add(`theme-${template}`);
});
