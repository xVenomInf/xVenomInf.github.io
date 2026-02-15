// Sync views input and slider
const viewsInput = document.getElementById('views');
const viewsRange = document.getElementById('viewsRange');
const languageSelect = document.getElementById('language');
const themeSelect = document.getElementById('theme-selector');

// Theme Switching
if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
        const theme = e.target.value;
        document.body.setAttribute('data-theme', theme);
        // Persist theme choice if desired, but for now just switching
    });
}

// Language switching logic
function updateLanguage(lang) {
    if (!window.TRANSLATIONS || !window.TRANSLATIONS[lang]) return;

    const t = window.TRANSLATIONS[lang].index;

    document.getElementById('title-text').textContent = t.title;
    document.getElementById('label-views').textContent = t.label_views;
    document.getElementById('label-language').textContent = t.label_language;
    document.getElementById('label-category').textContent = t.label_category;
    document.getElementById('cat-general').textContent = t.cat_general;
    document.getElementById('cat-cars').textContent = t.cat_cars;
    document.getElementById('cat-motos').textContent = t.cat_motos;
    document.getElementById('cat-party').textContent = t.cat_party;
    document.getElementById('cat-gaming').textContent = t.cat_gaming;
    document.getElementById('cat-fashion').textContent = t.cat_fashion;
    document.getElementById('cat-food').textContent = t.cat_food;

    document.getElementById('label-template').textContent = t.label_template;
    document.getElementById('label-time').textContent = t.label_time;
    document.getElementById('nextPageLink').textContent = t.btn_start;
}

languageSelect.addEventListener('change', (e) => {
    updateLanguage(e.target.value);
});

// Initialize with default (es) or current selection
updateLanguage(languageSelect.value);

viewsRange.addEventListener('input', () => {
    viewsInput.value = viewsRange.value;
});

viewsInput.addEventListener('input', () => {
    viewsRange.value = viewsInput.value;
});

// Sync time input and slider
const timeInput = document.getElementById('time');
const timeRange = document.getElementById('timeRange');

timeRange.addEventListener('input', () => {
    timeInput.value = timeRange.value;
});

timeInput.addEventListener('input', () => {
    timeRange.value = timeInput.value;
});

document.getElementById('nextPageLink').addEventListener('click', (event) => {
    // Prevent default anchor behavior to allow processing parameters
    event.preventDefault();

    const views = document.getElementById('views').value || 0;
    const language = document.getElementById('language').value || 'es';
    const template = document.getElementById('template').value || 'instagram';
    const time = document.getElementById('time').value || 0;
    const category = document.getElementById('category').value || 'general';

    // Construct the URL with parameters
    const targetUrl = `live.html?views=${views}&language=${language}&template=${template}&time=${time}&category=${category}`;

    // Navigate to the target URL
    window.location.href = targetUrl;
});

// Particle System
function createParticles() {
    const particleCount = 30;
    const body = document.body;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random properties
        const size = Math.random() * 5 + 2; // 2px to 7px
        const left = Math.random() * 100; // 0% to 100%
        const duration = Math.random() * 10 + 10; // 10s to 20s
        const delay = Math.random() * 10; // 0s to 10s

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `-${delay}s`; // Negative delay to start mid-animation

        body.appendChild(particle);
    }
}

// Init Particles
createParticles();
