import { initSpace } from "./background/overlay.js";
import { renderProjects } from "./projects.js";
import { setupForm } from "./contact.js";

function init() {
    initSpace();
    renderProjects();
    setupForm();
}
document.addEventListener('DOMContentLoaded', init);