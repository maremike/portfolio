import { initSkyBackground } from "./background/background.js";
import { initSpaceOverlay, initCloudOverlay } from "./background/overlay.js";

export function createHeader(initialColorScheme) {
    let colorScheme = initialColorScheme; // make it mutable

    const header = document.createElement("header");
    const nav = document.createElement("nav");
    const ul = document.createElement("ul");
    ul.className = "nav-list";

    const navItems = [
        { text: "Über mich", href: "#about" },
        { text: "Projekte", href: "#projects" },
        { text: "Kontakt", href: "#contact" }
    ];

    navItems.forEach(item => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = item.href;
        a.textContent = item.text;
        li.appendChild(a);
        ul.appendChild(li);
    });

    // --- Theme toggle button ---
    const toggleBtn = document.createElement("button");
    toggleBtn.id = "theme-toggle";
    toggleBtn.style.marginLeft = "auto";
    toggleBtn.style.cursor = "pointer";
    toggleBtn.style.background = "none";
    toggleBtn.style.border = "none";
    toggleBtn.style.fontSize = "1.2rem";

    toggleBtn.textContent = colorScheme === "dark" ? "🌙" : "☀️";

    toggleBtn.addEventListener("click", () => {
        if (colorScheme === "dark") {
            colorScheme = "light";
            toggleBtn.textContent = "☀️";

            document.getElementById('dark').style.display = 'none';
            document.getElementById('space').style.display = 'none';
            document.getElementById('light').style.display = 'block';
            document.getElementById('sky').style.display = 'block';
            document.getElementById('clouds').style.display = 'block';
            initSkyBackground();
            initCloudOverlay();
        } else {
            colorScheme = "dark";
            toggleBtn.textContent = "🌙";

            document.getElementById('light').style.display = 'none';
            document.getElementById('sky').style.display = 'none';
            document.getElementById('clouds').style.display = 'none';
            document.getElementById('dark').style.display = 'block';
            document.getElementById('space').style.display = 'block';
            initSpaceOverlay();
        }
    });

    // --- Flex container for nav + toggle ---
    const navContainer = document.createElement("div");
    navContainer.style.display = "flex";
    navContainer.style.alignItems = "center";
    navContainer.style.justifyContent = "space-between";
    navContainer.style.width = "100%";

    navContainer.appendChild(ul);
    navContainer.appendChild(toggleBtn);
    nav.appendChild(navContainer);

    header.appendChild(nav);
    document.body.appendChild(header);
}
