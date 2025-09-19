import { projects } from "../data/projects"

export function renderProjects() {
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