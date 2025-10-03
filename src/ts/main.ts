import { initRouter } from "./router";
import { createHeader } from "./header";
import { createFooter } from "./footer";
import { initTheme } from "./utility/themes";

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