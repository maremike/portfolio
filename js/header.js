import {switchToDarkMode, switchToLightMode} from "./utility/themes.js"

export function createHeader(initialColorScheme) {
    let colorScheme = initialColorScheme; // make it mutable

    const header = document.createElement("header");
    const nav = document.createElement("nav");
    const ul = document.createElement("ul");
    ul.className = "nav-list";

    const navItems = [
        { image: "src/image.png", href: "/" },
        { text: "Products", href: "/products" },
        { text: "Projects", href: "/projects" },
        { text: "Contact", href: "/contact" }
    ];

    navItems.forEach(item => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = item.href;

        // If item has an image, create an <img> inside the link
        if (item.image) {
            const img = document.createElement("img");
            img.src = item.image;
            img.alt = "Logo";        // accessibility
            img.style.height = "40px"; // adjust as needed
            a.appendChild(img);
        }

        // If item has text, add it
        if (item.text) {
            a.appendChild(document.createTextNode(item.text));
        }

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

    let isSwitching = false;
    toggleBtn.addEventListener("click", async () => {
        if (isSwitching) return;
        isSwitching = true;

        if (colorScheme === "dark") {
            colorScheme = "light";
            toggleBtn.textContent = "☀️";
            await switchToLightMode();
        } else {
            colorScheme = "dark";
            toggleBtn.textContent = "🌙";
            await switchToDarkMode();
        }

        isSwitching = false;
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
