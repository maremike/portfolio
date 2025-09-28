import { switchToDarkMode, switchToLightMode } from "./utility/themes.js";
import { createHamburgerMenu } from "./components/hamburger.js";
import { isCrowded } from "./utility/crowding.js";

export function createHeader(initialColorScheme) {
    let colorScheme = initialColorScheme;
    let isSwitching = false;

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
        { text: "Resume", href: "/resume" },
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
            img.style.width = "auto";
            a.appendChild(img);
        }

        if (item.text) {
            a.appendChild(document.createTextNode(item.text));
        }

        li.appendChild(a);
        ul.appendChild(li);
    });

    // --- Home logo ---
    const homeLogo = {
        dark: "https://cdn.michael.markov.uk/logos/000000/0.svg",
        light: "https://cdn.michael.markov.uk/logos/ffffff/0.svg",
        href: "/"
    };
    const homeLink = document.createElement("a");
    homeLink.href = homeLogo.href;

    // Helper function to load inline SVG into a container
    async function loadSVG(container, url, height = 25) {
        try {
            const res = await fetch(url);
            const svgText = await res.text();
            container.innerHTML = svgText;
            const svgEl = container.querySelector("svg");
            if (svgEl) {
                svgEl.setAttribute("height", `${height}`);
                svgEl.setAttribute("width", "auto");
            }
        } catch (err) {
            console.error("Failed to load SVG:", err);
        }
    }

    // Load initial home logo
    loadSVG(homeLink, colorScheme === "dark" ? homeLogo.light : homeLogo.dark);

    // --- Theme toggle button ---
    const toggleBtn = document.createElement("button");
    toggleBtn.id = "theme-toggle";
    toggleBtn.style.cursor = "pointer";
    toggleBtn.style.background = "none";
    toggleBtn.style.border = "none";
    toggleBtn.style.padding = "0";
    toggleBtn.style.height = "25px";

    // Load initial toggle icon
    async function updateToggleIcon() {
        const iconUrl = colorScheme === "dark"
            ? "https://cdn.michael.markov.uk/icons/fontawesome/solid/ffffff/cloud-moon.svg"
            : "https://cdn.michael.markov.uk/icons/fontawesome/solid/000000/sun.svg";
        await loadSVG(toggleBtn, iconUrl);
    }
    updateToggleIcon();

    toggleBtn.addEventListener("click", async () => {
        if (isSwitching) return;
        isSwitching = true;

        if (colorScheme === "dark") {
            colorScheme = "light";
            await switchToLightMode();
            await loadSVG(homeLink, homeLogo.dark);
        } else {
            colorScheme = "dark";
            await switchToDarkMode();
            await loadSVG(homeLink, homeLogo.light);
        }

        await updateToggleIcon();
        isSwitching = false;
    });

    // --- Hamburger menu ---
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

    updateNavDisplay();
    window.addEventListener("resize", updateNavDisplay);
}
