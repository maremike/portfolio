import { initRouter } from "./router";
import { createHeader } from "./header";
import { createFooter } from "./footer";
import { initTheme } from "./utility/themes";
import { initLanguage } from "./language";
import "../css/accessibility.scss";
import "../css/background.scss";
import "../css/content.scss";
import "../css/footer.scss";
import "../css/general.scss";
import "../css/hamburger.scss";
import "../css/header.scss";
import "../css/utility.scss";

function init() {
    // Setup Background
    const colorScheme = initTheme(); // TODO: Outsource to each page in near future

    // Build page structure
    createHeader(colorScheme);

    const main = document.createElement("main");
    document.body.appendChild(main);

    createFooter();

    initLanguage();
    initRouter();
}

document.addEventListener('DOMContentLoaded', init);