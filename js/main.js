import { renderProjects } from "./projects.js";
import { initGalaxy } from "./background/overlay.js";
import { setupForm } from "./contact.js";

function init() {
    renderProjects();
    setupForm();
    initGalaxy();
}
document.addEventListener('DOMContentLoaded', init);