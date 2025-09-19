import { initSkyBackground, initCloudOverlay } from "./background/sky.js";
import { initSpaceOverlay } from "./background/space.js";
import { checkColorScheme, setupColorSchemeListener } from "./utility/themes.js";
import { createHeader } from "./head.js";
import { createFooter } from "./foot.js";

import { renderStartpage } from "./pages/startpage.js";
import { renderProjects } from "./pages/projects.js";
import { renderProducts } from "./pages/products.js";
import { renderContact } from "./pages/contact.js";
import { renderMyspace } from "./pages/myspace.js";
import { render404 } from "./pages/404.js";


function initBackground() {
    const colorScheme = checkColorScheme();
    setupColorSchemeListener();
    if (colorScheme === "dark") {
        document.getElementById('dark').style.display = 'block';
        document.getElementById('space').style.display = 'block';
        initSpaceOverlay();
    } else {
        document.getElementById('light').style.display = 'block';
        document.getElementById('sky').style.display = 'block';
        document.getElementById('clouds').style.display = 'block';
        initSkyBackground();
        initCloudOverlay();
    }
    return colorScheme;
}

function router() {
    const app = document.getElementById("app");
    app.innerHTML = ""; // clear content before rendering a new page

    const path = window.location.hash.slice(1) || "/"; // remove "#" from URL

    switch (path) {
        case "/":
            renderStartpage(app);
            break;
        case "/products":
            renderProducts(app);
            break;
        case "/projects":
            renderProjects(app);
            break;
        case "/contact":
            renderContact(app);
            break;
        case "/myspace":
            renderMyspace(app);
            break;
        default:
            render404(app);
            break;
    }
}

function init() {
    // Setup Background
    initBackground(); // TODO: Outsource to each page in near future

    // Build page structure
    router();
    window.addEventListener("hashchange", router); // Handle route changes
}

document.addEventListener('DOMContentLoaded', init);