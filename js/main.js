import { initTheme } from "./utility/themes.js";
import { createHeader } from "./header.js";
import { createFooter } from "./footer.js";
import { initRouter } from "./router.js";

function init() {
    // Setup Background
    const colorScheme = initTheme(); // TODO: Outsource to each page in near future

    // Build page structure
    createHeader(colorScheme);

    const main = document.createElement("main");
    document.body.appendChild(main);

    createFooter();

    initRouter();
}

document.addEventListener('DOMContentLoaded', init);