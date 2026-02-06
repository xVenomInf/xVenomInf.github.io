document.getElementById('nextPageLink').addEventListener('click', (event) => {
    // Prevent default anchor behavior to allow processing parameters
    event.preventDefault();

    const views = document.getElementById('views').value || 0;
    const language = document.getElementById('language').value || 'es';
    const template = document.getElementById('template').value || 'instagram';
    const time = document.getElementById('time').value || 0;

    // Construct the URL with parameters
    const targetUrl = `live.html?views=${views}&language=${language}&template=${template}&time=${time}`;

    // Navigate to the target URL
    window.location.href = targetUrl;
});
