import { initSpaceBackground, initSkyBackground } from "./background/background.js";
import { initSpaceOverlay, initSkyOverlay } from "./background/overlay.js";
import { renderProjects } from "./data/projects.js";
import { setupForm } from "./data/contact.js";

import { createHeader } from "./head.js";
import { createBody } from "./body.js";
import { createFooter } from "./foot.js";

// --- COLOR SCHEME FUNCTIONS ---
function checkColorScheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.classList.add('dark-mode');
        document.documentElement.classList.remove('light-mode');
        return 'dark';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.add('light-mode');
        document.documentElement.classList.remove('dark-mode');
        return 'light';
    }
}

function setupColorSchemeListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        if (e.matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.classList.add('dark-mode');
            document.documentElement.classList.remove('light-mode');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.documentElement.classList.add('light-mode');
            document.documentElement.classList.remove('dark-mode');
        }
    });
}

// --- INIT FUNCTION ---
function init() {
    // Initialize theme
    const colorScheme = checkColorScheme();
    setupColorSchemeListener();

    // Initialize background/overlay based on theme
    if (colorScheme === "dark") {
        document.getElementById('dark').style.display = 'block';
        initSpaceBackground();
        initSpaceOverlay();
    } else {
        document.getElementById('light').style.display = 'block';
        initSkyBackground();
        initSkyOverlay();
    }

    // Build page structure
    createHeader(colorScheme);
    createBody();
    createFooter();

    // Render content
    renderProjects();
    setupForm();
}

document.addEventListener('DOMContentLoaded', init);
