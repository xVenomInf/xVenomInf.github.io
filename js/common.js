/**
 * Common Logic for Stream Simulation
 * Contains shared classes for Camera, Chat, Stats, and Security.
 */

// --- UTILS ---
const Utils = {
    getRandomElement: (array) => array[Math.floor(Math.random() * array.length)],

    pad: (val) => val.toString().padStart(2, '0'),

    formatCount: (count) => {
        if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
        if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
        return Math.floor(count).toString();
    }
};

// --- SIMULATION STATE ---
class SimulationState {
    constructor() {
        this.chatDelayMin = 500;
        this.chatDelayMax = 2500;
        this.heartSpawnChance = 0.3;
        this.listeners = [];
    }

    update(viewCount) {
        let newState = {};
        if (viewCount > 10000) {
            // > 10k Views: Slow Chat, Fast Hearts
            newState = { chatDelayMin: 2000, chatDelayMax: 5000, heartSpawnChance: 0.8, slowMode: true };
        } else if (viewCount < 3000) {
            // < 3k Views: Intense Chat, Normal Hearts
            newState = { chatDelayMin: 200, chatDelayMax: 800, heartSpawnChance: 0.3, slowMode: false };
        } else {
            // 3k - 10k: Normal
            newState = { chatDelayMin: 500, chatDelayMax: 2500, heartSpawnChance: 0.4, slowMode: false };
        }

        this.chatDelayMin = newState.chatDelayMin;
        this.chatDelayMax = newState.chatDelayMax;
        this.heartSpawnChance = newState.heartSpawnChance;

        this.notifyListeners(newState.slowMode);
    }

    onChange(callback) {
        this.listeners.push(callback);
    }

    notifyListeners(slowMode) {
        this.listeners.forEach(cb => cb(slowMode));
    }
}

// --- STREAM STATS (Views, Timer, Hearts) ---
class StreamStats {
    constructor(simulationState) {
        this.state = simulationState;
        this.viewCount = 150;
        this.totalHearts = 0;
        this.heartContainer = document.querySelector('.floating-hearts-container');

        // Timer
        this.timerElement = document.getElementById('live-timer');
        this.totalSeconds = 0;

        // Views Elements (can be multiple)
        this.viewElements = [];

        // Heart Elements
        this.heartElements = [];

        this.init();
    }

    init() {
        // Parse URL params
        const urlParams = new URLSearchParams(window.location.search);
        this.viewCount = parseInt(urlParams.get('views')) || 0;
        this.initialViewCount = this.viewCount; // Store minimum bound
        const requestedTimeMin = parseInt(urlParams.get('time')) || 60;
        this.totalSeconds = requestedTimeMin * 60;

        // Timer Loop
        if (this.timerElement) {
            setInterval(() => {
                this.totalSeconds++;
                this.updateTimerDisplay();
            }, 1000);
            this.updateTimerDisplay();
        }

        // View Count Loops
        // 1. Small fluctuations every 3 seconds (Slower than before)
        setInterval(() => this.updateViewCount(false), 3000);

        // 2. Larger jumps every 15 seconds
        setInterval(() => this.updateViewCount(true), 15000);

        // Hearts Loop
        this.heartLoop();
    }

    registerViewElement(element) {
        if (element) this.viewElements.push(element);
        this.updateViewDisplays(); // Initial update
    }

    registerHeartElement(element) {
        if (element) this.heartElements.push(element);
        this.updateHeartDisplays(); // Initial update
    }

    updateTimerDisplay() {
        if (!this.timerElement) return;
        const h = Math.floor(this.totalSeconds / 3600);
        const m = Math.floor((this.totalSeconds % 3600) / 60);
        const s = this.totalSeconds % 60;

        let timeStr = `${Utils.pad(m)}:${Utils.pad(s)}`;
        if (h > 0) timeStr = `${Utils.pad(h)}:${timeStr}`;
        this.timerElement.textContent = timeStr;
    }

    updateViewCount(isBigJump = false) {
        // Fix: If 0, force start
        if (this.viewCount === 0) {
            this.viewCount = Math.floor(Math.random() * 5) + 1; // 1-5 starting views
            this.updateViewDisplays();
            this.state.update(this.viewCount);
            return;
        }

        let changePercent;
        if (isBigJump) {
            // Big jump: 5-15% change
            changePercent = (Math.random() * 0.10) + 0.05;
        } else {
            // Small fluctuation: 1-3% change
            changePercent = (Math.random() * 0.02) + 0.01;
        }

        // 60% chance to go up, 40% to go down
        const direction = Math.random() < 0.6 ? 1 : -1;

        const change = Math.floor(this.viewCount * changePercent * direction);
        let newCount = this.viewCount + change;

        // Fix: Enforce minimum bound (initial input)
        if (this.initialViewCount > 0 && newCount < this.initialViewCount) {
            // Bounce back slightly above min
            newCount = this.initialViewCount + Math.floor(Math.random() * (this.initialViewCount * 0.05));
        }

        // Never below 0
        this.viewCount = Math.max(0, newCount);

        this.updateViewDisplays();
        this.state.update(this.viewCount);
    }

    updateViewDisplays() {
        const formatted = Utils.formatCount(this.viewCount);
        this.viewElements.forEach(el => {
            // Check if element expects prefix/suffix based on class or just text
            // Simple text update for now, can be enhanced
            if (el.tagName === 'SPAN' || el.tagName === 'DIV') {
                // specific handling for TikTok formatted spans vs raw numbers could go here
                // For now, we assume the element just needs the number or we let the specific script handle formatting?
                // Let's pass the raw string and let CSS/template handle layout, or do simple text replacement.
                el.textContent = formatted;
            }
        });
    }

    createHeart() {
        if (!this.heartContainer) return;
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.textContent = '❤️';
        const randomX = (Math.random() - 0.5) * 40;
        heart.style.transform = `translateX(${randomX}px)`;
        const scale = Math.random() * 0.5 + 0.8;
        const duration = Math.random() * 2 + 2;
        heart.style.animationDuration = `${duration}s`;
        this.heartContainer.appendChild(heart);

        this.totalHearts++;
        this.updateHeartDisplays();

        setTimeout(() => {
            if (this.heartContainer.contains(heart)) {
                this.heartContainer.removeChild(heart);
            }
        }, duration * 1000);
    }

    updateHeartDisplays() {
        const formatted = Utils.formatCount(this.totalHearts);
        this.heartElements.forEach(el => {
            // Custom logic for different display types?
            // For now, we'll emit a custom event or just require the element to be passed with a callback?
            // Simplest: The specific JS sets the text content pattern.
            // We can store a callback instead of an element if we want custom formatting.
            // Or we just update textContent.
        });

        // Dispatch event for custom formatting in specific templates
        document.dispatchEvent(new CustomEvent('heartsUpdated', { detail: { count: this.totalHearts, formatted } }));
    }

    heartLoop() {
        if (Math.random() < this.state.heartSpawnChance) {
            this.createHeart();
        }
        setTimeout(() => this.heartLoop(), 100);
    }
}

// --- CAMERA & MASKS ---
class StreamCamera {
    constructor() {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('overlay-canvas');
        this.context = this.canvas ? this.canvas.getContext('2d') : null;
        this.currentFacingMode = "user";
        this.currentStream = null;
        this.model = null;
        this.maskIndex = 0;
        this.totalMasks = 8;

        // Mask smoothing
        this.lastRect = null;
        this.persistenceFrames = 0;

        this.init();
    }

    async init() {
        if (!this.video) return;

        // Load BlazeFace
        try {
            console.log("Loading BlazeFace...");
            this.model = await blazeface.load();
            console.log("BlazeFace loaded.");
        } catch (err) {
            console.error("Error loading BlazeFace:", err);
        }

        // Handle resize
        window.addEventListener('resize', () => this.updateCanvasSize());
        this.updateCanvasSize();
    }

    updateCanvasSize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    async start() {
        if (this.currentStream) {
            this.currentStream.getTracks().forEach(track => track.stop());
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: this.currentFacingMode }
            });
            this.currentStream = stream;
            if (this.video) {
                this.video.srcObject = stream;
                this.updateMirror();
                this.video.onloadedmetadata = () => {
                    this.video.play();
                    this.startTracking();
                };
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Error al acceder a la cámara: " + error.message);
        }
    }

    updateMirror() {
        if (this.currentFacingMode === "user") {
            this.video.style.transform = "scaleX(-1)";
        } else {
            this.video.style.transform = "scaleX(1)";
        }
    }

    switchCamera() {
        this.currentFacingMode = this.currentFacingMode === "user" ? "environment" : "user";
        this.start();
    }

    switchMask() {
        this.maskIndex = (this.maskIndex + 1) % this.totalMasks;
        console.log("Switched to mask:", this.maskIndex);
    }

    startTracking() {
        if (!this.model || !this.context) return;

        setInterval(async () => {
            if (this.video.readyState < 2) return;

            const predictions = await this.model.estimateFaces(this.video, false);
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            if (predictions.length > 0) {
                this.drawMask(predictions[0]);
            } else {
                this.handleNoFace();
            }
        }, 100);
    }

    drawMask(prediction) {
        const landmarks = prediction.landmarks;
        const rightEye = landmarks[0];
        const leftEye = landmarks[1];
        const nose = landmarks[2];

        // Mapping logic
        const vidW = this.video.videoWidth;
        const vidH = this.video.videoHeight;
        const screenW = this.canvas.width;
        const screenH = this.canvas.height;

        const scale = Math.max(screenW / vidW, screenH / vidH);
        const xOffset = (screenW - vidW * scale) / 2;
        const yOffset = (screenH - vidH * scale) / 2;

        const mapPoint = (p) => {
            const x = p[0] * scale + xOffset;
            const y = p[1] * scale + yOffset;
            return { x: screenW - x, y: y }; // Mirror X
        };

        const rEye = mapPoint(rightEye);
        const lEye = mapPoint(leftEye);
        const nPos = mapPoint(nose);

        const centerX = (rEye.x + lEye.x) / 2;
        const centerY = (rEye.y + lEye.y) / 2;
        const dx = rEye.x - lEye.x;
        const dy = rEye.y - lEye.y;
        const angle = Math.atan2(dy, dx);
        const eyeDist = Math.sqrt(dx * dx + dy * dy);

        // Yaw & Pitch approx
        const yaw = (nPos.x - centerX) / (eyeDist * 0.5);
        const pitch = ((nPos.y - centerY) / eyeDist) - 0.4;

        const targetMask = {
            x: centerX,
            y: centerY,
            angle: angle,
            width: eyeDist * 2.8,
            height: eyeDist * 1.5,
            yaw: yaw,
            pitch: pitch
        };

        // Smooth
        const smoothing = 0.5;
        if (this.lastRect) {
            this.lastRect.x += (targetMask.x - this.lastRect.x) * smoothing;
            this.lastRect.y += (targetMask.y - this.lastRect.y) * smoothing;
            this.lastRect.angle += (targetMask.angle - this.lastRect.angle) * smoothing;
            this.lastRect.width += (targetMask.width - this.lastRect.width) * smoothing;
            this.lastRect.height += (targetMask.height - this.lastRect.height) * smoothing;
            this.lastRect.yaw += (targetMask.yaw - (this.lastRect.yaw || 0)) * smoothing;
            this.lastRect.pitch += (targetMask.pitch - (this.lastRect.pitch || 0)) * smoothing;
            this.persistenceFrames = 20;
        } else {
            this.lastRect = targetMask;
            this.persistenceFrames = 20;
        }

        if (typeof ARMasks !== 'undefined') {
            ARMasks.draw(this.context, this.lastRect, this.maskIndex, false);
        }
    }

    handleNoFace() {
        if (this.persistenceFrames > 0 && this.lastRect) {
            this.persistenceFrames--;
            if (typeof ARMasks !== 'undefined') {
                ARMasks.draw(this.context, this.lastRect, this.maskIndex, true);
            }
        } else {
            this.lastRect = null;
        }
    }
}

// --- CHAT SYSTEM ---
class StreamChat {
    constructor(simulationState, language = 'es', category = 'general') {
        this.state = simulationState;
        this.language = language;
        this.category = category;
        this.translations = (window.TRANSLATIONS && window.TRANSLATIONS[language]) ? window.TRANSLATIONS[language].common : { you: "Tú" };

        this.container = document.querySelector('.chat-overlay');
        this.input = document.getElementById('chat-input');
        this.sendBtn = document.querySelector('.send-btn');
        this.names = [
            "Carlos", "María", "Juan", "Lucía", "Pedro", "Ana", "Sofía", "Miguel", "Elena", "David",
            "Laura", "Daniel", "Carmen", "Alejandro", "Paula", "Manuel", "Isabel", "Javier", "Marta",
            "Francisco", "John", "Emily", "Michael", "Sarah", "Hans", "Anna", "Pierre", "Sophie",
            "Giovanni", "Chiara", "Yuki", "Hiroshi"
        ];
        this.activeUsers = []; // Store recent users for mentions
        this.init();
    }

    init() {
        this.loadMessages();
        this.generateRandomMessages();

        if (this.input) {
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleUserMessage();
            });
        }
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.handleUserMessage());
        }
    }

    loadMessages() {
        if (!window.CHAT_DATA) return;

        const langData = window.CHAT_DATA[this.language] || window.CHAT_DATA['es'];

        // Load messages based on category
        if (this.category === 'general') {
            this.messages = langData.general || [];
        } else {
            const specific = langData[this.category] || [];
            const general = langData.general || [];
            this.messages = specific.concat(general);
        }

        // Fallback
        if (!this.messages || this.messages.length === 0) this.messages = ["Hola!", "Hello!"];

        // Setup foreign messages (10% chance)
        this.foreignMessages = [];
        const otherLangs = Object.keys(window.CHAT_DATA).filter(l => l !== this.language);
        if (otherLangs.length > 0) {
            otherLangs.forEach(lang => {
                const fData = window.CHAT_DATA[lang];
                if (fData) {
                    if (this.category === 'general') {
                        if (fData.general) this.foreignMessages = this.foreignMessages.concat(fData.general);
                    } else {
                        if (fData[this.category]) this.foreignMessages = this.foreignMessages.concat(fData[this.category]);
                        if (fData.general) this.foreignMessages = this.foreignMessages.concat(fData.general);
                    }
                }
            });
        }
    }

    getRandomMessage() {
        if (!this.messages) return "Hello!";

        // 10% chance for foreign message
        if (this.foreignMessages.length > 0 && Math.random() < 0.1) {
            return Utils.getRandomElement(this.foreignMessages);
        }
        return Utils.getRandomElement(this.messages);
    }

    getRandomName() {
        return Utils.getRandomElement(this.names);
    }

    createMessageElement(name, text, isUser = false) {
        const container = document.createElement('div');
        container.className = `chat-message ${isUser ? 'user-message' : ''}`;

        const avatarId = isUser ? "user_" + Date.now() : Math.floor(Math.random() * 1000);
        const avatar = document.createElement('img');
        avatar.src = `https://picsum.photos/seed/${avatarId}/200/200`;
        avatar.className = 'chat-avatar';

        const content = document.createElement('div');
        content.className = 'chat-content';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'chat-name';
        nameSpan.textContent = name;

        const textSpan = document.createElement('span');
        textSpan.className = 'chat-text';
        textSpan.textContent = text;

        // Store user as active for potential reply later
        if (!isUser) {
            this.addToActiveUsers(name);
        }

        content.appendChild(nameSpan);
        content.appendChild(textSpan);
        container.appendChild(avatar);
        container.appendChild(content);

        return container;
    }

    addToActiveUsers(name) {
        this.activeUsers.push(name);
        if (this.activeUsers.length > 20) this.activeUsers.shift();
    }

    addMessage(element) {
        if (!this.container) return;
        this.container.appendChild(element);

        // Prune old messages
        const msgs = Array.from(this.container.children).filter(el => el.classList.contains('chat-message'));
        if (msgs.length > 7) {
            this.container.removeChild(msgs[0]);
        }
        this.container.scrollTop = this.container.scrollHeight;
    }

    generateRandomMessages() {
        if (!this.container) return;

        const name = this.getRandomName();
        let text = this.getRandomMessage();

        // Interaction Logic: Reply or Mention
        // 15% chance to mention someone active
        if (this.activeUsers.length > 0 && Math.random() < 0.15) {
            const target = Utils.getRandomElement(this.activeUsers);
            if (target !== name) {
                text = `@${target} ${text}`;
            }
        }

        const msgEl = this.createMessageElement(name, text);
        this.addMessage(msgEl);

        const delay = Math.random() * (this.state.chatDelayMax - this.state.chatDelayMin) + this.state.chatDelayMin;
        setTimeout(() => this.generateRandomMessages(), delay);
    }

    handleUserMessage() {
        const text = this.input.value.trim();
        if (text) {
            const msgEl = this.createMessageElement(this.translations.you, text, true);
            this.addMessage(msgEl);
            this.input.value = '';
        }
    }
}

// --- SECURITY MODAL ---
class SecurityModal {
    constructor() {
        this.overlay = document.getElementById('security-modal-overlay');
        this.display = document.getElementById('typed-code-display');
        this.content = document.querySelector('.security-modal');
        this.code = '0000';
        this.inputParams = '';
    }

    open() {
        this.inputParams = '';
        if (this.display) this.display.textContent = '';
        if (this.overlay) this.overlay.style.display = 'flex';
    }

    close() {
        if (this.overlay) this.overlay.style.display = 'none';
        // Logic to actually end stream could go here or be a callback
        // For now, "closing" the modal IS the success state in the simulation context 
        // OR we redirect if that was the goal. The original code just closed it on success.
    }

    handleKey(key) {
        if (key === 'delete') {
            this.inputParams = this.inputParams.slice(0, -1);
        } else if (this.inputParams.length < 4) {
            this.inputParams += key;
        }

        if (this.display) {
            this.display.textContent = '*'.repeat(this.inputParams.length);
        }

        if (this.inputParams.length === 4) {
            this.verify();
        }
    }

    verify() {
        if (this.inputParams === this.code) {
            setTimeout(() => this.close(), 300);
            // Optionally Dispatch 'streamEnded' event
            window.location.href = 'index.html'; // Redirect to home/setup on success?
            // Or just close for now as per original behavior which seemed to just simulate the security check.
            // Actually original code just closed it. Let's redirect to index for "Ending".
        } else {
            if (this.content) {
                this.content.classList.add('modal-vibrate');
                setTimeout(() => this.content.classList.remove('modal-vibrate'), 300);
            }
            setTimeout(() => {
                this.inputParams = '';
                if (this.display) this.display.textContent = '';
            }, 400);
        }
    }
}

// Export classes to global scope
window.SimState = SimulationState;
window.StreamStats = StreamStats;
window.StreamCamera = StreamCamera;
window.StreamChat = StreamChat;
window.SecurityModal = SecurityModal;
window.Utils = Utils;
