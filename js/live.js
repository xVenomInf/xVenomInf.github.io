document.addEventListener('DOMContentLoaded', () => {
    // Globals for simulation state
    let currentChatDelayMin = 500;
    let currentChatDelayMax = 2500;
    let currentHeartSpawnChance = 0.3; // 30% per tick

    // Setup Overlay Logic
    const setupOverlay = document.getElementById('setup-overlay');
    const usernameInput = document.getElementById('username-input');
    const startStreamBtn = document.getElementById('start-stream-btn');
    const tiktokUsernameDisplay = document.querySelector('.tiktok-username');

    if (startStreamBtn && setupOverlay) {
        startStreamBtn.addEventListener('click', () => {
            // Attempt to go fullscreen
            const docEl = document.documentElement;
            if (docEl.requestFullscreen) {
                docEl.requestFullscreen().catch(err => console.log("Fullscreen not allowed:", err));
            } else if (docEl.webkitRequestFullscreen) { /* Safari */
                docEl.webkitRequestFullscreen();
            } else if (docEl.msRequestFullscreen) { /* IE11 */
                docEl.msRequestFullscreen();
            }

            const name = usernameInput.value.trim() || "Streamer";
            if (tiktokUsernameDisplay) tiktokUsernameDisplay.textContent = name;
            setupOverlay.style.display = 'none';
            startCamera(); // Start camera only after name is set
        });
    }

    // View Count Logic
    const overlaySpan = document.querySelector('.overlay span'); // Standard overlay
    const urlParams = new URLSearchParams(window.location.search);
    let viewCount = parseInt(urlParams.get('views')) || 150; // Default 150
    const viewCountSpan = document.getElementById('view-count-text'); // TikTok specific

    // Timer Logic
    const requestedTimeMin = parseInt(urlParams.get('time')) || 60; // Default 60 min
    const liveTimerSpan = document.getElementById('live-timer');
    let totalSeconds = requestedTimeMin * 60;

    function pad(val) { return val.toString().padStart(2, '0'); }

    function updateTimerDisplay() {
        if (!liveTimerSpan) return;
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        let timeStr = `${pad(m)}:${pad(s)}`;
        if (h > 0) {
            timeStr = `${pad(h)}:${timeStr}`;
        }
        liveTimerSpan.textContent = timeStr;
    }

    // Start timer ticking up
    setInterval(() => {
        totalSeconds++;
        updateTimerDisplay();
    }, 1000);
    updateTimerDisplay();

    // Theme Logic
    const template = urlParams.get('template') || 'tiktok';
    document.body.classList.add(`theme-${template}`);
    // Slow mode indicator
    const slowModeIndicator = document.querySelector('.slow-mode-indicator');

    function updateSimulationState() {
        if (viewCount > 10000) {
            // > 10k Views: Slow Chat, Fast Hearts
            currentChatDelayMin = 2000;
            currentChatDelayMax = 5000;
            currentHeartSpawnChance = 0.8;
            if (slowModeIndicator) slowModeIndicator.style.display = 'block';
        } else if (viewCount < 3000) {
            // < 3k Views: Intense Chat, Normal Hearts
            currentChatDelayMin = 200;
            currentChatDelayMax = 800;
            currentHeartSpawnChance = 0.3;
            if (slowModeIndicator) slowModeIndicator.style.display = 'none';
        } else {
            // 3k - 10k: Normal
            currentChatDelayMin = 500;
            currentChatDelayMax = 2500;
            currentHeartSpawnChance = 0.4;
            if (slowModeIndicator) slowModeIndicator.style.display = 'none';
        }
    }

    if (overlaySpan) {
        function formatViewCount(count) {
            if (count >= 1000) {
                return (count / 1000).toFixed(1) + 'k';
            }
            return Math.floor(count).toString();
        }

        overlaySpan.textContent = formatViewCount(viewCount);
        if (viewCountSpan) viewCountSpan.textContent = formatViewCount(viewCount);
        updateSimulationState();

        function updateViewCount() {
            // Fluctuation logic based on magnitude
            let magnitude;
            if (viewCount >= 10000) {
                magnitude = 0.05; // 5% fluctuation for 10k+
            } else if (viewCount >= 1000) {
                magnitude = 0.1; // 10% fluctuation for 1k-10k
            } else if (viewCount >= 100) {
                magnitude = 0.2; // 20% fluctuation for 100-1k
            } else {
                magnitude = 0.5; // 50% fluctuation for <100
            }

            const change = Math.floor(viewCount * magnitude * (Math.random() - 0.5) * 2); // +/- magnitude
            viewCount = Math.max(0, viewCount + change);
            const formatted = formatViewCount(viewCount);
            overlaySpan.textContent = formatted;
            if (viewCountSpan) viewCountSpan.textContent = formatted; // Updated

            updateSimulationState();
        }
        setInterval(updateViewCount, 2000);
    }

    // Heart Counter
    const heartCounter = document.querySelector('.heart-counter');
    const tiktokLikes = document.querySelector('.tiktok-likes'); // New TikTok element
    let totalHearts = 0;
    function updateHeartCounter() {
        if (heartCounter) {
            heartCounter.textContent = `${totalHearts} ❤️`;
        }
        if (tiktokLikes) {
            let formattedHearts = totalHearts;
            if (totalHearts >= 1000) {
                formattedHearts = (totalHearts / 1000).toFixed(1) + 'k';
            }
            tiktokLikes.textContent = `🤍 ${formattedHearts}`;
        }
    }
    updateHeartCounter();

    // Camera
    const video = document.getElementById('video');
    const canvas = document.getElementById('overlay-canvas');
    const context = canvas ? canvas.getContext('2d') : null;
    let currentFacingMode = "user"; // "user" or "environment"
    let currentStream = null;

    window.switchCamera = function () {
        currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
        startCamera();
    };

    async function startCamera() {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: currentFacingMode }
            });
            currentStream = stream;
            if (video) {
                video.srcObject = stream;
                // Mirror effect logic based on camera
                if (currentFacingMode === "user") {
                    video.style.transform = "scaleX(-1)";
                } else {
                    video.style.transform = "scaleX(1)";
                }

                video.onloadedmetadata = () => {
                    video.play();
                    startTracking();
                };
            }
        } catch (error) {
            console.error("Error accessing the camera:", error);
            alert("Error al acceder a la cámara: " + error.message);
        }
    }


    // Mask State
    let currentMaskIndex = 0;
    const TOTAL_MASKS = 8; // 0:Carnival, 1:Hero, 2:Cyber, 3:Anon, 4:Hat, 5:VR, 6:Pixel, 7:None

    window.switchMask = function () {
        currentMaskIndex = (currentMaskIndex + 1) % TOTAL_MASKS;
        console.log("Switched to mask:", currentMaskIndex);
    };

    async function startTracking() {
        if (!video || !canvas || !context) return;

        // Match canvas size to video size
        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        let model = null;
        try {
            console.log("Loading BlazeFace...");
            model = await blazeface.load();
            console.log("BlazeFace loaded.");
        } catch (err) {
            console.error("Error loading BlazeFace:", err);
            return;
        }

        // Smoothing variables
        let lastRect = null;
        let persistenceFrames = 0;
        const maxPersistence = 20; // ~2 seconds at 100ms interval
        const smoothingFactor = 0.5;

        // Detection loop
        setInterval(async () => {
            if (!model || video.readyState < 2) return;

            // Estimate faces
            const returnTensors = false;
            const predictions = await model.estimateFaces(video, returnTensors);

            context.clearRect(0, 0, canvas.width, canvas.height);

            if (predictions.length > 0) {
                const pred = predictions[0];
                const landmarks = pred.landmarks; // [x, y] for each point

                // BlazeFace landmarks: 0=RightEye, 1=LeftEye, 2=Nose, 3=Mouth, 4=RightEar, 5=LeftEar
                const rightEye = landmarks[0];
                const leftEye = landmarks[1];
                const nose = landmarks[2];

                // Coordinate Mapping for object-fit: cover
                const vidW = video.videoWidth;
                const vidH = video.videoHeight;
                const screenW = canvas.width;
                const screenH = canvas.height;

                const scale = Math.max(screenW / vidW, screenH / vidH);
                const xOffset = (screenW - vidW * scale) / 2;
                const yOffset = (screenH - vidH * scale) / 2;

                // Function to map and mirror a point
                const mapPoint = (p) => {
                    const x = p[0] * scale + xOffset;
                    const y = p[1] * scale + yOffset;
                    // Mirror X
                    return { x: screenW - x, y: y };
                };

                const rEye = mapPoint(rightEye);
                const lEye = mapPoint(leftEye);
                const nPos = mapPoint(nose);

                // Calculate center, angle, and size
                const centerX = (rEye.x + lEye.x) / 2;
                const centerY = (rEye.y + lEye.y) / 2;
                const dx = rEye.x - lEye.x;
                const dy = rEye.y - lEye.y;
                const angle = Math.atan2(dy, dx);
                const eyeDist = Math.sqrt(dx * dx + dy * dy);

                // 3D Angle Estimation
                // Yaw: Turn Left/Right. Nose deviation from eye center X.
                // Scaled by eyeDist to be size-invariant.
                // Standard: Nose is centered. Deviation / Size gives angle.
                // Range approx -1 to 1.
                const yaw = (nPos.x - centerX) / (eyeDist * 0.5);

                // Pitch: Tilt Up/Down. Nose deviation from eye center Y (corrected for roll).
                // Simple approx: Nose Y vs Eye Y.
                // We use a baseline ratio. Typically nose is below eyes.
                // If distance decreases, Looking UP. If increases, Looking DOWN.
                // Use perpendicular distance from nose to eye-line? Too complex for now.
                // Simple: (Nose.y - Center.y) / EyeDist.
                const pitchRaw = (nPos.y - centerY) / eyeDist;
                // Baseline might be ~0.3 or 0.4. Subtract baseline to get deviation.
                const pitch = pitchRaw - 0.4;

                // Mask properties
                const maskWidth = eyeDist * 2.8;
                const maskHeight = eyeDist * 1.5;

                // Use smoothing on the mask properties
                const targetMask = {
                    x: centerX, // Anchor at eye center or nose? Stick to eye center for stability.
                    y: centerY,
                    angle: angle,
                    width: maskWidth,
                    height: maskHeight,
                    yaw: yaw,
                    pitch: pitch
                };

                if (lastRect) {
                    // Smooth interpolation
                    lastRect.x += (targetMask.x - lastRect.x) * smoothingFactor;
                    lastRect.y += (targetMask.y - lastRect.y) * smoothingFactor;
                    lastRect.angle += (targetMask.angle - lastRect.angle) * smoothingFactor;
                    lastRect.width += (targetMask.width - lastRect.width) * smoothingFactor;
                    lastRect.height += (targetMask.height - lastRect.height) * smoothingFactor;
                    lastRect.yaw += (targetMask.yaw - (lastRect.yaw || 0)) * smoothingFactor;
                    lastRect.pitch += (targetMask.pitch - (lastRect.pitch || 0)) * smoothingFactor;
                    persistenceFrames = maxPersistence;
                } else {
                    lastRect = targetMask;
                    persistenceFrames = maxPersistence;
                }

                drawProceduralMask(lastRect, false);

            } else {
                // No face detected
                if (persistenceFrames > 0 && lastRect) {
                    persistenceFrames--;
                    drawProceduralMask(lastRect, true);
                } else {
                    lastRect = null;
                }
            }

        }, 100);

        function drawProceduralMask(mask, isPersisting) {
            if (typeof ARMasks !== 'undefined') {
                ARMasks.draw(context, mask, currentMaskIndex, isPersisting);
            } else {
                console.warn("ARMasks module not loaded");
            }
        }
    }

    // Chat
    const chatOverlay = document.querySelector('.chat-overlay');
    if (chatOverlay) {
        const names = [
            "Carlos", "María", "Juan", "Lucía", "Pedro", "Ana", "Sofía", "Miguel",
            "Elena", "David", "Laura", "Daniel", "Carmen", "Alejandro", "Paula", "Manuel",
            "Isabel", "Javier", "Marta", "Francisco", "Sara", "Antonio", "Raquel", "José",
            "John", "Emily", "Michael", "Sarah", "William", "Jessica", "James", "Jennifer",
            "Hans", "Anna", "Klaus", "Julia", "Stefan", "Lisa", "Pierre", "Sophie",
            "Giovanni", "Chiara", "Lars", "Emma", "Hiroshi", "Yuki", "Wei", "Mei",
            "Ahmed", "Fatima", "Olga", "Dmitry", "Sven", "Astrid", "Ravi", "Priya",
            "Mateo", "Valentina", "Liam", "Olivia", "Noah", "Emma", "Oliver", "Ava",
            "Elijah", "Charlotte", "Lucas", "Amelia", "Mason", "Harper", "Logan", "Evelyn",
            "Ethan", "Abigail", "Jacob", "Ella", "Leo", "Elizabeth", "Jack", "Camila",
            "Benjamin", "Luna", "Aden", "Sofia", "Henry", "Avery", "Wyatt", "Mila",
            "Sebastian", "Aria", "Owen", "Scarlett", "Caleb", "Penelope", "Ryan", "Layla",
            "Nathan", "Chloe", "Samuel", "Victoria", "Isaac", "Madison", "Gavin", "Eleanor",
            "Luke", "Grace", "Jayden", "Nora", "Connor", "Riley", "Jeremiah", "Zoey",
            "Cameron", "Hannah", "Josiah", "Hazel", "Adrian", "Lily", "Colton", "Ellie",
            "Jordan", "Violet", "Brayden", "Lillian", "Nicholas", "Zoe", "Robert", "Stella",
            "Angel", "Aurora", "Hudson", "Natalie", "Lincoln", "Emilia", "Evan", "Everly",
            "Dominic", "Leah", "Austin", "Aubrey", "Gael", "Willow", "Adam", "Addison",
            "Ian", "Lucy", "Elias", "Audrey", "Jaxson", "Bella", "Greyson", "Nova",
            "Jose", "Brooklyn", "Ezekiel", "Paisley", "Carson", "Savannah", "Evan", "Claire",
            "Maverick", "Skylar"
        ];

        // 500+ Messages
        const baseMessages = [
            "¡Hola a todos!", "Hello everyone!", "Salut tout le monde!", "Hallo zusammen!",
            "¿Qué tal el stream?", "How is the stream?", "Ça va?", "Wie geht's?",
            "Esto está increíble 😍", "This is amazing!", "C'est incroyable!", "Das ist toll!",
            "¿Alguien más emocionado?", "Anyone else excited?",
            "¡Saludos desde España!", "Greetings from USA", "Salutations de France",
            "Me encanta este contenido 💯", "Love this content!",
            "¿Qué opinan de esto?", "What do you think?",
            "¡Vamos equipo!", "Let's go team!", "Allez l'équipe!",
            "😂😂😂", "Wow! 😮", "👏bravo!", "🔥🔥🔥", "Top!",
            "Que pasada", "Increíble calidad", "Awesome quality",
            "Saludos desde México", "Hola desde Argentina", "Hi from UK",
            "Can you say hello?", "¿Puedes saludar?",
            "Jajaja buenísimo", "Lol nice", "Mdr",
            "Estoy aprendiendo mucho", "Learning a lot",
            "Sigue así", "Keep it up", "Continues comme ça",
            "Me gusta tu estilo", "I like your style",
            "Un saludo crack", "Big fan!",
            "Esto es oro", "This is gold",
            "No pare sigue sigue", "Don't stop!",
            "Increíble setup", "Nice setup",
            "¿Qué juego es este? 😂", "What game is this?",
            "Juega otra cosa", "Play something else",
            "Me aburro...", "Boring...",
            "¡Qué épico!", "So epic!",
            "Saludos a mi mamá", "Hi mom!",
            "Soy nuevo aquí", "I'm new here",
            "Bienvenido!", "Welcome!",
            "¿De dónde eres?", "Where are you from?",
            "Madrid presente", "Tokyo here", "Berlin presente",
            "Me encanta la música", "Love the music",
            "Sube el volumen", "Turn it up",
            "Baja el volumen", "Turn it down",
            "Lag?", "Is it lagging?",
            "No lag for me", "Va perfecto",
            "F en el chat", "F",
            "GG", "Good game", "Bien jugado",
            "¡Qué habilidad!", "Skills!",
            "No te creo", "Unbelievable",
            "OMG", "Dios mío",
            "¿Cuándo termina?", "When does it end?",
            "Acaba de empezar", "Just started",
            "Llego tarde", "I'm late",
            "No te preocupes", "Don't worry",
            "¡Qué risa!", "So funny!",
            "Jajajaja", "Hahahaha", "Jejeje",
            "Lol", "Lmao", "Rofl",
            "Saludos desde Chile", "Perú presente", "Colombia en la casa",
            "Viva el stream", "Long live the stream",
            "Eres el mejor", "You're the best",
            "No cambies nunca", "Never change",
            "¿Tienes instagram?", "Insta?",
            "Sígueme", "Follow me",
            "No spam", "Stop spamming",
            "Modo lento please", "Slow mode pls",
            "Demasiado rápido", "Too fast",
            "No leo nada", "Can't read",
            "Hype!", "Hype train!",
            "Vamosssss", "Let's gooooo",
            "Ojo cuidao", "Watch out",
            "Cuidado", "Careful",
            "Detrás de ti", "Behind you",
            "¡Qué susto!", "Scared me!",
            "No grites", "Don't scream",
            "Me duele el oído", "My ears",
            "Headphone user warning", "Alerta auriculares",
            "Calidad 10/10", "Quality 10/10",
            "Audio 10/10",
            "Video 4k",
            "Se ve pixelado", "Pixelated",
            "Sube la calidad", "Increase quality",
            "Es tu internet", "It's your internet",
            "Reinicia el router", "Restart router",
            "Me tengo que ir", "Gotta go",
            "Adiós", "Bye", "Ciao",
            "Hasta luego", "See ya",
            "Buenas noches", "Good night",
            "Buenos días", "Good morning",
            "¿Qué hora es allá?", "What time is it there?",
            "Aquí son las 3am", "It's 3am here",
            "No duermes?", "No sleep?",
            "Insomnio", "Insomnia",
            "Yo también", "Me too",
            "Estamos locos", "We are crazy",
            "Stream de 24h?", "24h stream?",
            "Ojalá", "I wish",
            "Dale caña", "Go hard",
            "Sin miedo", "No fear",
            "Con todo", "All in",
            "Apuesto todo", "Bet it all",
            "Gané", "I won",
            "Perdí", "I lost",
            "F por ti", "F for you",
            "Suerte la próxima", "Better luck next time",
            "¿Juegas con subs?", "Play with subs?",
            "Invítame", "Invite me",
            "Soy pro", "I'm pro",
            "Soy noob", "I'm noob",
            "Enséñame", "Teach me",
            "Maestro", "Master",
            "Senpai",
            "Ídolo", "Idol",
            "Máquina", "Machine",
            "Fiera", "Beast",
            "Tifón", "Typhoon",
            "Número 1", "Number 1",
            "El rey", "The King",
            "La reina", "The Queen",
            "Guapo", "Handsome",
            "Guapa", "Beautiful",
            "Cásate conmigo", "Marry me",
            "Te amo", "I love you",
            "Fan nº1", "Simp?",
            "No simping",
            "Respeto", "Respect",
            "Salúdame por favor", "Say hi pls",
            "Nunca me saludas", "Never say hi",
            "Hoy es mi cumple", "It's my birthday",
            "Felicidades!", "Happy birthday!",
            "Cumpleaños feliz",
            "Regálame algo", "Gift me something",
            "Sorteo?", "Giveaway?",
            "Quiero ganar", "I want to win",
            "Es falso", "Pre-recorded?",
            "Es directo", "It's live",
            "Parece grabado", "Looks recorded",
            "Saluda a la cámara", "Wave at camera",
            "Toca la nariz", "Touch nose",
            "Prueba de vida", "Proof of life",
            "Bot?", "Are you a bot?",
            "Soy real", "I'm real",
            "Todos somos bots", "We are all bots",
            "La matrix", "The matrix",
            "Despierta", "Wake up",
            "Neo",
            "Azul o roja?", "Blue or red?",
            "Pastilla roja", "Red pill",
            "Me encanta este chat", "Love this chat",
            "Sois los mejores", "You guys are the best",
            "Comunidad top", "Top community",
            "Tóxicos fuera", "No toxic",
            "Ban", "Ban him",
            "Timeout",
            "Moderadores?", "Mods?",
            "Trabajando", "Working",
            "Gracias mods", "Thanks mods",
            "Buen trabajo", "Good job",
            "Héroes sin capa", "Heroes without capes",
            "¿Qué comes?", "What are you eating?",
            "Tengo hambre", "I'm hungry",
            "Pizza time",
            "Tacos",
            "Sushi",
            "Hamburguesa", "Burger",
            "Invita", "Share",
            "Provecho", "Enjoy meal",
            "Bebida?", "Drink?",
            "Agua", "Water",
            "Hidratación", "Hydrate",
            "Importante", "Important",
            "Tomen agua", "Drink water",
            "Café", "Coffee",
            "Té", "Tea",
            "Mate",
            "Cerveza", "Beer",
            "Salud", "Cheers",
            "Brindis", "Toast",
            "Por el stream", "For the stream",
            "Por la victoria", "For the win",
            "Por nosotros", "For us",
            "Forever",
            "Amigos", "Friends",
            "Os quiero", "Love ya",
            "Abrazo grupal", "Group hug",
            "Besos", "Kisses",
            "XOXO",
            "UwU",
            "OwO",
            ">_<",
            "^_^",
            ":D",
            ":)",
            ":(",
            "D:",
            ":O",
            ":P",
            ";)",
            "❤️", "💙", "💚", "💛", "💜", "🧡", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝",
            "🔥", "💥", "✨", "🌟", "💫", "⭐", "🌈", "☀️", "🌙", "🌚", "🌝", "☁️", "⛈️", "❄️", "⚡",
            "⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🏓", "🏸", "🥅", "🏒", "🏑", "🏏", "⛳", "🏹", "🎣", "🥊", "🥋",
            "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🛴", "🚲", "🛵", "🏍️",
            "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "cow", "pig", "frog", "monkey",
            "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🥑", "🥦",
            "🍔", "🍟", "🍕", "🌭", "🥪", "🌮", "🌯", "🥙", "🥚", "🍳", "🥘", "🍲", "🥣", "🥗", "🍿", "🧂", "🥫",
            "🎸", "🎹", "🎺", "🎻", "🥁", "🎤", "🎧", "🎼", "🎵", "🎶",
            "🎮", "🕹️", "🎲", "♠️", "♥️", "♦️", "♣️", "🃏", "🀄", "🎴",
            "🌍", "🌎", "🌏", "🌐", "🗺️", "🗾", "Compass",
            "🏠", "🏡", "office", "post", "hospital", "bank", "hotel", "love hotel", "store", "school", "factory"
        ];

        // Generate a larger list by combining phrases randomly to reach 500+ logic if strictly needed, 
        // but the above list is already quite large (~250-300 items). 
        // Let's duplicate and shuffle to guarantee >500 unique-ish entries or just use the large list repeated.
        let messages = [];
        for (let i = 0; i < 3; i++) {
            messages = messages.concat(baseMessages);
        }

        function getRandomElement(array) {
            return array[Math.floor(Math.random() * array.length)];
        }
        function createChatMessage() {
            const messageContainer = document.createElement('div');
            messageContainer.className = 'chat-message';
            const avatarId = Math.floor(Math.random() * 1000);
            const avatar = document.createElement('img');
            avatar.src = `https://picsum.photos/seed/${avatarId}/200/200`;
            avatar.alt = 'Avatar';
            avatar.className = 'chat-avatar';
            const messageContent = document.createElement('div');
            messageContent.className = 'chat-content';
            const senderName = getRandomElement(names);
            const name = document.createElement('span');
            name.className = 'chat-name';
            name.textContent = senderName;
            const messageSpan = document.createElement('span');
            messageSpan.className = 'chat-text';
            let messageText = getRandomElement(messages);
            if (Math.random() < 0.15) {
                const mentionedUser = getRandomElement(names);
                if (mentionedUser !== senderName) {
                    messageText = `@${mentionedUser} ${messageText}`;
                    messageSpan.style.color = '#ff9999';
                }
            }
            messageSpan.textContent = messageText;
            messageContent.appendChild(name);
            messageContent.appendChild(messageSpan);
            messageContainer.appendChild(avatar);
            messageContainer.appendChild(messageContent);

            chatOverlay.appendChild(messageContainer);

            // Limit chat to 7 messages
            const currentMessages = Array.from(chatOverlay.children).filter(el => el.classList.contains('chat-message'));
            if (currentMessages.length > 7) {
                chatOverlay.removeChild(currentMessages[0]);
            }
        }
        function generateRandomMessages() {
            createChatMessage();
            const randomDelay = Math.random() * (currentChatDelayMax - currentChatDelayMin) + currentChatDelayMin;
            setTimeout(generateRandomMessages, randomDelay);
        }
        generateRandomMessages();

        // User Chat Input Logic
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.querySelector('.send-btn');

        function handleSendMessage() {
            const text = chatInput.value.trim();
            if (text) {
                postUserMessage(text);
                chatInput.value = '';
            }
        }

        function postUserMessage(text) {
            const messageContainer = document.createElement('div');
            messageContainer.className = 'chat-message user-message';

            // Random avatar for user
            const avatarId = "user_" + Date.now();
            const avatar = document.createElement('img');
            avatar.src = `https://picsum.photos/seed/${avatarId}/200/200`;
            avatar.alt = 'Tu Avatar';
            avatar.className = 'chat-avatar';

            const messageContent = document.createElement('div');
            messageContent.className = 'chat-content';

            const name = document.createElement('span');
            name.className = 'chat-name';
            name.textContent = 'Tú'; // Localized "You"

            const messageSpan = document.createElement('span');
            messageSpan.className = 'chat-text';
            messageSpan.textContent = text;

            messageContent.appendChild(name);
            messageContent.appendChild(messageSpan);
            messageContainer.appendChild(avatar);
            messageContainer.appendChild(messageContent);

            chatOverlay.appendChild(messageContainer);

            // Limit chat to 7 messages
            const currentMessages = Array.from(chatOverlay.children).filter(el => el.classList.contains('chat-message'));
            if (currentMessages.length > 7) {
                chatOverlay.removeChild(currentMessages[0]);
            }

            // Auto scroll (though limited to 7, good practice)
            chatOverlay.scrollTop = chatOverlay.scrollHeight;
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSendMessage();
                }
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', handleSendMessage);
        }
    }

    // Floating Hearts Logic
    const heartsContainer = document.querySelector('.floating-hearts-container');
    let heartsActive = true;
    function createHeart() {
        if (!heartsContainer || !heartsActive) return;
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.textContent = '❤️';
        const randomX = (Math.random() - 0.5) * 40;
        heart.style.transform = `translateX(${randomX}px)`;
        const scale = Math.random() * 0.5 + 0.8;
        const duration = Math.random() * 2 + 2;
        heart.style.animationDuration = `${duration}s`;
        heartsContainer.appendChild(heart);
        totalHearts++;
        updateHeartCounter();
        setTimeout(() => {
            if (heartsContainer.contains(heart)) {
                heartsContainer.removeChild(heart);
            }
        }, duration * 1000);
    }
    function heartLoop() {
        if (heartsActive) {
            // Dynamic spawn chance
            if (Math.random() < currentHeartSpawnChance) {
                createHeart();
            }
        }
        setTimeout(heartLoop, 100);
    }
    heartLoop();
    function toggleHearts() {
        heartsActive = !heartsActive;
        const nextToggle = heartsActive
            ? Math.random() * 5000 + 3000
            : Math.random() * 3000 + 1000;
        setTimeout(toggleHearts, nextToggle);
    }
    toggleHearts();

    // Security Modal Logic
    const currentSecurityCode = '0000'; // Fixed secret code
    let typedCode = '';
    const modalOverlay = document.getElementById('security-modal-overlay');
    const typedDisplay = document.getElementById('typed-code-display');
    const modalContent = document.querySelector('.security-modal');

    window.confirmEndStream = function () {
        typedCode = '';
        if (typedDisplay) typedDisplay.textContent = '';
        if (modalOverlay) modalOverlay.style.display = 'flex';
    };

    window.closeSecurityModal = function () {
        if (modalOverlay) modalOverlay.style.display = 'none';
    };

    window.pressKey = function (key) {
        if (key === 'delete') {
            typedCode = typedCode.slice(0, -1);
        } else if (typedCode.length < 4) {
            typedCode += key;
        }

        // Show asterisks instead of numbers
        if (typedDisplay) {
            typedDisplay.textContent = '*'.repeat(typedCode.length);
        }

        if (typedCode.length === 4) {
            if (typedCode === currentSecurityCode) {
                // Success: Close modal instead of redirecting
                setTimeout(() => {
                    closeSecurityModal();
                }, 300);
            } else {
                // Flash red or vibrate
                if (modalContent) {
                    modalContent.classList.add('modal-vibrate');
                    setTimeout(() => modalContent.classList.remove('modal-vibrate'), 300);
                }
                setTimeout(() => {
                    typedCode = '';
                    if (typedDisplay) typedDisplay.textContent = '';
                }, 400);
            }
        }
    };
});
