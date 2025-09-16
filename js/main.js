const projects = [
    {
        title: 'Sternenhimmel Animation',
        description: 'Interaktive Sternenhimmel-Animation mit Canvas und TypeScript.',
        url: 'https://github.com/deinname/sternenhimmel',
    },
    {
        title: 'Portfolio Webseite',
        description: 'Modernes Portfolio mit HTML, CSS und TypeScript.',
        url: 'https://github.com/deinname/portfolio',
    },
];
function renderProjects() {
    const container = document.getElementById('project-list');
    if (!container)
        return;
    projects.forEach((project) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        const title = document.createElement('h3');
        title.textContent = project.title;
        card.appendChild(title);
        const desc = document.createElement('p');
        desc.textContent = project.description;
        card.appendChild(desc);
        const link = document.createElement('a');
        link.href = project.url;
        link.textContent = 'Zum Projekt';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        card.appendChild(link);
        container.appendChild(card);
    });
}
function setupForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form || !status)
        return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        status.textContent = 'Vielen Dank für deine Nachricht! (Dies ist eine Demo)';
        form.reset();
    });
}
function init() {
    renderProjects();
    setupForm();
}
document.addEventListener('DOMContentLoaded', init);