import { switchToDarkMode, switchToLightMode } from "./utility/themes.js";
import { createHamburgerMenu } from "./components/hamburger.js";
import { isCrowded } from "./utility/crowding.js"; // new import

export function createHeader(initialColorScheme) {
    let colorScheme = initialColorScheme;

    const header = document.createElement("header");
    header.className = "navbar";
    header.style.width = "100%";

    // --- Nav list ---
    const ul = document.createElement("ul");
    ul.className = "nav-list";

    const navItems = [
        { text: "Products", href: "/products" },
        { text: "Projects", href: "/projects" },
        { text: "Skills", href: "/skills" },
        { text: "Contact", href: "/contact" },
        { text: "Support", href: "/support" }
    ];

    navItems.forEach(item => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = item.href;

        if (item.image) {
            const img = document.createElement("img");
            img.src = item.image;
            img.alt = "Logo";
            img.style.height = "40px";
            a.appendChild(img);
        }

        if (item.text) {
            a.appendChild(document.createTextNode(item.text));
        }

        li.appendChild(a);
        ul.appendChild(li);
    });

    // --- Home logo ---
    const home = { image: "src/image.png", href: "/" };
    const homeLink = document.createElement("a");
    homeLink.href = home.href;
    const homeImg = document.createElement("img");
    homeImg.src = home.image;
    homeImg.alt = "Home";
    homeImg.style.height = "40px";
    homeLink.appendChild(homeImg);

    // --- Theme toggle ---
    const toggleBtn = document.createElement("button");
    toggleBtn.id = "theme-toggle";
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

    // --- Hamburger button ---
    const burger = createHamburgerMenu(navItems);

    // --- Header layout ---
    const navLeft = document.createElement("div");
    navLeft.className = "nav-left";
    navLeft.appendChild(homeLink);

    const navCenter = document.createElement("div");
    navCenter.className = "nav-center";
    navCenter.appendChild(ul);

    const navRight = document.createElement("div");
    navRight.className = "nav-right";
    navRight.appendChild(toggleBtn);
    navRight.appendChild(burger);

    header.appendChild(navLeft);
    header.appendChild(navCenter);
    header.appendChild(navRight);

    document.body.appendChild(header);

    // --- Styles ---
    const style = document.createElement("style");
    style.textContent = `
        .navbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem 1rem;
            background: #fff;
            border-bottom: 1px solid #ddd;
        }

        .nav-left, .nav-center, .nav-right {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .nav-left { order: 1; justify-content: flex-start; }
        .nav-center { order: 2; justify-content: center; flex: 1; }
        .nav-right { order: 3; justify-content: flex-end; flex-shrink: 0; }

        .nav-list {
            display: flex;
            list-style: none;
            gap: 1.5rem;
            margin: 0;
            padding: 0;
        }
        .nav-list li a {
            text-decoration: none;
            color: #333;
        }

        .burger {
            display: none;
            font-size: 1.5rem;
            background: none;
            border: none;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // --- Responsive logic using isCrowded ---
    function updateNavDisplay() {
        const rightItems = Array.from(navRight.children).filter(el => el !== burger);
        if (isCrowded(header, ul, rightItems, 225)) {
            ul.style.display = "none";
            burger.style.display = "block";
        } else {
            ul.style.display = "flex";
            burger.style.display = "none";
        }
    }

    // Initial check
    updateNavDisplay();
    // Re-check on window resize
    window.addEventListener("resize", updateNavDisplay);
}
