import { switchToDarkMode, switchToLightMode } from "./utility/themes.js";

export function createHeader(initialColorScheme) {
    let colorScheme = initialColorScheme;

    const header = document.createElement("header");
    const nav = document.createElement("nav");
    nav.className = "navbar";

    // --- Nav list ---
    const ul = document.createElement("ul");
    ul.className = "nav-list";

    const navItems = [
        { text: "Products", href: "/products" },
        { text: "Projects", href: "/projects" },
        { text: "Contact", href: "/contact" }
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

    const home = { image: "src/image.png", href: "/" }

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
    const burger = document.createElement("button");
    burger.className = "burger";
    burger.innerHTML = "☰";
    burger.style.fontSize = "1.5rem";
    burger.style.background = "none";
    burger.style.border = "none";
    burger.style.cursor = "pointer";

    burger.addEventListener("click", () => {
        ul.classList.toggle("active");
    });

    // --- Container ---
    const navContainer = document.createElement("div");
    navContainer.className = "nav-container";
    navContainer.appendChild(ul);
    navContainer.appendChild(toggleBtn);
    navContainer.appendChild(burger);

    nav.appendChild(navContainer);
    header.appendChild(nav);
    document.body.appendChild(header);

    // --- Styles ---
    const style = document.createElement("style");
    style.textContent = `
        .navbar {
            width: 100%;
            padding: 0.5rem 1rem;
            background: #fff; /* clean white */
            border-bottom: 1px solid #ddd;
        }
        .nav-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .nav-list {
            display: flex;
            list-style: none;
            gap: 1rem;
            margin: 0;
            padding: 0;
        }
        .nav-list li a {
            text-decoration: none;
            color: #333;
        }

        /* --- Mobile --- */
        @media (max-width: 768px) {
            .nav-list {
                display: none;
                flex-direction: column;
                align-items: center;
                width: 100%;
                margin-top: 0.5rem;
                background: #fff;
                padding: 0.5rem 0;
            }
            .nav-list.active {
                display: flex;
            }
            .burger {
                display: block;
                margin-left: 1rem;
            }
        }

        /* --- Desktop --- */
        @media (min-width: 769px) {
            .burger {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
}
